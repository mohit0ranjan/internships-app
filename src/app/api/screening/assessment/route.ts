import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
    }

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            questions: true
          }
        },
        answers: true,
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Assessment is already ' + attempt.status }, { status: 403 });
    }

    // Calculate remaining time
    const durationMs = attempt.assessment.duration * 60 * 1000;
    const elapsed = Date.now() - new Date(attempt.startTime).getTime();
    const remainingTime = Math.max(0, Math.floor((durationMs - elapsed) / 1000));

    // Strip out correct answers and explanations to prevent cheating
    const safeQuestions = attempt.assessment.questions.map(q => {
      // Find if user already answered this
      const existingAnswer = attempt.answers.find(a => a.questionId === q.id);
      
      return {
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        difficulty: q.difficulty,
        marks: q.marks,
        selectedOption: existingAnswer ? existingAnswer.selectedOption : null
      };
    });

    // Randomize if needed, but keeping stable for now
    
    return NextResponse.json({ 
      success: true, 
      remainingTime,
      durationSeconds: attempt.assessment.duration * 60,
      questions: safeQuestions,
      warnings: attempt.warnings
    });
  } catch (error: any) {
    console.error('Fetch assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Auto-save endpoint for individual answers
export async function POST(req: Request) {
  try {
    const { attemptId, questionId, selectedOption } = await req.json();

    if (!attemptId || !questionId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId }
    });

    if (!attempt || attempt.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Cannot save answer for this attempt' }, { status: 403 });
    }

    // Upsert answer
    const existing = await prisma.assessmentAnswer.findFirst({
      where: { attemptId, questionId }
    });

    if (existing) {
      await prisma.assessmentAnswer.update({
        where: { id: existing.id },
        data: { selectedOption }
      });
    } else {
      await prisma.assessmentAnswer.create({
        data: {
          attemptId,
          questionId,
          selectedOption
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
