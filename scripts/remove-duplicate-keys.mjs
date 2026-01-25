#!/usr/bin/env node
/**
 * Remove duplicate keys from JSON translation files.
 * Keeps the first occurrence of each key.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function removeDuplicates(filePath) {
  console.log(`\n🔍 Processing ${filePath}...`);
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const seenKeys = new Set();
  const duplicates = [];
  const outputLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();
    
    // Check if line contains a key
    if (stripped.startsWith('"') && stripped.includes('":')) {
      // Extract key
      const match = stripped.match(/^"([^"]+)":/);
      if (match) {
        const key = match[1];
        
        if (seenKeys.has(key)) {
          // This is a duplicate - skip this line
          duplicates.push(key);
          continue;
        } else {
          seenKeys.add(key);
        }
      }
    }
    
    outputLines.push(line);
  }
  
  // Write back
  writeFileSync(filePath, outputLines.join('\n'), 'utf-8');
  
  if (duplicates.length > 0) {
    console.log(`✅ Removed ${duplicates.length} duplicate keys:`);
    duplicates.forEach(key => console.log(`   - ${key}`));
  } else {
    console.log(`✅ No duplicates found`);
  }
  
  return duplicates.length;
}

function main() {
  const files = [
    'src/locales/en.json',
    'src/locales/it.json',
  ];
  
  let totalRemoved = 0;
  
  for (const file of files) {
    try {
      const count = removeDuplicates(file);
      totalRemoved += count;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n🎯 Total duplicates removed: ${totalRemoved}`);
  
  if (totalRemoved > 0) {
    console.log('\n⚠️  Please verify the JSON files are still valid:');
    console.log('   npm run i18n:validate');
  }
}

main();
