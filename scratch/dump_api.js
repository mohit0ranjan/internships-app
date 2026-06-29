const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\src\\app\\api';
let output = '';

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file === 'route.ts') {
      output += `\n\n--- FILE: ${fullPath.replace(basePath, '')} ---\n`;
      output += fs.readFileSync(fullPath, 'utf8');
    }
  }
}

traverse(basePath);
fs.writeFileSync('c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\scratch\\api_dump.txt', output);
console.log('Done');
