/**
 * useDebounce & useThrottle Hooks - Tradelia 2026
 * 
 * Performance optimization hooks for search inputs and scroll handlers.
 * 
 * @see Requirements 12.4 - Debounce/throttle for performance
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook that debounces a value
 * Useful for search inputs to avoid excessive API calls
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms for search)
 * @returns The debounced value
 * 
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 300)
 * 
 * useEffect(() => {
 *   // This only runs 300ms after user stops typing
 *   performSearch(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook that returns a debounced callback function
 * Useful when you need to debounce a function rather than a value
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns A debounced version of the callback
 * 
 * @example
 * const debouncedSave = useDebouncedCallback((value) => {
 *   saveToServer(value)
 * }, 500)
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

/**
 * Hook that throttles a callback function
 * Useful for scroll/resize handlers to limit execution frequency
 * 
 * @param callback - The function to throttle
 * @param limit - Minimum time between calls in milliseconds (default: 100ms for scroll)
 * @returns A throttled version of the callback
 * 
 * @example
 * const throttledScroll = useThrottledCallback((e) => {
 *   updateScrollPosition(e.target.scrollTop)
 * }, 100)
 */
export function useThrottledCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  limit: number = 100
): (...args: Parameters<T>) => void {
  const inThrottleRef = useRef(false);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (!inThrottleRef.current) {
      callbackRef.current(...args);
      inThrottleRef.current = true;
      setTimeout(() => {
        inThrottleRef.current = false;
      }, limit);
    }
  }, [limit]);
}

/**
 * Hook that throttles a value
 * Useful for values that change frequently (like scroll position)
 * 
 * @param value - The value to throttle
 * @param limit - Minimum time between updates in milliseconds
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, limit: number = 100): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
