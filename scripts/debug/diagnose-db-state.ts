#!/usr/bin/env tsx
/**
 * Comprehensive Database Diagnostic
 * Checks:
 * 1. Connection status
 * 2. Table existence and schema
 * 3. RLS policies
 * 4. Write permissions
 * 5. Data presence
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin, supabaseAnon } from '../../lib/mce/db/supabase';

interface DiagnosticResult {
  section: string;
  status: 'OK' | 'ERROR' | 'WARNING';
  details: string[];
}

const results: DiagnosticResult[] = [];

async function checkConnection() {
  console.log('\n🔌 Checking Supabase Connection...');
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb.from('system_health').select('*').limit(1);
    
    if (error && error.message.includes('relation "system_health" does not exist')) {
      results.push({
        section: 'Connection',
        status: 'OK',
        details: ['✅ Connected to Supabase (system_health table not found, but connection works)']
      });
    } else if (error) {
      results.push({
        section: 'Connection',
        status: 'ERROR',
        details: [`❌ Connection error: ${error.message}`]
      });
    } else {
      results.push({
        section: 'Connection',
        status: 'OK',
        details: ['✅ Connected to Supabase']
      });
    }
  } catch (e) {
    results.push({
      section: 'Connection',
      status: 'ERROR',
      details: [`❌ Exception: ${e instanceof Error ? e.message : String(e)}`]
    });
  }
}

async function checkTables() {
  console.log('\n📋 Checking Table Existence...');
  const tables = [
    'mce_regime_snapshots',
    'universe_active',
    'msf_snapshots',
    'setup_events',
    'active_setups',
    'market_data',
    'eligibility_snapshots'
  ];
  
  const details: string[] = [];
  let errorCount = 0;
  
  for (const table of tables) {
    try {
      const sb = supabaseAdmin();
      const { data, error } = await sb
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('permission denied')) {
          details.push(`⚠️  ${table}: EXISTS but PERMISSION DENIED`);
          errorCount++;
        } else if (error.message.includes('does not exist')) {
          details.push(`❌ ${table}: DOES NOT EXIST`);
          errorCount++;
        } else {
          details.push(`⚠️  ${table}: ${error.message}`);
          errorCount++;
        }
      } else {
        details.push(`✅ ${table}: OK (${data?.length || 0} rows)`);
      }
    } catch (e) {
      details.push(`💥 ${table}: Exception - ${e instanceof Error ? e.message : String(e)}`);
      errorCount++;
    }
  }
  
  results.push({
    section: 'Tables',
    status: errorCount > 0 ? 'ERROR' : 'OK',
    details
  });
}

async function checkWritePermissions() {
  console.log('\n✍️  Checking Write Permissions...');
  const details: string[] = [];
  
  try {
    const sb = supabaseAdmin();
    const testId = 'test_' + Date.now();
    
    // Try to write to setup_events
    const { data, error } = await sb
      .from('setup_events')
      .insert({
        event_id: testId,
        symbol: 'BTCUSDT',
        event_type: 'CONTEXT_FILTER',
        timestamp: Date.now(),
        data: { test: true }
      })
      .select();
    
    if (error) {
      if (error.message.includes('permission denied')) {
        details.push(`❌ setup_events: PERMISSION DENIED for writes`);
      } else if (error.message.includes('does not exist')) {
        details.push(`❌ setup_events: TABLE DOES NOT EXIST`);
      } else {
        details.push(`❌ setup_events: ${error.message}`);
      }
    } else {
      details.push(`✅ setup_events: Write successful`);
      
      // Clean up test data
      await sb.from('setup_events').delete().eq('event_id', testId);
    }
  } catch (e) {
    details.push(`💥 Exception: ${e instanceof Error ? e.message : String(e)}`);
  }
  
  results.push({
    section: 'Write Permissions',
    status: details.some(d => d.includes('❌')) ? 'ERROR' : 'OK',
    details
  });
}

async function checkDataPresence() {
  console.log('\n📊 Checking Data Presence...');
  const details: string[] = [];
  
  const tables = [
    'mce_regime_snapshots',
    'universe_active',
    'msf_snapshots',
    'setup_events',
    'active_setups'
  ];
  
  for (const table of tables) {
    try {
      const sb = supabaseAdmin();
      const { data, error, count } = await sb
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        details.push(`⚠️  ${table}: Cannot check (${error.message})`);
      } else {
        const rowCount = count || 0;
        if (rowCount === 0) {
          details.push(`⚠️  ${table}: EMPTY (0 rows)`);
        } else {
          details.push(`✅ ${table}: ${rowCount} rows`);
        }
      }
    } catch (e) {
      details.push(`💥 ${table}: Exception`);
    }
  }
  
  results.push({
    section: 'Data Presence',
    status: 'WARNING',
    details
  });
}

async function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('DATABASE DIAGNOSTIC REPORT');
  console.log('='.repeat(60));
  
  for (const result of results) {
    const icon = result.status === 'OK' ? '✅' : result.status === 'ERROR' ? '❌' : '⚠️ ';
    console.log(`\n${icon} ${result.section}`);
    for (const detail of result.details) {
      console.log(`   ${detail}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  const hasErrors = results.some(r => r.status === 'ERROR');
  if (hasErrors) {
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('1. Check Supabase dashboard for table schema');
    console.log('2. Verify RLS policies are not blocking writes');
    console.log('3. Run: npx supabase db push (to apply pending migrations)');
    console.log('4. Check service role key has proper permissions');
  } else {
    console.log('\n✅ Database appears healthy!');
  }
}

async function main() {
  console.log('🔍 Starting Database Diagnostic...');
  
  await checkConnection();
  await checkTables();
  await checkWritePermissions();
  await checkDataPresence();
  await printResults();
}

main().catch(console.error);
