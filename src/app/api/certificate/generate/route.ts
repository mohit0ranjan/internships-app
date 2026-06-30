import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chromium, Browser } from 'playwright';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

// Global browser instance to optimize PDF generation
let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;

async function getBrowser() {
  if (browserInstance) return browserInstance;
  if (browserPromise) return browserPromise;

  browserPromise = chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }).then(browser => {
    browserInstance = browser;
    return browser;
  });

  return browserPromise;
}

// Save to local public/certificates directory
async function uploadToStorage(buffer: Buffer, filename: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'certificates');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  return `/certificates/${filename}`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { userId, internshipId, projectName, technology, grade } = body;

    if (!userId || !internshipId) {
      return NextResponse.json({ error: 'userId and internshipId are required' }, { status: 400 });
    }

    // 1. Generate unique Certificate ID
    const uniqueHash = crypto.randomBytes(3).toString('hex').toUpperCase();
    const currentYear = new Date().getFullYear();
    const certificateId = `CERT-${currentYear}-${uniqueHash}`;

    // 2. Validate user and internship, and create/update DB record
    let certificate = await prisma.certificate.findUnique({
      where: { userId_internshipId: { userId, internshipId } }
    });

    if (certificate) {
      // Update existing
      certificate = await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          projectName,
          technology,
          grade,
          issueDate: new Date(),
          status: 'GENERATED'
        }
      });
    } else {
      // Create new
      certificate = await prisma.certificate.create({
        data: {
          userId,
          internshipId,
          certificateNumber: certificateId,
          projectName,
          technology,
          grade,
          issueDate: new Date(),
          status: 'GENERATED',
          verificationUrl: `https://verify.csdac.in/${certificateId}`
        }
      });
    }

    // 3. Render PDF using Playwright
    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Determine base URL dynamically or use environment variable
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
      const renderUrl = `${baseUrl}/certificate/render/${certificate.certificateNumber}`;

      await page.goto(renderUrl, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for custom fonts to load
      await page.evaluate(() => document.fonts.ready);

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      // 4. Upload to Azure Blob Storage / S3
      const filename = `${certificate.certificateNumber}.pdf`;
      const pdfUrl = await uploadToStorage(pdfBuffer, filename);

      // 5. Update DB with PDF URL
      certificate = await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          pdfUrl,
          downloadUrl: pdfUrl,
          status: 'ISSUED'
        }
      });

      return NextResponse.json({
        success: true,
        certificateId: certificate.certificateNumber,
        pdfUrl: certificate.pdfUrl,
        metadata: {
          studentName: certificate.projectName, // Might need full user query for actual name
          issueDate: certificate.issueDate,
          status: certificate.status
        }
      });

    } finally {
      // Safely close the page to free memory
      await page.close();
      await context.close();
    }

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
