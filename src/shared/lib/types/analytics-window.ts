/**
 * Shared type definitions for window analytics extension
 * 
 * This file provides a unified type for the __TRADELIA_ANALYTICS__ window property
 * to avoid type conflicts across different modules.
 */

/**
 * Generic analytics event that can be tracked
 */
export interface GenericAnalyticsEvent {
  event: string
  properties: Record<string, string | number | boolean>
  timestamp?: number
  session_id?: string
}

/**
 * Window extension for Tradelia analytics
 */
export interface WindowWithTradeliaAnalytics {
  __TRADELIA_ANALYTICS__?: {
    trackEvent: (event: GenericAnalyticsEvent) => void
    getQueue?: () => GenericAnalyticsEvent[]
    getSettings?: () => unknown
    flushNow?: () => Promise<void>
  }
}

/**
 * Helper function to get the analytics object from window
 */
export function getWindowAnalytics(): WindowWithTradeliaAnalytics['__TRADELIA_ANALYTICS__'] | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as typeof window & WindowWithTradeliaAnalytics).__TRADELIA_ANALYTICS__
}

/**
 * Helper function to set the analytics object on window
 */
export function setWindowAnalytics(analytics: NonNullable<WindowWithTradeliaAnalytics['__TRADELIA_ANALYTICS__']>): void {
  if (typeof window === 'undefined') return
  const windowWithAnalytics = window as typeof window & WindowWithTradeliaAnalytics
  windowWithAnalytics.__TRADELIA_ANALYTICS__ = analytics
}
