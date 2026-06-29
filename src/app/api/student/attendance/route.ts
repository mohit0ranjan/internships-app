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

    const attendance = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    });

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = await prisma.attendance.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    // Calculate stats
    const totalPresent = await prisma.attendance.count({
      where: { userId, status: 'PRESENT' },
    });

    // Estimate enrolled days from the user's earliest attendance or application
    const firstAttendance = await prisma.attendance.findFirst({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const totalDaysEnrolled = firstAttendance
      ? Math.ceil((Date.now() - new Date(firstAttendance.date).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

    const absent = Math.max(0, totalDaysEnrolled - totalPresent);
    const percentage = totalDaysEnrolled > 0 ? Math.round((totalPresent / totalDaysEnrolled) * 100) : 0;

    return NextResponse.json({
      checkedInToday: !!todayRecord,
      stats: {
        totalDaysEnrolled,
        present: totalPresent,
        absent,
        percentage,
      },
      history: attendance,
    });
  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent future attendance
    const now = new Date();
    if (today > now) {
      return NextResponse.json({ error: 'Cannot mark future attendance' }, { status: 400 });
    }

    // Check if already checked in today (prevent duplicates)
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        date: today,
        status: 'PRESENT',
        checkInTime: new Date(),
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error('Attendance check-in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
