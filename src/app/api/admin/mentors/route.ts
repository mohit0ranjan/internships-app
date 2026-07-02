import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mentors = await prisma.mentor.findMany({
      include: {
        _count: {
          select: { workspaceAssignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ mentors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone, department, role, maxStudents, notes, status } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const mentor = await prisma.mentor.create({
      data: {
        name,
        email,
        phone,
        department,
        role,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        notes,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, mentor });
  } catch (error: any) {
    console.error("Mentor POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
