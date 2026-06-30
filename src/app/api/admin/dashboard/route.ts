import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run parallel queries for KPIs
    const [
      totalApplications,
      selectedStudents,
      workspacesGenerated,
      activeInterns,
      certificatesGenerated,
      paymentsReceivedAgg,
      pendingReviews
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({
        where: { status: { in: ['SELECTED', 'OFFER_LETTER_SENT', 'JOINED', 'COMPLETED'] } }
      }),
      prisma.project.count(), // Projects represent workspaces
      prisma.application.count({ where: { status: 'JOINED' } }),
      prisma.certificate.count({
        where: { status: { in: ['GENERATED', 'ISSUED'] } }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      }),
      prisma.application.count({ where: { status: 'SUBMITTED' } })
    ]);

    // Aggregate Platform Activity for the last 7 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const applicationsLast7Days = await prisma.application.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
          lte: today
        }
      },
      select: { createdAt: true, status: true }
    });

    // Group by day
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayApps = applicationsLast7Days.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.getDate() === d.getDate() && appDate.getMonth() === d.getMonth();
      });

      return {
        date: dateStr,
        applications: dayApps.length,
        approvals: dayApps.filter(a => ['APPROVED', 'SELECTED', 'JOINED', 'COMPLETED'].includes(a.status)).length
      };
    });

    const recentApplications = await prisma.application.findMany({
      take: 5,
      include: { user: true, internship: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalApplications,
        selectedStudents,
        workspacesGenerated,
        activeInterns,
        certificatesGenerated,
        paymentsReceived: paymentsReceivedAgg._sum.amount ? Number(paymentsReceivedAgg._sum.amount) : 0,
        pendingReviews,
      },
      chartData,
      recentApplications
    });
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
