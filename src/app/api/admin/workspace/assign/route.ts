import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(req, 10, 60 * 1000); // 10 per minute
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    
    const { 
      applicationId, 
      password, 
      projectId,
      batchId,
      mentorId,
      internshipTitle,
      internshipType,
      internshipDuration,
      startDate,
      endDate,
      numberOfWeeks,
      workingDays,
      expectedCompletionDate,
      mode,
      certificateTitle,
      certificateProjectName,
      certificateDuration,
      certificateDescription,
      certificateSkills,
      certificateTechnologies,
      certificateIssueAuthority,
      certificateRemarks
    } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    // Get application and user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, internship: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update user to active, set password if provided
      await tx.user.update({
        where: { id: application.userId },
        data: {
          ...(hashedPassword ? { password: hashedPassword } : {}),
          isActive: true
        }
      });

      // 2. Upsert WorkspaceAssignment
      await tx.workspaceAssignment.upsert({
        where: { applicationId: applicationId },
        update: {
          projectId: projectId || null,
          batchId: batchId || null,
          mentorId: mentorId || null,
          internshipTitle,
          internshipType,
          internshipDuration,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          numberOfWeeks: numberOfWeeks ? parseInt(numberOfWeeks) : null,
          workingDays,
          expectedCompletionDate: expectedCompletionDate ? new Date(expectedCompletionDate) : null,
          mode,
          certificateTitle,
          certificateProjectName,
          certificateDuration,
          certificateDescription,
          certificateSkills,
          certificateTechnologies,
          certificateIssueAuthority,
          certificateRemarks,
          ...(password ? { passwordLastResetAt: new Date() } : {})
        },
        create: {
          applicationId,
          userId: application.userId,
          projectId: projectId || null,
          batchId: batchId || null,
          mentorId: mentorId || null,
          internshipTitle,
          internshipType,
          internshipDuration,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          numberOfWeeks: numberOfWeeks ? parseInt(numberOfWeeks) : null,
          workingDays,
          expectedCompletionDate: expectedCompletionDate ? new Date(expectedCompletionDate) : null,
          mode,
          certificateTitle,
          certificateProjectName,
          certificateDuration,
          certificateDescription,
          certificateSkills,
          certificateTechnologies,
          certificateIssueAuthority,
          certificateRemarks,
          ...(password ? { passwordLastResetAt: new Date() } : {})
        }
      });

      // 3. Update application status to JOINED and sync projectId
      await tx.application.update({
        where: { id: applicationId },
        data: {
          ...(application.status !== 'JOINED' ? { status: 'JOINED' } : {}),
          projectId: projectId || null
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Workspace assigned successfully'
    });

  } catch (error: any) {
    console.error('Workspace assignment error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
