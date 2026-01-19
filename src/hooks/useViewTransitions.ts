/*
 * VIEW TRANSITIONS API - Enterprise 2026
 * 
 * Smooth page transitions using native browser API
 * Fallback graceful per browser non supportati
 */

'use client';

import { useRouter } from '@/libs/i18nNavigation';
import { useCallback } from 'react';

export type ViewTransitionOptions = {
  duration?: number;
  easing?: string;
  name?: string;
};

export const useViewTransitions = () => {
  const router = useRouter();

  // Check if View Transitions API is supported
  const isSupported = useCallback(() => {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  }, []);

  // Navigate with smooth transition
  const navigateWithTransition = useCallback(
    async (href: string, options: ViewTransitionOptions = {}) => {
      const { duration = 300, easing = 'ease-out', name = 'page-transition' } = options;

      if (!isSupported()) {
        // Fallback: simple navigation without transition
        router.push(href);
        return;
      }

      try {
        // Set CSS custom properties for transition
        document.documentElement.style.setProperty('--transition-duration', `${duration}ms`);
        document.documentElement.style.setProperty('--transition-easing', easing);
        document.documentElement.style.setProperty('--transition-name', name);

        // Start view transition using any type to avoid TypeScript conflicts
        const startTransition = (document as any).startViewTransition;
        if (startTransition) {
          const transition = startTransition(() => {
            router.push(href);
          });
          await transition.finished;
        } else {
          router.push(href);
        }
      } catch (error) {
        console.warn('View transition failed, falling back to normal navigation:', error);
        router.push(href);
      }
    },
    [router, isSupported],
  );

  // Preload page for instant transitions
  const preloadPage = useCallback(
    (href: string) => {
      if (typeof window !== 'undefined') {
        // Next.js automatic prefetching handles this
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    },
    [],
  );

  return {
    navigateWithTransition,
    preloadPage,
    isSupported: isSupported(),
  };
};