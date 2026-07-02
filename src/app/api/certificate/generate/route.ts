import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { renderToStream } from '@react-pdf/renderer';
import { PdfCertificate } from '@/components/certificate/PdfCertificate';
import React from 'react';

// Save to local public/certificates directory
async function uploadToStorage(buffer: Buffer, filename: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'certificates');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);
  return `/certificates/${filename}`;
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    stream.on('data', (data) => buffers.push(Buffer.isBuffer(data) ? data : Buffer.from(data)));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
    stream.on('error', reject);
  });
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

    const application = await prisma.application.findUnique({
      where: { userId_internshipId: { userId, internshipId } },
      include: { 
        workspaceAssignment: { include: { project: true } },
        user: true,
        internship: true
      }
    });

    const ws = application?.workspaceAssignment;
    const user = application?.user;
    const internship = application?.internship;
    
    const finalProjectName = projectName || ws?.certificateProjectName || ws?.project?.title || 'N/A';
    const finalTechnology = technology || ws?.certificateTechnologies || ws?.project?.techStack || 'N/A';
    const finalDuration = ws?.certificateDuration || ws?.internshipDuration || undefined;

    if (certificate) {
      // Update existing
      certificate = await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          projectName: finalProjectName,
          technology: finalTechnology,
          manualDuration: finalDuration || certificate.manualDuration,
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
          projectName: finalProjectName,
          technology: finalTechnology,
          manualDuration: finalDuration,
          grade,
          issueDate: new Date(),
          status: 'GENERATED',
          verificationUrl: `https://csdac.in/verify/${certificateId}`
        }
      });
    }

    // Format dates
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    };

    const startDateStr = internship?.startDate ? formatDate(internship.startDate) : (certificate.manualDuration?.split(' - ')[0] || 'Start Date');
    const endDateStr = internship?.endDate ? formatDate(internship.endDate) : (certificate.manualDuration?.split(' - ')[1] || 'End Date');
    const issueDateStr = certificate.issueDate ? formatDate(certificate.issueDate) : formatDate(certificate.createdAt);

    // Resolve absolute paths for images
    const csdacLogoPath = path.join(process.cwd(), 'public', 'assets', 'img', 'csdac-navbar.png');
    const aditiSignPath = path.join(process.cwd(), 'public', 'assets', 'img', 'signatures', 'aditi.jpg');
    const rajeshSignPath = path.join(process.cwd(), 'public', 'assets', 'img', 'signatures', 'rajesh.jpg');

    // 3. Render PDF using @react-pdf/renderer
    const pdfStream = await renderToStream(
      React.createElement(PdfCertificate, {
        studentName: user?.name || certificate.manualStudentName || 'Student Name',
        internshipDomain: internship?.domain || certificate.manualDomain || 'Internship Domain',
        startDate: startDateStr,
        endDate: endDateStr,
        projectName: certificate.projectName || 'Internship Project',
        technologyStack: certificate.technology || 'Various Technologies',
        grade: certificate.grade || 'A+',
        certificateId: certificate.certificateNumber,
        issueDate: issueDateStr,
        programDirectorName: "Dr. Aditi Verma",
        programDirectorDesignation: "Program Director",
        trainingHeadName: "Rajesh Kumar",
        trainingHeadDesignation: "Training Head",
        logoSrc: csdacLogoPath,
        sign1Src: aditiSignPath,
        sign2Src: rajeshSignPath,
      }) as any
    );

    const pdfBuffer = await streamToBuffer(pdfStream);

    // 4. Upload to Storage
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

  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
