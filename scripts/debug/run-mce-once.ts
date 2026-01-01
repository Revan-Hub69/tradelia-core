#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { runMCEPipeline } from '../../lib/mce/pipeline/runOnce';

async function runOnce() {
  console.log('🚀 Running MCE pipeline once...');
  
  try {
    const result = await runMCEPipeline();
    console.log('✅ Pipeline completed:', result);
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
  }
}

runOnce().catch(console.error);