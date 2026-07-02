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
          select: { workspaceAssignments: true }
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

    const { name, code, description, coordinator, maxStudents, internshipId, startDate, endDate, status } = await req.json();

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields (name, startDate, endDate)" }, { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        code,
        description,
        coordinator,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        internshipId: internshipId || null,
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, code, description, coordinator, maxStudents, internshipId, startDate, endDate, status, capacity } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing batch ID" }, { status: 400 });
    }

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        name,
        code,
        description,
        coordinator,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        internshipId: internshipId || null,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status
      }
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    console.error("Batch PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing batch ID" }, { status: 400 });
    }

    await prisma.batch.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Batch DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

