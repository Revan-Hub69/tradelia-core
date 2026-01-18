'use client';

import { useEffect, useRef } from 'react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';
type SwipeCallback = (direction: SwipeDirection) => void;

interface SwipeOptions {
  threshold?: number; // Minimum distance for swipe (default: 50px)
  velocity?: number;  // Minimum velocity for swipe (default: 0.3)
  preventScroll?: boolean; // Prevent default scroll behavior
}

/**
 * Hook for handling swipe gestures on mobile devices
 * 
 * Features:
 * - Touch-based swipe detection
 * - Configurable threshold and velocity
 * - Optimized for performance
 * - Prevents accidental triggers
 */
export const useSwipeNavigation = (
  callback: SwipeCallback,
  options: SwipeOptions = {}
) => {
  const {
    threshold = 50,
    velocity = 0.3,
    preventScroll = false,
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (preventScroll) {
        e.preventDefault();
      }
      
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Calculate distance and velocity
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const swipeVelocity = distance / deltaTime;

      // Check if swipe meets threshold requirements
      if (distance < threshold || swipeVelocity < velocity) {
        touchStartRef.current = null;
        return;
      }

      // Determine swipe direction
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      let direction: SwipeDirection;
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up';
      }

      callback(direction);
      touchStartRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll && touchStartRef.current) {
        e.preventDefault();
      }
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [callback, threshold, velocity, preventScroll]);

  return elementRef;
};

/**
 * Hook specifically for dashboard section navigation
 */
export const useDashboardSwipeNavigation = (
  currentSection: 'overview' | 'paths' | 'progress' | 'settings',
  onSectionChange: (section: 'overview' | 'paths' | 'progress' | 'settings') => void
) => {
  const sections: Array<'overview' | 'paths' | 'progress' | 'settings'> = [
    'overview',
    'paths', 
    'progress',
    'settings'
  ];

  const handleSwipe = (direction: SwipeDirection) => {
    const currentIndex = sections.indexOf(currentSection);
    
    if (direction === 'left' && currentIndex < sections.length - 1) {
      // Swipe left = next section
      onSectionChange(sections[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      // Swipe right = previous section
      onSectionChange(sections[currentIndex - 1]);
    }
  };

  return useSwipeNavigation(handleSwipe, {
    threshold: 80,
    velocity: 0.4,
    preventScroll: false,
  });
};