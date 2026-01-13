/**
 * Privacy-First Analytics - Tradelia 2026
 * 
 * Sistema di analytics compliant con privacy regulations
 * - No PII tracking
 * - No session replay
 * - No invasive heatmaps
 * - Minimal data collection
 * - User consent respected
 */

import React from 'react'

interface AnalyticsEvent {
  // Event identification
  event: 'navigation' | 'tool_usage' | 'error' | 'feature_usage' | 'performance' | 'accessibility'
  
  // Event properties (no PII allowed)
  properties: Record<string, string | number | boolean>
  
  // Metadata
  timestamp?: number
  session_id?: string
}

interface NavigationEvent {
  event: 'navigation'
  properties: {
    from_section: string
    to_section: string
    navigation_type: 'sidebar' | 'bottom_nav' | 'breadcrumb' | 'context_pill' | 'direct'
    load_time?: number
  }
}

interface ToolUsageEvent {
  event: 'tool_usage'
  properties: {
    tool_id: string
    section: string
    action: 'open' | 'close' | 'interact' | 'complete'
    usage_duration?: number
    success?: boolean
  }
}

interface ErrorEvent {
  event: 'error'
  properties: {
    error_type: 'network' | 'validation' | 'permission' | 'unknown'
    error_code?: string
    section: string
    recovery_action?: string
  }
}

interface FeatureUsageEvent {
  event: 'feature_usage'
  properties: {
    feature: string
    action: string
    section: string
    value?: string | number
  }
}

interface AccessibilityEvent {
  event: 'accessibility'
  properties: {
    interaction_type: 'keyboard' | 'screen_reader' | 'voice' | 'touch'
    element_type: string
    success: boolean
    section: string
  }
}

// Privacy settings
interface PrivacySettings {
  analytics_enabled: boolean
  performance_tracking: boolean
  error_reporting: boolean
  feature_usage: boolean
  last_updated: number
}

// Analytics configuration
const ANALYTICS_CONFIG = {
  // Endpoints
  endpoint: '/api/analytics',
  batch_size: 10,
  flush_interval: 30000, // 30 seconds
  
  // Privacy
  session_timeout: 30 * 60 * 1000, // 30 minutes
  data_retention: 90, // days
  
  // Sampling (reduce data volume)
  sampling_rate: {
    navigation: 1.0, // Track all navigation
    tool_usage: 1.0, // Track all tool usage
    error: 1.0, // Track all errors
    feature_usage: 0.1, // Sample 10% of feature usage
    performance: 0.05, // Sample 5% of performance events
    accessibility: 1.0 // Track all accessibility events
  }
}

// Event queue for batching
let eventQueue: AnalyticsEvent[] = []
let flushTimer: NodeJS.Timeout | null = null

// Privacy settings (stored in localStorage)
function getPrivacySettings(): PrivacySettings {
  if (typeof window === 'undefined') {
    return {
      analytics_enabled: false,
      performance_tracking: false,
      error_reporting: false,
      feature_usage: false,
      last_updated: Date.now()
    }
  }

  try {
    const stored = localStorage.getItem('tradelia-privacy-settings')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parsing errors
  }

  // Default settings (opt-in required)
  return {
    analytics_enabled: false,
    performance_tracking: false,
    error_reporting: true, // Errors are essential for functionality
    feature_usage: false,
    last_updated: Date.now()
  }
}

function setPrivacySettings(settings: Partial<PrivacySettings>) {
  if (typeof window === 'undefined') return

  const current = getPrivacySettings()
  const updated = {
    ...current,
    ...settings,
    last_updated: Date.now()
  }

  try {
    localStorage.setItem('tradelia-privacy-settings', JSON.stringify(updated))
  } catch {
    // Ignore storage errors
  }
}

// Anonymous session ID (no user identification)
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'

  let sessionId = sessionStorage.getItem('tradelia_session_id')
  const sessionStart = sessionStorage.getItem('tradelia_session_start')
  const now = Date.now()

  // Check if session expired
  if (sessionStart && (now - parseInt(sessionStart)) > ANALYTICS_CONFIG.session_timeout) {
    sessionId = null
  }

  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    sessionStorage.setItem('tradelia_session_id', sessionId)
    sessionStorage.setItem('tradelia_session_start', now.toString())
  }

  return sessionId
}

// Check if event should be sampled
function shouldSampleEvent(eventType: AnalyticsEvent['event']): boolean {
  const rate = ANALYTICS_CONFIG.sampling_rate[eventType] || 1.0
  return Math.random() < rate
}

