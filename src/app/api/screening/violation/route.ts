import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { attemptId, type } = await req.json();

    if (!attemptId || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId }
    });

    if (!attempt || attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Cannot log violation for this attempt' }, { status: 403 });
    }

    // Log the violation
    await prisma.assessmentViolation.create({
      data: {
        attemptId,
        type
      }
    });

    // Increment counters on the attempt
    const updateData: any = { warnings: attempt.warnings + 1 };
    
    if (type === 'TAB_SWITCH') {
      updateData.tabSwitches = attempt.tabSwitches + 1;
    } else if (type === 'FULLSCREEN_EXIT') {
      updateData.fullscreenExits = attempt.fullscreenExits + 1;
    }

    const updatedAttempt = await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: updateData
    });

    // If warnings exceed 3, auto-terminate (client will handle the actual redirect, but server enforces status)
    let terminated = false;
    if (updatedAttempt.warnings >= 4) {
      await prisma.assessmentAttempt.update({
        where: { id: attemptId },
        data: { status: 'TERMINATED', endTime: new Date() }
      });
      terminated = true;
    }

    return NextResponse.json({ success: true, warnings: updatedAttempt.warnings, terminated });
  } catch (error: any) {
    console.error('Log violation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
