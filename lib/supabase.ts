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
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  notifications?: boolean
  [key: string]: string | boolean | undefined
}

// Country codes - now accepts all ISO 3166-1 alpha-2 codes
// Full list available in lib/countries.ts
export type CountryCode = string  // Any valid 2-letter ISO code

// Re-export for convenience
export { ALL_COUNTRIES, getCountryName, searchCountries, getCountriesSortedByLocale } from './countries'
export type { Country } from './countries'

// Legacy export for backward compatibility
export const SUPPORTED_COUNTRIES = [] as { code: string; name: string }[]  // Deprecated - use ALL_COUNTRIES

export interface UserProfile {
  id: string
  email?: string
  full_name?: string  // Deprecated - use nickname instead
  nickname?: string   // Display name (3-20 chars, alphanumeric + underscore)
  country_code?: string  // ISO 3166-1 alpha-2 country code
  avatar_url?: string
  crypto_objective?: 'investment' | 'emergency' | 'passive' | 'speculation'
  experience_level?: 'none' | 'basic' | 'traditional' | 'crypto'
  other_tools?: 'none' | 'pension' | 'diversified' | 'trading'
  storage_preference?: 'register' | 'guest'
  onboarding_completed_at?: string
  preferences?: UserPreferences
  created_at?: string
  updated_at?: string
}

export interface EncryptedData {
  iv?: string
  data?: string
  [key: string]: string | undefined
}

export interface UserSession {
  id: string
  session_token: string
  user_id?: string
  encrypted_data?: EncryptedData
  ip_address?: string
  user_agent?: string
  created_at?: string
  last_active?: string
  expires_at?: string
}

export interface ObjectiveConfig {
  primary?: string
  secondary?: string[]
  [key: string]: string | string[] | undefined
}

export interface RiskWarnings {
  acknowledged?: string[]
  dismissed?: string[]
  [key: string]: string[] | undefined
}

export interface RecommendedTools {
  tools?: string[]
  priority?: string
  [key: string]: string | string[] | undefined
}

export interface DashboardConfig {
  id: string
  user_id?: string
  session_token?: string
  objective_config?: ObjectiveConfig
  risk_warnings?: RiskWarnings
  recommended_tools?: RecommendedTools
  created_at?: string
  updated_at?: string
}

export interface UserProgress {
  id: string
  user_id: string
  journey_id: string
  pillar_id: string
  completed_sections: string[]
  percentage: number
  created_at?: string
  updated_at?: string
}
