/**
 * SkipLink Component - Accessibility
 * 
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to main content.
 * 
 * Requirements: 5.4, 5.5 - Focus management and skip links
 * WCAG 2.4.1 - Bypass Blocks
 * 
 * @module shared/ui/SkipLink
 */

'use client'

import { cn } from './utils'

interface SkipLinkProps {
  /** Target element ID (without #) */
  targetId?: string
  /** Link text */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * SkipLink - Accessible skip navigation link
 * 
 * - Hidden by default (sr-only)
 * - Visible on focus with high z-index
 * - Allows keyboard users to skip to main content
 * 
 * @example
 * ```tsx
 * // In layout, as first child
 * <SkipLink targetId="main-content" />
 * 
 * // Then in main content area
 * <main id="main-content">...</main>
 * ```
 */
export function SkipLink({
  targetId = 'main-content',
  children = 'Salta al contenuto principale',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Hidden by default (screen reader only)
        'sr-only',
        // Visible on focus
        'focus:not-sr-only',
        'focus:absolute',
        'focus:top-4',
        'focus:left-4',
        'focus:z-[9999]',
        // Styling
        'focus:px-4',
        'focus:py-2',
        'focus:bg-primary',
        'focus:text-primary-foreground',
        'focus:rounded-lg',
        'focus:font-medium',
        'focus:text-sm',
        // Focus ring
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'focus:ring-primary/50',
        // Animation
        'focus:animate-in',
        'focus:fade-in',
        'focus:duration-150',
        className
      )}
    >
      {children}
    </a>
  )
}

export default SkipLink
