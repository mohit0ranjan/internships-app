import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createTicketSchema = z.object({
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(2000),
  category: z.enum(['GENERAL', 'TECHNICAL', 'PAYMENT', 'CERTIFICATE', 'MENTORSHIP']).optional().default('GENERAL'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Map messages to include isFromAdmin and rename content→message for frontend
    const mappedTickets = tickets.map(ticket => ({
      ...ticket,
      messages: ticket.messages.map(msg => ({
        id: msg.id,
        message: msg.content,
        isFromAdmin: msg.isFromAdmin,
        createdAt: msg.timestamp,
      })),
    }));

    return NextResponse.json({ tickets: mappedTickets });
  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { subject, category, priority, message } = parsed.data;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        category,
        priority,
        messages: {
          create: {
            senderId: session.user.id,
            content: message,
            isFromAdmin: false,
          }
        }
      },
      include: { messages: true }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
