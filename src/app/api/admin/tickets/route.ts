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

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const tickets = await prisma.supportTicket.findMany({
      where: filter,
      include: {
        user: true,
        messages: {
          orderBy: { timestamp: 'asc' },
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const mappedTickets = tickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.map(msg => ({
        ...msg,
        message: msg.content,
        createdAt: msg.timestamp,
      }))
    }));

    return NextResponse.json({ success: true, tickets: mappedTickets });
  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const replySchema = z.object({
  ticketId: z.string().cuid(),
  message: z.string().min(1),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = replySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { ticketId, message, status } = parsed.data;

    // Create reply
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: session.user.id,
        content: message,
        isFromAdmin: true,
      }
    });

    // Update ticket status and timestamp
    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: status || undefined,
        updatedAt: new Date()
      },
      include: { messages: true }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Ticket reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
