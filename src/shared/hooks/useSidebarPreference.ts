/**
 * Sidebar Preference Hook - Tradelia 2026
 * 
 * Gestisce le preferenze utente per la sidebar con persistenza locale
 * e comportamento smart responsive
 */

'use client'

import { useState, useEffect } from 'react'

interface SidebarPreference {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export function useSidebarPreference(): SidebarPreference {
  const [collapsed, setCollapsedState] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration-safe initialization
  useEffect(() => {
    const stored = localStorage.getItem('tradelia-sidebar-collapsed')
    if (stored !== null) {
      setCollapsedState(JSON.parse(stored))
    }
    setIsHydrated(true)
  }, [])

  // Persist preference changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('tradelia-sidebar-collapsed', JSON.stringify(collapsed))
    }
  }, [collapsed, isHydrated])

  const toggle = () => {
    setCollapsedState(prev => !prev)
  }

  const setCollapsed = (newCollapsed: boolean) => {
    setCollapsedState(newCollapsed)
  }

  return {
    collapsed: isHydrated ? collapsed : false, // Default to expanded during SSR
    toggle,
    setCollapsed
  }
}