#!/usr/bin/env tsx
/**
 * Fix Database Schema and Permissions
 * 
 * This script:
 * 1. Creates missing tables
 * 2. Fixes RLS policies
 * 3. Grants proper permissions
 * 4. Verifies the fixes
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function executeSql(sql: string, description: string) {
  console.log(`\n📝 ${description}...`);
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb.rpc('exec', { sql });
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      return false;
    }
    
    console.log(`   ✅ Success`);
    return true;
  } catch (e) {
    console.error(`   💥 Exception: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}

async function createMissingTables() {
  console.log('\n' + '='.repeat(60));
  console.log('CREATING MISSING TABLES');
  console.log('='.repeat(60));
  
  // Create mce_regime_snapshots
  await executeSql(`
    CREATE TABLE IF NOT EXISTS public.mce_regime_snapshots (
      id BIGSERIAL PRIMARY KEY,
      symbol TEXT NOT NULL,
      tf TEXT NOT NULL,
      as_of BIGINT NOT NULL,
      signature JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(symbol, tf, as_of)
    );
    
    CREATE INDEX IF NOT EXISTS idx_mce_regime_snapshots_symbol_tf_as_of 
    ON public.mce_regime_snapshots(symbol, tf, as_of DESC);
  `, 'Create mce_regime_snapshots table');
  
  // Create msf_snapshots
  await executeSql(`
    CREATE TABLE IF NOT EXISTS public.msf_snapshots (
      id BIGSERIAL PRIMARY KEY,
      symbol TEXT NOT NULL,
      as_of BIGINT NOT NULL,
      day_gate JSONB NOT NULL,
      market_fits JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(symbol, as_of)
    );
    
    CREATE INDEX IF NOT EXISTS idx_msf_snapshots_symbol_as_of 
    ON public.msf_snapshots(symbol, as_of DESC);
  `, 'Create msf_snapshots table');
  
  // Create setup_events
  await executeSql(`
    CREATE TABLE IF NOT EXISTS public.setup_events (
      id BIGSERIAL PRIMARY KEY,
      event_id TEXT NOT NULL UNIQUE,
      setup_id TEXT,
      symbol TEXT NOT NULL,
      event_type TEXT NOT NULL,
      timestamp BIGINT NOT NULL,
      data JSONB NOT NULL,
      market_state JSONB,
      outcome JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_setup_events_symbol_timestamp 
    ON public.setup_events(symbol, timestamp DESC);
    
    CREATE INDEX IF NOT EXISTS idx_setup_events_setup_id 
    ON public.setup_events(setup_id);
  `, 'Create setup_events table');
  
  // Create active_setups
  await executeSql(`
    CREATE TABLE IF NOT EXISTS public.active_setups (
      id BIGSERIAL PRIMARY KEY,
      setup_id TEXT NOT NULL UNIQUE,
      symbol TEXT NOT NULL,
      setup_type TEXT NOT NULL,
      direction TEXT NOT NULL,
      entry_price NUMERIC NOT NULL,
      stop_price NUMERIC NOT NULL,
      target_primary NUMERIC NOT NULL,
      target_secondary NUMERIC,
      confidence_score NUMERIC NOT NULL,
      risk_reward NUMERIC NOT NULL,
      max_risk NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      metadata JSONB
    );
    
    CREATE INDEX IF NOT EXISTS idx_active_setups_symbol_status 
    ON public.active_setups(symbol, status);
    
    CREATE INDEX IF NOT EXISTS idx_active_setups_expires_at 
    ON public.active_setups(expires_at);
  `, 'Create active_setups table');
}

async function fixRLSPolicies() {
  console.log('\n' + '='.repeat(60));
  console.log('FIXING RLS POLICIES');
  console.log('='.repeat(60));
  
  // Enable RLS on all tables
  const tables = [
    'mce_regime_snapshots',
    'msf_snapshots',
    'setup_events',
    'active_setups',
    'market_data',
    'universe_active'
  ];
  
  for (const table of tables) {
    await executeSql(
      `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`,
      `Enable RLS on ${table}`
    );
  }
  
  // Create public read policies
  for (const table of tables) {
    await executeSql(
      `
      DROP POLICY IF EXISTS "Public read access" ON public.${table};
      CREATE POLICY "Public read access" 
      ON public.${table} FOR SELECT 
      TO public 
      USING (true);
      `,
      `Create public read policy for ${table}`
    );
  }
  
  // Create service role write policies
  for (const table of tables) {
    await executeSql(
      `
      DROP POLICY IF EXISTS "Service role full access" ON public.${table};
      CREATE POLICY "Service role full access" 
      ON public.${table} FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true);
      `,
      `Create service role write policy for ${table}`
    );
  }
}

async function grantPermissions() {
  console.log('\n' + '='.repeat(60));
  console.log('GRANTING PERMISSIONS');
  console.log('='.repeat(60));
  
  const tables = [
    'mce_regime_snapshots',
    'msf_snapshots',
    'setup_events',
    'active_setups',
    'market_data',
    'universe_active'
  ];
  
  for (const table of tables) {
    await executeSql(
      `
      GRANT ALL ON TABLE public.${table} TO service_role;
      GRANT SELECT ON TABLE public.${table} TO authenticated;
      GRANT SELECT ON TABLE public.${table} TO anon;
      `,
      `Grant permissions on ${table}`
    );
  }
}

async function verifyFix() {
  console.log('\n' + '='.repeat(60));
  console.log('VERIFYING FIXES');
  console.log('='.repeat(60));
  
  const tables = [
    'mce_regime_snapshots',
    'msf_snapshots',
    'setup_events',
    'active_setups',
    'market_data',
    'universe_active'
  ];
  
  const sb = supabaseAdmin();
  
  for (const table of tables) {
    try {
      const { data, error } = await sb
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: OK`);
      }
    } catch (e) {
      console.log(`   💥 ${table}: Exception`);
    }
  }
}

async function main() {
  console.log('🔧 Starting Database Schema Fix...\n');
  
  try {
    await createMissingTables();
    await fixRLSPolicies();
    await grantPermissions();
    await verifyFix();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE FIX COMPLETE');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('1. Verify all tables are accessible');
    console.log('2. Run setup engine to populate data');
    console.log('3. Check API endpoints for real data');
    
  } catch (e) {
    console.error('\n❌ Fix failed:', e);
    process.exit(1);
  }
}

main();
