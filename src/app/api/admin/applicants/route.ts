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
    const internshipId = searchParams.get('internshipId');

    const filter: any = {};
    if (status) {
      if (status.includes(',')) {
        filter.status = { in: status.split(',') };
      } else {
        filter.status = status;
      }
    }
    if (internshipId) filter.internshipId = internshipId;

    const applicants = await prisma.application.findMany({
      where: filter,
      include: {
        user: {
          include: {
            batches: true,
            candidateProfile: true
          }
        },
        internship: true,
        workspaceAssignment: {
          include: {
            batch: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, applicants });
  } catch (error) {
    console.error('Applicants fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum([
    'SUBMITTED', 'SCREENING', 'INTERVIEW', 'SELECTED',
    'REJECTED', 'OFFER_LETTER_SENT', 'JOINED', 'COMPLETED'
  ])
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { id, status } = parsed.data;

    if (status === 'JOINED' || status === 'COMPLETED') {
      const app = await prisma.application.findUnique({
        where: { id },
        include: { workspaceAssignment: true }
      });

      if (!app) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      if (!app.workspaceAssignment) {
        return NextResponse.json({ 
          error: 'Cannot update status to JOINED or COMPLETED. Please assign a Workspace first.' 
        }, { status: 400 });
      }
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Applicant update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
