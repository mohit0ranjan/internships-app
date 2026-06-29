const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\src\\app\\admin';
const targetPath = path.join(basePath, '(dashboard)');

if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath);
}

const filesToMove = [
  'applicants', 'batches', 'certificates', 'progress', 'tickets', 'workspace', 'layout.tsx', 'page.tsx'
];

for (const file of filesToMove) {
  const oldPath = path.join(basePath, file);
  const newPath = path.join(targetPath, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${file} to (dashboard)`);
  }
}
