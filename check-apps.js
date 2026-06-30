const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkApps() {
  const apps = await prisma.application.findMany({
    include: { user: true, internship: true }
  });
  console.log("All Applications:");
  apps.forEach(app => {
    console.log(`- ${app.user?.name} (${app.user?.email}): Status = ${app.status} | Internship = ${app.internship?.title}`);
  });
  process.exit(0);
}
checkApps();
