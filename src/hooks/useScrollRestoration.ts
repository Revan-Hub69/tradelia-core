/*
 * SCROLL RESTORATION - Apple/Linear/Stripe Level 2026
 *
 * Gestione intelligente scroll position per SPA navigation
 * Policy: tab switch → top, back button → restore
 */

import { useEffect, useRef } from 'react';

import { usePathname } from '@/libs/i18nNavigation';

type ScrollPosition = {
  x: number;
  y: number;
  timestamp: number;
};

type ScrollHistory = {
  [path: string]: ScrollPosition;
};

export const useScrollRestoration = () => {
  const pathname = usePathname();
  const scrollHistory = useRef<ScrollHistory>({});
  const isNavigatingBack = useRef(false);

  // Save scroll position before navigation
  const saveScrollPosition = (path: string) => {
    scrollHistory.current[path] = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now(),
    };
  };

  // Restore scroll position
  const restoreScrollPosition = (path: string) => {
    const saved = scrollHistory.current[path];
    if (saved) {
      // Use requestAnimationFrame for smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          left: saved.x,
          top: saved.y,
          behavior: 'instant',
        });
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
  };

  // Detect back navigation
  useEffect(() => {
    const handlePopState = () => {
      isNavigatingBack.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle scroll restoration on route change
  useEffect(() => {
    const currentPath = pathname;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isNavigatingBack.current) {
        // Back navigation: restore scroll
        restoreScrollPosition(currentPath);
        isNavigatingBack.current = false;
      } else {
        // Forward navigation: scroll to top
        scrollToTop();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Save scroll position before leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(pathname);
    };

    // Save on route change
    const handleRouteChange = () => {
      saveScrollPosition(pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen for navigation events
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      handleRouteChange();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      handleRouteChange();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [pathname]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTop,
  };
};
