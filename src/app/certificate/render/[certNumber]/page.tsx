import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { InternshipCertificate } from '@/components/certificate/InternshipCertificate';

export default async function CertificateRenderPage({
  params
}: {
  params: Promise<{ certNumber: string }>
}) {
  const { certNumber } = await params;
  
  if (!certNumber) {
    notFound();
  }

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: certNumber },
    include: {
      user: {
        select: { name: true }
      },
      internship: {
        select: { domain: true, startDate: true, endDate: true }
      }
    }
  });

  if (!certificate || certificate.status === 'REVOKED') {
    notFound();
  }

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const startDate = certificate.internship?.startDate ? formatDate(certificate.internship.startDate) : (certificate.manualDuration?.split(' - ')[0] || 'Start Date');
  const endDate = certificate.internship?.endDate ? formatDate(certificate.internship.endDate) : (certificate.manualDuration?.split(' - ')[1] || 'End Date');
  const issueDate = certificate.issueDate ? formatDate(certificate.issueDate) : formatDate(certificate.createdAt);

  return (
    <InternshipCertificate
      studentName={certificate.user?.name || certificate.manualStudentName || 'Student Name'}
      internshipDomain={certificate.internship?.domain || certificate.manualDomain || 'Internship Domain'}
      startDate={startDate}
      endDate={endDate}
      projectName={certificate.projectName || 'Internship Project'}
      technologyStack={certificate.technology || 'Various Technologies'}
      grade={certificate.grade || 'A+'}
      certificateId={certificate.certificateNumber}
      issueDate={issueDate}
      programDirectorName="Dr. A. K. Sharma"
      programDirectorDesignation="Program Director"
      trainingHeadName="Dr. S. K. Singh"
      trainingHeadDesignation="Training Head"
    />
  );
}
