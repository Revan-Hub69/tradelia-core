#!/usr/bin/env node

/**
 * Remove console.log/warn/info/debug statements from production code
 * Keeps console.error for error handling
 * Skips test files, development files, and files with eslint-disable comments
 */

import { readFileSync, writeFileSync } from 'node:fs';

const filesToProcess = [
  'src/app/[locale]/(auth)/(center)/auth/page.tsx',
  'src/app/[locale]/(auth)/dashboard/not-found.tsx',
  'src/app/[locale]/(unauth)/lesson-demo/page.tsx',
  'src/app/actions/auth.ts',
  'src/components/dashboard/UserDropdown.tsx',
  'src/components/dashboard/NotificationsBell.tsx',
  'src/components/dashboard/LanguageSwitcherDashboard.tsx',
];

let totalRemoved = 0;

for (const file of filesToProcess) {
  try {
    let content = readFileSync(file, 'utf8');
    const originalContent = content;

    // Remove console.log statements
    content = content.replace(/\s*console\.log\([^)]*\);?\s*/g, '');

    // Remove console.warn statements (keep those with eslint-disable)
    content = content.replace(/(?<!\/\/ eslint-disable-next-line no-console\s*)\s*console\.warn\([^)]*\);?\s*/g, '');

    // Remove console.info statements
    content = content.replace(/\s*console\.info\([^)]*\);?\s*/g, '');

    // Remove console.debug statements
    content = content.replace(/\s*console\.debug\([^)]*\);?\s*/g, '');

    if (content !== originalContent) {
      writeFileSync(file, content, 'utf8');
      const removed = (originalContent.match(/console\.(log|warn|info|debug)/g) || []).length;
      totalRemoved += removed;
      console.log(`✅ ${file}: Removed ${removed} console statements`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log(`\n🎉 Total console statements removed: ${totalRemoved}`);
