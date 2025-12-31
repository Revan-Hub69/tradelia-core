#!/usr/bin/env tsx

// Start All Production Pipelines
// This script starts all the background workers needed for the system to be operational

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { spawn } from 'child_process';
import path from 'path';

const workers = [
  {
    name: 'MCE Pipeline',
    script: 'scripts/prod/mce-pipeline.ts',
    description: 'Market Context Engine - Updates regime data every minute'
  },
  {
    name: 'UCM Pipeline', 
    script: 'scripts/prod/ucm-pipeline.ts',
    description: 'Universe Context Manager - Updates tradable universe every hour'
  },
  {
    name: 'MSF Pipeline',
    script: 'scripts/prod/msf-pipeline.ts', 
    description: 'Market Structure Fit - Updates market fit data daily'
  },
  {
    name: 'Setup Detector',
    script: 'scripts/prod/setup-detector-only.ts',
    description: 'Setup Engine - Generates trading setups every 15 seconds'
  }
];

const processes: any[] = [];

console.log('🚀 Starting all production pipelines...\n');

for (const worker of workers) {
  console.log(`Starting ${worker.name}...`);
  console.log(`  ${worker.description}`);
  
  const workerProcess = spawn('npx', ['tsx', worker.script], {
    stdio: ['inherit', 'pipe', 'pipe'],
    cwd: process.cwd()
  });
  
  workerProcess.stdout?.on('data', (data) => {
    console.log(`[${worker.name}] ${data.toString().trim()}`);
  });
  
  workerProcess.stderr?.on('data', (data) => {
    console.error(`[${worker.name} ERROR] ${data.toString().trim()}`);
  });
  
  workerProcess.on('exit', (code) => {
    console.log(`[${worker.name}] Process exited with code ${code}`);
  });
  
  processes.push({ name: worker.name, process: workerProcess });
  console.log(`✅ ${worker.name} started\n`);
}

console.log('🎯 All pipelines started successfully!');
console.log('\nRunning workers:');
processes.forEach(p => console.log(`  - ${p.name}`));
console.log('\nPress Ctrl+C to stop all workers');

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all workers...');
  
  processes.forEach(p => {
    console.log(`Stopping ${p.name}...`);
    p.process.kill('SIGINT');
  });
  
  setTimeout(() => {
    console.log('All workers stopped.');
    process.exit(0);
  }, 2000);
});