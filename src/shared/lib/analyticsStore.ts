/**
 * Shared Analytics Store - Tradelia 2026
 * 
 * Centralized storage for analytics events
 * In production, this would be replaced with a database
 */

export interface AnalyticsEvent {
  event: 'navigation' | 'tool_usage' | 'error' | 'feature_usage' | 'performance' | 'accessibility'
  properties: Record<string, string | number | boolean>
  timestamp: number
  session_id: string
}

// In-memory storage for demo (in production, use a proper database)
export const analyticsStore: AnalyticsEvent[] = []

// Helper functions for analytics store management
export function addEvent(event: AnalyticsEvent) {
  analyticsStore.push(event)
  
  // Keep only last 1000 events in memory (prevent memory leaks)
  if (analyticsStore.length > 1000) {
    analyticsStore.splice(0, analyticsStore.length - 1000)
  }
}

export function getEvents(): AnalyticsEvent[] {
  return [...analyticsStore] // Return a copy to prevent mutations
}

export function getEventsByTimeframe(timeframeDuration: number): AnalyticsEvent[] {
  const now = Date.now()
  return analyticsStore.filter(event => 
    now - event.timestamp <= timeframeDuration
  )
}

export function getEventsByType(eventType: AnalyticsEvent['event']): AnalyticsEvent[] {
  return analyticsStore.filter(event => event.event === eventType)
}

export function getEventCount(): number {
  return analyticsStore.length
}

export function clearEvents() {
  analyticsStore.length = 0
}

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Add some sample events for testing
  const sampleEvents: AnalyticsEvent[] = [
    {
      event: 'navigation',
      properties: {
        from_section: 'homepage',
        to_section: 'dashboard_home',
        navigation_type: 'direct',
        section: 'dashboard_home'
      },
      timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      session_id: 'sample_session_1'
    },
    {
      event: 'navigation',
      properties: {
        from_section: 'dashboard_home',
        to_section: 'emergency_journey',
        navigation_type: 'sidebar',
        section: 'emergency_journey'
      },
      timestamp: Date.now() - 3 * 60 * 1000, // 3 minutes ago
      session_id: 'sample_session_1'
    },
    {
      event: 'tool_usage',
      properties: {
        tool_id: 'risk_calculator',
        section: 'emergency_journey',
        action: 'open',
        usage_duration: 120
      },
      timestamp: Date.now() - 2 * 60 * 1000, // 2 minutes ago
      session_id: 'sample_session_1'
    }
  ]
  
  // Add sample events only if store is empty
  if (analyticsStore.length === 0) {
    sampleEvents.forEach(addEvent)
  }
}