'use client';

import { useCallback, useEffect, useState } from 'react';

import type { MotionType } from './TradeliaMotion';

export const useTradeliaMotion = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [motionPreference, setMotionPreference] = useState<'full' | 'reduced' | 'none'>('full');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionPreference(e.matches ? 'reduced' : 'full');
    };

    setMotionPreference(mediaQuery.matches ? 'reduced' : 'full');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const triggerMotion = useCallback((duration?: number) => {
    if (motionPreference === 'none') {
      return;
    }

    setIsAnimating(true);

    const timeout = duration || (motionPreference === 'reduced' ? 150 : 300);
    setTimeout(() => setIsAnimating(false), timeout);
  }, [motionPreference]);

  const shouldAnimate = useCallback((motionType: MotionType) => {
    if (motionPreference === 'none') {
      return false;
    }
    if (motionPreference === 'reduced' && ['success', 'error'].includes(motionType)) {
      return false;
    }
    return true;
  }, [motionPreference]);

  return {
    isAnimating,
    motionPreference,
    triggerMotion,
    shouldAnimate,
  };
};

export const motionTokens = {
  duration: {
    instant: 0,
    micro: 120,
    quick: 180,
    base: 280,
    smooth: 350,
    slow: 450,
  },

  delay: {
    micro: 45,
    small: 65,
    medium: 100,
    large: 150,
  },

  easing: {
    tradelia: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    confident: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    exit: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  stagger: {
    micro: 30,
    small: 50,
    medium: 80,
    large: 120,
  },
} as const;
