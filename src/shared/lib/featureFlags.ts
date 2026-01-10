/**
 * Feature Flags - Ultra-Chicca 2026
 * 
 * UX Kill-Switch System
 * - Remote feature flags without deploy
 * - Emergency override via localStorage
 * - Graceful degradation for disabled features
 * - Real-time control over problematic features
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface FeatureFlags {
  // UI Features
  animations: boolean
  complexAnimations: boolean
  autoplay: boolean
  
  // Tool Features
  riskCalculator: boolean
  portfolioAnalyzer: boolean
  advancedCharts: boolean
  aiFeatures: boolean
  
  // UX Features
  tooltips: boolean
  notifications: boolean
  soundEffects: boolean
  hapticFeedback: boolean
  
  // Performance Features
  lazyLoading: boolean
  imageOptimization: boolean
  prefetching: boolean
  
  // Experimental Features
  betaFeatures: boolean
  debugMode: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  // UI Features
  animations: true,
  complexAnimations: true,
  autoplay: false,
  
  // Tool Features
  riskCalculator: true,
  portfolioAnalyzer: true,
  advancedCharts: true,
  aiFeatures: false, // Disabled by default
  
  // UX Features
  tooltips: true,
  notifications: true,
  soundEffects: false,
  hapticFeedback: true,
  
  // Performance Features
  lazyLoading: true,
  imageOptimization: true,
  prefetching: true,
  
  // Experimental Features
  betaFeatures: false,
  debugMode: false
}

// Emergency flags that can be set via localStorage
const EMERGENCY_STORAGE_KEY = 'tradelia-emergency-flags'
const REMOTE_FLAGS_CACHE_KEY = 'tradelia-remote-flags'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedFlags {
  flags: Partial<FeatureFlags>
  timestamp: number
}

export function useFeatureFlags(): FeatureFlags & {
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void
  resetFlags: () => void
  isLoading: boolean
} {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS)
  const [isLoading, setIsLoading] = useState(true)

  // Load flags from various sources
  useEffect(() => {
    const loadFlags = async () => {
      try {
        // 1. Start with defaults
        let mergedFlags = { ...DEFAULT_FLAGS }

        // 2. Load cached remote flags
        const cachedData = localStorage.getItem(REMOTE_FLAGS_CACHE_KEY)
        if (cachedData) {
          try {
            const cached: CachedFlags = JSON.parse(cachedData)
            const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
            
            if (!isExpired) {
              mergedFlags = { ...mergedFlags, ...cached.flags }
            }
          } catch (e) {
            console.warn('Failed to parse cached flags:', e)
          }
        }

        // 3. Try to fetch fresh remote flags
        try {
          const response = await fetch('/api/feature-flags', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache'
          })
          
          if (response.ok) {
            const remoteFlags = await response.json()
            mergedFlags = { ...mergedFlags, ...remoteFlags }
            
            // Cache the remote flags
            const cacheData: CachedFlags = {
              flags: remoteFlags,
              timestamp: Date.now()
            }
            localStorage.setItem(REMOTE_FLAGS_CACHE_KEY, JSON.stringify(cacheData))
          }
        } catch (e) {
          // Remote fetch failed, continue with cached/default flags
          console.warn('Failed to fetch remote flags, using cached/default:', e)
        }

        // 4. Apply emergency overrides from localStorage
        const emergencyFlags = localStorage.getItem(EMERGENCY_STORAGE_KEY)
        if (emergencyFlags) {
          try {
            const emergency = JSON.parse(emergencyFlags)
            mergedFlags = { ...mergedFlags, ...emergency }
            console.warn('Emergency flags applied:', emergency)
          } catch (e) {
            console.error('Failed to parse emergency flags:', e)
          }
        }

        // 5. Apply URL overrides (for debugging)
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          const debugFlags = urlParams.get('flags')
          if (debugFlags) {
            try {
              const urlOverrides = JSON.parse(decodeURIComponent(debugFlags))
              mergedFlags = { ...mergedFlags, ...urlOverrides }
              console.warn('URL flag overrides applied:', urlOverrides)
            } catch (e) {
              console.error('Failed to parse URL flags:', e)
            }
          }
        }

        setFlags(mergedFlags)
      } catch (error) {
        console.error('Error loading feature flags:', error)
        setFlags(DEFAULT_FLAGS)
      } finally {
        setIsLoading(false)
      }
    }

    loadFlags()
  }, [])

  // Update a single flag (emergency override)
  const updateFlag = useCallback((key: keyof FeatureFlags, value: boolean) => {
    setFlags(prev => {
      const newFlags = { ...prev, [key]: value }
      
      // Save to emergency storage
      const currentEmergency = localStorage.getItem(EMERGENCY_STORAGE_KEY)
      const emergencyFlags = currentEmergency ? JSON.parse(currentEmergency) : {}
      emergencyFlags[key] = value
      
      localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(emergencyFlags))
      
      return newFlags
    })
  }, [])

  // Reset all flags to defaults
  const resetFlags = useCallback(() => {
    localStorage.removeItem(EMERGENCY_STORAGE_KEY)
    localStorage.removeItem(REMOTE_FLAGS_CACHE_KEY)
    setFlags(DEFAULT_FLAGS)
  }, [])

  return {
    ...flags,
    updateFlag,
    resetFlags,
    isLoading
  }
}

// Hook for checking a specific feature
export function useFeatureFlag(feature: keyof FeatureFlags): boolean {
  const flags = useFeatureFlags()
  return flags[feature]
}

// Emergency flag controls (for admin/debug use)
export const emergencyControls = {
  // Disable all animations (performance issues)
  disableAnimations: () => {
    const flags = { animations: false, complexAnimations: false, autoplay: false }
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(flags))
    window.location.reload()
  },

  // Disable AI features (API issues)
  disableAI: () => {
    const flags = { aiFeatures: false, advancedCharts: false }
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(flags))
    window.location.reload()
  },

  // Performance mode (disable heavy features)
  performanceMode: () => {
    const flags = {
      animations: false,
      complexAnimations: false,
      autoplay: false,
      soundEffects: false,
      prefetching: false
    }
    localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(flags))
    window.location.reload()
  },

  // Reset all emergency overrides
  reset: () => {
    localStorage.removeItem(EMERGENCY_STORAGE_KEY)
    window.location.reload()
  }
}

// Make emergency controls available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).tradeliaEmergency = emergencyControls
}