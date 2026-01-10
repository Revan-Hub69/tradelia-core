/**
 * Advanced Analytics Provider - Tradelia 2026
 * 
 * Provider avanzato per tracking comportamentale dettagliato
 * - Auto-tracking di scroll, hover, click
 * - Analisi del comportamento utente
 * - Segmentazione automatica
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { advancedAnalytics, type DetailedEvent } from '@/src/shared/lib/advancedAnalytics'

interface AdvancedAnalyticsProviderProps {
  children: React.ReactNode
  enableScrollTracking?: boolean
  enableHoverTracking?: boolean
  enableFormTracking?: boolean
}

export function AdvancedAnalyticsProvider({ 
  children, 
  enableScrollTracking = true,
  enableHoverTracking = true,
  enableFormTracking = true
}: AdvancedAnalyticsProviderProps) {
  const pathname = usePathname()
  const sessionRef = useRef<string | undefined>(undefined)
  const scrollDepthRef = useRef<number>(0)
  const pageStartTime = useRef<number>(Date.now())

  // Initialize session
  useEffect(() => {
    const session = advancedAnalytics.trackSession({
      entry_point: pathname,
      ...(document.referrer && { referrer: document.referrer })
    })
    sessionRef.current = session.session_id
  }, [pathname])

  // Track page views
  useEffect(() => {
    pageStartTime.current = Date.now()
    scrollDepthRef.current = 0

    const trackPageView = () => {
      if (!sessionRef.current) return

      advancedAnalytics.trackDetailedEvent({
        session_id: sessionRef.current,
        event_type: 'page_view',
        page: pathname,
        section: getPageSection(pathname),
        load_time: Date.now() - pageStartTime.current
      })
    }

    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackPageView, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  // Enhanced click tracking
  const handleClick = useCallback((event: MouseEvent) => {
    if (!sessionRef.current) return

    const target = event.target as HTMLElement
    
    advancedAnalytics.trackDetailedEvent({
      session_id: sessionRef.current,
      event_type: 'click',
      page: pathname,
      section: getPageSection(pathname),
      element: getElementIdentifier(target),
      element_text: getElementText(target),
      element_position: {
        x: event.clientX,
        y: event.clientY
      },
      click_sequence: getClickSequence()
    })
  }, [pathname])

  // Scroll depth tracking
  const handleScroll = useCallback(() => {
    if (!enableScrollTracking || !sessionRef.current) return

    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )

    if (scrollPercent > scrollDepthRef.current) {
      scrollDepthRef.current = scrollPercent

      // Track significant scroll milestones
      if (scrollPercent % 25 === 0 || scrollPercent === 100) {
        advancedAnalytics.trackDetailedEvent({
          session_id: sessionRef.current,
          event_type: 'scroll',
          page: pathname,
          section: getPageSection(pathname),
          scroll_depth: scrollPercent
        })
      }
    }
  }, [pathname, enableScrollTracking])

  // Hover tracking for important elements
  const handleMouseOver = useCallback((event: MouseEvent) => {
    if (!enableHoverTracking || !sessionRef.current) return

    const target = event.target as HTMLElement
    
    // Only track hovers on interactive elements
    if (isInteractiveElement(target)) {
      const hoverStartTime = Date.now()
      
      const handleMouseOut = () => {
        const hoverDuration = Date.now() - hoverStartTime
        
        if (hoverDuration > 1000) { // Only track hovers longer than 1 second
          advancedAnalytics.trackDetailedEvent({
            session_id: sessionRef.current!,
            event_type: 'hover',
            page: pathname,
            section: getPageSection(pathname),
            element: getElementIdentifier(target),
            time_on_element: hoverDuration
          })
        }
        
        target.removeEventListener('mouseout', handleMouseOut)
      }
      
      target.addEventListener('mouseout', handleMouseOut)
    }
  }, [pathname, enableHoverTracking])

  // Form interaction tracking
  const handleFormInteraction = useCallback((event: Event) => {
    if (!enableFormTracking || !sessionRef.current) return

    const target = event.target as HTMLFormElement
    
    advancedAnalytics.trackDetailedEvent({
      session_id: sessionRef.current,
      event_type: 'form_interaction',
      page: pathname,
      section: getPageSection(pathname),
      element: getElementIdentifier(target),
      form_field: target.name || target.id || 'unknown'
    })
  }, [pathname, enableFormTracking])

  // Error tracking
  const handleError = useCallback((event: ErrorEvent) => {
    if (!sessionRef.current) return

    advancedAnalytics.trackDetailedEvent({
      session_id: sessionRef.current,
      event_type: 'error',
      page: pathname,
      section: getPageSection(pathname),
      error_type: 'javascript',
      error_message: event.message
    })
  }, [pathname])

  // Setup event listeners
  useEffect(() => {
    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('focus', handleFormInteraction, true)
    window.addEventListener('error', handleError)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('focus', handleFormInteraction, true)
      window.removeEventListener('error', handleError)
    }
  }, [handleClick, handleScroll, handleMouseOver, handleFormInteraction, handleError])

  // Periodic data sync
  useEffect(() => {
    const syncData = async () => {
      try {
        const events = advancedAnalytics.getEvents().slice(-50) // Last 50 events
        const sessions = advancedAnalytics.getSessions().slice(-10) // Last 10 sessions

        await fetch('/api/analytics/advanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            events: events.map(e => ({
              ...e,
              // Remove sensitive data before sending
              session_id: e.session_id.substring(0, 8) + '...'
            })),
            session_data: sessions[sessions.length - 1]
          })
        })
      } catch (error) {
        console.warn('Analytics sync failed:', error)
      }
    }

    // Sync every 30 seconds
    const interval = setInterval(syncData, 30000)
    
    // Sync on page unload
    const handleBeforeUnload = () => {
      syncData()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return <>{children}</>
}

// Helper functions
function getPageSection(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.includes('dashboard')) {
    if (segments.includes('analytics')) return 'analytics_dashboard'
    if (segments.includes('emergency')) return 'emergency_journey'
    if (segments.includes('longterm')) return 'longterm_journey'
    if (segments.includes('speculation')) return 'speculation_journey'
    if (segments.includes('passive')) return 'passive_journey'
    return 'dashboard_home'
  }
  
  if (segments.length === 0) return 'homepage'
  return segments[segments.length - 1] || 'unknown'
}

function getElementIdentifier(element: HTMLElement): string {
  // Try to get a meaningful identifier
  if (element.id) return `#${element.id}`
  if (element.className && typeof element.className === 'string') return `.${element.className.split(' ')[0]}`
  if (element.tagName === 'BUTTON') return 'button'
  if (element.tagName === 'A') return 'link'
  if (element.tagName === 'INPUT') return `input[${element.getAttribute('type') || 'text'}]`
  return element.tagName.toLowerCase()
}

function getElementText(element: HTMLElement): string {
  const text = element.textContent || element.innerText || ''
  return text.trim().substring(0, 50) // Limit to 50 characters
}

function isInteractiveElement(element: HTMLElement): boolean {
  const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']
  const interactiveRoles = ['button', 'link', 'menuitem', 'tab']
  
  return (
    interactiveTags.includes(element.tagName) ||
    interactiveRoles.includes(element.getAttribute('role') || '') ||
    element.hasAttribute('onclick') ||
    element.style.cursor === 'pointer'
  )
}

let clickSequence = 0
function getClickSequence(): number {
  return ++clickSequence
}

// Hook for manual tracking
export function useAdvancedAnalytics() {
  const pathname = usePathname()

  const trackCustomEvent = useCallback((eventData: Partial<DetailedEvent>) => {
    advancedAnalytics.trackDetailedEvent({
      page: pathname,
      section: getPageSection(pathname),
      ...eventData
    })
  }, [pathname])

  const trackConversion = useCallback((conversionType: string, value?: number) => {
    trackCustomEvent({
      event_type: 'conversion',
      element: conversionType,
      ...(value !== undefined && { element_text: value.toString() })
    })
  }, [trackCustomEvent])

  const trackToolUsage = useCallback((toolId: string, action: string, duration?: number) => {
    trackCustomEvent({
      event_type: 'tool_usage',
      element: toolId,
      element_text: action,
      ...(duration !== undefined && { time_on_element: duration })
    })
  }, [trackCustomEvent])

  const trackUserIntent = useCallback((intent: 'learning' | 'comparing' | 'planning' | 'executing') => {
    trackCustomEvent({
      event_type: 'page_view',
      user_intent: intent
    })
  }, [trackCustomEvent])

  return {
    trackCustomEvent,
    trackConversion,
    trackToolUsage,
    trackUserIntent
  }
}