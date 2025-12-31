#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/mce/db/supabase';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    const sb = supabaseAdmin();
    
    // Test basic connection
    const { data, error } = await sb.from('system_health').select('*').limit(1);
    
    if (error) {
      console.log('Database error:', error.message);
    } else {
      console.log('Database connected successfully');
      console.log('System health data:', data);
    }
    
    // Check if active_setups table exists
    const { data: tables, error: tablesError } = await sb
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'active_setups');
    
    if (tablesError) {
      console.log('Error checking tables:', tablesError.message);
    } else {
      console.log('Active setups table exists:', tables && tables.length > 0);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDatabase();