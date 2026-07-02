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
        },
        workspaceAssignment: {
          include: { project: true }
        }
      }
    });

    if (!certificate || certificate.status === 'REVOKED') {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid or revoked certificate' 
      }, { status: 404 });
    }

    const ws = certificate.workspaceAssignment;
    const project = ws?.project;

    return NextResponse.json({ 
      valid: true, 
      certificate: {
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        studentName: certificate.user?.name || certificate.manualStudentName || 'N/A',
        college: certificate.user?.college || certificate.manualCollege || 'N/A',
        degree: certificate.user?.degree || certificate.manualDegree || 'N/A',
        internshipTitle: certificate.internship?.title || certificate.manualDomain || 'N/A',
        domain: certificate.internship?.domain || certificate.manualDomain || 'N/A',
        centre: certificate.internship?.centre || certificate.manualCentre || 'N/A',
        duration: certificate.manualDuration || ws?.certificateDuration || ws?.internshipDuration || certificate.internship?.duration || 'N/A',
        projectName: certificate.projectName || ws?.certificateProjectName || project?.title || 'N/A',
        technology: certificate.technology || ws?.certificateTechnologies || project?.techStack || 'N/A',
        grade: certificate.grade || 'A+',
        status: certificate.status,
        pdfUrl: `/api/certificate/download/${certificate.certificateNumber}`,
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
