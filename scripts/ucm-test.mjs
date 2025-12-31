#!/usr/bin/env node

// UCM Test Script - Test the Universe Control Module pipeline
// Usage: node scripts/ucm-test.mjs [--dry-run] [--verbose]

import { runUCMPipeline, formatPipelineReport } from '../lib/ucm/pipeline/runOnce.js';

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  
  console.log('🧪 UCM Test Script');
  console.log('==================');
  
  if (dryRun) {
    console.log('🔍 Running in DRY RUN mode (no database writes)');
  }
  
  if (verbose) {
    console.log('📝 Verbose logging enabled');
  }
  
  console.log('');
  
  try {
    // Run the UCM pipeline
    const result = await runUCMPipeline();
    
    // Format and display the report
    const report = formatPipelineReport(result);
    console.log(report);
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('❌ UCM Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('❌ Script execution failed:', error);
  process.exit(1);
});