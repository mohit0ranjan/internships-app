import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ certNumber?: string[] }> }
) {
  try {
    const url = new URL(req.url);
    const queryId = url.searchParams.get('id');
    const { certNumber: certNumberArray } = await params;
    
    // Support both /api/verify?id=XXX and /api/verify/X/Y/Z
    const certNumber = queryId || (Array.isArray(certNumberArray) ? certNumberArray.map(decodeURIComponent).join('/') : decodeURIComponent(certNumberArray || ''));
    
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
        studentName: certificate.user?.name || certificate.manualStudentName,
        college: certificate.user?.college || certificate.manualCollege,
        degree: certificate.user?.degree || certificate.manualDegree,
        internshipTitle: certificate.internship?.title || certificate.manualDomain, // Fallback title to domain
        domain: certificate.internship?.domain || certificate.manualDomain,
        centre: certificate.internship?.centre || certificate.manualCentre,
        duration: certificate.internship?.duration || certificate.manualDuration,
        projectName: certificate.projectName,
        technology: certificate.technology,
        grade: certificate.grade,
        status: certificate.status,
        pdfUrl: certificate.pdfUrl || certificate.downloadUrl,
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
