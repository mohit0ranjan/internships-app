import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalStudents = await prisma.user.count({ where: { role: 'APPLICANT', isActive: true } });
    const pendingApplications = await prisma.application.count({ where: { status: 'SUBMITTED' } });
    
    // Get today's attendance count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.count({
      where: { date: today, status: 'PRESENT' }
    });
    
    const openTickets = await prisma.supportTicket.count({ where: { status: 'OPEN' } });

    const recentApplications = await prisma.application.findMany({
      take: 5,
      include: { user: true, internship: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        pendingApplications,
        todayAttendance,
        openTickets,
      },
      recentApplications
    });
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
