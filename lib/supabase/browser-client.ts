'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Database features disabled.')
}

// Browser-side Supabase client (for client components)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

export default supabase
