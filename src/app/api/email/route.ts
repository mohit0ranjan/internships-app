import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/mail';

const emailSchema = z.object({
  to: z.string().email(),
  templateName: z.string().min(1),
  variables: z.record(z.string(), z.string()).optional().default({}),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Only ADMIN can manually trigger API emails via this endpoint
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { to, templateName, variables } = parsed.data;

    const result = await sendEmail({ to, templateName, variables });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully', mock: result.mock });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
