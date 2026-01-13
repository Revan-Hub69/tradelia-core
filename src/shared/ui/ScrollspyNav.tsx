/**
 * ScrollspyNav - Tradelia 2026
 * 
 * Navigation component that highlights the current section based on scroll position.
 * Uses IntersectionObserver for efficient scroll tracking.
 * 
 * @requirements REQ-26.3 - Scrollspy for section tracking
 */

'use client'

import { useCallback } from 'react'
import { useScrollspy } from '@/src/shared/hooks/useScrollspy'

export interface ScrollspyNavItem {
  /** Unique identifier matching the section element's id */
  id: string
  /** Display label for the navigation item */
  label: string
  /** Optional icon to display */
  icon?: React.ReactNode
}

export interface ScrollspyNavProps {
  /** Array of navigation items with IDs matching section elements */
  items: ScrollspyNavItem[]
  /** Additional CSS classes */
  className?: string
  /** Orientation of the navigation */
  orientation?: 'horizontal' | 'vertical'
  /** Whether to use smooth scrolling when clicking items */
  smoothScroll?: boolean
  /** Callback when active section changes */
  onActiveChange?: (activeId: string | null) => void
  /** Custom root margin for IntersectionObserver */
  rootMargin?: string
}

/**
 * Navigation component that highlights the current section based on scroll position
 * 
 * @example
 * ```tsx
 * const sections = [
 *   { id: 'intro', label: 'Introduction' },
 *   { id: 'features', label: 'Features' },
 *   { id: 'pricing', label: 'Pricing' },
 * ]
 * 
 * return (
 *   <>
 *     <ScrollspyNav items={sections} orientation="vertical" />
 *     <main>
 *       <section id="intro">...</section>
 *       <section id="features">...</section>
 *       <section id="pricing">...</section>
 *     </main>
 *   </>
 * )
 * ```
 */
export function ScrollspyNav({
  items,
  className = '',
  orientation = 'horizontal',
  smoothScroll = true,
  onActiveChange,
  rootMargin = '-20% 0px -80% 0px',
}: ScrollspyNavProps) {
  const sectionIds = items.map(item => item.id)
  const { activeId } = useScrollspy(sectionIds, { rootMargin })

  // Notify parent of active section changes
  if (onActiveChange && activeId) {
    onActiveChange(activeId)
  }

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      element.scrollIntoView({
        behavior: smoothScroll && !prefersReducedMotion ? 'smooth' : 'auto',
        block: 'start',
      })
    }
  }, [smoothScroll])

  const isHorizontal = orientation === 'horizontal'

  return (
    <nav
      className={`
        ${isHorizontal ? 'flex flex-row space-x-1 overflow-x-auto' : 'flex flex-col space-y-1'}
        ${className}
      `}
      aria-label="Section navigation"
    >
      {items.map((item) => {
        const isActive = item.id === activeId

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
              ${isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
              ${isHorizontal ? 'whitespace-nowrap' : ''}
            `}
            aria-current={isActive ? 'true' : undefined}
          >
            {item.icon && (
              <span className="flex-shrink-0">{item.icon}</span>
            )}
            <span>{item.label}</span>
            {isActive && (
              <span className="sr-only">(current section)</span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
