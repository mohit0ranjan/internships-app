import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      include: {
        application: {
          include: {
            user: { select: { name: true, email: true } },
            internship: { select: { title: true, domain: true } }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error("Payments GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
