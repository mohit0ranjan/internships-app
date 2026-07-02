import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CSDAC/MAN/${year}/${randomStr}`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required manual fields
    const { 
      studentName, college, degree, 
      domain, duration, centre, 
      projectName, technology, grade 
    } = body;

    if (!studentName || !domain || !duration) {
      return NextResponse.json({ error: 'Student name, domain, and duration are required' }, { status: 400 });
    }

    const certificateNumber = generateCertificateNumber();
    
    // Store in database
    const certificate = await prisma.certificate.create({
      data: {
        certificateNumber,
        issueDate: new Date(),
        status: 'ISSUED',
        isVerified: true,
        verifiedAt: new Date(),
        // Manual fields
        manualStudentName: studentName,
        manualCollege: college || null,
        manualDegree: degree || null,
        manualDomain: domain,
        manualDuration: duration,
        manualCentre: centre || null,
        projectName: projectName || null,
        technology: technology || null,
        grade: grade || null,
      }
    });

    // In a real production setup, we would trigger Playwright PDF generation here asynchronously
    // fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/certificate/generate`, { ... })
    // For now, we return the generated data

    return NextResponse.json({ 
      success: true, 
      certificate 
    });

  } catch (error: any) {
    console.error('Manual certificate generation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
