import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { rateLimit } from '@/lib/rate-limit';
import { workspaceCreateSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(req, 10, 60 * 1000); // 10 per minute
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = workspaceCreateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { applicationId, batchId } = parsed.data;

    // Get application and user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, internship: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'OFFER_LETTER_SENT' && application.status !== 'SELECTED') {
      return NextResponse.json({ error: 'Application must be SELECTED to generate a workspace' }, { status: 400 });
    }

    // Generate random password
    const plainPassword = nanoid(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Update user to active and set password
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        password: hashedPassword,
        isActive: true,
        batches: {
          connect: { id: batchId }
        }
      }
    });

    // Update application status to JOINED
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'JOINED' }
    });

    // Get email template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: 'WORKSPACE_CREDENTIALS' }
    });

    let emailBody = template?.body || 'Your credentials are:\nEmail: {{email}}\nPassword: {{password}}';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'));
    emailBody = emailBody
      .replace('{{name}}', application.user.name || 'Student')
      .replace('{{email}}', application.user.email || '')
      .replace('{{password}}', plainPassword)
      .replace('{{loginUrl}}', `${appUrl}/login`);

    return NextResponse.json({
      success: true,
      message: 'Workspace account generated successfully',
      credentials: {
        email: application.user.email,
        password: plainPassword,
        template: emailBody
      }
    });

  } catch (error: any) {
    console.error('Workspace generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
