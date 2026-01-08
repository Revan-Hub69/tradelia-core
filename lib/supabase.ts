import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createUnconfiguredClient(): SupabaseClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        )
      }
    }
  ) as unknown as SupabaseClient
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createUnconfiguredClient()

// Types for our database
export interface UserProfile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  crypto_objective?: 'investment' | 'emergency' | 'passive' | 'speculation'
  experience_level?: 'none' | 'basic' | 'traditional' | 'crypto'
  other_tools?: 'none' | 'pension' | 'diversified' | 'trading'
  storage_preference?: 'register' | 'guest'
  onboarding_completed_at?: string
  preferences?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface UserSession {
  id: string
  session_token: string
  user_id?: string
  encrypted_data?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
  last_active?: string
  expires_at?: string
}

export interface DashboardConfig {
  id: string
  user_id?: string
  session_token?: string
  objective_config?: Record<string, any>
  risk_warnings?: Record<string, any>
  recommended_tools?: Record<string, any>
  created_at?: string
  updated_at?: string
}
