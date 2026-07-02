import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    // Fetch active global announcements
    const announcements = await prisma.announcement.findMany({
      where: { 
        isPublished: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { order: 'asc' },
    });

    // Map announcements to look like notifications for the UI
    const mappedAnnouncements = announcements.map(ann => ({
      id: ann.id,
      title: ann.title,
      message: ann.body,
      type: ann.type,
      isRead: false,
      createdAt: ann.createdAt,
      link: null
    }));

    const allNotifications = [...mappedAnnouncements, ...notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ success: true, notifications: allNotifications, unreadCount });
  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateNotificationSchema = z.object({
  id: z.string().cuid().optional(),
  markAllRead: z.boolean().optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = updateNotificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { id, markAllRead } = parsed.data;

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (id) {
      // Ensure user owns the notification
      const existing = await prisma.notification.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== userId) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }

      const notification = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, notification });
    }

    return NextResponse.json({ error: 'Must provide id or markAllRead' }, { status: 400 });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
