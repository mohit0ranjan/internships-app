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
        applications: {
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

    // Also fetch students who have JOINED but have no project
    const unassignedStudents = await prisma.application.findMany({
      where: { 
        status: { in: ["JOINED", "COMPLETED"] },
        projectId: null
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        internship: { select: { title: true } }
      }
    });

    return NextResponse.json({ projects, internships, unassignedStudents });
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

    if (!title || !internshipId) {
      return NextResponse.json({ error: "Title and Internship ID are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || "",
        internshipId,
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

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, projectId } = await req.json();

    if (!applicationId || !projectId) {
      return NextResponse.json({ error: "Application ID and Project ID are required" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { projectId }
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Project PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
