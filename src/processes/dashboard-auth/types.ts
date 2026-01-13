/**
 * Dashboard Authentication Process Types - Tradelia 2026
 * 
 * Tipi per il processo di autenticazione nella dashboard SuperBig
 * seguendo i principi FSD (Feature-Sliced Design)
 */

import type { User } from '@supabase/supabase-js'
import type { UserProfile, DashboardConfig } from '@/lib/supabase'

export interface DashboardAuthState {
  user: User | null
  profile: UserProfile | null
  dashboardConfig: DashboardConfig | null
  isGuestMode: boolean
  loading: boolean
  error: string | null
}

export interface DashboardAuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  enableGuestMode: () => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  resendVerification: () => Promise<void>
}

export interface DashboardAuthFlow {
  state: DashboardAuthState
  actions: DashboardAuthActions
}

export interface GuestModeConfig {
  enabled: boolean
  defaultObjective: UserProfile['crypto_objective']
  defaultExperience: UserProfile['experience_level']
  limitations: string[]
}

export interface AuthRedirectConfig {
  successPath: string
  errorPath: string
  guestPath: string
}