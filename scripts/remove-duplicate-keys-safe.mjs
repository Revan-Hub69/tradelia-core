#!/usr/bin/env node
/**
 * Remove duplicate keys from JSON translation files (SAFE VERSION).
 * Uses proper JSON parsing to preserve structure.
 */

import { readFileSync, writeFileSync } from 'fs';

function removeDuplicatesFromObject(obj, path = '') {
  const seen = new Map();
  const result = {};
  const duplicates = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (seen.has(key)) {
      duplicates.push(fullPath);
      console.log(`   ⚠️  Duplicate key found: "${key}" at ${fullPath}`);
      continue; // Skip duplicate
    }
    
    seen.set(key, true);
    
    // Recursively process nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const [nestedResult, nestedDuplicates] = removeDuplicatesFromObject(value, fullPath);
      result[key] = nestedResult;
      duplicates.push(...nestedDuplicates);
    } else {
      result[key] = value;
    }
  }
  
  return [result, duplicates];
}

function removeDuplicates(filePath) {
  console.log(`\n🔍 Processing ${filePath}...`);
  
  try {
    // Read and parse JSON
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Remove duplicates
    const [cleanData, duplicates] = removeDuplicatesFromObject(data);
    
    // Write back with proper formatting
    const output = JSON.stringify(cleanData, null, 2);
    writeFileSync(filePath, output + '\n', 'utf-8');
    
    if (duplicates.length > 0) {
      console.log(`✅ Removed ${duplicates.length} duplicate keys`);
    } else {
      console.log(`✅ No duplicates found`);
    }
    
    return duplicates.length;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return 0;
  }
}

function main() {
  const files = [
    'src/locales/en.json',
    'src/locales/it.json',
  ];
  
  let totalRemoved = 0;
  
  for (const file of files) {
    const count = removeDuplicates(file);
    totalRemoved += count;
  }
  
  console.log(`\n🎯 Total duplicates removed: ${totalRemoved}`);
  
  if (totalRemoved > 0) {
    console.log('\n✅ JSON files are valid and formatted');
    console.log('⚠️  Please verify translations:');
    console.log('   npm run i18n:validate');
  }
}

main();
