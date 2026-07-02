import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { PdfCertificate } from '@/components/certificate/PdfCertificate';
import React from 'react';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ certNumber: string }> }
) {
  try {
    const { certNumber } = await params;
    
    if (!certNumber) {
      return NextResponse.json({ error: 'Certificate number required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: certNumber },
      include: {
        user: {
          select: { name: true }
        },
        internship: {
          select: { title: true, domain: true }
        },
        workspaceAssignment: true
      }
    });

    if (!certificate || certificate.status === 'REVOKED') {
      return NextResponse.json({ error: 'Certificate not found or revoked' }, { status: 404 });
    }

    // Prepare data for the PDF
    const studentName = certificate.user?.name || certificate.manualStudentName || 'N/A';
    const internshipDomain = certificate.internship?.domain || certificate.manualDomain || 'N/A';
    
    // Dates
    let startDateStr = 'N/A';
    let endDateStr = 'N/A';
    if (certificate.workspaceAssignment?.startDate) {
      startDateStr = new Date(certificate.workspaceAssignment.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    if (certificate.workspaceAssignment?.endDate) {
      endDateStr = new Date(certificate.workspaceAssignment.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    if (certificate.manualDuration) {
      startDateStr = certificate.manualDuration;
      endDateStr = ""; // Usually duration is given as "June - August 2024"
    }

    const projectName = certificate.projectName || certificate.workspaceAssignment?.certificateProjectName || 'N/A';
    const technologyStack = certificate.technology || certificate.workspaceAssignment?.certificateTechnologies || 'N/A';
    const grade = certificate.grade || 'A';
    const issueDateStr = certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

    // Resolve absolute paths for images
    const csdacLogoPath = path.join(process.cwd(), 'public', 'assets', 'img', 'csdac-navbar.png');
    const aditiSignPath = path.join(process.cwd(), 'public', 'assets', 'img', 'signatures', 'aditi.jpg');
    const rajeshSignPath = path.join(process.cwd(), 'public', 'assets', 'img', 'signatures', 'rajesh.jpg');

    // Generate PDF stream
    const pdfStream = await renderToStream(
      (React.createElement(PdfCertificate, {
        studentName,
        internshipDomain,
        startDate: startDateStr,
        endDate: endDateStr,
        projectName,
        technologyStack,
        grade,
        certificateId: certificate.certificateNumber,
        issueDate: issueDateStr,
        programDirectorName: "Dr. Aditi Verma",
        programDirectorDesignation: "Program Director, CSDAC",
        trainingHeadName: "Rajesh Kumar",
        trainingHeadDesignation: "Head of Training",
        logoSrc: csdacLogoPath,
        sign1Src: aditiSignPath,
        sign2Src: rajeshSignPath,
      }) as any)
    );

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `inline; filename="CSDAC_Certificate_${certificate.certificateNumber}.pdf"`);

    // Stream the PDF to the client
    return new NextResponse(pdfStream as unknown as ReadableStream, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
