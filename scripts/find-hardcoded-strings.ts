#!/usr/bin/env tsx
/**
 * HARDCODED STRINGS FINDER - 2026
 *
 * Trova tutte le stringhe hardcoded che dovrebbero essere tradotte
 * Focus su: Header, Sidebar, Tooltips, Dropdowns, Popups
 *
 * Usage:
 *   npx tsx scripts/find-hardcoded-strings.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import { glob } from 'glob';

// Patterns to detect hardcoded strings
const STRING_PATTERNS = [
  // JSX text content: >text<
  />([A-Z][a-zA-Z\s]{2,})</g,

  // String literals in JSX attributes
  /(?:title|placeholder|aria-label|alt)=["']([^"']+)["']/g,

  // String literals in template literals
  /`([A-Z][a-zA-Z\s]{2,})`/g,

  // String literals in quotes
  /["']([A-Z][a-zA-Z\s]{3,})["']/g,
];

// Files to analyze (focus on UI components)
const TARGET_PATTERNS = [
  'src/components/dashboard/DashboardHeader.tsx',
  'src/components/dashboard/UserDropdown.tsx',
  'src/components/dashboard/NotificationsBell.tsx',
  'src/components/dashboard/LanguageSwitcherDashboard.tsx',
  'src/components/dashboard/ThemeSwitcher.tsx',
  'src/components/navigation/SidebarNavigation.tsx',
  'src/components/ui/MobileDropdownPopover.tsx',
  'src/components/ui/Popover.tsx',
  'src/components/ui/Tooltip.tsx',
];

// Strings to ignore (not user-facing)
const IGNORE_PATTERNS = [
  /^[A-Z_]+$/, // Constants like "HEADER_HEIGHT"
  /^[a-z_]+$/, // Variables like "user_id"
  /^\d+$/, // Numbers
  /^(true|false|null|undefined)$/, // Booleans
  /^(px|rem|em|vh|vw|%)$/, // CSS units
  /^(flex|grid|block|inline)$/, // CSS values
  /^(primary|secondary|success|error|warning|info)$/, // Color names
  /^(sm|md|lg|xl|2xl)$/, // Size names
  /^(left|right|top|bottom|center)$/, // Position names
  /^(open|close|show|hide)$/, // State names
  /^(data-|aria-)/, // HTML attributes
  /^(className|onClick|onChange)/, // React props
  /^(import|export|from|const|let|var|function|return)/, // JS keywords
  /^(React|useState|useEffect|useCallback|useMemo)/, // React APIs
  /^(motion\.|framer-motion)/, // Framer Motion
  /^(cn|clsx|twMerge)/, // Utility functions
  /^(\.|\/)/, // Paths
  /^(http|https|www)/, // URLs
  /^#[0-9a-f]{3,6}$/i, // Hex colors
  /^rgb|rgba|hsl|hsla/, // Color functions
  /^var\(--/, // CSS variables
  /^@\//, // Path aliases
];

type HardcodedString = {
  file: string;
  line: number;
  column: number;
  string: string;
  context: string;
  severity: 'high' | 'medium' | 'low';
};

function shouldIgnore(str: string): boolean {
  // Empty or too short
  if (!str || str.length < 3) {
    return true;
  }

  // Check ignore patterns
  return IGNORE_PATTERNS.some(pattern => pattern.test(str));
}

function detectSeverity(_str: string, context: string): 'high' | 'medium' | 'low' {
  // High severity: User-facing UI text
  if (
    context.includes('aria-label')
    || context.includes('title=')
    || context.includes('placeholder=')
    || context.includes('alt=')
    || context.includes('>{')
  ) {
    return 'high';
  }

  // Medium severity: Tooltips, labels
  if (
    context.includes('tooltip')
    || context.includes('label')
    || context.includes('description')
  ) {
    return 'medium';
  }

  // Low severity: Other strings
  return 'low';
}

function analyzeFile(filePath: string): HardcodedString[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const results: HardcodedString[] = [];

  lines.forEach((line, lineIndex) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return;
    }

    // Skip imports
    if (line.includes('import ') || line.includes('from ')) {
      return;
    }

    // Check for hardcoded strings
    STRING_PATTERNS.forEach((pattern) => {
      const matches = line.matchAll(pattern);

      for (const match of matches) {
        const str = match[1]?.trim();

        if (!str || shouldIgnore(str)) {
          continue;
        }

        // Check if it's using translation function
        const contextBefore = line.substring(0, match.index);
        if (
          contextBefore.includes('t(')
          || contextBefore.includes('tGeneral(')
          || contextBefore.includes('useTranslations(')
          || contextBefore.includes('formatMessage(')
        ) {
          continue;
        }

        const severity = detectSeverity(str, line);

        results.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          string: str,
          context: line.trim(),
          severity,
        });
      }
    });
  });

  return results;
}

function analyzeProject(): HardcodedString[] {
  console.log('🔍 Searching for hardcoded strings...\n');

  const allResults: HardcodedString[] = [];

  // Analyze target files
  TARGET_PATTERNS.forEach((pattern) => {
    const files = glob.sync(pattern);

    files.forEach((file) => {
      if (fs.existsSync(file)) {
        const results = analyzeFile(file);
        allResults.push(...results);
      }
    });
  });

  return allResults;
}

function printReport(results: HardcodedString[]) {
  console.log('═'.repeat(80));
  console.log('🔍 HARDCODED STRINGS REPORT');
  console.log('═'.repeat(80));
  console.log();

  // Group by severity
  const bySeverity = {
    high: results.filter(r => r.severity === 'high'),
    medium: results.filter(r => r.severity === 'medium'),
    low: results.filter(r => r.severity === 'low'),
  };

  // Summary
  console.log('📊 SUMMARY');
  console.log('─'.repeat(80));
  console.log(`Total hardcoded strings: ${results.length}`);
  console.log(`  🔴 High severity:   ${bySeverity.high.length} (User-facing UI)`);
  console.log(`  🟡 Medium severity: ${bySeverity.medium.length} (Tooltips, labels)`);
  console.log(`  🟢 Low severity:    ${bySeverity.low.length} (Other)`);
  console.log();

  // Group by file
  const byFile = results.reduce<Record<string, HardcodedString[]>>((acc, result) => {
    const relativePath = result.file.replace(process.cwd(), '').replace(/\\/g, '/');
    if (!acc[relativePath]) {
      acc[relativePath] = [];
    }
    acc[relativePath]!.push(result);
    return acc;
  }, {});

  // Print high severity first
  if (bySeverity.high.length > 0) {
    console.log('🔴 HIGH SEVERITY (User-facing UI)');
    console.log('─'.repeat(80));

    const highByFile = bySeverity.high.reduce<Record<string, HardcodedString[]>>((acc, result) => {
      const relativePath = result.file.replace(process.cwd(), '').replace(/\\/g, '/');
      if (!acc[relativePath]) {
        acc[relativePath] = [];
      }
      acc[relativePath]!.push(result);
      return acc;
    }, {});

    Object.entries(highByFile).forEach(([file, strings]) => {
      console.log(`\n${file} (${strings.length} strings)`);
      strings.forEach((s) => {
        console.log(`  Line ${s.line}: "${s.string}"`);
        console.log(`    Context: ${s.context.substring(0, 80)}...`);
      });
    });
    console.log();
  }

  // Print medium severity
  if (bySeverity.medium.length > 0) {
    console.log('🟡 MEDIUM SEVERITY (Tooltips, labels)');
    console.log('─'.repeat(80));

    const mediumByFile = bySeverity.medium.reduce<Record<string, HardcodedString[]>>((acc, result) => {
      const relativePath = result.file.replace(process.cwd(), '').replace(/\\/g, '/');
      if (!acc[relativePath]) {
        acc[relativePath] = [];
      }
      acc[relativePath]!.push(result);
      return acc;
    }, {});

    Object.entries(mediumByFile).forEach(([file, strings]) => {
      console.log(`\n${file} (${strings.length} strings)`);
      strings.slice(0, 5).forEach((s) => {
        console.log(`  Line ${s.line}: "${s.string}"`);
      });
      if (strings.length > 5) {
        console.log(`  ... and ${strings.length - 5} more`);
      }
    });
    console.log();
  }

  // Recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('─'.repeat(80));

  if (results.length === 0) {
    console.log('✅ No hardcoded strings found! Great job!');
  } else {
    console.log('1. Add missing translation keys to locales/en.json and locales/it.json');
    console.log('2. Replace hardcoded strings with t() or tGeneral() calls');
    console.log('3. Focus on HIGH severity first (user-facing UI)');
    console.log();
    console.log('Example fix:');
    console.log('  // Before');
    console.log('  <button>Click me</button>');
    console.log();
    console.log('  // After');
    console.log('  <button>{t("click_me")}</button>');
  }

  console.log();
  console.log('═'.repeat(80));
  console.log();

  // Export JSON report
  const reportPath = path.join(process.cwd(), 'hardcoded-strings-report.json');
  const jsonReport = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      high: bySeverity.high.length,
      medium: bySeverity.medium.length,
      low: bySeverity.low.length,
    },
    byFile: Object.fromEntries(
      Object.entries(byFile).map(([file, strings]) => [
        file,
        strings.map(s => ({
          line: s.line,
          column: s.column,
          string: s.string,
          severity: s.severity,
          context: s.context,
        })),
      ]),
    ),
  };

  fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`📄 Detailed report saved to: hardcoded-strings-report.json`);
  console.log();
}

// Run analysis
const results = analyzeProject();
printReport(results);
