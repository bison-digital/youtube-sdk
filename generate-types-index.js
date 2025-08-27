#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typesDir = path.join(__dirname, 'src', 'types');
const indexFile = path.join(typesDir, 'index.ts');

// Get all .generated.ts files
const generatedFiles = fs.readdirSync(typesDir)
  .filter(file => file.endsWith('.generated.ts'))
  .sort();

// Generate export statements
const exports = generatedFiles.map(file => {
  const moduleName = file.replace('.generated.ts', '.generated.js');
  return `export * from './${moduleName}';`;
}).join('\n');

const content = `// Auto-generated types index
// This file exports all generated types from the YouTube API

${exports}
`;

fs.writeFileSync(indexFile, content);
console.log(`✅ Generated types/index.ts with ${generatedFiles.length} type exports`);