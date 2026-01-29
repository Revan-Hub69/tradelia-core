'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useAnticipatoryFeedback = () => {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'anticipating' | 'active'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerAnticipation = useCallback((delay: number = 45) => {
    setFeedbackState('anticipating');

    timeoutRef.current = setTimeout(() => {
      setFeedbackState('active');
    }, delay);
  }, []);

  const completeFeedback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFeedbackState('idle');
  }, []);

  const resetFeedback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFeedbackState('idle');
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    feedbackState,
    triggerAnticipation,
    completeFeedback,
    resetFeedback,
    isAnticipating: feedbackState === 'anticipating',
    isActive: feedbackState === 'active',
  };
};

export const hapticPatterns = {
  light: {
    intensity: 'subtle',
    duration: 80,
    scale: 0.98,
  },
  medium: {
    intensity: 'normal',
    duration: 120,
    scale: 0.96,
  },
  heavy: {
    intensity: 'prominent',
    duration: 160,
    scale: 0.94,
  },
  success: {
    intensity: 'normal',
    duration: 200,
    scale: 1.02,
    bounce: true,
  },
  warning: {
    intensity: 'normal',
    duration: 150,
    scale: 0.98,
    shake: true,
  },
  error: {
    intensity: 'prominent',
    duration: 180,
    scale: 0.96,
    shake: true,
  },
} as const;
