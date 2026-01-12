/**
 * Session Continuity Hook - Tradelia 2026
 * 
 * Persiste lo stato UI tra sessioni per un'esperienza seamless.
 * Ricorda: ultimo journey, ultima sezione, ultimo tab drawer, density.
 * Versioned localStorage per evitare conflitti dopo update.
 * 
 * REQ 18.1: Ricorda ultimo journey aperto
 * REQ 18.2: Ricorda ultima sezione visitata
 * REQ 18.3: Ricorda ultimo tab nel drawer
 * REQ 18.4: Ricorda preferenze UI (density, layout)
 * REQ 18.5: Session data versionato per evitare conflitti
 */

'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import type { JourneyId } from '@/src/shared/config/journeys'

// Current schema version - increment when breaking changes occur
const SESSION_VERSION = 1
const SESSION_KEY = 'tradelia_session_v1'

export type DensityMode = 'compact' | 'comfortable'

export interface SessionState {
  /** Last visited journey (REQ 18.1) */
  lastJourney: JourneyId | null
  /** Last visited section within a journey (REQ 18.2) */
  lastSection: string | null
  /** Last active tab in drawer (REQ 18.3) */
  lastDrawerTab: string | null
  /** UI density preference (REQ 18.4) */
  density: DensityMode
  /** Schema version for migration (REQ 18.5) */
  version: number
  /** Timestamp of last update */
  lastUpdated: number
}

const DEFAULT_STATE: SessionState = {
  lastJourney: null,
  lastSection: null,
  lastDrawerTab: null,
  density: 'comfortable',
  version: SESSION_VERSION,
  lastUpdated: Date.now()
}

/**
 * Get stored session state from localStorage
 * Handles version migration and corrupted data
 */
function getStoredSession(): SessionState {
  if (typeof window === 'undefined') return DEFAULT_STATE

  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return DEFAULT_STATE

    const parsed = JSON.parse(stored) as Partial<SessionState>

    // Version check - if version mismatch, migrate or reset
    if (parsed.version !== SESSION_VERSION) {
      // Future: add migration logic here
      // For now, reset to defaults but preserve density if valid
      return {
        ...DEFAULT_STATE,
        density: parsed.density === 'compact' || parsed.density === 'comfortable' 
          ? parsed.density 
          : 'comfortable'
      }
    }

    // Validate and return with defaults for missing fields
    return {
      lastJourney: isValidJourney(parsed.lastJourney) ? parsed.lastJourney : null,
      lastSection: typeof parsed.lastSection === 'string' ? parsed.lastSection : null,
      lastDrawerTab: typeof parsed.lastDrawerTab === 'string' ? parsed.lastDrawerTab : null,
      density: parsed.density === 'compact' || parsed.density === 'comfortable' 
        ? parsed.density 
        : 'comfortable',
      version: SESSION_VERSION,
      lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : Date.now()
    }
  } catch {
    // Corrupted data - reset to defaults
    return DEFAULT_STATE
  }
}

/**
 * Save session state to localStorage
 */
function saveSession(state: SessionState): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...state,
      lastUpdated: Date.now()
    }))
  } catch {
    // Storage full or unavailable - fail silently
    console.warn('[SessionContinuity] Failed to save session state')
  }
}

/**
 * Validate journey ID
 */
function isValidJourney(journey: unknown): journey is JourneyId {
  return journey === 'emergency' || 
         journey === 'longterm' || 
         journey === 'speculation' || 
         journey === 'passive'
}

export interface UseSessionContinuityReturn {
  /** Current session state */
  state: SessionState
  /** Update session state (partial update) */
  updateSession: (updates: Partial<Omit<SessionState, 'version' | 'lastUpdated'>>) => void
  /** Set last visited journey (REQ 18.1) */
  setLastJourney: (journey: JourneyId | null) => void
  /** Set last visited section (REQ 18.2) */
  setLastSection: (section: string | null) => void
  /** Set last drawer tab (REQ 18.3) */
  setLastDrawerTab: (tab: string | null) => void
  /** Set density preference (REQ 18.4) */
  setDensity: (density: DensityMode) => void
  /** Toggle density between compact and comfortable */
  toggleDensity: () => void
  /** Clear all session data (e.g., on logout) */
  clearSession: () => void
  /** Check if session has been restored */
  isRestored: boolean
}

/**
 * Hook for managing session continuity across browser sessions.
 * 
 * @example
 * ```tsx
 * const { state, setLastJourney, setDensity } = useSessionContinuity()
 * 
 * // Remember last journey when navigating
 * useEffect(() => {
 *   if (currentJourney) {
 *     setLastJourney(currentJourney)
 *   }
 * }, [currentJourney, setLastJourney])
 * 
 * // Apply density to document
 * useEffect(() => {
 *   document.documentElement.dataset.density = state.density
 * }, [state.density])
 * ```
 */
