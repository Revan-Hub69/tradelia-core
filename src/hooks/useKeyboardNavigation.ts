'use client';

import { useEffect, useRef } from 'react';

type NavigationDirection = 'up' | 'down' | 'left' | 'right';
type KeyboardHandler = (direction: NavigationDirection) => void;

type KeyboardNavigationOptions = {
  enableArrowKeys?: boolean;
  enableTabNavigation?: boolean;
  enableEscapeKey?: boolean;
  enableEnterKey?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowKey?: KeyboardHandler;
  trapFocus?: boolean;
};

/**
 * Hook for comprehensive keyboard navigation support
 *
 * Features:
 * - Arrow key navigation
 * - Tab navigation with focus trapping
 * - Escape key handling
 * - Enter key handling
 * - Focus management
 * - Accessibility compliance
 */
export const useKeyboardNavigation = (
  options: KeyboardNavigationOptions = {},
) => {
  const {
    enableArrowKeys = true,
    enableTabNavigation = true,
    enableEscapeKey = true,
    enableEnterKey = true,
    onEscape,
    onEnter,
    onArrowKey,
    trapFocus = false,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Arrow key navigation
      if (enableArrowKeys && onArrowKey) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            onArrowKey('up');
            break;
          case 'ArrowDown':
            event.preventDefault();
            onArrowKey('down');
            break;
          case 'ArrowLeft':
            event.preventDefault();
            onArrowKey('left');
            break;
          case 'ArrowRight':
            event.preventDefault();
            onArrowKey('right');
            break;
        }
      }

      // Escape key
      if (enableEscapeKey && event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
      }

      // Enter key
      if (enableEnterKey && event.key === 'Enter' && onEnter) {
        event.preventDefault();
        onEnter();
      }

      // Tab navigation with focus trapping
      if (enableTabNavigation && trapFocus && event.key === 'Tab') {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enableArrowKeys,
    enableTabNavigation,
    enableEscapeKey,
    enableEnterKey,
    onEscape,
    onEnter,
    onArrowKey,
    trapFocus,
  ]);

  return containerRef;
};

/**
 * Hook specifically for dashboard section navigation via keyboard
 */
export const useDashboardKeyboardNavigation = (
  currentSection: 'overview' | 'paths' | 'progress' | 'settings',
  onSectionChange: (section: 'overview' | 'paths' | 'progress' | 'settings') => void,
  onSettingsOpen?: () => void,
) => {
  const sections: Array<'overview' | 'paths' | 'progress' | 'settings'> = [
    'overview',
    'paths',
    'progress',
    'settings',
  ];

  const handleArrowKey = (direction: NavigationDirection) => {
    const currentIndex = sections.indexOf(currentSection);

    switch (direction) {
      case 'left':
        if (currentIndex > 0) {
          const prevSection = sections[currentIndex - 1];
          if (prevSection) {
            onSectionChange(prevSection);
          }
        }
        break;
      case 'right':
        if (currentIndex < sections.length - 1) {
          const nextSection = sections[currentIndex + 1];
          if (nextSection) {
            onSectionChange(nextSection);
          }
        }
        break;
      case 'up':
        // Navigate to first section
        onSectionChange('overview');
        break;
      case 'down':
        // Navigate to last section
        onSectionChange('settings');
        break;
    }
  };

  const handleEnter = () => {
    if (currentSection === 'settings' && onSettingsOpen) {
      onSettingsOpen();
    }
  };

  return useKeyboardNavigation({
    enableArrowKeys: true,
    enableEnterKey: true,
    onArrowKey: handleArrowKey,
    onEnter: handleEnter,
  });
};

/**
 * Hook for modal/dialog keyboard navigation
 */
export const useModalKeyboardNavigation = (
  isOpen: boolean,
  onClose: () => void,
) => {
  return useKeyboardNavigation({
    enableEscapeKey: isOpen,
    enableTabNavigation: isOpen,
    trapFocus: isOpen,
    onEscape: onClose,
  });
};
