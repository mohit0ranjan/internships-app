import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');

    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (projectId) filter.projectId = projectId;

    const progress = await prisma.weeklyProgress.findMany({
      where: filter,
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { title: true, internshipId: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Admin Progress fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateProgressSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['REVIEWED', 'REJECTED']),
  adminRemarks: z.string().min(1).max(1000).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { id, status, adminRemarks } = parsed.data;

    const progress = await prisma.weeklyProgress.update({
      where: { id },
      data: {
        status,
        adminRemarks,
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Admin Progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
