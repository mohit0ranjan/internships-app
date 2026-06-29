import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY is not set. Emails will be logged to console instead of sent.');
}

type SendEmailOptions = {
  to: string;
  templateName: string;
  variables: Record<string, string>;
};

export async function sendEmail({ to, templateName, variables }: SendEmailOptions) {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { name: templateName }
    });

    if (!template) {
      console.error(`Email template ${templateName} not found`);
      return { success: false, error: 'Template not found' };
    }

    let htmlBody = template.body;
    let subject = template.subject;

    // Replace variables (e.g. {{name}})
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlBody = htmlBody.replace(regex, value);
      subject = subject.replace(regex, value);
    }

    if (resend) {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@csdac.in',
        to: [to],
        subject: subject,
        html: htmlBody,
      });
      return { success: true, data };
    } else {
      console.log(`\n--- MOCK EMAIL ---
To: ${to}
Subject: ${subject}
Body: 
${htmlBody}
------------------\n`);
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Internal error' };
  }
}
