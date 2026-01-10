/**
 * Analytics API Endpoint - Tradelia 2026
 * 
 * Privacy-first analytics collection endpoint
 * - GDPR compliant
 * - No PII storage
 * - Minimal data collection
 */

import { NextRequest, NextResponse } from 'next/server'
import { addEvent, getEvents, getEventsByType, getEventCount, type AnalyticsEvent } from '@/src/shared/lib/analyticsStore'

interface AnalyticsPayload {
  events: AnalyticsEvent[]
  client_info: {
    user_agent: string
    screen_resolution: string
    timezone: string
    language: string
  }
}

// In-memory storage for demo (in production, use a proper database)
// Now using shared analytics store

export async function POST(request: NextRequest) {
  try {
    const payload: AnalyticsPayload = await request.json()
    
    // Validate payload
    if (!payload.events || !Array.isArray(payload.events)) {
      return NextResponse.json(
        { error: 'Invalid payload: events array required' },
        { status: 400 }
      )
    }

    // Process each event
    for (const event of payload.events) {
      // Validate event structure
      if (!event.event || !event.properties || !event.timestamp) {
        continue // Skip invalid events
      }

      // Sanitize and store event
      const sanitizedEvent: AnalyticsEvent = {
        event: event.event,
        properties: sanitizeProperties(event.properties),
        timestamp: event.timestamp,
        session_id: event.session_id || 'anonymous'
      }

      // Store event (in production, save to database)
      addEvent(sanitizedEvent)
      
      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', {
          type: sanitizedEvent.event,
          properties: sanitizedEvent.properties,
          session: sanitizedEvent.session_id.substring(0, 8) + '...'
        })
      }
    }

    // Keep only last 1000 events in memory (prevent memory leaks)
    // This is now handled by the shared store

    return NextResponse.json({ 
      success: true, 
      processed: payload.events.length,
      message: 'Events processed successfully'
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for analytics dashboard (development only)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Analytics dashboard only available in development' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const eventType = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '100')

  let events = getEvents()
  
  // Filter by event type if specified
  if (eventType) {
    events = getEventsByType(eventType as AnalyticsEvent['event'])
  }

  // Get recent events
  const recentEvents = events
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)

  // Generate summary statistics
  const summary = {
    total_events: getEventCount(),
    event_types: getEventTypeCounts(),
    recent_sessions: getRecentSessions(),
    top_sections: getTopSections(),
    error_rate: getErrorRate()
  }

  return NextResponse.json({
    summary,
    events: recentEvents,
    timestamp: Date.now()
  })
}

// Helper functions
function sanitizeProperties(properties: Record<string, unknown>): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {}

  for (const [key, value] of Object.entries(properties)) {
    // Skip potentially sensitive keys
    if (key.toLowerCase().includes('email') || 
        key.toLowerCase().includes('name') || 
        key.toLowerCase().includes('phone') ||
        key.toLowerCase().includes('address') ||
        key.toLowerCase().includes('password')) {
      continue
    }

    // Only allow safe types
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
    }
  }

  return sanitized
}

function getEventTypeCounts() {
  const counts: Record<string, number> = {}
  const events = getEvents()
  
  for (const event of events) {
    counts[event.event] = (counts[event.event] || 0) + 1
  }
  
  return counts
}

function getRecentSessions() {
  const sessions = new Set()
  const events = getEvents()
  const recentEvents = events
    .filter(event => Date.now() - event.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
  
  for (const event of recentEvents) {
    sessions.add(event.session_id)
  }
  
  return sessions.size
}

function getTopSections() {
  const sections: Record<string, number> = {}
  const events = getEvents()
  
  for (const event of events) {
    const section = event.properties.section as string
    if (section) {
      sections[section] = (sections[section] || 0) + 1
    }
  }
  
  return Object.entries(sections)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
}

function getErrorRate() {
  const events = getEvents()
  const totalEvents = events.length
  const errorEvents = events.filter(event => event.event === 'error').length
  
  return totalEvents > 0 ? (errorEvents / totalEvents * 100).toFixed(2) : '0.00'
}