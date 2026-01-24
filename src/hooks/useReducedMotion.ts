/*
 * USE REDUCED MOTION HOOK - Performance Optimized
 *
 * Global hook to detect user's motion preferences
 * Prevents unnecessary re-renders across components
 */

import { useEffect, useState } from 'react';

let globalReducedMotion: boolean | null = null;
const listeners = new Set<(value: boolean) => void>();

export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (globalReducedMotion !== null) {
      return globalReducedMotion;
    }

    // Initialize on first use
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      globalReducedMotion = mediaQuery.matches;

      const handleChange = (e: MediaQueryListEvent) => {
        globalReducedMotion = e.matches;
        listeners.forEach(listener => listener(e.matches));
      };

      mediaQuery.addEventListener('change', handleChange);

      // Cleanup function stored globally
      (window as any).__reducedMotionCleanup = () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    return globalReducedMotion ?? false;
  });

  useEffect(() => {
    listeners.add(setReducedMotion);
    return () => {
      listeners.delete(setReducedMotion);
    };
  }, []);

  return reducedMotion;
};
