/**
 * Web Vitals Integration - Performance Monitoring
 * 
 * Tracks Core Web Vitals for performance optimization
 */

'use client'

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import { type GenericAnalyticsEvent, getWindowAnalytics } from './types/analytics-window'

// Extended navigator type for connection info
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string
  }
}

// Track analytics event
function trackEvent(event: GenericAnalyticsEvent) {
  // Integration with existing analytics system
  if (typeof window !== 'undefined') {
    const analytics = getWindowAnalytics()
    if (analytics?.trackEvent) {
      analytics.trackEvent(event)
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', event)
    }
  }
}

// Send metric to analytics
function sendToAnalytics(metric: Metric) {
  trackEvent({
    event: 'web_vital',
    properties: {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      // Add context
      url: window.location.pathname,
      user_agent: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
      connection: (navigator as NavigatorWithConnection).connection?.effectiveType || 'unknown'
    }
  })
}

// Performance thresholds (Core Web Vitals)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 }, // Replaces FID
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
}

// Get performance rating
function getPerformanceRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  if (typeof window === 'undefined') return

  try {
    // Track all Core Web Vitals
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics) // Replaces FID in web-vitals v3
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)

    // Track custom performance metrics
    trackCustomMetrics()
    
    console.log('[Web Vitals] Tracking initialized')
  } catch (error) {
    console.warn('[Web Vitals] Failed to initialize:', error)
  }
}

// Track custom performance metrics
function trackCustomMetrics() {
  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now()
    trackEvent({
      event: 'page_load_time',
      properties: {
        load_time: Math.round(loadTime),
        rating: getPerformanceRating('TTFB', loadTime),
        url: window.location.pathname
      }
    })
  })

  // Track navigation timing
  if ('navigation' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      trackEvent({
        event: 'navigation_timing',
        properties: {
          dns_lookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcp_connect: Math.round(navigation.connectEnd - navigation.connectStart),
          server_response: Math.round(navigation.responseEnd - navigation.requestStart),
          dom_processing: Math.round(navigation.domContentLoadedEventEnd - navigation.responseEnd),
          url: window.location.pathname
        }
      })
    }
  }

  // Track resource loading performance
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming
        
        // Only track significant resources
        if (resource.duration > 100) {
          trackEvent({
            event: 'resource_timing',
            properties: {
              name: resource.name.split('/').pop() || 'unknown',
              duration: Math.round(resource.duration),
              size: resource.transferSize || 0,
              type: getResourceType(resource.name),
              url: window.location.pathname
            }
          })
        }
      }
    }
  })

  observer.observe({ entryTypes: ['resource'] })
}

// Get resource type from URL
function getResourceType(url: string): string {
  if (url.includes('.js')) return 'javascript'
  if (url.includes('.css')) return 'stylesheet'
  if (url.includes('.png') || url.includes('.jpg') || url.includes('.webp')) return 'image'
  if (url.includes('.woff') || url.includes('.ttf')) return 'font'
  return 'other'
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const trackInteraction = (action: string, element?: string) => {
    trackEvent({
      event: 'user_interaction',
      properties: {
        action,
        element: element || 'unknown',
        timestamp: Date.now(),
        url: window.location.pathname
      }
    })
  }

  const trackError = (error: Error, context?: string) => {
    trackEvent({
      event: 'javascript_error',
      properties: {
        message: error.message,
        stack: error.stack?.substring(0, 500) || '',
        context: context || 'unknown',
        url: window.location.pathname
      }
    })
  }

  return {
    trackInteraction,
    trackError
  }
}

// Performance budget checker
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return

  const budget = {
    maxBundleSize: 500 * 1024, // 500KB
    maxImageSize: 200 * 1024,  // 200KB
    maxFontSize: 100 * 1024,   // 100KB
    maxLCP: 2500,              // 2.5s
    maxFID: 100,               // 100ms
    maxCLS: 0.1                // 0.1
  }

  // Check resource sizes
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0
    const type = getResourceType(resource.name)
    
    let exceeded = false
    let budgetType = ''
    
    if (type === 'javascript' && size > budget.maxBundleSize) {
      exceeded = true
      budgetType = 'bundle_size'
    } else if (type === 'image' && size > budget.maxImageSize) {
      exceeded = true
      budgetType = 'image_size'
    } else if (type === 'font' && size > budget.maxFontSize) {
      exceeded = true
      budgetType = 'font_size'
    }
    
    if (exceeded) {
      trackEvent({
        event: 'performance_budget_exceeded',
        properties: {
          type: budgetType,
          resource: resource.name.split('/').pop() || 'unknown',
          size,
          budget: type === 'javascript' ? budget.maxBundleSize : 
                 type === 'image' ? budget.maxImageSize : budget.maxFontSize,
          url: window.location.pathname
        }
      })
    }
  })
}