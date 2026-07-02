import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const screeningRegistrationSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  college: z.string().min(2, "College is required"),
  university: z.string().min(2, "University is required"),
  branch: z.string().min(2, "Branch is required"),
  degree: z.string().min(2, "Degree is required"),
  currentYear: z.string().min(1, "Current year is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  cgpa: z.string().min(1, "CGPA is required"),
  preferredDomain: z.string().min(2, "Domain is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  linkedin: z.string().optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),
  resumeBase64: z.string().optional(), // In a real app, this would be an S3 upload URL
});

export async function POST(req: Request) {
  try {
    // Check system setting for ALLOW_NEW_REGISTRATIONS
    const allowSetting = await prisma.systemSetting.findUnique({
      where: { key: 'ALLOW_NEW_REGISTRATIONS' },
    });
    if (allowSetting && allowSetting.value === 'false') {
      return NextResponse.json({ error: 'New registrations are currently closed by administration.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = screeningRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered. You can only take the assessment once.' }, { status: 400 });
    }

    // Ensure there is a dummy internship to link the application
    let internship = await prisma.internship.findFirst({
      where: { domain: 'Screening' }
    });

    if (!internship) {
      internship = await prisma.internship.create({
        data: {
          title: "Screening General Application",
          domain: "Screening",
          description: "Internal container for all screening candidates.",
          duration: "N/A",
          eligibility: "N/A",
          centre: "Online",
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          maxSeats: 10000,
          isActive: false, // Hide from public list
        }
      });
    }

    // Create Candidate, Profile, and Application
    const tempPassword = await bcrypt.hash(nanoid(10), 10);
    
    // Resume handling mock - save a placeholder or use a data URI if provided (not ideal for db, but no upload service is configured)
    const resumeUrl = data.resumeBase64 ? "mock-resume-url.pdf" : null;

    const user = await prisma.user.create({
      data: {
        name: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        college: data.college,
        degree: data.degree,
        branch: data.branch,
        year: data.currentYear,
        password: tempPassword,
        role: 'APPLICANT',
        candidateProfile: {
          create: {
            university: data.university,
            graduationYear: data.graduationYear,
            cgpa: data.cgpa,
            city: data.city,
            state: data.state,
            linkedinUrl: data.linkedin,
            preferredDomain: data.preferredDomain,
          }
        },
        applications: {
          create: {
            internshipId: internship.id,
            status: 'SUBMITTED',
            githubLink: data.github,
            resumeUrl: resumeUrl
          }
        }
      },
      include: {
        applications: true
      }
    });

    const application = user.applications[0];

    return NextResponse.json({ 
      success: true, 
      candidateId: user.id,
      applicationId: application.id,
    });
  } catch (error: any) {
    console.error('Screening registration error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
