const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLifecycle() {
  console.log('--- E2E LIFECYCLE TEST START ---');
  
  // 1. Create Internship
  console.log('1. Setting up Internship & Assessment...');
  const internship = await prisma.internship.create({
    data: {
      title: 'E2E Test Internship',
      domain: 'Testing',
      description: 'Test',
      duration: '6 Months',
      eligibility: 'Test',
      centre: 'Pune',
      startDate: new Date(),
      endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
      maxSeats: 10,
      seatsAvailable: 10,
    }
  });

  const assessment = await prisma.assessment.create({
    data: {
      title: 'Test Assessment',
      duration: 15,
      totalMarks: 10,
      passingMarks: 5
    }
  });

  // 2. Student Registration
  console.log('2. Registering Student...');
  const user = await prisma.user.create({
    data: {
      name: 'E2E Student',
      email: `e2e-${Date.now()}@example.com`,
      role: 'APPLICANT',
      college: 'Test College'
    }
  });

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      internshipId: internship.id,
      status: 'SUBMITTED'
    }
  });

  // 3. Assessment Attempt
  console.log('3. Taking Assessment...');
  const attempt = await prisma.assessmentAttempt.create({
    data: {
      applicationId: application.id,
      assessmentId: assessment.id,
      status: 'COMPLETED',
      score: 8,
      percentage: 80
    }
  });

  // 4. Admin Shortlisting
  console.log('4. Admin Shortlisting...');
  await prisma.application.update({
    where: { id: application.id },
    data: { status: 'SELECTED' }
  });

  // 5. Payment & Activation
  console.log('5. Payment & Activation...');
  await prisma.payment.create({
    data: {
      applicationId: application.id,
      amount: 349,
      status: 'SUCCESS',
      transactionId: `TXN-${Date.now()}`
    }
  });
  
  await prisma.application.update({
    where: { id: application.id },
    data: { status: 'JOINED' }
  });

  // 6. Workspace (Project) Generation
  console.log('6. Workspace Generation...');
  const project = await prisma.project.create({
    data: {
      title: 'E2E Project',
      description: 'Test Project',
      internshipId: internship.id,
      status: 'ACTIVE'
    }
  });

  await prisma.application.update({
    where: { id: application.id },
    data: { projectId: project.id }
  });

  // 7. Student Dashboard (Progress)
  console.log('7. Progress Submission...');
  await prisma.weeklyProgress.create({
    data: {
      userId: user.id,
      projectId: project.id,
      weekNumber: 1,
      summary: 'Completed Week 1 tasks.',
      status: 'SUBMITTED'
    }
  });

  // 8. Admin Review & Certificate Generation
  console.log('8. Certificate Generation...');
  const certNumber = `CERT-${Date.now()}`;
  const certificate = await prisma.certificate.create({
    data: {
      userId: user.id,
      internshipId: internship.id,
      certificateNumber: certNumber,
      status: 'ISSUED',
      isVerified: true,
      issueDate: new Date()
    }
  });

  console.log('✅ Generated Certificate:', certNumber);

  // 9. Public Verification
  console.log('9. Verifying via HTTP Proxy API...');
  try {
    const res = await fetch(`http://localhost:3000/api/verify/${certNumber}`);
    const data = await res.json();
    if (data.valid) {
      console.log('✅ Certificate Verified Successfully!', data.certificate);
      console.log('--- E2E LIFECYCLE TEST PASSED ---');
    } else {
      console.error('❌ Verification failed:', data);
    }
  } catch(e) {
    console.error('❌ HTTP Proxy test failed:', e);
  }
}

testLifecycle()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
