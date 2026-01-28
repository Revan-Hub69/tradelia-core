#!/usr/bin/env node
/**
 * Script per eseguire migrazioni SQL in Supabase usando il Service Role Key
 * Usage: node scripts/execute-migration.js <path-to-sql-file>
 */

const fs = require('node:fs');
const path = require('node:path');

// Supabase config from .env.local
const SUPABASE_URL = 'https://higkhlfjfhlecbtfnznx.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

async function executeMigration(sqlFilePath) {
  console.log(`🚀 Executing migration: ${sqlFilePath}`);

  // Read SQL file
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  // Split SQL into statements (handle comments)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  console.log(`📋 Found ${statements.length} SQL statements`);

  // Execute via Supabase REST API
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      query: sql,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  console.log('✅ Migration executed successfully!');
}

// Alternative: Use direct SQL execution via pg-meta endpoint
async function executeViaPgMeta(sqlFilePath) {
  console.log(`🚀 Executing migration via pg-meta: ${sqlFilePath}`);

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  // The Supabase REST API doesn't support raw SQL execution directly
  // We need to use the pg-meta endpoint or create a stored procedure

  // For now, let's print the SQL that needs to be executed
  console.log('\n📄 SQL to execute:');
  console.log('==================');
  console.log(sql);
  console.log('==================\n');

  console.log('⚠️  Please execute this SQL manually in Supabase Studio SQL Editor:');
  console.log(`   URL: ${SUPABASE_URL}/project/sql`);
  console.log('\nOr use the Supabase CLI:');
  console.log('   npx supabase db push');
}

// Main
const sqlFile = process.argv[2] || 'supabase/migrations/0011_add_competition_rules_fields.sql';
const fullPath = path.resolve(sqlFile);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

executeViaPgMeta(fullPath).catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
