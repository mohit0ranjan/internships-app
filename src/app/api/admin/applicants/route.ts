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

    const filter: Record<string, string> = {};
    if (status) filter.status = status;
    if (internshipId) filter.internshipId = internshipId;

    const applicants = await prisma.application.findMany({
      where: filter,
      include: {
        user: true,
        internship: true,
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
