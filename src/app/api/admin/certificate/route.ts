import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all COMPLETED applications that don't have a certificate yet
    // For testing purposes, we'll also fetch JOINED users so there is data to test with
    const eligibleInterns = await prisma.application.findMany({
      where: {
        status: {
          in: ["COMPLETED", "JOINED"]
        },
        user: {
          certificates: {
            none: {}
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        internship: {
          select: {
            id: true,
            title: true,
            domain: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json({ eligibleInterns });
  } catch (error: any) {
    console.error("Certificate GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    // Get the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        internship: true
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Generate unique cert number
    const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certNumber = `CSDAC-WBL-2026-${uniqueSuffix}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://internships.csdac.in/verify/${certNumber}`;

    // Create the certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId: application.userId,
        internshipId: application.internshipId,
        certificateNumber: certNumber,
        issueDate: new Date(),
        qrCode: qrUrl,
        status: "GENERATED"
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        internship: {
          select: { title: true }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      certificate 
    });

  } catch (error: any) {
    console.error("Certificate POST Error:", error);
    // Unique constraint violation for userId + internshipId
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Certificate already generated for this intern." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
