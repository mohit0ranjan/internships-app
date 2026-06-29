import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error('CMS fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createAnnouncementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['INFO', 'WARNING', 'IMPORTANT']),
  isPublished: z.boolean(),
  order: z.number().int().default(0),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createAnnouncementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const announcement = await prisma.announcement.create({
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error('CMS create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
