/**
 * Simplified Cookie and Preferences Management System
 * Uses only localStorage to avoid Supabase initialization issues
 */

'use client'

import { getSessionId, savePreferences, getPreferences } from '@/lib/utils/session'

export interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
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
  version: string
}

class CookiePreferencesManager {
  private static readonly CONSENT_VERSION = '1.0'
  private currentConsent: ConsentState | null = null
  private listeners: ((consent: ConsentState) => void)[] = []

  constructor() {
    this.initializeConsent()
  }

  private async initializeConsent() {
    try {
      const stored = await this.loadStoredConsent()
      if (stored && stored.version === CookiePreferencesManager.CONSENT_VERSION) {
        this.currentConsent = stored
        this.notifyListeners(stored)
      } else {
        this.currentConsent = null
      }
    } catch (error) {
      console.warn('Failed to initialize cookie consent:', error)
      this.currentConsent = null
    }
  }

  private async loadStoredConsent(): Promise<ConsentState | null> {
    try {
      // Use only localStorage/IndexedDB, skip Supabase
      const localConsent = await getPreferences()
      return localConsent?.cookieConsent || null
    } catch (error) {
      console.warn('Failed to load stored consent:', error)
      return null
    }
  }

  private async saveConsent(consent: ConsentState) {
    try {
      // Save only locally
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

  async giveConsent(preferences: CookiePreferences): Promise<void> {
    const consent: ConsentState = {
      hasConsented: true,
      consentDate: new Date().toISOString(),
      preferences: {
        essential: true,
        functional: preferences.functional,
        analytics: preferences.analytics
      },
      version: CookiePreferencesManager.CONSENT_VERSION
    }

    this.currentConsent = consent
    await this.saveConsent(consent)
    this.notifyListeners(consent)
    this.applyCookiePreferences(consent.preferences)
  }

  async updatePreferences(preferences: Partial<CookiePreferences>): Promise<void> {
    if (!this.currentConsent) {
      throw new Error('No consent given yet')
    }

    const updatedConsent: ConsentState = {
      ...this.currentConsent,
      preferences: {
        essential: true,
        functional: preferences.functional ?? this.currentConsent.preferences.functional,
        analytics: preferences.analytics ?? this.currentConsent.preferences.analytics
      }
    }

    this.currentConsent = updatedConsent
    await this.saveConsent(updatedConsent)
    this.notifyListeners(updatedConsent)
    this.applyCookiePreferences(updatedConsent.preferences)
  }

  async revokeConsent(): Promise<void> {
    this.clearNonEssentialCookies()

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
    if (!preferences.functional) {
      this.clearFunctionalCookies()
    }
    if (!preferences.analytics) {
      this.clearAnalyticsCookies()
    }
    if (typeof window !== 'undefined') {
      (window as any).__TRADELIA_CONSENT__ = preferences
    }
  }

  private clearNonEssentialCookies() {
    this.clearFunctionalCookies()
    this.clearAnalyticsCookies()
  }

  private clearFunctionalCookies() {
    if (typeof document !== 'undefined') {
      const functionalCookies = ['theme', 'ui-preferences', 'session-data']
      functionalCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    }
  }

  private clearAnalyticsCookies() {
    if (typeof document !== 'undefined') {
      const analyticsCookies = ['_ga', '_gid', '_gat', 'analytics-session']
      analyticsCookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    }
  }

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

  canUse(type: keyof CookiePreferences): boolean {
    if (!this.currentConsent) return false
    return this.currentConsent.preferences[type]
  }

  onConsentChange(callback: (consent: ConsentState) => void): () => void {
    this.listeners.push(callback)
    if (this.currentConsent) {
      callback(this.currentConsent)
    }
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

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
      const localPrefs = await getPreferences()
      return localPrefs?.userPreferences || null
    } catch (error) {
      console.warn('Failed to load user preferences:', error)
      return null
    }
  }

  private async savePreferences(preferences: UserPreferences) {
    try {
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

  async updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
    if (!this.currentPreferences) return

    const updatedPreferences: UserPreferences = {
      ...this.currentPreferences,
      ...updates,
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

  get preferences(): UserPreferences | null {
    return this.currentPreferences
  }

  onPreferencesChange(callback: (prefs: UserPreferences) => void): () => void {
    this.listeners.push(callback)
    if (this.currentPreferences) {
      callback(this.currentPreferences)
    }
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export const cookieManager = new CookiePreferencesManager()
export const preferencesManager = new UserPreferencesManager()

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
