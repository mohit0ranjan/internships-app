import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json({ error: 'Invalid application' }, { status: 404 });
    }

    const assessmentId = "cl_screening_assessment";

    // Check if attempt already exists
    let attempt = await prisma.assessmentAttempt.findFirst({
      where: { 
        applicationId: application.id,
        assessmentId: assessmentId
      }
    });

    if (attempt) {
      if (attempt.status === 'COMPLETED' || attempt.status === 'TERMINATED' || attempt.status === 'TIMEOUT') {
        return NextResponse.json({ error: 'Assessment already completed.' }, { status: 403 });
      }
      // If IN_PROGRESS, allow them to resume
      return NextResponse.json({ success: true, attemptId: attempt.id });
    }

    // Create new attempt
    attempt = await prisma.assessmentAttempt.create({
      data: {
        applicationId: application.id,
        assessmentId: assessmentId,
        status: 'IN_PROGRESS',
        startTime: new Date(),
      }
    });

    return NextResponse.json({ success: true, attemptId: attempt.id });
  } catch (error: any) {
    console.error('Screening attempt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
