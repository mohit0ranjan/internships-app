const fs = require('fs');
const path = require('path');

const adminPath = 'c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\src\\app\\admin';
const studentPath = 'c:\\Users\\Mohit\\Downloads\\www.cdac.in\\www.cdac.in\\internships-app\\src\\app\\student';

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content
        // Standardize container width
        .replace(/max-w-4xl/g, 'max-w-6xl')
        .replace(/max-w-5xl/g, 'max-w-6xl')
        // Remove hardcoded pixel heights and replace with min-height or h-full depending on context
        // Actually it's safer to just change h-[650px] and h-[700px] to min-h-[600px]
        .replace(/h-\[650px\]/g, 'min-h-[600px]')
        .replace(/h-\[700px\]/g, 'min-h-[600px]')
        // Standardize tiny arbitrary fonts to text-xs
        .replace(/text-\[10px\]/g, 'text-xs')
        .replace(/text-\[13px\]/g, 'text-sm')
        // Fix some contrast issues (very specific cases)
        .replace(/text-muted-foreground mt-1 text-\[10px\]/g, 'text-muted-foreground mt-1 text-xs');
        
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log('Updated', filePath);
    }
}

function traverse(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (file.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

traverse(adminPath);
traverse(studentPath);
console.log('Standardization complete');
