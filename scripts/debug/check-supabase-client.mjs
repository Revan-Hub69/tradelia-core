#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env.local');

dotenv.config({ path: envPath });

console.log('🔍 Supabase Client Configuration Check\n');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment Variables:');
console.log(`  NEXT_PUBLIC_SUPABASE_URL: ${url ? '✅ Set' : '❌ Missing'}`);
console.log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${anonKey ? '✅ Set' : '❌ Missing'}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? '✅ Set' : '❌ Missing'}`);

if (!url || !anonKey) {
  console.log('\n❌ ERROR: Missing required environment variables!');
  console.log('   The Supabase client cannot be initialized.');
  console.log('   Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!');
console.log('\nSupabase Project Details:');
console.log(`  URL: ${url}`);
console.log(`  Anon Key (first 20 chars): ${anonKey.substring(0, 20)}...`);

// Test if we can make a request
console.log('\n🧪 Testing Supabase REST API...');

try {
  const response = await fetch(`${url}/rest/v1/`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
    },
  });

  if (response.ok) {
    console.log('✅ Supabase REST API is accessible');
  } else {
    console.log(`⚠️  Supabase REST API returned status ${response.status}`);
    const text = await response.text();
    console.log(`   Response: ${text}`);
  }
} catch (error) {
  console.log(`❌ Failed to connect to Supabase: ${error.message}`);
}

console.log('\n✅ Configuration check complete!');
