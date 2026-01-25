/*
 * MEMORY LEAK DETECTION HOOK - PHASE 3C IMPLEMENTATION
 *
 * Tier 1 Research Implementation:
 * - Chrome DevTools Memory profiling patterns
 * - React memory leak prevention
 * - Event listener cleanup audit
 * - Timer cleanup audit
 *
 * Expected Impact: Zero memory leaks in production
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';

// ✅ TIER 1: Memory leak detection interface
type MemoryLeakDetectionOptions = {
  enableInProduction?: boolean;
  logInterval?: number;
  memoryThreshold?: number; // MB
  componentName?: string;
};

// ✅ TIER 1: Memory usage tracking
type MemoryUsage = {
  used: number;
  total: number;
  timestamp: number;
  componentName?: string;
};

// ✅ TIER 1: Global memory tracking
const memoryHistory: MemoryUsage[] = [];
const activeComponents = new Set<string>();

// ✅ TIER 1: Memory leak detection hook
export const useMemoryLeakDetection = (options: MemoryLeakDetectionOptions = {}) => {
  const {
    enableInProduction = false,
    logInterval = 10000, // 10 seconds
    memoryThreshold = 100, // 100MB
    componentName = 'Unknown',
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountTimeRef = useRef<number>(Date.now());
  const initialMemoryRef = useRef<number>(0);

  // ✅ TIER 1: Get memory usage (Chrome only)
  const getMemoryUsage = useCallback((): MemoryUsage | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    // ✅ CRITICAL FIX: Chrome-specific API (performance.memory) not in standard types
    // Research: Feature-Sliced Design 2026 - Explicit any cast for browser-specific APIs
    const memory = (performance as any).memory;
    if (!memory) {
      return null;
    }

    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      timestamp: Date.now(),
      componentName,
    };
  }, [componentName]);

  // ✅ TIER 1: Memory leak detection logic
  const detectMemoryLeak = useCallback((currentMemory: MemoryUsage) => {
    if (memoryHistory.length < 5) {
      return false;
    } // Need history for detection

    const recentHistory = memoryHistory.slice(-5);
    const firstEntry = recentHistory[0];
    if (!firstEntry) {
      return false;
    } // Safety check

    const memoryGrowth = currentMemory.used - firstEntry.used;
    const timeElapsed = currentMemory.timestamp - firstEntry.timestamp;
    const growthRate = memoryGrowth / (timeElapsed / 1000); // MB per second

    // ✅ TIER 1: Leak detection criteria
    const isLeaking
      = memoryGrowth > memoryThreshold // Significant growth
        && growthRate > 0.1 // Consistent growth rate
        && recentHistory.every((entry, index) => {
          if (index === 0) {
            return true;
          }
          const prevEntry = recentHistory[index - 1];
          return prevEntry ? entry.used >= prevEntry.used : true;
        }); // Monotonic increase

    if (isLeaking) {
      console.warn(`🚨 Memory leak detected in ${componentName}:`, {
        growth: `${memoryGrowth}MB`,
        rate: `${growthRate.toFixed(2)}MB/s`,
        current: `${currentMemory.used}MB`,
        threshold: `${memoryThreshold}MB`,
      });
    }

    return isLeaking;
  }, [componentName, memoryThreshold]);

  // ✅ TIER 1: Memory monitoring effect
  useEffect(() => {
    // Skip in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && !enableInProduction) {
      return;
    }

    // Skip if memory API not available
    const initialMemory = getMemoryUsage();
    if (!initialMemory) {
      console.warn('Memory API not available (Chrome required for memory leak detection)');
      return;
    }

    initialMemoryRef.current = initialMemory.used;
    activeComponents.add(componentName);

    // ✅ TIER 1: Periodic memory monitoring
    intervalRef.current = setInterval(() => {
      const currentMemory = getMemoryUsage();
      if (!currentMemory) {
        return;
      }

      memoryHistory.push(currentMemory);

      // Keep only recent history (last 50 entries)
      if (memoryHistory.length > 50) {
        memoryHistory.shift();
      }

      // Detect memory leaks
      detectMemoryLeak(currentMemory);

      // Log memory usage in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Memory usage (${componentName}):`, {
          current: `${currentMemory.used}MB`,
          growth: `${currentMemory.used - initialMemoryRef.current}MB`,
          activeComponents: activeComponents.size,
        });
      }
    }, logInterval);

    // ✅ TIER 1: Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      activeComponents.delete(componentName);

      const finalMemory = getMemoryUsage();
      if (finalMemory && process.env.NODE_ENV === 'development') {
        const memoryDelta = finalMemory.used - initialMemoryRef.current;
        const componentLifetime = Date.now() - mountTimeRef.current;

        console.log(`🧹 Component cleanup (${componentName}):`, {
          lifetime: `${Math.round(componentLifetime / 1000)}s`,
          memoryDelta: `${memoryDelta}MB`,
          finalMemory: `${finalMemory.used}MB`,
        });

        // Warn about potential leaks on unmount
        if (memoryDelta > 10) { // 10MB threshold
          console.warn(`⚠️ Potential memory leak in ${componentName}: ${memoryDelta}MB not released`);
        }
      }
    };
  }, [componentName, enableInProduction, logInterval, getMemoryUsage, detectMemoryLeak]);

  // ✅ TIER 1: Manual memory check function
  const checkMemoryNow = useCallback(() => {
    const currentMemory = getMemoryUsage();
    if (!currentMemory) {
      return null;
    }

    const memoryDelta = currentMemory.used - initialMemoryRef.current;
    const componentLifetime = Date.now() - mountTimeRef.current;

    return {
      current: currentMemory.used,
      initial: initialMemoryRef.current,
      delta: memoryDelta,
      lifetime: componentLifetime,
      isLeaking: detectMemoryLeak(currentMemory),
    };
  }, [getMemoryUsage, detectMemoryLeak]);

  return {
    checkMemoryNow,
    memoryHistory: memoryHistory.slice(-10), // Last 10 entries
    activeComponents: Array.from(activeComponents),
  };
};

// ✅ TIER 1: Event listener cleanup hook
export const useEventListenerCleanup = () => {
  const listenersRef = useRef<Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
    options?: boolean | AddEventListenerOptions;
  }>>([]);

  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions,
  ) => {
    element.addEventListener(event, handler, options);
    listenersRef.current.push({ element, event, handler, options });
  }, []);

  const removeEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions,
  ) => {
    element.removeEventListener(event, handler, options);
    listenersRef.current = listenersRef.current.filter(
      listener => !(
        listener.element === element
        && listener.event === event
        && listener.handler === handler
      ),
    );
  }, []);

  // ✅ TIER 1: Cleanup all listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(({ element, event, handler, options }) => {
        try {
          element.removeEventListener(event, handler, options);
        } catch (error) {
          console.warn('Failed to remove event listener:', error);
        }
      });
      listenersRef.current = [];
    };
  }, []);

  return { addEventListener, removeEventListener };
};

// ✅ TIER 1: Timer cleanup hook
export const useTimerCleanup = () => {
  const timersRef = useRef<Array<{
    id: NodeJS.Timeout | number;
    type: 'timeout' | 'interval';
  }>>([]);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push({ id, type: 'timeout' });
    return id;
  }, []);

  const setInterval = useCallback((callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    timersRef.current.push({ id, type: 'interval' });
    return id;
  }, []);

  const clearTimeout = useCallback((id: NodeJS.Timeout | number) => {
    window.clearTimeout(id);
    timersRef.current = timersRef.current.filter(timer => timer.id !== id);
  }, []);

  const clearInterval = useCallback((id: NodeJS.Timeout | number) => {
    window.clearInterval(id);
    timersRef.current = timersRef.current.filter(timer => timer.id !== id);
  }, []);

  // ✅ TIER 1: Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(({ id, type }) => {
        try {
          if (type === 'timeout') {
            window.clearTimeout(id);
          } else {
            window.clearInterval(id);
          }
        } catch (error) {
          console.warn('Failed to clear timer:', error);
        }
      });
      timersRef.current = [];
    };
  }, []);

  return { setTimeout, setInterval, clearTimeout, clearInterval };
};
