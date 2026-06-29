const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\src\\app';
let output = '';

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith('page.tsx') || file.endsWith('layout.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic regex to find className attributes
      const classRegex = /className="([^"]+)"/g;
      const classes = new Set();
      let match;
      while ((match = classRegex.exec(content)) !== null) {
          classes.add(match[1]);
      }
      
      output += `\n--- FILE: ${fullPath.replace(basePath, '')} ---\n`;
      output += Array.from(classes).join('\n');
    }
  }
}

traverse(basePath);
fs.writeFileSync('c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\scratch\\ui_class_dump.txt', output);
console.log('Done UI class dump');
