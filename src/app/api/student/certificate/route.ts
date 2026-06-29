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

    // Get active application
    const application = await prisma.application.findFirst({
      where: { userId, status: { in: ['JOINED', 'COMPLETED'] } },
      include: {
        internship: true,
        project: true,
        user: { select: { name: true } }
      }
    });

    // Attendance stats
    const presentCount = await prisma.attendance.count({
      where: { userId, status: 'PRESENT' }
    });

    const firstAttendance = await prisma.attendance.findFirst({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const totalDays = firstAttendance
      ? Math.ceil((Date.now() - new Date(firstAttendance.date).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;
    const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    // Progress count
    let progressCount = 0;
    if (application?.projectId) {
      progressCount = await prisma.weeklyProgress.count({
        where: { userId, projectId: application.projectId }
      });
    }

    // Certificate
    const certificate = application ? await prisma.certificate.findFirst({
      where: { userId, internshipId: application.internshipId }
    }) : null;

    return NextResponse.json({
      application,
      attendance: { percentage, count: presentCount },
      progress: { count: progressCount },
      certificate,
    });
  } catch (error) {
    console.error('Certificate page data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
