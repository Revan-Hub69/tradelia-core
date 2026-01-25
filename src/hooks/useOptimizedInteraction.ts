/**
 * Optimized Interaction Hook
 *
 * Provides optimized event handlers to improve INP
 * Automatically debounces, throttles, or defers heavy operations
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';

import { debounce, rafThrottle, runWhenIdle, throttle, yieldToMain } from '@/lib/performance/interaction-optimizer';

// ============================================================================
// TYPES
// ============================================================================

type OptimizationStrategy = 'debounce' | 'throttle' | 'raf' | 'idle' | 'yield';

type UseOptimizedInteractionOptions = {
  strategy?: OptimizationStrategy;
  delay?: number; // For debounce/throttle
  immediate?: boolean; // Execute immediately then optimize
};

// ============================================================================
// HOOK: useOptimizedClick
// ============================================================================

/**
 * Optimized click handler
 * Prevents long tasks by deferring heavy operations
 */
export function useOptimizedClick<T extends (...args: any[]) => any>(
  callback: T,
  options: UseOptimizedInteractionOptions = {},
): (...args: Parameters<T>) => void {
  const {
    strategy = 'yield',
    delay = 300,
    immediate = true,
  } = options;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    const execute = () => callbackRef.current(...args);

    switch (strategy) {
      case 'debounce':
        return debounce(execute, delay)();

      case 'throttle':
        return throttle(execute, delay)();

      case 'raf':
        return rafThrottle(execute)();

      case 'idle':
        return runWhenIdle(execute)();

      case 'yield':
      default:
        if (immediate) {
          // Execute immediately for instant feedback
          execute();
        } else {
          // Defer to next frame
          yieldToMain().then(execute);
        }
    }
  }, [strategy, delay, immediate]);
}

// ============================================================================
// HOOK: useOptimizedChange
// ============================================================================

/**
 * Optimized change handler (for inputs)
 * Debounces by default to reduce updates
 */
export function useOptimizedChange<T extends (...args: any[]) => any>(
  callback: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedRef = useRef(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
  );

  useEffect(() => {
    debouncedRef.current = debounce(
      (...args: Parameters<T>) => callbackRef.current(...args),
      delay,
    );
  }, [delay]);

  return useCallback((...args: Parameters<T>) => {
    debouncedRef.current(...args);
  }, []);
}

// ============================================================================
// HOOK: useOptimizedScroll
// ============================================================================

/**
 * Optimized scroll handler
 * Throttles by default to reduce event frequency
 */
export function useOptimizedScroll<T extends (...args: any[]) => any>(
  callback: T,
  interval = 100,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const throttledRef = useRef(
    throttle((...args: Parameters<T>) => callbackRef.current(...args), interval),
  );

  useEffect(() => {
    throttledRef.current = throttle(
      (...args: Parameters<T>) => callbackRef.current(...args),
      interval,
    );
  }, [interval]);

  return useCallback((...args: Parameters<T>) => {
    throttledRef.current(...args);
  }, []);
}

// ============================================================================
// HOOK: useOptimizedResize
// ============================================================================

/**
 * Optimized resize handler
 * Uses RAF throttle for smooth visual updates
 */
export function useOptimizedResize<T extends (...args: any[]) => any>(
  callback: T,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const rafThrottledRef = useRef(
    rafThrottle((...args: Parameters<T>) => callbackRef.current(...args)),
  );

  return useCallback((...args: Parameters<T>) => {
    rafThrottledRef.current(...args);
  }, []);
}

// ============================================================================
// HOOK: useDeferredUpdate
// ============================================================================

/**
 * Defer non-critical updates to idle time
 * Good for analytics, logging, etc.
 */
export function useDeferredUpdate<T extends (...args: any[]) => any>(
  callback: T,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    runWhenIdle(() => callbackRef.current(...args))();
  }, []);
}

// ============================================================================
// HOOK: useHeavyComputation
// ============================================================================

/**
 * Execute heavy computation without blocking UI
 * Automatically yields to main thread
 */
export function useHeavyComputation<T, R>(
  computation: (data: T) => R | Promise<R>,
): (data: T) => Promise<R> {
  const computationRef = useRef(computation);
  computationRef.current = computation;

  return useCallback(async (data: T): Promise<R> => {
    // Yield to main thread first
    await yieldToMain();

    // Execute computation
    const result = await computationRef.current(data);

    // Yield again before returning
    await yieldToMain();

    return result;
  }, []);
}

// ============================================================================
// HOOK: useBatchedUpdates
// ============================================================================

/**
 * Batch multiple updates into single operation
 * Reduces number of re-renders
 */
export function useBatchedUpdates<T>(
  callback: (items: T[]) => void,
  batchSize = 10,
  delay = 100,
): (item: T) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (batchRef.current.length > 0) {
      callbackRef.current(batchRef.current);
      batchRef.current = [];
    }
    timeoutRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        flush();
      }
    };
  }, [flush]);

  return useCallback((item: T) => {
    batchRef.current.push(item);

    // Flush if batch size reached
    if (batchRef.current.length >= batchSize) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      flush();
      return;
    }

    // Schedule flush
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(flush, delay);
    }
  }, [batchSize, delay, flush]);
}

// ============================================================================
// HOOK: useInteractionObserver
// ============================================================================

/**
 * Observe user interaction with element
 * Execute callback on first interaction
 */
export function useInteractionObserver(
  callback: () => void,
  options: {
    events?: string[];
    once?: boolean;
  } = {},
): (element: HTMLElement | null) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return useCallback((element: HTMLElement | null) => {
    // Cleanup previous observer
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (!element) {
 return;
}

    const {
      events = ['mouseenter', 'touchstart', 'focus'],
      once = true,
    } = options;

    const handler = () => {
      callbackRef.current();
      if (once) {
        cleanup();
      }
    };

    // Add event listeners
    events.forEach((event) => {
      element.addEventListener(event, handler, { passive: true, once });
    });

    // Cleanup function
    const cleanup = () => {
      events.forEach((event) => {
        element.removeEventListener(event, handler);
      });
    };

    cleanupRef.current = cleanup;
  }, [options.events?.join(','), options.once]);
}
