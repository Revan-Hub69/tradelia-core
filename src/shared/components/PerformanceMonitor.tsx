/**
 * Performance Monitor Component - Tradelia 2026
 * 
 * Client-side performance monitoring
 * Tracks Web Vitals and navigation performance
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initPerformanceMonitoring, trackNavigation } from '@/src/shared/lib/performance'

export function PerformanceMonitor() {
  const pathname = usePathname()

  // Initialize performance monitoring on mount
  useEffect(() => {
    initPerformanceMonitoring()
  }, [])

  // Track route changes
  useEffect(() => {
    const startTime = performance.now()
    
    // Track navigation performance after route change
    const timer = setTimeout(() => {
      trackNavigation(pathname, startTime)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  // This component renders nothing - it's just for monitoring
  return null
}