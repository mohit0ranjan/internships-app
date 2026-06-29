const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding student...');
  const hashedPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@csdac.in' },
    update: {},
    create: {
      email: 'student@csdac.in',
      name: 'Test Student',
      password: hashedPassword,
      role: 'APPLICANT',
      isActive: true,
    },
  });
  console.log('Student user seeded:', student.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
