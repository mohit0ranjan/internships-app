import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateProjectSchema = z.object({
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.application.findFirst({
      where: { 
        userId: session.user.id,
        status: { in: ['JOINED', 'COMPLETED'] }
      },
      include: { 
        project: true,
        workspaceAssignment: {
          include: {
            project: true,
            mentor: true
          }
        },
        internship: { select: { title: true, domain: true, centre: true, duration: true } }
      }
    });

    const project = application?.workspaceAssignment?.project || application?.project;
    if (!application || !project) {
      return NextResponse.json({ internship: application?.internship || null, project: null, mentor: null });
    }

    // Build mentor info
    const mentor = application?.workspaceAssignment?.mentor || (project.mentorName ? {
      name: project.mentorName,
      email: project.mentorEmail || '',
    } : null);

    return NextResponse.json({ 
      internship: application.internship,
      project: {
        ...project,
        // Map githubRepoUrl to githubUrl for frontend, fall back to application.githubLink
        githubUrl: application.githubLink || project.githubRepoUrl,
        liveUrl: null, // Project model doesn't have liveUrl yet
      },
      mentor,
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { githubUrl, liveUrl } = parsed.data;

    // Auto-detect project from user's application (ownership verification)
    const application = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['JOINED', 'COMPLETED'] }
      },
      include: { workspaceAssignment: true }
    });

    const projectId = application?.workspaceAssignment?.projectId || application?.projectId;

    if (!application || !projectId) {
      return NextResponse.json({ error: 'No project assigned' }, { status: 404 });
    }

    // Update Application instead of shared Project to avoid overwriting other students' links
    await prisma.application.update({
      where: { id: application.id },
      data: {
        githubLink: githubUrl || null,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
