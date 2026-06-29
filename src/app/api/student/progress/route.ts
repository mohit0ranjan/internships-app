import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const submitProgressSchema = z.object({
  weekNumber: z.number().int().min(1).max(24),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(2000),
  githubUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Auto-detect project from user's active application
    const application = await prisma.application.findFirst({
      where: { userId, status: { in: ['JOINED', 'COMPLETED'] } },
      include: { project: true }
    });

    if (!application?.projectId) {
      return NextResponse.json({ progress: [], currentWeek: 1 });
    }

    const progress = await prisma.weeklyProgress.findMany({
      where: { userId, projectId: application.projectId },
      orderBy: { weekNumber: 'desc' },
    });

    // Calculate current week based on submissions
    const currentWeek = progress.length > 0 ? progress[0].weekNumber + 1 : 1;

    return NextResponse.json({ progress, currentWeek });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = submitProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { weekNumber, summary, githubUrl } = parsed.data;

    // Auto-detect projectId from user's application
    const application = await prisma.application.findFirst({
      where: { userId: session.user.id, status: { in: ['JOINED', 'COMPLETED'] } },
    });

    if (!application?.projectId) {
      return NextResponse.json({ error: 'No project assigned. Cannot submit progress.' }, { status: 400 });
    }

    // Check if already submitted for this week (prevent duplicates)
    const existing = await prisma.weeklyProgress.findUnique({
      where: {
        userId_projectId_weekNumber: {
          userId: session.user.id,
          projectId: application.projectId,
          weekNumber,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Progress already submitted for this week' }, { status: 400 });
    }

    const progress = await prisma.weeklyProgress.create({
      data: {
        userId: session.user.id,
        projectId: application.projectId,
        weekNumber,
        summary,
        githubLink: githubUrl || null,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Progress submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
