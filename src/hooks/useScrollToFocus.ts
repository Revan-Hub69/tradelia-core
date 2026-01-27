/**
 * SCROLL TO FOCUS HOOK - Accessibility
 * Best Practice 2026: Auto-scroll to focused element
 */

import { useEffect, useRef } from 'react';

type UseScrollToFocusOptions = {
  enabled?: boolean;
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  offset?: number;
};

/**
 * Automatically scroll to focused element
 * Improves keyboard navigation UX
 */
export function useScrollToFocus({
  enabled = true,
  behavior = 'smooth',
  block = 'nearest',
  inline = 'nearest',
  offset = 0,
}: UseScrollToFocusOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;

      // Check if target is within container
      if (!container.contains(target)) {
        return;
      }

      // Wait for next frame to ensure layout is updated
      requestAnimationFrame(() => {
        // Get element position
        const rect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Check if element is already visible
        const isVisible =
          rect.top >= containerRect.top - offset &&
          rect.bottom <= containerRect.bottom + offset &&
          rect.left >= containerRect.left - offset &&
          rect.right <= containerRect.right + offset;

        if (!isVisible) {
          // Scroll to element
          target.scrollIntoView({
            behavior,
            block,
            inline,
          });

          // Apply offset if needed
          if (offset !== 0) {
            const scrollParent = getScrollParent(target);
            if (scrollParent) {
              scrollParent.scrollTop -= offset;
            }
          }
        }
      });
    };

    // Add event listener
    container.addEventListener('focusin', handleFocusIn);

    // Cleanup
    return () => {
      container.removeEventListener('focusin', handleFocusIn);
    };
  }, [enabled, behavior, block, inline, offset]);

  return containerRef;
}

/**
 * Get scrollable parent element
 */
function getScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const { overflow, overflowY } = window.getComputedStyle(parent);

    if (
      overflow === 'auto' ||
      overflow === 'scroll' ||
      overflowY === 'auto' ||
      overflowY === 'scroll'
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return document.documentElement;
}
