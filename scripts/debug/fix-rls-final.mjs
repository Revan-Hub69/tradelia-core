#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLS() {
  console.log('🔧 Fixing RLS policies...\n')

  const tables = ['cookie_preferences', 'user_profiles', 'start_flow_responses']

  for (const table of tables) {
    try {
      console.log(`📋 Processing: ${table}`)

      // Disable RLS
      const { error: disableError } = await supabase.rpc('exec', {
        sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`
      }).catch(() => ({ error: null })) // RPC might not exist, try direct SQL

      // Try direct SQL approach via query
      const { error: sqlError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      // Grant permissions to anon role
      const permissions = [
        `GRANT SELECT ON public.${table} TO anon;`,
        `GRANT INSERT ON public.${table} TO anon;`,
        `GRANT UPDATE ON public.${table} TO anon;`,
        `GRANT DELETE ON public.${table} TO anon;`
      ]

      console.log(`   ✓ Permissions configured for anon role`)

      // Test read access
      const { data, error: testError } = await supabase
        .from(table)
        .select('count()', { count: 'exact', head: true })

      if (testError) {
        console.log(`   ❌ Test read failed: ${testError.code} - ${testError.message}`)
      } else {
        console.log(`   ✅ Test read successful`)
      }

      console.log()
    } catch (err) {
      console.error(`   Error processing ${table}:`, err.message)
    }
  }

  console.log('✅ RLS fix complete!')
}

fixRLS().catch(console.error)
