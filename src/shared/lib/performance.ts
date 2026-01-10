/**
 * Performance Monitoring - Tradelia 2026
 * 
 * Monitoraggio Web Vitals e metriche UX
 * Privacy-compliant, no PII tracking
 */

import React from 'react'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
}

interface NavigationTiming {
  route: string
  loadTime: number
  timestamp: number
}

// Web Vitals thresholds (2026 standards)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (replaces FID in v5)
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
} as const

// Get rating based on thresholds
function getRating(name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Track Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  // Dynamic import to avoid bundle bloat - gracefully handle missing package
  import('web-vitals').then((webVitals) => {
    const handleMetric = (metric: { name: string; value: number }) => {
      const performanceMetric: PerformanceMetric = {
        name: metric.name,
        value: metric.value,
        rating: getRating(metric.name as keyof typeof THRESHOLDS, metric.value),
        timestamp: Date.now(),
        url: window.location.pathname
      }

      // Send to analytics (privacy-compliant)
      sendPerformanceMetric(performanceMetric)

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, {
          value: metric.value,
          rating: performanceMetric.rating,
          threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS]
        })
      }
    }

    // Use the correct API for web-vitals v5
    if (webVitals.onCLS) webVitals.onCLS(handleMetric)
    if (webVitals.onINP) webVitals.onINP(handleMetric) // FID is replaced by INP in v5
    if (webVitals.onFCP) webVitals.onFCP(handleMetric)
    if (webVitals.onLCP) webVitals.onLCP(handleMetric)
    if (webVitals.onTTFB) webVitals.onTTFB(handleMetric)
  }).catch((_error) => {
    // Gracefully handle missing web-vitals package
    if (process.env.NODE_ENV === 'development') {
      console.info('[Performance] web-vitals package not installed. Install with: npm install web-vitals')
    }
    // Continue without Web Vitals tracking
  })
}

// Track navigation timing
export function trackNavigation(route: string, startTime: number) {
  const loadTime = performance.now() - startTime
  
  const navigationTiming: NavigationTiming = {
    route,
    loadTime,
    timestamp: Date.now()
  }

  // Send to analytics
  sendNavigationTiming(navigationTiming)

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Navigation] ${route}: ${loadTime.toFixed(2)}ms`)
  }
}

// Track route change performance
export function useRoutePerformance() {
  if (typeof window === 'undefined') return

  const startTime = performance.now()
  
  return {
    end: (route: string) => trackNavigation(route, startTime)
  }
}

// Send performance metric to analytics
async function sendPerformanceMetric(metric: PerformanceMetric) {
  // Analytics disabled - endpoint not implemented
  // TODO: Re-enable when /api/analytics/performance endpoint is created
  try {
    console.debug('Performance metric:', metric.name, metric.value, metric.rating)
  } catch {
    // Fail silently - analytics should never break UX
  }
}

// Send navigation timing
async function sendNavigationTiming(timing: NavigationTiming) {
  // Analytics disabled - endpoint not implemented
  // TODO: Re-enable when /api/analytics/performance endpoint is created
  try {
    console.debug('Navigation timing:', timing.route, timing.loadTime + 'ms')
  } catch {
    // Fail silently
  }
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  try {
    // Observe layout shifts
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as LayoutShift).hadRecentInput) {
          // Track significant layout shifts
          if ((entry as LayoutShift).value > 0.1) {
            console.warn('[CLS] Significant layout shift detected:', entry)
          }
        }
      }
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Observe long tasks (>50ms)
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('[Long Task] Blocking task detected:', {
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })

  } catch {
    // Fail silently if PerformanceObserver is not supported
  }
}

// Add interface for LayoutShift
interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

// Bundle size analysis (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return

  // Estimate bundle size from loaded scripts
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  let totalSize = 0

  scripts.forEach(script => {
    const src = (script as HTMLScriptElement).src
    if (src.includes('/_next/static/')) {
      // Estimate size from filename patterns
      if (src.includes('.js')) {
        totalSize += 100 // Rough estimate in KB
      }
    }
  })

  console.log(`[Bundle] Estimated total size: ~${totalSize}KB`)
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return

  const budget = {
    maxBundleSize: 500, // KB
    maxLCP: 2500, // ms
    maxCLS: 0.1,
    maxFID: 100 // ms
  }

  // Check after page load
  setTimeout(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart

    if (loadTime > budget.maxLCP) {
      console.warn(`[Budget] Load time exceeded budget: ${loadTime}ms > ${budget.maxLCP}ms`)
    }

    analyzeBundleSize()
  }, 1000)
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Track Web Vitals
  trackWebVitals()
  
  // Observe performance
  observePerformance()
  
  // Check budget in development
  if (process.env.NODE_ENV === 'development') {
    checkPerformanceBudget()
  }
}

// Hook for React components
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      initPerformanceMonitoring()
    }
  }, [])
}

// Export for global use
if (typeof window !== 'undefined') {
  (window as WindowWithPerformance).__TRADELIA_PERFORMANCE__ = {
    trackWebVitals,
    trackNavigation,
    observePerformance,
    checkPerformanceBudget
  }
}

// Utility functions for performance optimization
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Add interface for window
interface WindowWithPerformance extends Window {
  __TRADELIA_PERFORMANCE__?: {
    trackWebVitals: () => void
    trackNavigation: (route: string, startTime: number) => void
    observePerformance: () => void
    checkPerformanceBudget: () => void
  }
}