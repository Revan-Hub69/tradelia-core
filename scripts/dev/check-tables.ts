#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function checkTables() {
  const sb = supabaseAdmin();
  
  // Check what tables exist
  const { data, error } = await sb
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Available tables:');
  data.forEach(table => console.log(`  - ${table.table_name}`));
}

checkTables().catch(console.error);