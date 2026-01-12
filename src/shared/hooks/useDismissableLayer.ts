/**
 * useDismissableLayer Hook - Tradelia 2026
 * 
 * Handles ESC key and click outside for dismissable overlays (modals, drawers, popovers).
 * Restores focus to previous element on close.
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

import { useEffect, useRef, useCallback, type RefObject } from 'react'

interface UseDismissableLayerOptions {
  /** Close on ESC key (default: true) */
  escapeKey?: boolean
  /** Close on click outside (default: true) */
  clickOutside?: boolean
  /** Restore focus on close (default: true) */
  restoreFocus?: boolean
}

export function useDismissableLayer<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onDismiss: () => void,
  options: UseDismissableLayerOptions = {}
): RefObject<T | null> {
  const {
    escapeKey = true,
    clickOutside = true,
    restoreFocus = true,
  } = options

  const layerRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Store previous focus when opening
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  // Restore focus when closing
  useEffect(() => {
    if (!isOpen && restoreFocus && previousFocusRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        previousFocusRef.current?.focus()
        previousFocusRef.current = null
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen, restoreFocus])

  // ESC key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && escapeKey) {
      e.preventDefault()
      e.stopPropagation()
      onDismiss()
    }
  }, [escapeKey, onDismiss])

  // Click outside handler
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!clickOutside) return
    
    const layer = layerRef.current
    if (!layer) return

    const target = e.target as Node
    
    // Check if click is outside the layer
    if (!layer.contains(target)) {
      onDismiss()
    }
  }, [clickOutside, onDismiss])

  // Attach/detach event listeners
  useEffect(() => {
    if (!isOpen) return

    // Add listeners with a small delay to avoid immediate trigger
    const timer = setTimeout(() => {
      if (escapeKey) {
        document.addEventListener('keydown', handleKeyDown)
      }
      if (clickOutside) {
        document.addEventListener('mousedown', handleClickOutside)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, escapeKey, clickOutside, handleKeyDown, handleClickOutside])

  return layerRef
}

/**
 * Hook for focus trapping within a layer
 * Use with useDismissableLayer for complete modal behavior
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean
): RefObject<T | null> {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!isOpen) return

    const container = containerRef.current
    if (!container) return

    const focusableSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement && lastElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement && firstElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Focus first focusable element when opening
    const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector)
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return containerRef
}
