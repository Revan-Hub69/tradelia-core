/**
 * Deep Link Hook - Tradelia 2026
 * 
 * Gestisce URL state per deep linking
 * Supporta: ?panel=, ?tab=, ?journey=, ?section=
 * Aggiorna URL senza reload (REQ 17.1, 17.2, 17.3)
 */

'use client'

import { useCallback, useMemo, useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export interface DeepLinkParams {
  panel?: string | null
  tab?: string | null
  journey?: string | null
  section?: string | null
}

export interface UseDeepLinkReturn {
  /** Current panel from URL (?panel=) */
  panel: string | null
  /** Current tab from URL (?tab=) */
  tab: string | null
  /** Current journey from URL (?journey=) */
  journey: string | null
  /** Current section from URL (?section=) */
  section: string | null
  /** Set deep link params - updates URL without reload */
  setDeepLink: (params: DeepLinkParams) => void
  /** Clear specific params from URL */
  clearDeepLink: (keys?: (keyof DeepLinkParams)[]) => void
  /** Get current URL with all params (for copy link) */
  getCurrentUrl: () => string
  /** Check if any deep link params are set */
  hasDeepLink: boolean
}

/**
 * Hook for managing URL state for deep linking
 * 
 * @example
 * ```tsx
 * const { panel, tab, setDeepLink, getCurrentUrl } = useDeepLink()
 * 
 * // Open drawer and update URL
 * const openDrawer = (panelId: string) => {
 *   setDrawerOpen(true)
 *   setDeepLink({ panel: panelId })
 * }
 * 
 * // Copy current URL with params
 * const handleCopyLink = async () => {
 *   await navigator.clipboard.writeText(getCurrentUrl())
 * }
 * ```
 */
export function useDeepLink(): UseDeepLinkReturn {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract current params
  const panel = searchParams.get('panel')
  const tab = searchParams.get('tab')
  const journey = searchParams.get('journey')
  const section = searchParams.get('section')

  /**
   * Set deep link params - updates URL without page reload
   * Pass null to remove a param, undefined to keep existing
   */
  const setDeepLink = useCallback((params: DeepLinkParams) => {
    if (!mounted) return

    const newParams = new URLSearchParams(searchParams.toString())

    // Update each param
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })

    const queryString = newParams.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    // Use replace to avoid adding to history for minor state changes
    router.replace(newUrl, { scroll: false })
  }, [mounted, pathname, searchParams, router])

  /**
   * Clear specific params or all deep link params
   */
  const clearDeepLink = useCallback((keys?: (keyof DeepLinkParams)[]) => {
    if (!mounted) return

    const newParams = new URLSearchParams(searchParams.toString())
    const keysToRemove = keys || ['panel', 'tab', 'journey', 'section']

    keysToRemove.forEach(key => {
      newParams.delete(key)
    })

    const queryString = newParams.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.replace(newUrl, { scroll: false })
  }, [mounted, pathname, searchParams, router])

  /**
   * Get current full URL with all params (for copy link feature)
   */
  const getCurrentUrl = useCallback((): string => {
    if (typeof window === 'undefined') return ''
    
    return window.location.href
  }, [])

  /**
   * Check if any deep link params are currently set
   */
  const hasDeepLink = useMemo(() => {
    return !!(panel || tab || journey || section)
  }, [panel, tab, journey, section])

  return {
    panel,
    tab,
    journey,
    section,
    setDeepLink,
    clearDeepLink,
    getCurrentUrl,
    hasDeepLink
  }
}

/**
 * Hook to restore state from URL params on mount
 * Use this in components that need to open based on URL
 * 
 * @example
 * ```tsx
 * useDeepLinkRestore({
 *   onPanel: (panelId) => setActivePanel(panelId),
 *   onTab: (tabId) => setActiveTab(tabId),
 * })
 * ```
 */
export function useDeepLinkRestore(handlers: {
  onPanel?: (panel: string) => void
  onTab?: (tab: string) => void
  onJourney?: (journey: string) => void
  onSection?: (section: string) => void
}) {
  const { panel, tab, journey, section } = useDeepLink()
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    if (restored) return

    // Restore state from URL params
    if (panel && handlers.onPanel) {
      handlers.onPanel(panel)
    }
    if (tab && handlers.onTab) {
      handlers.onTab(tab)
    }
    if (journey && handlers.onJourney) {
      handlers.onJourney(journey)
    }
    if (section && handlers.onSection) {
      handlers.onSection(section)
    }

    setRestored(true)
  }, [panel, tab, journey, section, handlers, restored])

  return { restored }
}
