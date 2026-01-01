/**
 * Cookie and Preferences Management System
 * GDPR compliant cookie consent and user preferences
 */

'use client'

import { supabase } from '@/lib/supabase/browser-client'
import { authManager } from '@/lib/auth/supabase-auth'
import { getSessionId, savePreferences, getPreferences } from '@/lib/utils/session'
import type { Json } from '@/lib/supabase/types'

export interface CookiePreferences {
  essential: boolean      // Always true, cannot be disabled
  functional: boolean     // UI preferences, session data
  analytics: boolean      // Usage analytics, performance monitoring
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'it' | 'en'
  notifications: {
    progressReminders: boolean
    newContent: boolean
    securityAlerts: boolean
  }
  privacy: {
    dataRetentionDays: number
    shareUsageStats: boolean
    personalizedContent: boolean
  }
  ui: {
    reducedMotion: boolean
    compactMode: boolean
    showTooltips: boolean
  }
}

export interface ConsentState {
  hasConsented: boolean
  consentDate: string
  preferences: CookiePreferences
  version: string // For tracking consent version changes
}

class CookiePreferencesManager {
  private static readonly CONSENT_VERSION = '1.0'
  private static readonly CONSENT_KEY = 'tradelia_cookie_consent'
  private currentConsent: ConsentState | null = null
  private listeners: ((consent: ConsentState) => void)[] = []

  constructor() {
    this.initializeConsent()
  }

  private async initializeConsent() {
    try {
      // Try to load existing consent
      const stored = await this.loadStoredConsent()
      if (stored && stored.version === CookiePreferencesManager.CONSENT_VERSION) {
        this.currentConsent = stored
        this.notifyListeners(stored)
        return
      }

      // No valid consent found - user needs to consent
      this.currentConsent = null
    } catch (error) {
      console.warn('Failed to initialize cookie consent:', error)
    }
  }

  private async loadStoredConsent(): Promise<ConsentState | null> {
    try {
      // First try to load from user account if authenticated
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('cookie_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (data) {
            return {
              hasConsented: true,
              consentDate: data.created_at || new Date().toISOString(),
              preferences: {
                essential: data.essential ?? true,
                functional: data.functional ?? false,
                analytics: data.analytics ?? false
              },
              version: CookiePreferencesManager.CONSENT_VERSION
            }
          }
        }
      }

      // Fallback to local storage for guest users
      const sessionId = await getSessionId()
      if (supabase && authManager.isAuthenticated) {
        try {
          const { data } = await supabase
            .from('cookie_preferences')
            .select('*')
            .eq('session_id', sessionId)
            .single()

          if (data) {
            return {
              hasConsented: true,
              consentDate: data.created_at || new Date().toISOString(),
              preferences: {
                essential: data.essential ?? true,
                functional: data.functional ?? false,
                analytics: data.analytics ?? false
              },
              version: CookiePreferencesManager.CONSENT_VERSION
            }
          }
        } catch (supabaseError) {
          console.warn('Failed to load consent from Supabase:', supabaseError)
        }
      }

