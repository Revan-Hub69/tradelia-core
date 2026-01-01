#!/usr/bin/env tsx

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../../lib/mce/db/supabase';

async function checkTables() {
  const sb = supabaseAdmin();
  
  // Get all tables
  const { data, error } = await sb
    .rpc('get_schema_tables');
  
  if (error) {
    console.error('RPC Error:', error);
    
    // Try direct query
    const { data: tables, error: queryError } = await sb
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (queryError) {
      console.error('Query Error:', queryError);
      return;
    }
    
    console.log('Tables found:');
    tables?.forEach(t => console.log(`  - ${t.tablename}`));
    return;
  }
  
  console.log('Schema tables:', data);
}

checkTables().catch(console.error);