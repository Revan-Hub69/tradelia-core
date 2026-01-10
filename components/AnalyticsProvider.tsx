/**
 * Analytics Provider - Tradelia 2026
 * 
 * Inizializza e gestisce il sistema di analytics
 * - Privacy-first tracking
 * - Automatic event collection
 * - GDPR compliance
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnalytics, trackNavigation } from '@/src/shared/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics()
  }, [])

  // Track navigation changes
  useEffect(() => {
    const startTime = Date.now()
    
    // Track navigation after a short delay to ensure page is loaded
    const timer = setTimeout(() => {
      trackNavigation({
        properties: {
          from_section: 'unknown',
          to_section: pathname.split('/').pop() || 'home',
          navigation_type: 'direct',
          load_time: Date.now() - startTime
        }
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return <>{children}</>
}

// Hook per tracking eventi personalizzati
export function useAnalyticsTracking() {
  const trackUserAction = (action: string, properties: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).__TRADELIA_ANALYTICS__) {
      (window as any).__TRADELIA_ANALYTICS__.trackEvent({
        event: 'feature_usage',
        properties: {
          action,
          section: window.location.pathname.split('/').pop() || 'unknown',
          ...properties
        },
        timestamp: Date.now()
      })
    }
  }

  const trackToolUsage = (toolId: string, action: 'open' | 'close' | 'interact' | 'complete') => {
    if (typeof window !== 'undefined' && (window as any).__TRADELIA_ANALYTICS__) {
      (window as any).__TRADELIA_ANALYTICS__.trackEvent({
        event: 'tool_usage',
        properties: {
          tool_id: toolId,
          section: window.location.pathname.split('/').pop() || 'unknown',
          action
        },
        timestamp: Date.now()
      })
    }
  }

  const trackError = (errorType: string, errorCode?: string) => {
    if (typeof window !== 'undefined' && (window as any).__TRADELIA_ANALYTICS__) {
      (window as any).__TRADELIA_ANALYTICS__.trackEvent({
        event: 'error',
        properties: {
          error_type: errorType,
          error_code: errorCode || 'unknown',
          section: window.location.pathname.split('/').pop() || 'unknown'
        },
        timestamp: Date.now()
      })
    }
  }

  return {
    trackUserAction,
    trackToolUsage,
    trackError
  }
}