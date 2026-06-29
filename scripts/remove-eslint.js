const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, '..', 'src'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('/* eslint-disable @typescript-eslint/no-explicit-any */')) {
        content = content.replace(/\/\* eslint-disable @typescript-eslint\/no-explicit-any \*\/\r?\n?/g, '');
        changed = true;
    }
    if (content.includes('/* eslint-disable @typescript-eslint/no-unused-vars */')) {
        content = content.replace(/\/\* eslint-disable @typescript-eslint\/no-unused-vars \*\/\r?\n?/g, '');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
}
