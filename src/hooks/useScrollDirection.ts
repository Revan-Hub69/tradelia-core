/*
 * USE SCROLL DIRECTION - 2026 Real Applications Research
 *
 * Based on real implementations from Twitter, Medium, TutsPlus
 * - Persistent state (header stays hidden until scroll up)
 * - Proper threshold to prevent jank
 * - GPU-optimized animations
 * - Cross-browser compatibility
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down' | 'idle';

export type UseScrollDirectionOptions = {
  threshold?: number; // Minimum pixels to scroll before changing direction
};

export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 15 } = options; // Increased threshold based on research

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('idle');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    
    // Update scrolled state
    setIsScrolled(scrollY > 10);
    
    // Always show header at top of page
    if (scrollY <= 0) {
      setIsHeaderVisible(true);
      setScrollDirection('idle');
      lastScrollY.current = scrollY;
      ticking.current = false;
      return;
    }

    const difference = scrollY - lastScrollY.current;
    
    // Only update if we've scrolled past the threshold
    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        // Scrolling down - hide header (persistent state)
        setScrollDirection('down');
        setIsHeaderVisible(false);
      } else {
        // Scrolling up - show header
        setScrollDirection('up');
        setIsHeaderVisible(true);
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

    // Add scroll listener with passive for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    scrollDirection,
    isScrolled,
    isHeaderVisible, // New: persistent header visibility state
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
    isIdle: scrollDirection === 'idle',
  };
};
