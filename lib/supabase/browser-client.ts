'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Database features disabled.')
}

type SupabaseBrowserSingleton = {
  supabaseClient?: SupabaseClient<Database>
}

const globalForSupabase = globalThis as unknown as SupabaseBrowserSingleton

const createBrowserClient = () =>
  createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

// Browser-side Supabase client (singleton to avoid multiple GoTrue instances)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? globalForSupabase.supabaseClient ?? createBrowserClient()
    : null

if (supabaseUrl && supabaseAnonKey && supabase && !globalForSupabase.supabaseClient) {
  globalForSupabase.supabaseClient = supabase
}

export default supabase
