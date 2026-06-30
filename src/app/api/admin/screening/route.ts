import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attempts = await prisma.assessmentAttempt.findMany({
      orderBy: { startTime: 'desc' },
      include: {
        application: {
          include: {
            user: {
              include: { candidateProfile: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ attempts });
  } catch (error: any) {
    console.error('Fetch admin screening error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
