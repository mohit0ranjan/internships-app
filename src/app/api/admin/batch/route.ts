import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batches = await prisma.batch.findMany({
      include: {
        internship: {
          select: { title: true }
        },
        _count: {
          select: { students: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const internships = await prisma.internship.findMany({
      where: { isActive: true },
      select: { id: true, title: true }
    });

    return NextResponse.json({ batches, internships });
  } catch (error: any) {
    console.error("Batch GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, internshipId, startDate, endDate, status } = await req.json();

    if (!name || !internshipId || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        internshipId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || "UPCOMING"
      }
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    console.error("Batch POST Error:", error);
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Batch name already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
