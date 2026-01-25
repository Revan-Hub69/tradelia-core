/**
 * Interaction Optimizer for INP Improvement
 * 
 * Provides utilities to optimize heavy interactions and prevent long tasks
 * Based on 2026 Core Web Vitals best practices
 */

// ============================================================================
// SCHEDULER - Break up long tasks
// ============================================================================

/**
 * Yield to main thread to allow UI updates
 * Use this to break up long computations
 */
export function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

/**
 * Execute function with yielding to prevent blocking
 * Automatically yields every N iterations
 */
export async function executeWithYielding<T>(
  items: T[],
  callback: (item: T, index: number) => void | Promise<void>,
  yieldEvery = 50, // Yield every 50 items
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    await callback(items[i]!, i);
    
    // Yield to main thread periodically
    if (i % yieldEvery === 0 && i > 0) {
      await yieldToMain();
    }
  }
}

/**
 * Process array in chunks with yielding
 * Better for large arrays
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (chunk: T[]) => R[] | Promise<R[]>,
  chunkSize = 50,
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await processor(chunk);
    results.push(...chunkResults);
    
    // Yield after each chunk
    if (i + chunkSize < items.length) {
      await yieldToMain();
    }
  }
  
  return results;
}

// ============================================================================
// DEBOUNCE & THROTTLE - Reduce event frequency
// ============================================================================

/**
 * Debounce function - Execute after delay
 * Good for: search inputs, resize handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function - Execute at most once per interval
 * Good for: scroll handlers, mouse move
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= interval) {
      // Execute immediately
      lastCall = now;
      func(...args);
    } else {
      // Schedule for later
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, interval - timeSinceLastCall);
    }
  };
}

/**
 * Request Animation Frame throttle
 * Good for: visual updates, animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T,
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function throttled(...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

// ============================================================================
// IDLE CALLBACK - Execute during idle time
// ============================================================================

/**
 * Execute function during browser idle time
 * Good for: non-critical updates, analytics
 */
export function runWhenIdle<T extends (...args: any[]) => any>(
  func: T,
  options?: IdleRequestOptions,
): (...args: Parameters<T>) => void {
  return function idle(...args: Parameters<T>) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => func(...args), options);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => func(...args), 1);
    }
  };
}

/**
 * Execute function during idle time with promise
 */
export function executeWhenIdle<T>(
  func: () => T | Promise<T>,
  options?: IdleRequestOptions,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(async () => {
        try {
          const result = await func();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, options);
    } else {
      // Fallback
      setTimeout(async () => {
        try {
          const result = await func();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 1);
    }
  });
}

// ============================================================================
// INTERACTION OBSERVER - Detect user interactions
// ============================================================================

/**
 * Observe user interactions and execute callback
 * Good for: lazy loading, prefetching
 */
export function observeInteraction(
  element: HTMLElement,
  callback: () => void,
  options: {
    events?: string[];
    once?: boolean;
  } = {},
): () => void {
  const {
    events = ['mouseenter', 'touchstart', 'focus'],
    once = false,
  } = options;

  const handler = () => {
    callback();
    if (once) {
      cleanup();
    }
  };

  // Add event listeners
  events.forEach(event => {
    element.addEventListener(event, handler, { passive: true, once });
  });

  // Cleanup function
  const cleanup = () => {
    events.forEach(event => {
      element.removeEventListener(event, handler);
    });
  };

  return cleanup;
}

// ============================================================================
// LONG TASK DETECTOR - Identify performance issues
// ============================================================================

/**
 * Detect long tasks (> 50ms)
 * Use for debugging performance issues
 */
export function detectLongTasks(
  callback: (duration: number, name: string) => void,
): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          callback(entry.duration, entry.name);
        }
      }
    });

    observer.observe({ type: 'longtask', buffered: true });

    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

// ============================================================================
// PRIORITY QUEUE - Execute tasks by priority
// ============================================================================

type Task = {
  id: string;
  priority: 'high' | 'medium' | 'low';
  execute: () => void | Promise<void>;
};

export class PriorityQueue {
  private queue: Task[] = [];
  private isProcessing = false;

  /**
   * Add task to queue
   */
  add(task: Task): void {
    this.queue.push(task);
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    if (!this.isProcessing) {
      this.process();
    }
  }

  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();

    if (task) {
      try {
        await task.execute();
      } catch (error) {
        console.error(`[PriorityQueue] Task ${task.id} failed:`, error);
      }

      // Yield to main thread
      await yieldToMain();
    }

    // Process next task
    this.process();
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const InteractionOptimizer = {
  yieldToMain,
  executeWithYielding,
  processInChunks,
  debounce,
  throttle,
  rafThrottle,
  runWhenIdle,
  executeWhenIdle,
  observeInteraction,
  detectLongTasks,
  PriorityQueue,
};
