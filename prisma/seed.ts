import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@csdac.in' },
    update: {},
    create: {
      email: 'admin@csdac.in',
      name: 'CSDAC Admin',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Create Sample Internships
  const aiInternship = await prisma.internship.upsert({
    where: { id: 'seed-ai-internship' },
    update: {},
    create: {
      id: 'seed-ai-internship',
      title: 'AI & Machine Learning Internship',
      domain: 'Artificial Intelligence',
      description: 'Hands-on experience with cutting-edge AI models, NLP, and computer vision.',
      duration: '6 Months',
      mode: 'Hybrid',
      stipend: 'Performance Based',
      eligibility: 'B.Tech / M.Tech in CS/IT',
      centre: 'C-DAC Delhi',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
      maxSeats: 50,
      seatsAvailable: 50,
    },
  });

  const cyberInternship = await prisma.internship.upsert({
    where: { id: 'seed-cyber-internship' },
    update: {},
    create: {
      id: 'seed-cyber-internship',
      title: 'Cyber Security Analyst',
      domain: 'Cyber Security',
      description: 'Learn ethical hacking, vulnerability assessment, and security audits.',
      duration: '3 Months',
      mode: 'On-site',
      eligibility: 'B.Tech / MCA',
      centre: 'C-DAC Noida',
      startDate: new Date('2026-07-15'),
      endDate: new Date('2026-10-15'),
      maxSeats: 30,
      seatsAvailable: 30,
    },
  });
  console.log('Sample internships seeded.');

  // 3. Create Sample Batches
  await prisma.batch.upsert({
    where: { id: 'seed-batch-ai-1' },
    update: {},
    create: {
      id: 'seed-batch-ai-1',
      name: 'WBL-AI-2026-01',
      internshipId: aiInternship.id,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-12-31'),
      status: 'UPCOMING',
    },
  });
  console.log('Sample batches seeded.');

  // 4. Create Email Templates
  await prisma.emailTemplate.upsert({
    where: { name: 'WORKSPACE_CREDENTIALS' },
    update: {},
    create: {
      name: 'WORKSPACE_CREDENTIALS',
      subject: 'Welcome to CSDAC Internship Portal - Your Credentials',
      body: 'Dear {{name}},\n\nYour account has been activated for the CSDAC Internship Portal.\n\nLogin URL: {{loginUrl}}\nUsername/Email: {{email}}\nPassword: {{password}}\n\nPlease login and change your password immediately.\n\nBest regards,\nCSDAC Team',
      variables: 'name,email,password,loginUrl',
      type: 'CREDENTIALS',
    },
  });
  console.log('Email templates seeded.');

  // 5. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'ALLOW_NEW_REGISTRATIONS' },
    update: {},
    create: {
      key: 'ALLOW_NEW_REGISTRATIONS',
      value: 'true',
      category: 'GENERAL',
      description: 'Allow new applicants to register on the portal',
    },
  });
  console.log('System settings seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
