/**
 * ACCESSIBILITY HOOK - WCAG 2.1 AA Enterprise 2026
 *
 * Hook per gestione completa dell'accessibilità:
 * - Focus management
 * - Screen reader announcements
 * - Keyboard navigation
 * - ARIA attributes management
 * - Live regions
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AnnouncementPriority = 'polite' | 'assertive';

export type FocusTrapOptions = {
  initialFocus?: HTMLElement | null;
  returnFocus?: HTMLElement | null;
  allowOutsideClick?: boolean;
};

export type AccessibilityPreferences = {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersReducedData: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
};

// ============================================================================
// ACCESSIBILITY HOOK
// ============================================================================

export const useAccessibility = () => {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersReducedData: false,
    colorScheme: 'auto',
  });

  const liveRegionRef = useRef<HTMLDivElement | null>(null);
  const focusHistoryRef = useRef<HTMLElement[]>([]);

  // Initialize live region for announcements
  useEffect(() => {
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only live-region';
      liveRegion.id = 'accessibility-live-region';
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardNavigation(true);
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false);
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Monitor accessibility preferences
  useEffect(() => {
    const updatePreferences = () => {
      setAccessibilityPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      });
    };

    updatePreferences();

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-reduced-data: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    if (!liveRegionRef.current) {
      return;
    }

    liveRegionRef.current.setAttribute('aria-live', priority);
    liveRegionRef.current.textContent = message;

    // Clear the message after a short delay to allow for re-announcements
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  // Focus management
  const focusElement = useCallback((element: HTMLElement | null, options?: { preventScroll?: boolean }) => {
    if (!element) {
      return;
    }

    // Store current focus in history
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== element) {
      focusHistoryRef.current.push(currentFocus);
    }

    element.focus({ preventScroll: options?.preventScroll });
  }, []);

  // Return focus to previous element
  const returnFocus = useCallback(() => {
    const previousElement = focusHistoryRef.current.pop();
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  }, []);

  // Focus trap for modals and overlays
  const createFocusTrap = useCallback((container: HTMLElement, options: FocusTrapOptions = {}) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus initial element
    if (options.initialFocus) {
      focusElement(options.initialFocus);
    } else if (firstElement) {
      focusElement(firstElement);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        returnFocus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (options.allowOutsideClick && !container.contains(event.target as Node)) {
        returnFocus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    if (options.allowOutsideClick) {
      document.addEventListener('click', handleClickOutside);
    }

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (options.allowOutsideClick) {
        document.removeEventListener('click', handleClickOutside);
      }

      if (options.returnFocus) {
        focusElement(options.returnFocus);
      } else {
        returnFocus();
      }
    };
  }, [focusElement, returnFocus]);

  // Get accessible label for element
  const getAccessibleLabel = useCallback((element: HTMLElement): string => {
    // Check aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }

    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) {
        return labelElement.textContent || '';
      }
    }

    // Check associated label
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const id = element.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          return label.textContent || '';
        }
      }
    }

    // Fallback to text content
    return element.textContent || '';
  }, []);

  // Generate unique ID for accessibility
  const generateId = useCallback((prefix: string = 'accessibility'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Check if element is visible to screen readers
  const isVisibleToScreenReader = useCallback((element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);

    return !(
      style.display === 'none'
      || style.visibility === 'hidden'
      || element.getAttribute('aria-hidden') === 'true'
      || element.hasAttribute('hidden')
    );
  }, []);

  // Get all focusable elements in container
  const getFocusableElements = useCallback((container: HTMLElement = document.body): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="menuitem"]:not([aria-disabled="true"])',
      '[role="tab"]:not([aria-disabled="true"])',
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];

    return elements.filter((element) => {
      return isVisibleToScreenReader(element) && element.offsetParent !== null;
    });
  }, [isVisibleToScreenReader]);

  // Navigate with arrow keys
  const handleArrowNavigation = useCallback((
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' | 'both' = 'both',
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = (currentIndex + 1) % elements.length;
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = (currentIndex + 1) % elements.length;
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        }
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = elements.length - 1;
        break;
    }

    if (newIndex !== currentIndex && elements[newIndex]) {
      focusElement(elements[newIndex] || null);
      return newIndex;
    }

    return currentIndex;
  }, [focusElement]);

  return {
    isKeyboardNavigation,
    accessibilityPreferences,
    announce,
    focusElement,
    returnFocus,
    createFocusTrap,
    getAccessibleLabel,
    generateId,
    isVisibleToScreenReader,
    getFocusableElements,
    handleArrowNavigation,
  };
};

export default useAccessibility;
