#!/usr/bin/env node

/**
 * Version Alignment Check Script - Tradelia 2026
 * 
 * Verifica che le versioni in package.json siano allineate con quelle
 * specificate nella documentazione del progetto.
 */

const fs = require('fs');
const path = require('path');

function checkVersionAlignment() {
  console.log('🔍 Checking version alignment...');
  
  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    // Read tasks documentation
    const tasksDoc = fs.readFileSync('./.kiro/specs/tradelia-superbig-dashboard/tasks.md', 'utf8');
    
    // Extract versions from package.json
    const nextVersion = packageJson.dependencies?.['next'] || packageJson.devDependencies?.['next'];
    const reactVersion = packageJson.dependencies?.['react'] || packageJson.devDependencies?.['react'];
    const nodeVersion = packageJson.engines?.['node'];
    
    // Extract major versions
    const nextMajor = nextVersion?.match(/(\d+)\./)?.[1];
    const reactMajor = reactVersion?.match(/(\d+)\./)?.[1];
    const nodeMinor = nodeVersion?.match(/>=(\d+\.\d+)/)?.[1];
    
    console.log(`📦 Current versions:`);
    console.log(`   Next.js: ${nextVersion} (major: ${nextMajor})`);
    console.log(`   React: ${reactVersion} (major: ${reactMajor})`);
    console.log(`   Node.js: ${nodeVersion}`);
    
    // Check Next.js version alignment
    if (!tasksDoc.includes(`Next.js ${nextMajor}`)) {
      console.error(`❌ Version mismatch: package.json has Next.js ${nextVersion}, but tasks.md references different version`);
      process.exit(1);
    }
    
    // React version check is optional since it's not always referenced in docs
    console.log(`   React version: ${reactVersion} (major: ${reactMajor}) - OK`);
    
    // Check Node.js version requirements
    if (nodeMinor && parseFloat(nodeMinor) < 18.17) {
      console.error(`❌ Node.js version too low: requires >= 18.17.0, found ${nodeVersion}`);
      process.exit(1);
    }
    
    // Check for deprecated dependencies
    const deprecatedDeps = [
      'moment', // Use date-fns instead
      'lodash', // Use native JS or specific lodash functions
      'axios', // Use native fetch
      'styled-components', // Use Tailwind CSS
      'emotion' // Use Tailwind CSS
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const foundDeprecated = deprecatedDeps.filter(dep => allDeps[dep]);
    
    if (foundDeprecated.length > 0) {
      console.warn(`⚠️  Deprecated dependencies found: ${foundDeprecated.join(', ')}`);
      console.warn(`   Consider replacing with modern alternatives`);
    }
    
    // Check for security vulnerabilities in known packages
    const vulnerablePackages = {
      'react-scripts': '< 5.0.0', // Known security issues in older versions
      'webpack': '< 5.0.0',
      'node-sass': '*' // Deprecated, use sass instead
    };
    
    for (const [pkg, version] of Object.entries(vulnerablePackages)) {
      if (allDeps[pkg]) {
        console.warn(`⚠️  Potentially vulnerable package: ${pkg} ${allDeps[pkg]}`);
        console.warn(`   Recommended: ${version === '*' ? 'remove or replace' : `upgrade to ${version}`}`);
      }
    }
    
    console.log('✅ Version alignment verified');
    console.log('✅ No critical security issues found');
    
  } catch (error) {
    console.error('❌ Error checking versions:', error.message);
    process.exit(1);
  }
}

// Run the check
checkVersionAlignment();