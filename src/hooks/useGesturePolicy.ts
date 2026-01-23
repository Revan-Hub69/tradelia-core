/*
 * GESTURE POLICY HOOK - Enterprise Touch Optimization
 *
 * Prevents common mobile browser gestures that interfere with app UX
 * Configurable policies for different interaction contexts
 */

'use client';

import { useEffect, useRef } from 'react';

export type GesturePolicyOptions = {
  preventPullToRefresh?: boolean;
  preventSwipeBack?: boolean;
  preventOverscroll?: boolean;
  preventZoom?: boolean;
  preventSelection?: boolean;
};

export const useGesturePolicy = (options: GesturePolicyOptions = {}) => {
  const {
    preventPullToRefresh = false,
    preventSwipeBack = false,
    preventOverscroll = false,
    preventZoom = false,
    preventSelection = false,
  } = options;

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    let preventPull: ((e: TouchEvent) => void) | undefined;

    // Prevent pull-to-refresh
    if (preventPullToRefresh) {
      preventPull = (e: TouchEvent) => {
        const touch = e.touches[0];
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // If at top and pulling down, prevent
        if (scrollTop === 0 && touch && touch.clientY > touch.clientX) {
          e.preventDefault();
        }
      };

      element.addEventListener('touchstart', preventPull, { passive: false });
      element.addEventListener('touchmove', preventPull, { passive: false });
    }

    // Prevent overscroll bounce
    if (preventOverscroll) {
      element.style.overscrollBehavior = 'contain';
    }

    // Prevent text selection
    if (preventSelection) {
      element.style.userSelect = 'none';
      (element.style as any).webkitUserSelect = 'none';
      (element.style as any).webkitTouchCallout = 'none';
    }

    // Prevent zoom on double tap
    if (preventZoom) {
      element.style.touchAction = 'manipulation';
    }

    return () => {
      if (preventPullToRefresh && preventPull) {
        element.removeEventListener('touchstart', preventPull);
        element.removeEventListener('touchmove', preventPull);
      }
    };
  }, [preventPullToRefresh, preventSwipeBack, preventOverscroll, preventZoom, preventSelection]);

  return elementRef;
};

// Touch optimization hook
export const useTouchOptimization = () => {
  useEffect(() => {
    // Global touch optimizations
    document.body.style.touchAction = 'manipulation';
    document.body.style.userSelect = 'none';
    (document.body.style as any).webkitUserSelect = 'none';
    (document.body.style as any).webkitTouchCallout = 'none';

    return () => {
      // Cleanup on unmount
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      (document.body.style as any).webkitUserSelect = '';
      (document.body.style as any).webkitTouchCallout = '';
    };
  }, []);
};

// Haptic feedback simulation
export const useHapticFeedback = () => {
  const light = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const medium = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const heavy = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  };

  const success = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  };

  const error = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 25, 50]);
    }
  };

  return { light, medium, heavy, success, error };
};
