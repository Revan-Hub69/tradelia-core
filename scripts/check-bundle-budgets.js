#!/usr/bin/env node

/**
 * Bundle Budget Check Script - Tradelia 2026
 * 
 * Verifica che i bundle rispettino i budget definiti:
 * - Marketing: <150KB (lightweight, Italian-only)
 * - Dashboard: <300KB (full-featured, i18n)
 */

const fs = require('fs');
const path = require('path');

// Bundle size limits in bytes
const BUDGETS = {
  marketing: 150 * 1024, // 150KB
  dashboard: 300 * 1024, // 300KB
  shared: 100 * 1024     // 100KB for shared chunks
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

function findBundleFiles(pattern) {
  const nextDir = '.next/static/chunks';
  if (!fs.existsSync(nextDir)) return [];
  
  const files = [];
  
  function searchDir(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        searchDir(itemPath);
      } else if (item.name.includes(pattern) && item.name.endsWith('.js')) {
        files.push(itemPath);
      }
    }
  }
  
  searchDir(nextDir);
  return files;
}

function checkBundleBudgets() {
  console.log('📊 Checking bundle budgets...');
  
  if (!fs.existsSync('.next')) {
    console.error('❌ .next directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  let hasViolations = false;
  
  // Check marketing bundle
  console.log('\n🏪 Marketing Bundle Analysis:');
  const marketingFiles = findBundleFiles('marketing');
  let marketingSize = 0;
  
  if (marketingFiles.length === 0) {
    // Fallback: check pages/(marketing) directory
    const marketingPagesDir = '.next/static/chunks/pages/(marketing)';
    marketingSize = getDirectorySize(marketingPagesDir);
  } else {
    marketingSize = marketingFiles.reduce((total, file) => {
      const stats = fs.statSync(file);
      console.log(`   ${path.basename(file)}: ${formatBytes(stats.size)}`);
      return total + stats.size;
    }, 0);
  }
  
  console.log(`   Total: ${formatBytes(marketingSize)}`);
  console.log(`   Budget: ${formatBytes(BUDGETS.marketing)}`);
  
  if (marketingSize > BUDGETS.marketing) {
    console.error(`   ❌ BUDGET VIOLATION: ${formatBytes(marketingSize - BUDGETS.marketing)} over budget`);
    hasViolations = true;
  } else {
    const remaining = BUDGETS.marketing - marketingSize;
    console.log(`   ✅ Within budget (${formatBytes(remaining)} remaining)`);
  }
  
  // Check dashboard bundle
  console.log('\n📊 Dashboard Bundle Analysis:');
  const dashboardFiles = findBundleFiles('app');
  let dashboardSize = 0;
  
  if (dashboardFiles.length === 0) {
    // Fallback: check pages/(app) directory
    const dashboardPagesDir = '.next/static/chunks/pages/(app)';
    dashboardSize = getDirectorySize(dashboardPagesDir);
  } else {
    dashboardSize = dashboardFiles.reduce((total, file) => {
      const stats = fs.statSync(file);
      console.log(`   ${path.basename(file)}: ${formatBytes(stats.size)}`);
      return total + stats.size;
    }, 0);
  }
  
  console.log(`   Total: ${formatBytes(dashboardSize)}`);
  console.log(`   Budget: ${formatBytes(BUDGETS.dashboard)}`);
  
  if (dashboardSize > BUDGETS.dashboard) {
    console.error(`   ❌ BUDGET VIOLATION: ${formatBytes(dashboardSize - BUDGETS.dashboard)} over budget`);
    hasViolations = true;
  } else {
    const remaining = BUDGETS.dashboard - dashboardSize;
    console.log(`   ✅ Within budget (${formatBytes(remaining)} remaining)`);
  }
  
  // Check shared chunks
  console.log('\n🔗 Shared Chunks Analysis:');
  const sharedDir = '.next/static/chunks';
  const sharedFiles = fs.readdirSync(sharedDir)
    .filter(file => file.endsWith('.js') && !file.includes('marketing') && !file.includes('app'))
    .slice(0, 10); // Show top 10 largest shared chunks
  
  let sharedSize = 0;
  sharedFiles.forEach(file => {
    const filePath = path.join(sharedDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file}: ${formatBytes(stats.size)}`);
    sharedSize += stats.size;
  });
  
  if (sharedFiles.length > 10) {
    console.log(`   ... and ${sharedFiles.length - 10} more files`);
  }
  
  console.log(`   Shared total (top ${Math.min(10, sharedFiles.length)}): ${formatBytes(sharedSize)}`);
  
  // Bundle composition analysis
  console.log('\n📈 Bundle Composition:');
  const totalSize = marketingSize + dashboardSize;
  const marketingPercent = ((marketingSize / totalSize) * 100).toFixed(1);
  const dashboardPercent = ((dashboardSize / totalSize) * 100).toFixed(1);
  
  console.log(`   Marketing: ${marketingPercent}% (${formatBytes(marketingSize)})`);
  console.log(`   Dashboard: ${dashboardPercent}% (${formatBytes(dashboardSize)})`);
  console.log(`   Total: ${formatBytes(totalSize)}`);
  
  // Recommendations
  if (hasViolations) {
    console.log('\n💡 Optimization Recommendations:');
    
    if (marketingSize > BUDGETS.marketing) {
      console.log('   Marketing Bundle:');
      console.log('   - Remove unused dependencies');
      console.log('   - Ensure no i18n imports in marketing pages');
      console.log('   - Use dynamic imports for non-critical components');
      console.log('   - Consider code splitting for large components');
    }
    
    if (dashboardSize > BUDGETS.dashboard) {
      console.log('   Dashboard Bundle:');
      console.log('   - Implement lazy loading for dashboard widgets');
      console.log('   - Use dynamic imports for heavy libraries');
      console.log('   - Consider virtual scrolling for large lists');
      console.log('   - Split dashboard into smaller route-based chunks');
    }
  }
  
  if (hasViolations) {
    console.error('\n❌ Bundle budget violations found!');
    process.exit(1);
  } else {
    console.log('\n✅ All bundle budgets respected');
  }
}

// Run the check
checkBundleBudgets();