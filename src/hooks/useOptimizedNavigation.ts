/*
 * OPTIMIZED NAVIGATION HOOK - React 19 + Concurrent Features 2026
 *
 * Implementa navigation performance-first con startTransition e useDeferredValue
 * Elimina DOM manipulation diretta e memory leaks
 */

'use client';

import { useCallback, useDeferredValue, useState, useTransition } from 'react';

import { useRouter } from '@/libs/i18nNavigation';

export const useOptimizedNavigation = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // Deferred navigation target for non-blocking UI updates
  const deferredTarget = useDeferredValue(navigationTarget);

  // Optimized navigation with React 19 concurrent features
  const navigate = useCallback((href: string) => {
    // Don't navigate if already pending
    if (isPending) {
      return;
    }

    // Set target immediately for instant feedback
    setNavigationTarget(href);

    // Use startTransition for non-blocking navigation
    startTransition(() => {
      try {
        router.push(href);

        // Clear target after successful navigation
        setTimeout(() => {
          setNavigationTarget(null);
        }, 100);
      } catch (error) {
        console.error('Navigation failed:', error);
        setNavigationTarget(null);

        // Fallback navigation
        window.location.href = href;
      }
    });
  }, [router, isPending]);

  // Quick navigation for urgent updates (like closing modals)
  const navigateUrgent = useCallback((href: string) => {
    // Urgent navigation bypasses transitions
    router.push(href);
  }, [router]);

  return {
    navigate,
    navigateUrgent,
    isPending,
    navigationTarget: deferredTarget,
    isNavigating: isPending, // Backward compatibility
  };
};
