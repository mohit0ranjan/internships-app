import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { attemptId } = await req.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
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

    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'TIMEOUT') {
      return NextResponse.json({ error: 'Cannot submit. Assessment is ' + attempt.status }, { status: 403 });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let score = 0;

    const questions = attempt.assessment.questions;
    
    // Evaluate answers
    for (const q of questions) {
      const answer = attempt.answers.find(a => a.questionId === q.id);
      
      if (!answer || !answer.selectedOption) {
        skippedCount++;
      } else if (answer.selectedOption === q.correctAnswer) {
        correctCount++;
        score += q.marks;
        
        // Update answer correctness in DB for later analytics
        await prisma.assessmentAnswer.update({
          where: { id: answer.id },
          data: { isCorrect: true }
        });
      } else {
        wrongCount++;
        score -= q.negativeMarks;
        
        await prisma.assessmentAnswer.update({
          where: { id: answer.id },
          data: { isCorrect: false }
        });
      }
    }

    const percentage = attempt.assessment.totalMarks > 0 
      ? Math.max(0, (score / attempt.assessment.totalMarks) * 100) 
      : 0;
    
    const timeTaken = Math.floor((Date.now() - new Date(attempt.startTime).getTime()) / 1000);

    // Finalize attempt
    const updatedAttempt = await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: attempt.status === 'TIMEOUT' ? 'TIMEOUT' : 'COMPLETED',
        endTime: new Date(),
        score: score < 0 ? 0 : score, // Floor score at 0
        percentage,
        correctCount,
        wrongCount,
        skippedCount,
        timeTaken
      }
    });

    // Also update Application screening score
    await prisma.application.update({
      where: { id: attempt.applicationId },
      data: { screeningScore: score < 0 ? 0 : Math.round(score) }
    });

    return NextResponse.json({ success: true, result: updatedAttempt });
  } catch (error: any) {
    console.error('Submit assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
