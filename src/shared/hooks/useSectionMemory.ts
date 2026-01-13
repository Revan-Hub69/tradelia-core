/**
 * Section Memory Hook - Tradelia 2026
 * 
 * Ricorda l'ultima tab visitata per ogni sezione
 * Rende l'app "umana" - quando rientri, sei dove avevi lasciato
 */

import { useEffect, useState } from 'react'

interface SectionMemory {
  [sectionId: string]: {
    lastActiveTab: string
    lastVisited: number
    scrollPosition?: number // Per contenuti educativi
  }
}

const STORAGE_KEY = 'tradelia_section_memory'
const MEMORY_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 giorni

// Get stored memory
function getSectionMemory(): SectionMemory {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}

    const memory: SectionMemory = JSON.parse(stored)
    const now = Date.now()

    // Clean expired entries
    const cleaned: SectionMemory = {}
    for (const [sectionId, data] of Object.entries(memory)) {
      if (now - data.lastVisited < MEMORY_EXPIRY) {
        cleaned[sectionId] = data
      }
    }

    return cleaned
  } catch {
    return {}
  }
}

// Save section memory
function saveSectionMemory(memory: SectionMemory) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    // Ignore storage errors
  }
}

// Hook for section memory
export function useSectionMemory(sectionId: string, defaultTab: string) {
  const [memory, setMemory] = useState<SectionMemory>(() => getSectionMemory())

  // Get remembered tab for this section
  const getRememberedTab = (): string => {
    const sectionMemory = memory[sectionId]
    return sectionMemory?.lastActiveTab || defaultTab
  }

  // Remember tab for this section
  const rememberTab = (tabId: string) => {
    const currentSection = memory[sectionId]
    const newMemory = {
      ...memory,
      [sectionId]: {
        lastActiveTab: tabId,
        lastVisited: Date.now(),
        ...(currentSection?.scrollPosition !== undefined && { scrollPosition: currentSection.scrollPosition })
      }
    }
    
    setMemory(newMemory)
    saveSectionMemory(newMemory)
  }

  // Remember scroll position (for educational content)
  const rememberScrollPosition = (position: number) => {
    const newMemory = {
      ...memory,
      [sectionId]: {
        lastActiveTab: memory[sectionId]?.lastActiveTab || defaultTab,
        lastVisited: Date.now(),
        scrollPosition: position
      }
    }
    
    setMemory(newMemory)
    saveSectionMemory(newMemory)
  }

  // Get remembered scroll position
  const getRememberedScrollPosition = (): number => {
    return memory[sectionId]?.scrollPosition || 0
  }

  // Clear memory for section
  const clearSectionMemory = () => {
    const newMemory = { ...memory }
    delete newMemory[sectionId]
    
    setMemory(newMemory)
    saveSectionMemory(newMemory)
  }

  // Clear all memory
  const clearAllMemory = () => {
    setMemory({})
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    getRememberedTab,
    rememberTab,
    rememberScrollPosition,
    getRememberedScrollPosition,
    clearSectionMemory,
    clearAllMemory,
    hasMemory: !!memory[sectionId]
  }
}

// Hook for scroll memory (educational content)
export function useScrollMemory(sectionId: string, tabId: string) {
  const { rememberScrollPosition, getRememberedScrollPosition } = useSectionMemory(sectionId, '')

  useEffect(() => {
    // Restore scroll position after content loads
    const timer = setTimeout(() => {
      const position = getRememberedScrollPosition()
      if (position > 0) {
        window.scrollTo({ top: position, behavior: 'smooth' })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [tabId, getRememberedScrollPosition])

  // Save scroll position on scroll (throttled)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        // Only save for educational tabs
        if (tabId === 'educational' || tabId === 'intro') {
          rememberScrollPosition(window.scrollY)
        }
      }, 500) // Throttle to 500ms
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [tabId, rememberScrollPosition])

  return {
    rememberScrollPosition,
    getRememberedScrollPosition
  }
}

// Import shared analytics window type
import { getWindowAnalytics } from '@/src/shared/lib/types/analytics-window'

// Analytics integration
export function trackSectionMemoryUsage(sectionId: string, wasRemembered: boolean) {
  // This would integrate with our analytics system
  if (typeof window !== 'undefined') {
    const analytics = getWindowAnalytics()
    if (analytics) {
      analytics.trackEvent({
        event: 'feature_usage',
        properties: {
          feature: 'section_memory',
          section: sectionId,
          was_remembered: wasRemembered,
          action: 'tab_restore'
        }
      })
    }
  }
}