/**
 * Focus Trap Hook - Tradelia 2026
 * 
 * Gestisce il focus trap per modal, sidebar e altri overlay
 * Conforme WCAG 2.2 per accessibilità
 */

import { useEffect, useRef, useCallback } from 'react'

interface UseFocusTrapOptions {
  isActive: boolean
  restoreFocus?: boolean
  autoFocus?: boolean
  escapeDeactivates?: boolean
  onEscape?: (() => void) | undefined
}

export function useFocusTrap({
  isActive,
  restoreFocus = true,
  autoFocus = true,
  escapeDeactivates = true,
  onEscape
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  // Get focusable elements
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        // Check if element is visible and not hidden
        const htmlElement = element as HTMLElement
        const style = window.getComputedStyle(htmlElement)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          !htmlElement.hasAttribute('hidden') &&
          htmlElement.offsetWidth > 0 &&
          htmlElement.offsetHeight > 0
        )
      }) as HTMLElement[]
  }, [])

  // Handle tab key navigation
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !containerRef.current) return

    const focusableElements = getFocusableElements(containerRef.current)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }, [getFocusableElements])

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && escapeDeactivates) {
      event.preventDefault()
      onEscape?.()
    }
  }, [escapeDeactivates, onEscape])

  // Handle click outside (for mobile sidebar)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node) &&
      onEscape
    ) {
      onEscape()
    }
  }, [onEscape])

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Store previous focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    // Get focusable elements
    const focusableElements = getFocusableElements(container)
    
    if (focusableElements.length > 0) {
      firstFocusableRef.current = focusableElements[0] || null
      lastFocusableRef.current = focusableElements[focusableElements.length - 1] || null

      // Auto focus first element
      if (autoFocus) {
        // Small delay to ensure element is rendered
        setTimeout(() => {
          firstFocusableRef.current?.focus()
        }, 10)
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)

      // Restore previous focus
      if (restoreFocus && previousFocusRef.current) {
        // Small delay to ensure the element is focusable
        setTimeout(() => {
          previousFocusRef.current?.focus()
        }, 10)
      }
    }
  }, [
    isActive,
    restoreFocus,
    autoFocus,
    getFocusableElements,
    handleTabKey,
    handleEscapeKey,
    handleClickOutside
  ])

  return {
    containerRef,
    firstFocusableRef,
    lastFocusableRef
  }
}

// Specialized hook for sidebar
export function useSidebarFocusTrap(isOpen: boolean, onClose: () => void) {
  return useFocusTrap({
    isActive: isOpen,
    restoreFocus: true,
    autoFocus: true,
    escapeDeactivates: true,
    onEscape: onClose
  })
}

// Specialized hook for modal
export function useModalFocusTrap(isOpen: boolean, onClose?: () => void) {
  return useFocusTrap({
    isActive: isOpen,
    restoreFocus: true,
    autoFocus: true,
    escapeDeactivates: true,
    onEscape: onClose
  })
}

// Specialized hook for dropdown/popover
export function useDropdownFocusTrap(isOpen: boolean, onClose?: () => void) {
  return useFocusTrap({
    isActive: isOpen,
    restoreFocus: true,
    autoFocus: false, // Don't auto-focus for dropdowns
    escapeDeactivates: true,
    onEscape: onClose
  })
}