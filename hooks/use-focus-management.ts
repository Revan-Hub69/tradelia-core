import { useRef, useCallback } from 'react'

/**
 * Hook for managing focus in multi-step forms and complex UIs
 * Helps prevent autofocus issues and provides controlled focus management
 */
export function useFocusManagement() {
  const focusTimeoutRef = useRef<NodeJS.Timeout>()

  const manageFocus = useCallback((
    element: HTMLElement | null, 
    delay: number = 100
  ) => {
    // Clear any existing timeout
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current)
    }

    // Set focus with delay to ensure DOM is ready
    focusTimeoutRef.current = setTimeout(() => {
      if (element && document.contains(element)) {
        element.focus({ preventScroll: true })
      }
    }, delay)
  }, [])

  const focusById = useCallback((id: string, delay: number = 100) => {
    const element = document.getElementById(id)
    manageFocus(element, delay)
  }, [manageFocus])

  const focusFirstFocusable = useCallback((
    container: HTMLElement | null, 
    delay: number = 100
  ) => {
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    manageFocus(firstElement, delay)
  }, [manageFocus])

  const clearFocusTimeout = useCallback(() => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current)
    }
  }, [])

  return {
    manageFocus,
    focusById,
    focusFirstFocusable,
    clearFocusTimeout
  }
}

/**
 * Hook for managing focus in step-based flows
 * Provides specific patterns for multi-step forms
 */
export function useStepFocusManagement() {
  const { manageFocus, focusFirstFocusable } = useFocusManagement()

  const focusStepContainer = useCallback((
    containerRef: React.RefObject<HTMLElement>,
    delay: number = 150
  ) => {
    if (containerRef.current) {
      manageFocus(containerRef.current, delay)
    }
  }, [manageFocus])

  const focusFirstOption = useCallback((
    containerRef: React.RefObject<HTMLElement>,
    delay: number = 150
  ) => {
    if (containerRef.current) {
      focusFirstFocusable(containerRef.current, delay)
    }
  }, [focusFirstFocusable])

  const focusBackButton = useCallback((
    buttonRef: React.RefObject<HTMLButtonElement>,
    delay: number = 150
  ) => {
    if (buttonRef.current) {
      manageFocus(buttonRef.current, delay)
    }
  }, [manageFocus])

  return {
    focusStepContainer,
    focusFirstOption,
    focusBackButton
  }
}