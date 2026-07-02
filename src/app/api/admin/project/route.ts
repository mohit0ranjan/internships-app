import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      include: {
        internship: {
          select: { title: true }
        },
        workspaceAssignments: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
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

    return NextResponse.json({ projects, internships });
  } catch (error: any) {
    console.error("Project GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, internshipId, mentorName, mentorEmail, techStack } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || "",
        internshipId: internshipId || null,
        mentorName,
        mentorEmail,
        techStack,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Project POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, internshipId, mentorName, mentorEmail, techStack, status } = await req.json();

    if (!id || !title) {
      return NextResponse.json({ error: "ID and Title are required" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || "",
        internshipId: internshipId || null,
        mentorName,
        mentorEmail,
        techStack,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Project PATCH Error:", error);
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
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Project DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