// Core tracking function
function trackEvent(event: AnalyticsEvent) {
  // Check privacy settings
  const privacy = getPrivacySettings()
  
  if (!privacy.analytics_enabled && event.event !== 'error') {
    return // Only track errors if analytics disabled
  }

  if (!privacy.performance_tracking && event.event === 'performance') {
    return
  }

  if (!privacy.error_reporting && event.event === 'error') {
    return
  }

  if (!privacy.feature_usage && event.event === 'feature_usage') {
    return
  }

  // Apply sampling
  if (!shouldSampleEvent(event.event)) {
    return
  }

  // Sanitize and enrich event
  const sanitizedEvent: AnalyticsEvent = {
    event: event.event,
    properties: sanitizeProperties(event.properties),
    timestamp: event.timestamp || Date.now(),
    session_id: getSessionId()
  }

  // Add to queue
  eventQueue.push(sanitizedEvent)

  // Flush if queue is full
  if (eventQueue.length >= ANALYTICS_CONFIG.batch_size) {
    flushEvents()
  } else {
    // Schedule flush
    scheduleFlush()
  }
}

// Sanitize properties to ensure no PII
function sanitizeProperties(properties: Record<string, unknown>): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {}

  for (const [key, value] of Object.entries(properties)) {
    // Skip potentially sensitive keys
    if (key.toLowerCase().includes('email') || 
        key.toLowerCase().includes('name') || 
        key.toLowerCase().includes('phone') ||
        key.toLowerCase().includes('address')) {
      continue
    }

    // Only allow safe types
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
    }
  }

  return sanitized
}

// Schedule event flush
function scheduleFlush() {
  // Analytics disabled - endpoint removed
  // Clear timer if exists and do nothing
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
}

// Flush events to server
// DISABLED: Analytics endpoint has been removed
// This function now clears the queue without making network requests
async function flushEvents() {
  if (eventQueue.length === 0) return

  // Clear the queue without sending - endpoint no longer exists
  if (eventQueue.length > 0) {
    console.debug('[Analytics] Events cleared (endpoint disabled):', eventQueue.length)
    eventQueue = []
  }

  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  // No network request - endpoint removed
  return
}

// Public API functions
export function trackNavigation(event: Omit<NavigationEvent, 'event'>) {
  trackEvent({
    event: 'navigation',
    ...event
  })
}

export function trackToolUsage(event: Omit<ToolUsageEvent, 'event'>) {
  trackEvent({
    event: 'tool_usage',
    ...event
  })
}

export function trackError(event: Omit<ErrorEvent, 'event'>) {
  trackEvent({
    event: 'error',
    ...event
  })
}

export function trackFeatureUsage(event: Omit<FeatureUsageEvent, 'event'>) {
  trackEvent({
    event: 'feature_usage',
    ...event
  })
}

export function trackAccessibility(event: Omit<AccessibilityEvent, 'event'>) {
  trackEvent({
    event: 'accessibility',
    ...event
  })
}

// Privacy management
export function enableAnalytics() {
  setPrivacySettings({ analytics_enabled: true })
}

export function disableAnalytics() {
  setPrivacySettings({ analytics_enabled: false })
  // Clear queue
  eventQueue = []
}

export function updatePrivacySettings(settings: Partial<PrivacySettings>) {
  setPrivacySettings(settings)
}

export function getAnalyticsStatus() {
  return getPrivacySettings()
}

// Consent management
export function requestAnalyticsConsent(): Promise<boolean> {
  return new Promise((resolve) => {
    // This would typically show a consent modal
    // For now, return current status
    const settings = getPrivacySettings()
    resolve(settings.analytics_enabled)
  })
}

// Initialize analytics
// DISABLED: Analytics endpoint has been removed
export function initAnalytics() {
  // Analytics disabled - no event listeners needed
  // Endpoint has been removed, so we don't set up any flush handlers
  console.debug('[Analytics] Analytics initialization skipped - endpoint disabled')
  return
}

// React hook for analytics
export function useAnalytics() {
  const [privacySettings, setPrivacySettingsState] = React.useState(getPrivacySettings())

  const updateSettings = (settings: Partial<PrivacySettings>) => {
    updatePrivacySettings(settings)
    setPrivacySettingsState(getPrivacySettings())
  }

  return {
    settings: privacySettings,
    updateSettings,
    trackNavigation,
    trackToolUsage,
    trackError,
    trackFeatureUsage,
    trackAccessibility
  }
}

// Development helpers
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Use a type assertion to set the analytics object
  // The trackEvent function accepts the local AnalyticsEvent type which is more specific
  // than the generic type, but compatible for tracking purposes
  const windowWithAnalytics = window as typeof window & {
    __TRADELIA_ANALYTICS__?: {
      getQueue: () => AnalyticsEvent[]
      getSettings: () => PrivacySettings
      flushNow: () => Promise<void>
      trackEvent: (event: AnalyticsEvent) => void
    }
  }
  windowWithAnalytics.__TRADELIA_ANALYTICS__ = {
    getQueue: () => eventQueue,
    getSettings: getPrivacySettings,
    flushNow: flushEvents,
    trackEvent
  }
}