/**
 * Dashboard Authentication Process - Tradelia 2026
 * 
 * Processo di autenticazione per la dashboard SuperBig
 * Gestisce auth, guest mode, profili utente e configurazioni dashboard
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase, UserProfile, DashboardConfig } from '@/lib/supabase'
import { DashboardAuthState, DashboardAuthActions, DashboardAuthFlow } from './types'

const DashboardAuthContext = createContext<DashboardAuthFlow | null>(null)

interface DashboardAuthProviderProps {
  children: ReactNode
  locale: string
}

function DashboardAuthProviderInner({ children, locale }: DashboardAuthProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [state, setState] = useState<DashboardAuthState>({
    user: null,
    profile: null,
    dashboardConfig: null,
    isGuestMode: false,
    loading: true,
    error: null
  })

  // Default dashboard config per guest mode
  const getDefaultDashboardConfig = (): DashboardConfig => ({
    id: 'guest-config',
    objective_config: {
      title: 'Configurazione di base',
      description: 'Analisi generale degli strumenti finanziari'
    },
    risk_warnings: {
      primary: 'Verifica sempre la coerenza tra obiettivo e strumento',
      secondary: 'Gli strumenti complessi richiedono maggiore attenzione',
      academicSource: 'Ricerca comportamentale finanziaria'
    },
    recommended_tools: {
      primary: ['ETF diversificati', 'Fondi indicizzati', 'Conti deposito'],
      avoid: ['Prodotti strutturati complessi', 'Leva finanziaria elevata']
    }
  })

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set loading to false faster for better UX
        setState(prev => ({ ...prev, loading: true }))
        
        const isGuestParam = searchParams.get('guest') === 'true'
        
        // Get current session with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 3000)
        )
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any
        
        if (session?.user) {
          // Authenticated user - set loading false immediately
          setState(prev => ({ 
            ...prev, 
            user: session.user, 
            isGuestMode: false,
            loading: false 
          }))
          
          // Fetch profile and dashboard config in background
          Promise.all([
            fetchProfile(session.user.id),
            fetchDashboardConfig(session.user.id)
          ]).catch(console.error)
          
        } else if (isGuestParam) {
          // Guest mode - immediate loading
          setState(prev => ({
            ...prev,
            user: null,
            profile: {
              id: 'guest',
              full_name: 'Utente ospite',
              crypto_objective: 'investment',
              experience_level: 'basic'
            } as UserProfile,
            dashboardConfig: getDefaultDashboardConfig(),
            isGuestMode: true,
            loading: false
          }))
        } else {
          // No auth, redirect to home immediately
          setState(prev => ({ ...prev, loading: false }))
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({
          ...prev,
          error: 'Errore durante l\'inizializzazione',
          loading: false
        }))
      }
    }

    // Add small delay to prevent flash
    const timer = setTimeout(initializeAuth, 100)
    return () => clearTimeout(timer)
  }, [searchParams, router, locale])

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setState(prev => ({ 
            ...prev, 
            user: session.user, 
            isGuestMode: false 
          }))
          
          await Promise.all([
            fetchProfile(session.user.id),
            fetchDashboardConfig(session.user.id)
          ])
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            dashboardConfig: null,
            isGuestMode: false
          }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      setState(prev => ({ ...prev, profile: data }))
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchDashboardConfig = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('dashboard_configs')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // No config found, use default
        setState(prev => ({ 
          ...prev, 
          dashboardConfig: getDefaultDashboardConfig() 
        }))
        return
      }

      setState(prev => ({ ...prev, dashboardConfig: data }))
    } catch (error) {
      console.error('Error fetching dashboard config:', error)
      setState(prev => ({ 
        ...prev, 
        dashboardConfig: getDefaultDashboardConfig() 
      }))
    }
  }

  // Actions
  const actions: DashboardAuthActions = {
    signIn: async (email: string, password: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        // Redirect will happen via auth state change
        router.push(`/${locale}/dashboard`)
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante il login',
          loading: false 
        }))
        throw error
      }
    },

    signUp: async (email: string, password: string, fullName: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        })
        
        if (error) throw error
        
        router.push(`/${locale}/dashboard`)
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante la registrazione',
          loading: false 
        }))
        throw error
      }
    },

    signInWithGoogle: async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante il login con Google',
          loading: false 
        }))
        throw error
      }
    },

    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        router.push('/')
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante il logout' 
        }))
        throw error
      }
    },

    enableGuestMode: () => {
      setState(prev => ({
        ...prev,
        user: null,
        profile: {
          id: 'guest',
          full_name: 'Utente ospite',
          crypto_objective: 'investment',
          experience_level: 'basic'
        } as UserProfile,
        dashboardConfig: getDefaultDashboardConfig(),
        isGuestMode: true,
        loading: false
      }))
    },

    updateProfile: async (updates: Partial<UserProfile>) => {
      if (!state.user) throw new Error('No user logged in')

      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            id: state.user.id,
            email: state.user.email,
            ...updates,
            updated_at: new Date().toISOString()
          })

        if (error) throw error
        
        await fetchProfile(state.user.id)
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante l\'aggiornamento del profilo' 
        }))
        throw error
      }
    },

    resendVerification: async () => {
      if (!state.user?.email) throw new Error('No user email available')

      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: state.user.email
        })
        
        if (error) throw error
      } catch (error: any) {
        setState(prev => ({ 
          ...prev, 
          error: error.message || 'Errore durante l\'invio della verifica' 
        }))
        throw error
      }
    }
  }

  const value: DashboardAuthFlow = {
    state,
    actions
  }

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  )
}

export function DashboardAuthProvider({ children, locale }: DashboardAuthProviderProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary" />
      </div>
    }>
      <DashboardAuthProviderInner locale={locale}>
        {children}
      </DashboardAuthProviderInner>
    </Suspense>
  )
}

export function useDashboardAuth(): DashboardAuthFlow {
  const context = useContext(DashboardAuthContext)
  
  if (!context) {
    throw new Error('useDashboardAuth must be used within DashboardAuthProvider')
  }
  
  return context
}
