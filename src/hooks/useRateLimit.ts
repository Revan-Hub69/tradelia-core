/**
 * Client-side Rate Limiting Hook
 * Provides user feedback and prevents excessive requests
 */

import { useCallback, useRef, useState } from 'react';

type RateLimitState = {
  isLimited: boolean;
  remainingAttempts: number;
  resetTime: number | null;
  lastAttempt: number | null;
};

type UseRateLimitOptions = {
  maxAttempts: number;
  windowMs: number;
};

export function useRateLimit({ maxAttempts, windowMs }: UseRateLimitOptions) {
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingAttempts: maxAttempts,
    resetTime: null,
    lastAttempt: null,
  });

  const attemptsRef = useRef<number[]>([]);

  const checkLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove attempts outside the window
    attemptsRef.current = attemptsRef.current.filter(time => time > windowStart);

    const currentAttempts = attemptsRef.current.length;
    const remainingAttempts = Math.max(0, maxAttempts - currentAttempts);
    const isLimited = currentAttempts >= maxAttempts;

    // Calculate reset time (when the oldest attempt expires)
    const resetTime = attemptsRef.current.length > 0 && attemptsRef.current[0]
      ? attemptsRef.current[0] + windowMs
      : null;

    setState({
      isLimited,
      remainingAttempts,
      resetTime,
      lastAttempt: attemptsRef.current[attemptsRef.current.length - 1] || null,
    });

    return { allowed: !isLimited, remainingAttempts };
  }, [maxAttempts, windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    attemptsRef.current.push(now);

    // Trigger state update
    checkLimit();
  }, [checkLimit]);

  const getRemainingTime = useCallback(() => {
    if (!state.resetTime) {
      return 0;
    }
    return Math.max(0, state.resetTime - Date.now());
  }, [state.resetTime]);

  const getTimeUntilReset = useCallback(() => {
    const remaining = getRemainingTime();
    if (remaining === 0) {
      return null;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [getRemainingTime]);

  // Auto-reset when window expires
  const resetIfExpired = useCallback(() => {
    if (state.isLimited && state.resetTime && Date.now() > state.resetTime) {
      checkLimit();
    }
  }, [state.isLimited, state.resetTime, checkLimit]);

  return {
    ...state,
    checkLimit,
    recordAttempt,
    getRemainingTime,
    getTimeUntilReset,
    resetIfExpired,
  };
}

// Predefined rate limiters for common actions
export const useAuthRateLimit = () => useRateLimit({
  maxAttempts: 10, // Increased from 5 to 10
  windowMs: 10 * 60 * 1000, // Reduced from 15 to 10 minutes
});

export const useEmailCheckRateLimit = () => useRateLimit({
  maxAttempts: 20, // Increased from 10 to 20
  windowMs: 2 * 60 * 1000, // Reduced from 5 to 2 minutes
});
