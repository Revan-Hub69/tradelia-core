/**
 * useScrollspy Hook - Tradelia 2026
 * 
 * Tracks which section is currently visible in the viewport using IntersectionObserver.
 * Used for highlighting the current section in navigation.
 * 
 * @requirements REQ-26.3 - Scrollspy for section tracking
 */

'use client'

import { useState, useEffect } from 'react'

export interface UseScrollspyOptions {
  /** Root margin for the IntersectionObserver (default: '-20% 0px -80% 0px') */
  rootMargin?: string
  /** Threshold for intersection (default: 0) */
  threshold?: number | number[]
  /** Root element for the observer (default: null = viewport) */
  root?: Element | null
}

export interface UseScrollspyReturn {
  /** ID of the currently active/visible section */
  activeId: string | null
  /** Set of all currently intersecting section IDs */
  visibleIds: Set<string>
}

/**
 * Hook to track which section is currently visible in the viewport
 * 
 * @param sectionIds - Array of section element IDs to observe
 * @param options - Configuration options for the IntersectionObserver
 * @returns Object with activeId (most visible section) and visibleIds (all visible sections)
 * 
 * @example
 * ```tsx
 * const sections = ['intro', 'features', 'pricing', 'faq']
 * const { activeId } = useScrollspy(sections)
 * 
 * return (
 *   <nav>
 *     {sections.map(id => (
 *       <a 
 *         key={id} 
 *         href={`#${id}`}
 *         className={activeId === id ? 'text-primary' : ''}
 *       >
 *         {id}
 *       </a>
 *     ))}
 *   </nav>
 * )
 * ```
 */
export function useScrollspy(
  sectionIds: string[],
  options: UseScrollspyOptions = {}
): UseScrollspyReturn {
  const {
    rootMargin = '-20% 0px -80% 0px',
    threshold = 0,
    root = null,
  } = options

  const [activeId, setActiveId] = useState<string | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Skip if no section IDs provided
    if (sectionIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)
        
        if (intersectingEntries.length > 0) {
          // Get the first intersecting entry (topmost in viewport)
          // Sort by boundingClientRect.top to get the one closest to top
          const sorted = intersectingEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          const topEntry = sorted[0]
          if (topEntry) {
            setActiveId(topEntry.target.id)
          }
        }
        
        // Update visible IDs set
        setVisibleIds(prev => {
          const newSet = new Set(prev)
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              newSet.add(entry.target.id)
            } else {
              newSet.delete(entry.target.id)
            }
          })
          return newSet
        })
      },
      { rootMargin, threshold, root }
    )

    // Observe all section elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    // Set initial active ID to first section if none is active
    const firstSectionId = sectionIds[0]
    if (firstSectionId) {
      const firstElement = document.getElementById(firstSectionId)
      if (firstElement) {
        const rect = firstElement.getBoundingClientRect()
        // If first section is in viewport, set it as active
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setActiveId(firstSectionId)
        }
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [sectionIds, rootMargin, threshold, root])

  return { activeId, visibleIds }
}
