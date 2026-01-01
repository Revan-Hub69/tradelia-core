#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkRLSStatus() {
  console.log('🔍 Checking RLS status on public tables...\n')

  const tables = ['cookie_preferences', 'user_profiles', 'start_flow_responses']

  for (const table of tables) {
    try {
      console.log(`📋 Table: ${table}`)
      
      // Check if RLS is enabled
      const { data: rls, error: rlsError } = await supabase
        .rpc('get_table_rls_status', { table_name: table })
        .single()

      if (rlsError) {
        console.log(`   ⚠️  Could not check RLS status: ${rlsError.message}`)
      } else {
        console.log(`   RLS Enabled: ${rls?.rls_enabled ? '✓ YES' : '✗ NO'}`)
      }

      // Try to read as anon
      const { data, error } = await supabase
        .from(table)
        .select('count()', { count: 'exact', head: true })

      if (error) {
        console.log(`   ❌ Anon Read: FAILED - ${error.code}: ${error.message}`)
      } else {
        console.log(`   ✅ Anon Read: SUCCESS`)
      }

      console.log()
    } catch (err) {
      console.error(`   Error checking ${table}:`, err.message)
    }
  }
}

checkRLSStatus().catch(console.error)
