import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ certNumber: string }> }
) {
  try {
    const { certNumber } = await params;
    
    if (!certNumber) {
      return NextResponse.json({ error: 'Certificate number required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: certNumber },
      include: {
        user: {
          select: { name: true, college: true, degree: true }
        },
        internship: {
          select: { title: true, domain: true, centre: true, duration: true }
        }
      }
    });

    if (!certificate || certificate.status === 'REVOKED') {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid or revoked certificate' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      valid: true, 
      certificate: {
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        studentName: certificate.user.name,
        college: certificate.user.college,
        degree: certificate.user.degree,
        internshipTitle: certificate.internship.title,
        domain: certificate.internship.domain,
        centre: certificate.internship.centre,
        duration: certificate.internship.duration,
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
