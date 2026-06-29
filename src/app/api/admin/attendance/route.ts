import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    const batchId = searchParams.get('batchId');

    // Default to today if no date provided
    let queryDate = new Date();
    if (dateParam) {
      queryDate = new Date(dateParam);
    }
    queryDate.setHours(0, 0, 0, 0);

    const filter: any = {
      date: queryDate,
    };

    if (batchId) {
      // Find users in this batch and filter attendance by them
      const usersInBatch = await prisma.user.findMany({
        where: { batches: { some: { id: batchId } } },
        select: { id: true }
      });
      filter.userId = { in: usersInBatch.map(u => u.id) };
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: filter,
      include: {
        user: {
          select: { name: true, email: true, batches: { select: { name: true } } }
        }
      },
      orderBy: { checkInTime: 'desc' },
    });

    return NextResponse.json({ 
      success: true, 
      date: queryDate.toISOString(),
      records: attendanceRecords 
    });
  } catch (error) {
    console.error('Admin Attendance fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
