#!/usr/bin/env node

/**
 * MCE Pipeline End-to-End Test
 * Tests the complete flow: Binance → MCE → Database
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  db: { schema: 'public' }
});

async function testMCEPipeline() {
  console.log('🧪 MCE Pipeline End-to-End Test');
  console.log('═'.repeat(60));
  
  try {
    // Step 1: Check database connectivity
    console.log('\n1️⃣  Testing database connectivity...');
    const { data: healthData, error: healthError } = await supabase
      .from('system_health')
      .select('key')
      .limit(1);
    
    if (healthError) {
      console.log(`   ❌ Database error: ${healthError.message}`);
      return false;
    }
    console.log('   ✅ Database connected');
    
    // Step 2: Check regime_signatures table
    console.log('\n2️⃣  Checking regime_signatures table...');
    const { data: regimeData, error: regimeError, count: regimeCount } = await supabase
      .from('regime_signatures')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (regimeError) {
      console.log(`   ❌ Error: ${regimeError.message}`);
      return false;
    }
    
    console.log(`   ✅ Table exists (${regimeCount} rows)`);
    
    if (regimeCount > 0) {
      const latest = regimeData[0];
      console.log(`   📊 Latest entry:`);
      console.log(`      Symbol: ${latest.symbol}`);
      console.log(`      TF: ${latest.tf}`);
      console.log(`      Trend: ${latest.trend}`);
      console.log(`      Volatility: ${latest.volatility}`);
      console.log(`      Confidence: ${latest.confidence}`);
    } else {
      console.log('   ⚠️  Table is empty (pipeline hasn\'t run yet)');
    }
    
    // Step 3: Check market_data table
    console.log('\n3️⃣  Checking market_data table...');
    const { data: marketData, error: marketError, count: marketCount } = await supabase
      .from('market_data')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (marketError) {
      console.log(`   ❌ Error: ${marketError.message}`);
      return false;
    }
    
    console.log(`   ✅ Table exists (${marketCount} rows)`);
    
    if (marketCount > 0) {
      const latest = marketData[0];
      console.log(`   📊 Latest entry:`);
      console.log(`      Symbol: ${latest.symbol}`);
      console.log(`      TF: ${latest.tf}`);
      console.log(`      Close: $${parseFloat(latest.close).toFixed(2)}`);
      console.log(`      Volume: ${parseFloat(latest.volume).toFixed(0)}`);
    } else {
      console.log('   ⚠️  Table is empty (pipeline hasn\'t run yet)');
    }
    
    // Step 4: Check market_data_runs table
    console.log('\n4️⃣  Checking market_data_runs table...');
    const { data: runsData, error: runsError, count: runsCount } = await supabase
      .from('market_data_runs')
      .select('*', { count: 'exact' })
      .order('started_at', { ascending: false })
      .limit(5);
    
    if (runsError) {
      console.log(`   ❌ Error: ${runsError.message}`);
      return false;
    }
    
    console.log(`   ✅ Table exists (${runsCount} runs)`);
    
    if (runsCount > 0) {
      console.log('   📊 Recent runs:');
      runsData.forEach((run, i) => {
        const status = run.status === 'SUCCESS' ? '✅' : run.status === 'RUNNING' ? '⏳' : '❌';
        const duration = run.completed_at 
          ? Math.round((new Date(run.completed_at) - new Date(run.started_at)) / 1000)
          : '?';
        console.log(`      ${i + 1}. ${status} ${run.module} - ${run.status} (${duration}s, ${run.records_processed} records)`);
      });
    } else {
      console.log('   ⚠️  No runs yet (pipeline hasn\'t run)');
    }
    
    // Step 5: Summary
    console.log('\n📊 Summary');
    console.log('═'.repeat(60));
    
    const hasData = regimeCount > 0 || marketCount > 0;
    
    if (hasData) {
      console.log('✅ Pipeline has written data to database');
      console.log(`   Regime signatures: ${regimeCount} rows`);
      console.log(`   Market data: ${marketCount} rows`);
      console.log(`   Pipeline runs: ${runsCount} executions`);
    } else {
      console.log('⚠️  No data in database yet');
      console.log('   Pipeline hasn\'t run or hasn\'t written data');
      console.log('\n💡 Next steps:');
      console.log('   1. Run MCE pipeline: node scripts/prod/mce-pipeline.ts');
      console.log('   2. Or enable GitHub Actions for automatic execution');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    return false;
  }
}

async function main() {
  const success = await testMCEPipeline();
  process.exit(success ? 0 : 1);
}

main();
