#!/usr/bin/env tsx
/**
 * BARREL IMPORTS ANALYZER - 2026
 * 
 * Analizza l'uso di barrel imports nel progetto e calcola l'impatto
 * 
 * Based on:
 * - Atlassian: 75% faster builds by removing barrel files
 * - Vercel: Bundle size reduction up to 40%
 * 
 * Usage:
 *   npx tsx scripts/analyze-barrel-imports.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';

// Barrel files to analyze
const BARREL_PATTERNS = [
  '@/components',
  '@/hooks',
  '@/utils',
  '@/lib',
  '@/features',
];

type BarrelUsage = {
  file: string;
  line: number;
  importPath: string;
  imports: string[];
};

type BarrelStats = {
  totalFiles: number;
  totalImports: number;
  byBarrel: Map<string, BarrelUsage[]>;
  largestFiles: Array<{ file: string; count: number }>;
};

function analyzeFile(filePath: string): BarrelUsage[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const usages: BarrelUsage[] = [];

  lines.forEach((line, index) => {
    // Match: import { X, Y, Z } from '@/components'
    const importMatch = line.match(/import\s+(?:type\s+)?{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
    
    if (importMatch) {
      const [, importsList, importPath] = importMatch;
      
      // Check if it's a barrel import
      const isBarrel = BARREL_PATTERNS.some(pattern => importPath === pattern);
      
      if (isBarrel && importsList && importPath) {
        const imports = importsList
          .split(',')
          .map(i => i.trim())
          .filter(Boolean);
        
        usages.push({
          file: filePath,
          line: index + 1,
          importPath,
          imports,
        });
      }
    }
  });

  return usages;
}

function analyzeProject(): BarrelStats {
  console.log('🔍 Analyzing barrel imports...\n');

  // Find all TypeScript/TSX files
  const files = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}', '**/node_modules/**'],
  });

  console.log(`📁 Found ${files.length} files to analyze\n`);

  const stats: BarrelStats = {
    totalFiles: 0,
    totalImports: 0,
    byBarrel: new Map(),
    largestFiles: [],
  };

  const fileImportCounts = new Map<string, number>();

  files.forEach((file) => {
    const usages = analyzeFile(file);
    
    if (usages.length > 0) {
      stats.totalFiles++;
      
      usages.forEach((usage) => {
        stats.totalImports += usage.imports.length;
        
        if (!stats.byBarrel.has(usage.importPath)) {
          stats.byBarrel.set(usage.importPath, []);
        }
        stats.byBarrel.get(usage.importPath)!.push(usage);
        
        // Track file import counts
        const currentCount = fileImportCounts.get(file) || 0;
        fileImportCounts.set(file, currentCount + usage.imports.length);
      });
    }
  });

  // Sort files by import count
  stats.largestFiles = Array.from(fileImportCounts.entries())
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return stats;
}

function printReport(stats: BarrelStats) {
  console.log('═'.repeat(80));
  console.log('📊 BARREL IMPORTS ANALYSIS REPORT');
  console.log('═'.repeat(80));
  console.log();

  // Summary
  console.log('📈 SUMMARY');
  console.log('─'.repeat(80));
  console.log(`Files using barrel imports: ${stats.totalFiles}`);
  console.log(`Total barrel imports: ${stats.totalImports}`);
  console.log();

  // By barrel
  console.log('📦 BY BARREL FILE');
  console.log('─'.repeat(80));
  
  const sortedBarrels = Array.from(stats.byBarrel.entries())
    .sort((a, b) => {
      const aCount = a[1].reduce((sum, u) => sum + u.imports.length, 0);
      const bCount = b[1].reduce((sum, u) => sum + u.imports.length, 0);
      return bCount - aCount;
    });

  sortedBarrels.forEach(([barrel, usages]) => {
    const totalImports = usages.reduce((sum, u) => sum + u.imports.length, 0);
    const filesCount = new Set(usages.map(u => u.file)).size;
    
    console.log(`\n${barrel}`);
    console.log(`  Files: ${filesCount}`);
    console.log(`  Imports: ${totalImports}`);
    console.log(`  Impact: ${totalImports > 50 ? '🔴 HIGH' : totalImports > 20 ? '🟡 MEDIUM' : '🟢 LOW'}`);
  });

  console.log();

  // Top files
  console.log('🔥 TOP 10 FILES WITH MOST BARREL IMPORTS');
  console.log('─'.repeat(80));
  
  stats.largestFiles.forEach(({ file, count }, index) => {
    const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/');
    console.log(`${index + 1}. ${relativePath}`);
    console.log(`   Imports: ${count}`);
  });

  console.log();

  // Recommendations
  console.log('💡 RECOMMENDATIONS');
  console.log('─'.repeat(80));
  
  if (stats.totalImports === 0) {
    console.log('✅ No barrel imports found! Great job!');
  } else if (stats.totalImports < 50) {
    console.log('🟢 Low usage - Consider fixing manually');
    console.log('   Run: npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx --dry ./src');
  } else if (stats.totalImports < 200) {
    console.log('🟡 Medium usage - Automated transformation recommended');
    console.log('   1. Dry run: npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx --dry ./src');
    console.log('   2. Apply: npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx ./src');
  } else {
    console.log('🔴 High usage - CRITICAL performance impact');
    console.log('   Estimated build time improvement: 50-75%');
    console.log('   Estimated bundle size reduction: 20-40%');
    console.log();
    console.log('   Steps:');
    console.log('   1. Backup: git commit -am "Before barrel removal"');
    console.log('   2. Dry run: npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx --dry ./src');
    console.log('   3. Apply: npx jscodeshift -t ./scripts/transform-barrel-imports.ts --parser=tsx ./src');
    console.log('   4. Test: npm run build && npm run test');
    console.log('   5. Verify: npm run lint && npm run type-check');
  }

  console.log();
  console.log('═'.repeat(80));
  console.log();

  // Export JSON report
  const reportPath = path.join(process.cwd(), 'barrel-imports-report.json');
  const jsonReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: stats.totalFiles,
      totalImports: stats.totalImports,
    },
    byBarrel: Object.fromEntries(
      Array.from(stats.byBarrel.entries()).map(([barrel, usages]) => [
        barrel,
        {
          filesCount: new Set(usages.map(u => u.file)).size,
          totalImports: usages.reduce((sum, u) => sum + u.imports.length, 0),
          usages: usages.map(u => ({
            file: u.file.replace(process.cwd(), '').replace(/\\/g, '/'),
            line: u.line,
            imports: u.imports,
          })),
        },
      ]),
    ),
    topFiles: stats.largestFiles.map(f => ({
      file: f.file.replace(process.cwd(), '').replace(/\\/g, '/'),
      count: f.count,
    })),
  };

  fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`📄 Detailed report saved to: barrel-imports-report.json`);
  console.log();
}

// Run analysis
const stats = analyzeProject();
printReport(stats);
