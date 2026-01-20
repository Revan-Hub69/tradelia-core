/*
 * NAVIGATION LOADING STATES - Enterprise 2026
 *
 * Gestisce stati di loading durante navigazione per UX premium
 * Maschera i tempi di caricamento di Next.js con feedback appropriato
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from '@/libs/i18nNavigation';

export const useNavigationLoading = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // Navigate with proper loading states
  const navigateWithLoading = useCallback(async (href: string, source: 'sidebar' | 'bottom' = 'sidebar') => {
    // Don't navigate if already navigating
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);
    setNavigationTarget(href);

    try {
      // Add loading class to body for global loading styles
      document.body.classList.add('navigation-loading');

      // Faster, more responsive visual feedback
      const mainContent = document.querySelector('main');
      if (mainContent) {
        if (source === 'sidebar') {
          // Sidebar: quick subtle fade for desktop feel
          mainContent.style.transition = 'opacity 120ms ease-out';
          mainContent.style.opacity = '0.7';
        } else {
          // Bottom nav: quick but noticeable for mobile feel
          mainContent.style.transition = 'opacity 100ms ease-out, transform 100ms ease-out';
          mainContent.style.opacity = '0.5';
          mainContent.style.transform = 'scale(0.99)';
        }
      }

      // Minimal delay - just enough to show loading state
      await new Promise(resolve => setTimeout(resolve, 50));

      // Navigate
      if (source === 'sidebar') {
        router.push(href);
      } else {
        // Bottom nav uses window.location for reliability
        window.location.href = href;
      }

      // Quick reset after navigation starts
      setTimeout(() => {
        setIsNavigating(false);
        setNavigationTarget(null);
        document.body.classList.remove('navigation-loading');

        if (mainContent) {
          mainContent.style.opacity = '';
          mainContent.style.transform = '';
          mainContent.style.transition = '';
        }
      }, 150);
    } catch (error) {
      console.error('Navigation failed:', error);
      setIsNavigating(false);
      setNavigationTarget(null);
      document.body.classList.remove('navigation-loading');

      // Fallback navigation
      window.location.href = href;
    }
  }, [router, isNavigating]);

  // Reset loading state on unmount
  useEffect(() => {
    return () => {
      setIsNavigating(false);
      setNavigationTarget(null);
      document.body.classList.remove('navigation-loading');
    };
  }, []);

  return {
    navigateWithLoading,
    isNavigating,
    navigationTarget,
  };
};
