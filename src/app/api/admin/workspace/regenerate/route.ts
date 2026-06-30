import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const regenerateSchema = z.object({
  applicationId: z.string().cuid('Invalid application ID'),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(req, 10, 60 * 1000); // 10 per minute
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = regenerateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { applicationId } = parsed.data;

    // Get application and user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, internship: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'JOINED') {
      return NextResponse.json({ error: 'Workspace must be generated (JOINED status) before regenerating credentials' }, { status: 400 });
    }

    // Generate random password
    const plainPassword = nanoid(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        password: hashedPassword,
      }
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
      message: 'Workspace password regenerated successfully',
      credentials: {
        email: application.user.email,
        password: plainPassword,
        template: emailBody
      }
    });

  } catch (error: any) {
    console.error('Workspace regeneration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