      // Final fallback to IndexedDB
      const localConsent = await getPreferences()
      return localConsent?.cookieConsent || null

    } catch (error) {
      console.warn('Failed to load stored consent:', error)
      return null
    }
  }

  private async saveConsent(consent: ConsentState) {
    try {
      // Save to database if available
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        const sessionId = await getSessionId()

        const consentData = {
          essential: consent.preferences.essential,
          functional: consent.preferences.functional,
          analytics: consent.preferences.analytics,
          created_at: consent.consentDate,
          updated_at: new Date().toISOString()
        }

        if (user) {
          // Authenticated user
          await supabase
            .from('cookie_preferences')
            .upsert({
              ...consentData,
              user_id: user.id
            })
        } else {
          // Guest user
          await supabase
            .from('cookie_preferences')
            .upsert({
              ...consentData,
              session_id: sessionId
            })
        }
      }

      // Always save locally as backup
      const currentPrefs = await getPreferences() || {}
      await savePreferences({
        ...currentPrefs,
        cookieConsent: consent
      })

    } catch (error) {
      console.warn('Failed to save consent:', error)
    }
  }

  private notifyListeners(consent: ConsentState) {
    this.listeners.forEach(listener => listener(consent))
  }

  // Public API
  async giveConsent(preferences: CookiePreferences): Promise<void> {
    const consent: ConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: {
        essential: true, // Always true
        functional: preferences.functional,
        analytics: preferences.analytics
      },
      version: CookiePreferencesManager.CONSENT_VERSION
    }

    this.currentConsent = consent
    await this.saveConsent(consent)
    this.notifyListeners(consent)

    // Apply consent immediately
    this.applyCookiePreferences(consent.preferences)
  }

  async updatePreferences(preferences: Partial<CookiePreferences>): Promise<void> {
    if (!this.currentConsent) {
      throw new Error('No consent given yet')
    }

    const updatedConsent: ConsentState = {
      ...this.currentConsent,
      preferences: {
        essential: true, // Always true
        functional: preferences.functional ?? this.currentConsent.preferences.functional,
        analytics: preferences.analytics ?? this.currentConsent.preferences.analytics
      }
    }

    this.currentConsent = updatedConsent
    await this.saveConsent(updatedConsent)
    this.notifyListeners(updatedConsent)

    // Apply updated preferences
    this.applyCookiePreferences(updatedConsent.preferences)
  }

  async revokeConsent(): Promise<void> {
    // Clear all non-essential cookies
    this.clearNonEssentialCookies()

    // Reset to minimal consent
    const minimalConsent: ConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: {
        essential: true,
        functional: false,
        analytics: false
      },
      version: CookiePreferencesManager.CONSENT_VERSION
    }

    this.currentConsent = minimalConsent
    await this.saveConsent(minimalConsent)
    this.notifyListeners(minimalConsent)
  }

  private applyCookiePreferences(preferences: CookiePreferences) {
    // Apply functional cookies
    if (!preferences.functional) {
      this.clearFunctionalCookies()
    }

    // Apply analytics cookies
    if (!preferences.analytics) {
      this.clearAnalyticsCookies()
    }

    // Set flags for other parts of the app to check
    if (typeof window !== 'undefined') {
      (window as any).__TRADELIA_CONSENT__ = preferences
    }
  }

  private clearNonEssentialCookies() {
    this.clearFunctionalCookies()
    this.clearAnalyticsCookies()
  }

  private clearFunctionalCookies() {
    // Clear functional cookies (UI preferences, etc.)
    if (typeof document !== 'undefined') {
      const functionalCookies = ['theme', 'ui-preferences', 'session-data']
      functionalCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    }
  }

  private clearAnalyticsCookies() {
    // Clear analytics cookies
    if (typeof document !== 'undefined') {
      const analyticsCookies = ['_ga', '_gid', '_gat', 'analytics-session']
      analyticsCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    }
  }

  // Getters
  get hasConsented(): boolean {
    return this.currentConsent?.hasConsented || false
  }

  get needsConsent(): boolean {
    return !this.hasConsented
  }

  get preferences(): CookiePreferences | null {
    return this.currentConsent?.preferences || null
  }

  get consentDate(): string | null {
    return this.currentConsent?.consentDate || null
  }

  // Check if specific cookie type is allowed
  canUse(type: keyof CookiePreferences): boolean {
    if (!this.currentConsent) return false
    return this.currentConsent.preferences[type]
  }

  // Event listeners
  onConsentChange(callback: (consent: ConsentState) => void): () => void {
    this.listeners.push(callback)
    
    // Call immediately if consent exists
    if (this.currentConsent) {
      callback(this.currentConsent)
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// User Preferences Manager (separate from cookie consent)
class UserPreferencesManager {
  private currentPreferences: UserPreferences | null = null
  private listeners: ((prefs: UserPreferences) => void)[] = []

  constructor() {
    this.initializePreferences()
  }

  private async initializePreferences() {
    try {
      const stored = await this.loadStoredPreferences()
      this.currentPreferences = stored || this.getDefaultPreferences()
      this.notifyListeners(this.currentPreferences)
    } catch (error) {
      console.warn('Failed to initialize user preferences:', error)
      this.currentPreferences = this.getDefaultPreferences()
    }
  }

  private async loadStoredPreferences(): Promise<UserPreferences | null> {
    try {
      // Try database first for authenticated users
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('user_profiles')
            .select('preferences')
            .eq('id', user.id)
            .single()

          if (data?.preferences) {
            return data.preferences as unknown as UserPreferences
          }
        }
      }

      // Fallback to local storage
      const localPrefs = await getPreferences()
      return localPrefs?.userPreferences || null

    } catch (error) {
      console.warn('Failed to load user preferences:', error)
      return null
    }
  }

  private async savePreferences(preferences: UserPreferences) {
    try {
      // Save to database if authenticated
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              preferences: preferences as unknown as Json,
              updated_at: new Date().toISOString()
            })
        }
      }

      // Always save locally
      const currentPrefs = await getPreferences() || {}
      await savePreferences({
        ...currentPrefs,
        userPreferences: preferences
      })

    } catch (error) {
      console.warn('Failed to save user preferences:', error)
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'it',
      notifications: {
        progressReminders: false,
        newContent: false,
        securityAlerts: true
      },
      privacy: {
        dataRetentionDays: 365,
        shareUsageStats: false,
        personalizedContent: false
      },
      ui: {
        reducedMotion: false,
        compactMode: false,
        showTooltips: true
      }
    }
  }

  private notifyListeners(preferences: UserPreferences) {
    this.listeners.forEach(listener => listener(preferences))
  }

  // Public API
  async updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
    if (!this.currentPreferences) return

    const updatedPreferences: UserPreferences = {
      ...this.currentPreferences,
      ...updates,
      // Deep merge nested objects
      notifications: {
        ...this.currentPreferences.notifications,
        ...updates.notifications
      },
      privacy: {
        ...this.currentPreferences.privacy,
        ...updates.privacy
      },
      ui: {
        ...this.currentPreferences.ui,
        ...updates.ui
      }
    }

    this.currentPreferences = updatedPreferences
    await this.savePreferences(updatedPreferences)
    this.notifyListeners(updatedPreferences)
  }

  async resetToDefaults(): Promise<void> {
    const defaults = this.getDefaultPreferences()
    this.currentPreferences = defaults
    await this.savePreferences(defaults)
    this.notifyListeners(defaults)
  }

  // Getters
  get preferences(): UserPreferences | null {
    return this.currentPreferences
  }

  // Event listeners
  onPreferencesChange(callback: (prefs: UserPreferences) => void): () => void {
    this.listeners.push(callback)
    
    // Call immediately if preferences exist
    if (this.currentPreferences) {
      callback(this.currentPreferences)
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// Singleton instances
export const cookieManager = new CookiePreferencesManager()
export const preferencesManager = new UserPreferencesManager()

// Convenience exports
export const {
  giveConsent,
  updatePreferences: updateCookiePreferences,
  revokeConsent,
  canUse,
  onConsentChange
} = cookieManager

export const {
  updatePreferences: updateUserPreferences,
  resetToDefaults,
  onPreferencesChange
} = preferencesManager