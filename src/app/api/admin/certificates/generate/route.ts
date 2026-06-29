import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { rateLimit } from '@/lib/rate-limit';
import { certificateGenerateSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(req, 10, 60 * 1000); // 10 per minute
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = certificateGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { userId, internshipId } = parsed.data;

    // Verify user and internship exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: { userId, internshipId }
    });

    if (existingCert) {
      return NextResponse.json({ error: 'Certificate already exists for this internship' }, { status: 400 });
    }

    // Generate unique certificate number
    const year = new Date().getFullYear();
    const certNumber = `CSDAC-WBL-${year}-${nanoid(6).toUpperCase()}`;

    // Generate QR Code data URL
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify/${certNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);

    // Create certificate record
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        internshipId,
        certificateNumber: certNumber,
        issueDate: new Date(),
        qrCode: qrCodeDataUrl,
        status: 'ISSUED',
        isVerified: true,
        verifiedAt: new Date()
      }
    });

    // Update application status
    await prisma.application.updateMany({
      where: { userId, internshipId },
      data: { status: 'COMPLETED' }
    });

    return NextResponse.json({
      success: true,
      message: 'Certificate generated successfully',
      certificate
    });

  } catch (error: any) {
    console.error('Certificate generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
