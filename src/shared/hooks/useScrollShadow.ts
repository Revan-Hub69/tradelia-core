/**
 * useScrollShadow Hook - Tradelia 2026
 * 
 * Detects scroll position and returns whether content is scrolled.
 * Used for showing scroll shadows on headers/footers.
 * 
 * @requirements REQ-26.1 - Drawer header scroll shadow
 */

'use client'

import { useState, useEffect, type RefObject } from 'react'

export interface UseScrollShadowOptions {
  /** Threshold in pixels before considering content scrolled (default: 0) */
  threshold?: number
}

export interface UseScrollShadowReturn {
  /** Whether the content is scrolled past the threshold */
  isScrolled: boolean
  /** Current scroll position in pixels */
  scrollTop: number
}

/**
 * Hook to detect scroll position for showing scroll shadows
 * 
 * @param ref - Reference to the scrollable element
 * @param options - Configuration options
 * @returns Object with isScrolled boolean and scrollTop value
 * 
 * @example
 * ```tsx
 * const contentRef = useRef<HTMLDivElement>(null)
 * const { isScrolled } = useScrollShadow(contentRef)
 * 
 * return (
 *   <>
 *     <header className={isScrolled ? 'shadow-md' : ''}>Header</header>
 *     <div ref={contentRef} className="overflow-y-auto">Content</div>
 *   </>
 * )
 * ```
 */
export function useScrollShadow(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollShadowOptions = {}
): UseScrollShadowReturn {
  const { threshold = 0 } = options
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const currentScrollTop = element.scrollTop
      setScrollTop(currentScrollTop)
      setIsScrolled(currentScrollTop > threshold)
    }

    // Check initial scroll position
    handleScroll()

    // Add scroll listener with passive option for performance
    element.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [ref, threshold])

  return { isScrolled, scrollTop }
}
