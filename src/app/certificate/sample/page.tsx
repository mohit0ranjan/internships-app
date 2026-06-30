import { InternshipCertificate } from '@/components/certificate/InternshipCertificate';

export default function SampleCertificatePage() {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-900 min-h-screen">
      <InternshipCertificate
        studentName="Aarav Sharma"
        internshipDomain="Full Stack Web Development"
        startDate="15 May 2026"
        endDate="15 July 2026"
        projectName="CSDAC Internship Management Portal"
        technologyStack="Next.js, Tailwind CSS, PostgreSQL"
        grade="Outstanding (A+)"
        certificateId="CERT-2026-X79B2M"
        issueDate="20 July 2026"
        programDirectorName="Dr. Aditi Verma"
        programDirectorDesignation="Program Director, CSDAC"
        trainingHeadName="Rajesh Kumar"
        trainingHeadDesignation="Head of Skill Development"
      />
    </div>
  );
}
