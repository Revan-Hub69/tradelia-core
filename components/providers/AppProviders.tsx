'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authManager, type AuthUser } from '@/lib/auth/supabase-auth'
import { cookieManager, preferencesManager, type CookiePreferences, type UserPreferences } from '@/lib/preferences/cookie-manager'
import { CookieConsentBanner } from '@/components/preferences/CookieConsentBanner'
import { initStorageCleanup } from '@/lib/utils/session'

// Auth Context
interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true
})

// Preferences Context
interface PreferencesContextType {
  cookiePreferences: CookiePreferences | null
  userPreferences: UserPreferences | null
  hasConsentedToCookies: boolean
  needsCookieConsent: boolean
}

const PreferencesContext = createContext<PreferencesContextType>({
  cookiePreferences: null,
  userPreferences: null,
  hasConsentedToCookies: false,
  needsCookieConsent: true
})

// Combined App Providers
interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Preferences state
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences | null>(null)
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [hasConsentedToCookies, setHasConsentedToCookies] = useState(false)

  // Initialize everything
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage cleanup
        await initStorageCleanup()

        // Set up auth listener
        const unsubscribeAuth = authManager.onAuthChange((user) => {
          setUser(user)
          setIsAuthLoading(false)
        })

        // Set up cookie preferences listener
        const unsubscribeCookies = cookieManager.onConsentChange((consent) => {
          setCookiePreferences(consent.preferences)
          setHasConsentedToCookies(consent.hasConsented)
        })

        // Set up user preferences listener
        const unsubscribePrefs = preferencesManager.onPreferencesChange((prefs) => {
          setUserPreferences(prefs)
        })

        // Initial auth state
        setUser(authManager.user)
        setIsAuthLoading(false)

        // Initial preferences state
        setCookiePreferences(cookieManager.preferences)
        setHasConsentedToCookies(cookieManager.hasConsented)
        setUserPreferences(preferencesManager.preferences)

        return () => {
          unsubscribeAuth()
          unsubscribeCookies()
          unsubscribePrefs()
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setIsAuthLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Apply theme from user preferences
  useEffect(() => {
    if (userPreferences?.theme) {
      const root = document.documentElement
      
      if (userPreferences.theme === 'dark') {
        root.classList.add('dark')
      } else if (userPreferences.theme === 'light') {
        root.classList.remove('dark')
      } else {
        // System theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        if (mediaQuery.matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }
  }, [userPreferences?.theme])

  // Apply reduced motion preference
  useEffect(() => {
    if (userPreferences?.ui?.reducedMotion) {
      document.documentElement.style.setProperty('--motion-reduce', userPreferences.ui.reducedMotion ? '1' : '0')
    }
  }, [userPreferences?.ui?.reducedMotion])

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isAuthLoading
  }

  const preferencesContextValue: PreferencesContextType = {
    cookiePreferences,
    userPreferences,
    hasConsentedToCookies,
    needsCookieConsent: !hasConsentedToCookies
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <PreferencesContext.Provider value={preferencesContextValue}>
        {children}
        
        {/* Cookie Consent Banner */}
        <CookieConsentBanner />
      </PreferencesContext.Provider>
    </AuthContext.Provider>
  )
}

// Hooks for consuming contexts
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AppProviders')
  }
  return context
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within AppProviders')
  }
  return context
}

// Convenience hooks
export function useAuthUser() {
  const { user } = useAuth()
  return user
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export function useCookieConsent() {
  const { hasConsentedToCookies, needsCookieConsent, cookiePreferences } = usePreferences()
  return {
    hasConsented: hasConsentedToCookies,
    needsConsent: needsCookieConsent,
    preferences: cookiePreferences,
    canUse: (type: keyof CookiePreferences) => cookiePreferences?.[type] || false
  }
}

export function useUserPreferences() {
  const { userPreferences } = usePreferences()
  return userPreferences
}