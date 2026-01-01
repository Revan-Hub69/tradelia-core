#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function listTables() {
  const sb = supabaseAdmin();
  
  console.log('📋 Listing available tables...');
  
  // Try to get table names from information_schema
  const { data, error } = await sb
    .from('eligibility_snapshots')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error accessing eligibility_snapshots:', error);
  } else {
    console.log('✅ eligibility_snapshots exists:', data);
  }
  
  // Try other common table names
  const tables = [
    'market_data',
    'mce_regime_snapshots', 
    'universe_active',
    'msf_snapshots',
    'setup_events',
    'active_setups'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await sb
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists`);
      }
    } catch (e) {
      console.log(`💥 ${table}: exception`);
    }
  }
}

listTables().catch(console.error);