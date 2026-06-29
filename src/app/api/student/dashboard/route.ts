import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get active application/internship
    const application = await prisma.application.findFirst({
      where: { 
        userId,
        status: { in: ['JOINED', 'COMPLETED'] }
      },
      include: { 
        internship: true,
        project: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!application) {
      return NextResponse.json({ application: null, attendanceCount: 0, progressCount: 0, certificate: null });
    }

    // Get attendance count (safe)
    const attendanceCount = await prisma.attendance.count({
      where: { userId, status: 'PRESENT' }
    });

    // Get progress count (safe — guard against null projectId)
    let progressCount = 0;
    if (application.projectId) {
      progressCount = await prisma.weeklyProgress.count({
        where: { userId, projectId: application.projectId }
      });
    }

    // Get certificate status
    const certificate = await prisma.certificate.findFirst({
      where: { userId, internshipId: application.internshipId }
    });

    return NextResponse.json({
      application,
      attendanceCount,
      progressCount,
      certificate,
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