export function useSessionContinuity(): UseSessionContinuityReturn {
  const [state, setState] = useState<SessionState>(DEFAULT_STATE)
  const [isRestored, setIsRestored] = useState(false)

  // Restore session on mount (client-side only)
  useEffect(() => {
    const stored = getStoredSession()
    setState(stored)
    setIsRestored(true)
  }, [])

  // Save to localStorage whenever state changes (after initial restore)
  useEffect(() => {
    if (isRestored) {
      saveSession(state)
    }
  }, [state, isRestored])

  // Apply density to document root
  useEffect(() => {
    if (typeof document !== 'undefined' && isRestored) {
      document.documentElement.dataset.density = state.density
    }
  }, [state.density, isRestored])

  /**
   * Update session state with partial updates
   */
  const updateSession = useCallback((
    updates: Partial<Omit<SessionState, 'version' | 'lastUpdated'>>
  ) => {
    setState(prev => ({
      ...prev,
      ...updates,
      version: SESSION_VERSION,
      lastUpdated: Date.now()
    }))
  }, [])

  /**
   * Set last visited journey (REQ 18.1)
   */
  const setLastJourney = useCallback((journey: JourneyId | null) => {
    if (journey !== null && !isValidJourney(journey)) return
    updateSession({ lastJourney: journey })
  }, [updateSession])

  /**
   * Set last visited section (REQ 18.2)
   */
  const setLastSection = useCallback((section: string | null) => {
    updateSession({ lastSection: section })
  }, [updateSession])

  /**
   * Set last drawer tab (REQ 18.3)
   */
  const setLastDrawerTab = useCallback((tab: string | null) => {
    updateSession({ lastDrawerTab: tab })
  }, [updateSession])

  /**
   * Set density preference (REQ 18.4)
   */
  const setDensity = useCallback((density: DensityMode) => {
    updateSession({ density })
  }, [updateSession])

  /**
   * Toggle density between compact and comfortable
   */
  const toggleDensity = useCallback(() => {
    setState(prev => ({
      ...prev,
      density: prev.density === 'compact' ? 'comfortable' : 'compact',
      lastUpdated: Date.now()
    }))
  }, [])

  /**
   * Clear all session data (e.g., on logout)
   */
  const clearSession = useCallback(() => {
    setState(DEFAULT_STATE)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }, [])

  return useMemo(() => ({
    state,
    updateSession,
    setLastJourney,
    setLastSection,
    setLastDrawerTab,
    setDensity,
    toggleDensity,
    clearSession,
    isRestored
  }), [
    state,
    updateSession,
    setLastJourney,
    setLastSection,
    setLastDrawerTab,
    setDensity,
    toggleDensity,
    clearSession,
    isRestored
  ])
}

/**
 * Hook to restore journey from session on mount
 * Use in DashboardLayout to redirect to last journey
 * 
 * @example
 * ```tsx
 * const { shouldRestore, lastJourney, markRestored } = useJourneyRestore()
 * 
 * useEffect(() => {
 *   if (shouldRestore && lastJourney && isOnHome) {
 *     router.push(`/${locale}/dashboard/${lastJourney}`)
 *     markRestored()
 *   }
 * }, [shouldRestore, lastJourney, isOnHome])
 * ```
 */
export function useJourneyRestore() {
  const { state, isRestored } = useSessionContinuity()
  const [hasRestored, setHasRestored] = useState(false)

  const shouldRestore = isRestored && !hasRestored && state.lastJourney !== null

  const markRestored = useCallback(() => {
    setHasRestored(true)
  }, [])

  return {
    shouldRestore,
    lastJourney: state.lastJourney,
    markRestored
  }
}

/**
 * Hook to restore drawer tab from session
 * Use in PremiumDrawer to restore last active tab
 * 
 * @example
 * ```tsx
 * const { lastDrawerTab, setLastDrawerTab } = useDrawerTabRestore()
 * 
 * // Restore tab when drawer opens
 * useEffect(() => {
 *   if (isOpen && lastDrawerTab) {
 *     setActiveTab(lastDrawerTab)
 *   }
 * }, [isOpen, lastDrawerTab])
 * 
 * // Remember tab when it changes
 * useEffect(() => {
 *   if (activeTab) {
 *     setLastDrawerTab(activeTab)
 *   }
 * }, [activeTab, setLastDrawerTab])
 * ```
 */
export function useDrawerTabRestore() {
  const { state, setLastDrawerTab, isRestored } = useSessionContinuity()

  return {
    lastDrawerTab: isRestored ? state.lastDrawerTab : null,
    setLastDrawerTab,
    isRestored
  }
}
