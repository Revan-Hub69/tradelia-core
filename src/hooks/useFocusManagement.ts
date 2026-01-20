/*
 * FOCUS MANAGEMENT - Enterprise 2026
 *
 * Sistema completo per gestione focus keyboard e screen reader
 * Standard WCAG AAA + best practice enterprise
 */

import { useCallback, useEffect, useRef } from 'react';

// Focus trap per modal/dropdown
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return;
    }

    // Salva focus precedente
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Trova elementi focusabili
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus sul primo elemento
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Ripristina focus precedente
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
};

// Roving tabindex per navigation
export const useRovingTabindex = <T extends HTMLElement>(
  items: T[],
  orientation: 'horizontal' | 'vertical' = 'horizontal',
) => {
  const activeIndexRef = useRef(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    const isHorizontal = orientation === 'horizontal';

    let newIndex = activeIndexRef.current;

    switch (key) {
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        e.preventDefault();
        newIndex = newIndex > 0 ? newIndex - 1 : items.length - 1;
        break;
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        e.preventDefault();
        newIndex = newIndex < items.length - 1 ? newIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    // Aggiorna tabindex
    items.forEach((item, index) => {
      item.tabIndex = index === newIndex ? 0 : -1;
    });

    // Focus nuovo elemento
    items[newIndex]?.focus();
    activeIndexRef.current = newIndex;
  }, [items, orientation]);

  const initializeTabindex = useCallback((activeIndex = 0) => {
    items.forEach((item, index) => {
      item.tabIndex = index === activeIndex ? 0 : -1;
      item.addEventListener('keydown', handleKeyDown);
    });
    activeIndexRef.current = activeIndex;

    return () => {
      items.forEach((item) => {
        item.removeEventListener('keydown', handleKeyDown);
      });
    };
  }, [items, handleKeyDown]);

  return { initializeTabindex, activeIndex: activeIndexRef.current };
};

// Skip links per accessibility
export const useSkipLinks = () => {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + S per skip links
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        skipLinksRef.current?.querySelector('a')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return skipLinksRef;
};

// Focus restoration per SPA navigation
export const useFocusRestoration = () => {
  const focusHistoryRef = useRef<HTMLElement[]>([]);

  const saveFocus = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      focusHistoryRef.current.push(activeElement);
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocus = focusHistoryRef.current.pop();
    if (lastFocus && document.contains(lastFocus)) {
      lastFocus.focus();
    }
  }, []);

  const clearHistory = useCallback(() => {
    focusHistoryRef.current = [];
  }, []);

  return { saveFocus, restoreFocus, clearHistory };
};

// Announce per screen reader
export const useAnnouncer = () => {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) {
      return;
    }

    announcerRef.current.setAttribute('aria-live', priority);
    announcerRef.current.textContent = message;

    // Clear dopo 1 secondo per evitare spam
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  return { announcerRef, announce };
};
