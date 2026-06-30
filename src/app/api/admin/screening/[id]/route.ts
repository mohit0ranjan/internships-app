import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            user: {
              include: { candidateProfile: true }
            }
          }
        },
        violations: {
          orderBy: { timestamp: 'desc' }
        },
        answers: true
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error('Fetch admin screening details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
