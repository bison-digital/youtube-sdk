#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace .ts extensions with .js in imports
  const fixedContent = content
    .replace(/from ['"]([^'"]+)\.ts['"]/g, "from '$1.js'")
    .replace(/import\(['"]([^'"]+)\.ts['"]\)/g, "import('$1.js')");
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed imports in: ${filePath}`);
  }
}

function fixImportsInDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.ts')) {
      fixImportsInFile(fullPath);
    }
  }
}

// Fix imports in the src directory
const srcDir = path.join(__dirname, 'src');
fixImportsInDirectory(srcDir);

console.log('✅ Import extensions have been fixed!');