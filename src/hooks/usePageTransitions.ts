/*
 * PAGE TRANSITIONS ENTERPRISE 2026
 *
 * Sistema avanzato di transizioni basato su GSAP + View Transitions API
 * Ispirato a Linear, Stripe, GitHub per esperienza premium
 */

'use client';

import { useCallback, useState } from 'react';

import { useRouter } from '@/libs/i18nNavigation';

export type TransitionType = 'fade' | 'slide' | 'scale' | 'enterprise';

export type PageTransitionOptions = {
  type?: TransitionType;
  duration?: number;
  easing?: string;
  stagger?: boolean;
  preload?: boolean;
};

export const usePageTransitions = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if View Transitions API is supported
  const isViewTransitionsSupported = useCallback(() => {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  }, []);

  // Preload page for instant navigation
  const preloadPage = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  // Enterprise fade transition with stagger
  const enterpriseFadeTransition = useCallback(async (href: string) => {
    setIsTransitioning(true);

    // Phase 1: Exit animation
    const mainContent = document.querySelector('main');

    if (mainContent) {
      mainContent.style.transition = 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)';
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(8px) scale(0.98)';
    }

    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 200));

    // Phase 2: Navigate
    router.push(href);

    // Phase 3: Enter animation (will be handled by new page)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  }, [router]);

  // Scale transition for premium feel
  const scaleTransition = useCallback(async (href: string) => {
    setIsTransitioning(true);

    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.transition = 'all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'scale(0.95)';
    }

    await new Promise(resolve => setTimeout(resolve, 150));
    router.push(href);

    setTimeout(() => setIsTransitioning(false), 300);
  }, [router]);

  // Slide transition for directional navigation
  const slideTransition = useCallback(async (href: string, direction: 'left' | 'right' = 'right') => {
    setIsTransitioning(true);

    const mainContent = document.querySelector('main');
    if (mainContent) {
      const translateX = direction === 'right' ? '-20px' : '20px';
      mainContent.style.transition = 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)';
      mainContent.style.opacity = '0';
      mainContent.style.transform = `translateX(${translateX})`;
    }

    await new Promise(resolve => setTimeout(resolve, 125));
    router.push(href);

    setTimeout(() => setIsTransitioning(false), 250);
  }, [router]);

  // Main navigation function with intelligent transition selection
  const navigateWithTransition = useCallback(async (
    href: string,
    options: PageTransitionOptions = {},
  ) => {
    const {
      type = 'enterprise',
      preload = true,
    } = options;

    // Preload if requested
    if (preload) {
      preloadPage(href);
    }

    // Add loading class to body for global styles
    document.body.classList.add('page-transitioning');

    try {
      // Use View Transitions API if supported, otherwise fallback
      if (isViewTransitionsSupported() && type === 'fade') {
        const startTransition = document.startViewTransition;
        if (startTransition) {
          const transition = startTransition(() => {
            router.push(href);
          });
          await transition.finished;
        } else {
          await enterpriseFadeTransition(href);
        }
      } else {
        // Custom transitions for better control
        switch (type) {
          case 'enterprise':
          case 'fade':
            await enterpriseFadeTransition(href);
            break;
          case 'scale':
            await scaleTransition(href);
            break;
          case 'slide':
            await slideTransition(href);
            break;
          default:
            await enterpriseFadeTransition(href);
        }
      }
    } catch (error) {
      console.warn('Page transition failed, falling back to normal navigation:', error);
      router.push(href);
    } finally {
      document.body.classList.remove('page-transitioning');
    }
  }, [router, enterpriseFadeTransition, scaleTransition, slideTransition, preloadPage, isViewTransitionsSupported]);

  // Enter animation for new pages
  const animatePageEnter = useCallback(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      // Reset any existing styles
      mainContent.style.opacity = '0';
      mainContent.style.transform = 'translateY(12px) scale(0.98)';
      mainContent.style.transition = 'none';

      // Force reflow
      mainContent.offsetHeight;

      // Animate in
      mainContent.style.transition = 'opacity 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      mainContent.style.opacity = '1';
      mainContent.style.transform = 'translateY(0) scale(1)';

      // Cleanup after animation
      setTimeout(() => {
        mainContent.style.transition = '';
        mainContent.style.transform = '';
        mainContent.style.opacity = '';
      }, 300);
    }
  }, []);

  return {
    navigateWithTransition,
    animatePageEnter,
    isTransitioning,
    isViewTransitionsSupported: isViewTransitionsSupported(),
    preloadPage,
  };
};
