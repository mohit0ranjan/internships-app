import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all relevant applications that don't have a certificate yet
    const applications = await prisma.application.findMany({
      where: {
        status: {
          in: ["SELECTED", "OFFER_LETTER_SENT", "JOINED", "COMPLETED"]
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
            emailVerified: true,
            attendances: true,
            weeklyProgress: true,
          }
        },
        internship: {
          select: {
            id: true,
            title: true,
            domain: true
          }
        },
        project: true,
        payment: true,
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    const eligibleInterns = applications.map((app) => {
      // Eligibility calculations
      const hasWorkspace = app.status === "JOINED" || app.status === "COMPLETED";
      const hasInternship = !!app.internshipId;
      const isStudentVerified = !!app.user.emailVerified;
      
      const totalAttendances = app.user.attendances.length;
      const presentCount = app.user.attendances.filter(a => a.status === "PRESENT").length;
      const attendanceRatio = totalAttendances > 0 ? (presentCount / totalAttendances) : 0;
      const hasSufficientAttendance = attendanceRatio >= 0.70;

      // Weekly submissions >= 60%
      // Assuming a standard 6 weeks project, or just calculating based on how many they submitted.
      // For a robust system, we check if they submitted at least 3 weeks or use a dynamic threshold.
      const hasSufficientSubmissions = app.user.weeklyProgress.length >= 3;

      const hasProjectSubmitted = app.project !== null;
      const isPaymentVerified = app.payment ? (app.payment.status === "SUCCESS") : true; // Assuming true if no payment required

      const isEligible = 
        hasWorkspace && 
        hasInternship && 
        isStudentVerified && 
        hasSufficientAttendance && 
        hasSufficientSubmissions && 
        hasProjectSubmitted && 
        isPaymentVerified;

      return {
        ...app,
        eligibility: {
          isEligible,
          hasWorkspace,
          hasInternship,
          isStudentVerified,
          hasSufficientAttendance,
          hasSufficientSubmissions,
          hasProjectSubmitted,
          isPaymentVerified,
        }
      };
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
        internship: true,
        workspaceAssignment: true,
        project: true
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Generate unique cert number
    const currentYear = new Date().getFullYear();
    const uniqueSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certNumber = `CSDAC-WBL-${currentYear}-${uniqueSuffix}`;

    const ws = application.workspaceAssignment;

    const certificate = await prisma.$transaction(async (tx) => {
      const cert = await tx.certificate.create({
        data: {
          userId: application.userId,
          internshipId: application.internshipId,
          certificateNumber: certNumber,
          projectName: ws?.certificateProjectName || application.project?.title || 'N/A',
          technology: ws?.certificateTechnologies || application.project?.techStack || 'N/A',
          manualDuration: ws?.certificateDuration || ws?.internshipDuration || application.internship.duration,
          issueDate: new Date(),
          status: "ISSUED",
          isVerified: true,
          verifiedAt: new Date(),
          verificationUrl: `/verify/${certNumber}`
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

      await tx.application.update({
        where: { id: applicationId },
        data: { status: 'COMPLETED' }
      });

      return cert;
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
