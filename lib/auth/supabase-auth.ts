/**
 * Supabase Authentication wrapper
 * Provides a clean interface for all auth operations
 */

import { supabase } from '@/lib/supabase/browser-client'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { exportUserData, importUserData, clearTemporaryData } from '@/lib/utils/session'

export interface AuthUser {
  id: string
  email: string
  emailVerified: boolean
  displayName?: string
  createdAt: string
  lastActive: string
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthResult {
  user?: AuthUser
  session?: AuthSession
  error?: string
}

export interface RegisterData {
  email: string
  password: string
  displayName?: string
}

export interface LoginData {
  email: string
  password: string
}

class SupabaseAuthManager {
  private currentUser: AuthUser | null = null
  private currentSession: AuthSession | null = null
  private listeners: ((user: AuthUser | null) => void)[] = []

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    if (!supabase) return

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await this.handleAuthChange(session)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_IN' && session) {
        await this.handleAuthChange(session)
      } else if (event === 'SIGNED_OUT') {
        await this.handleSignOut()
      } else if (event === 'TOKEN_REFRESHED' && session) {
        await this.handleAuthChange(session)
      }
    })
  }

  private async handleAuthChange(session: Session) {
    try {
      const user = await this.mapSupabaseUser(session.user)
      const authSession: AuthSession = {
        user,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at || 0
      }

      this.currentUser = user
      this.currentSession = authSession

      // Update last active timestamp
      await this.updateLastActive(user.id)

      // Notify listeners
      this.notifyListeners(user)

      // Try to migrate guest data if this is a new registration
      await this.attemptGuestDataMigration(user.id)

    } catch (error) {
      console.error('Error handling auth change:', error)
    }
  }

  private async handleSignOut() {
    this.currentUser = null
    this.currentSession = null
    this.notifyListeners(null)
  }

  private async mapSupabaseUser(supabaseUser: User): Promise<AuthUser> {
    // Get additional user data from our profiles table
    let displayName = supabaseUser.user_metadata?.display_name
    let emailVerified = supabaseUser.email_confirmed_at !== null

    if (supabase) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('id', supabaseUser.id)
        .single()

      if (profile?.display_name) {
        displayName = profile.display_name
      }
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      emailVerified,
      displayName,
      createdAt: supabaseUser.created_at,
      lastActive: new Date().toISOString()
    }
  }

  private async updateLastActive(userId: string) {
    if (!supabase) return

    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          last_active: new Date().toISOString()
        })
    } catch (error) {
      console.warn('Failed to update last active:', error)
    }
  }

  private async attemptGuestDataMigration(userId: string) {
    try {
      // Export guest data
      const guestData = await exportUserData()
      if (!guestData) return

      // Check if user already has data (to avoid overwriting)
      if (supabase) {
        const { data: existingData } = await supabase
          .from('start_flow_responses')
          .select('id')
          .eq('session_id', userId)
          .limit(1)

        if (existingData && existingData.length > 0) {
          console.log('User already has data, skipping migration')
          return
        }
      }

      // Migrate start flow data
      if (guestData.startFlowData && supabase) {
        await supabase
          .from('start_flow_responses')
          .insert({
            ...guestData.startFlowData,
            session_id: userId // Use user ID instead of guest session
          })
      }

      // Migrate other progress data
      if (guestData.progressData && supabase) {
        await supabase
          .from('user_progress')
          .insert({
            ...guestData.progressData,
            session_id: userId
          })
      }

      // Clear guest data after successful migration
      await clearTemporaryData()
      
      console.log('Guest data migration completed successfully')
    } catch (error) {
      console.warn('Guest data migration failed:', error)
      // Don't throw - migration failure shouldn't break auth
    }
  }

  private notifyListeners(user: AuthUser | null) {
    this.listeners.forEach(listener => listener(user))
  }

  // Public API
  async register(data: RegisterData): Promise<AuthResult> {
    if (!supabase) {
      return { error: 'Authentication service not available' }
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      if (authData.user && !authData.session) {
        return { 
          error: 'Registration successful! Please check your email to verify your account.' 
        }
      }

      return { user: this.currentUser || undefined }
    } catch (error) {
      return { error: 'Registration failed. Please try again.' }
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    if (!supabase) {
      return { error: 'Authentication service not available' }
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        return { error: error.message }
      }

      return { 
        user: this.currentUser || undefined,
        session: this.currentSession || undefined
      }
    } catch (error) {
      return { error: 'Login failed. Please try again.' }
    }
  }

  async loginWithGoogle(): Promise<AuthResult> {
    if (!supabase) {
      return { error: 'Authentication service not available' }
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {} // OAuth redirect will handle the rest
    } catch (error) {
      return { error: 'Google login failed. Please try again.' }
    }
  }

  async logout(): Promise<void> {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async resetPassword(email: string): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Authentication service not available' }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Password reset failed. Please try again.' }
    }
  }

  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    if (!supabase) {
      return { error: 'Authentication service not available' }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Password update failed. Please try again.' }
    }
  }

  async updateProfile(updates: { displayName?: string }): Promise<{ error?: string }> {
    if (!supabase || !this.currentUser) {
      return { error: 'Not authenticated' }
    }

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: updates.displayName }
      })

      if (authError) {
        return { error: authError.message }
      }

      // Update profile table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: this.currentUser.id,
          display_name: updates.displayName,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        return { error: profileError.message }
      }

      // Update current user
      this.currentUser = {
        ...this.currentUser,
        displayName: updates.displayName
      }

      this.notifyListeners(this.currentUser)
      return {}
    } catch (error) {
      return { error: 'Profile update failed. Please try again.' }
    }
  }

  async deleteAccount(): Promise<{ error?: string }> {
    if (!supabase || !this.currentUser) {
      return { error: 'Not authenticated' }
    }

    try {
      // Delete user data first (due to foreign key constraints)
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', this.currentUser.id)

      // Delete auth user (this will cascade to other tables)
      const { error } = await supabase.auth.admin.deleteUser(this.currentUser.id)

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Account deletion failed. Please contact support.' }
    }
  }

  // Getters
  get user(): AuthUser | null {
    return this.currentUser
  }

  get session(): AuthSession | null {
    return this.currentSession
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  // Event listeners
  onAuthChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// Singleton instance
export const authManager = new SupabaseAuthManager()

// Convenience exports
export const {
  register,
  login,
  loginWithGoogle,
  logout,
  resetPassword,
  updatePassword,
  updateProfile,
  deleteAccount,
  onAuthChange
} = authManager
