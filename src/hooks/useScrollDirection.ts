/*
 * USE SCROLL DIRECTION - 2026 Best Practices
 *
 * Hook for detecting scroll direction following Nielsen Norman Group guidelines:
 * - Hide header on scroll down (preserve reading space)
 * - Show header on scroll up (access navigation)
 * - Smooth 300-400ms animations
 * - Small threshold to prevent jank
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

export type UseScrollDirectionOptions = {
  threshold?: number; // Minimum pixels to scroll before changing direction
};

export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 10 } = options; // Minimum pixels to prevent jank

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollDifference = scrollY - lastScrollY.current;

    // Update scrolled state
    setIsScrolled(scrollY > 10);

    // Only update direction if we've scrolled past the threshold
    if (Math.abs(scrollDifference) > threshold) {
      if (scrollDifference > 0) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollY.current = scrollY;
    }

    ticking.current = false;
  }, [threshold]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollDirection);
      ticking.current = true;
    }
  }, [updateScrollDirection]);

  useEffect(() => {
    // Set initial values
    lastScrollY.current = window.scrollY;
    setIsScrolled(window.scrollY > 10);

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    scrollDirection,
    isScrolled,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
  };
};
