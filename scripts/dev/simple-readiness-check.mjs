#!/usr/bin/env node

// Simple Phase 1 Readiness Check
// Basic verification without complex imports

import { promises as fs } from 'fs';
import fetch from 'node-fetch';

async function checkEnvironmentConfig() {
  console.log('🔧 Checking Environment Configuration...');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  let allConfigured = true;
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: CONFIGURED`);
    } else {
      console.log(`❌ ${envVar}: MISSING`);
      allConfigured = false;
    }
  }
  
  return allConfigured;
}

async function checkFileStructure() {
  console.log('\n📁 Checking Key Files...');
  
  const keyFiles = [
    'app/dashboard/market-data/page.tsx',
    'hooks/use-market-data-dashboard.ts',
    'app/api/market-data/status/route.ts',
    'lib/market-data/engine.ts',
    'lib/setup/engine/index.ts',
    'scripts/dev/start-operational-demo.mjs'
  ];
  
  let allExist = true;
  
  for (const file of keyFiles) {
    try {
      await fs.access(file);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.log(`❌ ${file}: NOT FOUND`);
      allExist = false;
    }
  }
  
  return allExist;
}

async function checkDevelopmentServer() {
  console.log('\n🌐 Checking Development Server...');
  
  try {
    const response = await fetch('http://localhost:3000/api/health', { 
      timeout: 5000 
    });
    
    if (response.ok) {
      console.log('✅ Development server is running');
      return true;
    } else {
      console.log(`⚠️  Development server responded with: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Development server not running');
    console.log('   Please start with: npm run dev');
    return false;
  }
}

async function checkBuildStatus() {
  console.log('\n🔨 Checking Build Status...');
  
  try {
    // Check if .next directory exists (indicates successful build)
    await fs.access('.next');
    console.log('✅ Next.js build directory found');
    
    // Check for build artifacts
    await fs.access('.next/server');
    console.log('✅ Server build artifacts present');
    
    return true;
  } catch (error) {
    console.log('❌ Build artifacts not found');
    console.log('   Please run: npm run build');
    return false;
  }
}

async function main() {
  console.log('🔍 PHASE 1 SIMPLE READINESS CHECK');
  console.log('=' .repeat(50));
  
  const checks = [
    { name: 'Environment Config', test: checkEnvironmentConfig },
    { name: 'Key Files', test: checkFileStructure },
    { name: 'Build Status', test: checkBuildStatus },
    { name: 'Development Server', test: checkDevelopmentServer }
  ];
  
  const results = [];
  
  for (const check of checks) {
    const result = await check.test();
    results.push({ name: check.name, passed: result });
  }
  
  console.log('\n📋 SUMMARY:');
  let allPassed = true;
  
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} - ${result.name}`);
    if (!result.passed) allPassed = false;
  }
  
  console.log('\n' + '=' .repeat(50));
  
  if (allPassed) {
    console.log('🎉 SYSTEM READY FOR OPERATIONAL DEMO!');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Ensure dev server is running: npm run dev');
    console.log('   2. Start operational demo: node scripts/dev/start-operational-demo.mjs');
    console.log('   3. Open dashboard: http://localhost:3000/dashboard/market-data');
    console.log('\n🎯 The complete operational loop will be active:');
    console.log('   📊 Binance real-time data → 🔄 Event processing');
    console.log('   🎯 Setup detection → 💰 Paper trading → 📈 KPI tracking');
    console.log('   🖥️  Professional dashboard with real-time monitoring');
  } else {
    console.log('❌ SYSTEM NOT READY');
    console.log('\n🔧 Required actions:');
    console.log('   - Check .env.local file exists and is configured');
    console.log('   - Run: npm install');
    console.log('   - Run: npm run build');
    console.log('   - Run: npm run dev (in separate terminal)');
  }
  
  return allPassed;
}

main().catch(console.error);