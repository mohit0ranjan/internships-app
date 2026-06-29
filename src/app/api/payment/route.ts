import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const initiatePaymentSchema = z.object({
  applicationId: z.string().cuid(),
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = initiatePaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { applicationId, amount } = parsed.data;

    // Verify application belongs to user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.userId !== session.user.id) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Mock Razorpay Order ID generation
    const orderId = `order_${nanoid(14)}`;

    // Upsert Payment Record (in case they tried before and it's still pending)
    const payment = await prisma.payment.upsert({
      where: { applicationId },
      update: {
        orderId,
        amount,
        status: 'PENDING',
      },
      create: {
        applicationId,
        orderId,
        amount,
        status: 'PENDING',
      }
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  transactionId: z.string().min(1),
});

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'APPLICANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = verifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { orderId, transactionId } = parsed.data;

    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { application: true },
    });

    if (!payment || payment.application.userId !== session.user.id) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (payment.status === 'SUCCESS') {
      return NextResponse.json({ error: 'Payment already verified' }, { status: 400 });
    }

    // Update payment to SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        transactionId,
        method: 'MOCK_RAZORPAY',
        updatedAt: new Date(),
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: 'Payment Successful',
        message: `We have received your payment of ₹${payment.amount} (Transaction ID: ${transactionId}).`,
        type: 'SUCCESS',
      }
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
