#!/usr/bin/env node
/**
 * Add type="button" to all <button> elements that don't have a type attribute.
 * WCAG 2.1 Level AA compliance fix.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const files = [
  'src/components/dashboard/DashboardHeader.tsx',
  'src/components/dashboard/EmailVerificationBanner.tsx',
  'src/components/learning/CryptoLesson0.tsx',
  'src/components/learning/CryptoLesson0Professional.tsx',
  'src/components/learning/CryptoLesson0Real.tsx',
  'src/components/learning/CryptoLesson0Simple.tsx',
  'src/components/learning/CryptoLesson0Ultra.tsx',
  'src/components/learning/CryptoLesson0WithAuth.tsx',
];

let totalFixed = 0;

for (const file of files) {
  console.log(`\n🔍 Processing ${file}...`);

  try {
    let content = readFileSync(file, 'utf-8');
    let fixCount = 0;

    // Pattern: <button without type= attribute
    // Matches: <button onClick=... or <button className=... etc
    // Does NOT match: <button type="..." or <Button (component)
    const pattern = /<button(\s+(?!type=)[^>]*)>/g;

    content = content.replace(pattern, (match, attributes) => {
      // Check if this is already a submit button or has type
      if (attributes.includes('type=')) {
        return match; // Already has type, skip
      }

      fixCount++;
      // Add type="button" as first attribute
      return `<button type="button"${attributes}>`;
    });

    if (fixCount > 0) {
      writeFileSync(file, content, 'utf-8');
      console.log(`✅ Fixed ${fixCount} button(s)`);
      totalFixed += fixCount;
    } else {
      console.log(`✅ No buttons to fix`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log(`\n🎯 Total buttons fixed: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n✅ All buttons now have type="button" attribute');
  console.log('⚠️  Please verify the changes:');
  console.log('   npm run build');
}
