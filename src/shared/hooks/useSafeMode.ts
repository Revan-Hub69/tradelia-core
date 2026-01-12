/**
 * useSafeMode Hook - Tradelia 2026
 * 
 * Detects repeated errors and network instability to enable safe mode.
 * When safe mode is active, risky actions should be disabled.
 * 
 * @see Requirements 19.4
 */

import { useState, useEffect, useCallback, useRef } from 'react'

interface SafeModeConfig {
  /** Number of errors before triggering safe mode (default: 3) */
  errorThreshold?: number
  /** Time window in ms to count errors (default: 60000 = 1 minute) */
  errorWindowMs?: number
  /** Time in ms before auto-recovering from safe mode (default: 30000 = 30 seconds) */
  recoveryDelayMs?: number
  /** Whether to track network errors (default: true) */
  trackNetworkErrors?: boolean
}

interface SafeModeState {
  /** Whether safe mode is currently active */
  isSafeMode: boolean
  /** Number of errors in current window */
  errorCount: number
  /** Timestamp when safe mode was activated */
  activatedAt: number | null
  /** Whether network is currently unstable */
  isNetworkUnstable: boolean
}

interface UseSafeModeReturn {
  /** Whether safe mode is currently active */
  isSafeMode: boolean
  /** Number of errors in current window */
  errorCount: number
  /** Whether network is currently unstable */
  isNetworkUnstable: boolean
  /** Report an error to the safe mode tracker */
  reportError: (error?: Error | string) => void
  /** Manually activate safe mode */
  activateSafeMode: () => void
  /** Manually deactivate safe mode */
  deactivateSafeMode: () => void
  /** Reset error count */
  resetErrors: () => void
}

const DEFAULT_CONFIG: Required<SafeModeConfig> = {
  errorThreshold: 3,
  errorWindowMs: 60000, // 1 minute
  recoveryDelayMs: 30000, // 30 seconds
  trackNetworkErrors: true,
}

export function useSafeMode(config: SafeModeConfig = {}): UseSafeModeReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  
  const [state, setState] = useState<SafeModeState>({
    isSafeMode: false,
    errorCount: 0,
    activatedAt: null,
    isNetworkUnstable: false,
  })

  // Track error timestamps for windowed counting
  const errorTimestamps = useRef<number[]>([])
  const recoveryTimer = useRef<NodeJS.Timeout | null>(null)
  const networkCheckTimer = useRef<NodeJS.Timeout | null>(null)

  // Clean up old errors outside the window
  const cleanOldErrors = useCallback(() => {
    const now = Date.now()
    const cutoff = now - mergedConfig.errorWindowMs
    errorTimestamps.current = errorTimestamps.current.filter(ts => ts > cutoff)
    setState(prev => ({
      ...prev,
      errorCount: errorTimestamps.current.length,
    }))
  }, [mergedConfig.errorWindowMs])

  // Report an error
  const reportError = useCallback((error?: Error | string) => {
    const now = Date.now()
    errorTimestamps.current.push(now)
    
    // Clean old errors
    const cutoff = now - mergedConfig.errorWindowMs
    errorTimestamps.current = errorTimestamps.current.filter(ts => ts > cutoff)
    
    const newErrorCount = errorTimestamps.current.length
    
    // Check if we should activate safe mode
    const shouldActivate = newErrorCount >= mergedConfig.errorThreshold
    
    setState(prev => ({
      ...prev,
      errorCount: newErrorCount,
      isSafeMode: shouldActivate || prev.isSafeMode,
      activatedAt: shouldActivate && !prev.isSafeMode ? now : prev.activatedAt,
    }))

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development' && error) {
      console.warn('[SafeMode] Error reported:', error)
    }
  }, [mergedConfig.errorWindowMs, mergedConfig.errorThreshold])

  // Manually activate safe mode
  const activateSafeMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSafeMode: true,
      activatedAt: Date.now(),
    }))
  }, [])

  // Manually deactivate safe mode
  const deactivateSafeMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSafeMode: false,
      activatedAt: null,
    }))
    errorTimestamps.current = []
  }, [])

  // Reset error count
  const resetErrors = useCallback(() => {
    errorTimestamps.current = []
    setState(prev => ({
      ...prev,
      errorCount: 0,
    }))
  }, [])

  // Track network errors
  useEffect(() => {
    if (!mergedConfig.trackNetworkErrors) return

    let consecutiveFailures = 0
    const maxFailures = 3

    const checkNetwork = async () => {
      try {
        const start = Date.now()
        const response = await fetch(window.location.origin + '/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
        })
        const duration = Date.now() - start

        if (!response.ok || duration > 5000) {
          consecutiveFailures++
        } else {
          consecutiveFailures = 0
        }
      } catch {
        consecutiveFailures++
      }

      const isUnstable = consecutiveFailures >= maxFailures

      setState(prev => {
        // If network becomes unstable, activate safe mode
        if (isUnstable && !prev.isNetworkUnstable) {
          return {
            ...prev,
            isNetworkUnstable: true,
            isSafeMode: true,
            activatedAt: prev.activatedAt || Date.now(),
          }
        }
        // If network recovers
        if (!isUnstable && prev.isNetworkUnstable) {
          return {
            ...prev,
            isNetworkUnstable: false,
          }
        }
        return prev
      })
    }

    // Check network periodically
    networkCheckTimer.current = setInterval(checkNetwork, 10000) // Every 10 seconds

    // Also listen for online/offline events
    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isNetworkUnstable: true,
        isSafeMode: true,
        activatedAt: prev.activatedAt || Date.now(),
      }))
    }

    const handleOnline = () => {
      consecutiveFailures = 0
      setState(prev => ({
        ...prev,
        isNetworkUnstable: false,
      }))
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      if (networkCheckTimer.current) {
        clearInterval(networkCheckTimer.current)
      }
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [mergedConfig.trackNetworkErrors])

  // Auto-recovery timer
  useEffect(() => {
    if (!state.isSafeMode || !state.activatedAt) {
      if (recoveryTimer.current) {
        clearTimeout(recoveryTimer.current)
        recoveryTimer.current = null
      }
      return
    }

    // Don't auto-recover if network is still unstable
    if (state.isNetworkUnstable) return

    recoveryTimer.current = setTimeout(() => {
      // Only recover if no new errors and network is stable
      if (!state.isNetworkUnstable && errorTimestamps.current.length < mergedConfig.errorThreshold) {
        deactivateSafeMode()
      }
    }, mergedConfig.recoveryDelayMs)

    return () => {
      if (recoveryTimer.current) {
        clearTimeout(recoveryTimer.current)
      }
    }
  }, [state.isSafeMode, state.activatedAt, state.isNetworkUnstable, mergedConfig.recoveryDelayMs, mergedConfig.errorThreshold, deactivateSafeMode])

  // Periodic cleanup of old errors
  useEffect(() => {
    const cleanupInterval = setInterval(cleanOldErrors, 10000) // Every 10 seconds
    return () => clearInterval(cleanupInterval)
  }, [cleanOldErrors])

  return {
    isSafeMode: state.isSafeMode,
    errorCount: state.errorCount,
    isNetworkUnstable: state.isNetworkUnstable,
    reportError,
    activateSafeMode,
    deactivateSafeMode,
    resetErrors,
  }
}

export default useSafeMode
