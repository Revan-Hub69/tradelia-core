/**
 * Throttle Utility - Performance P1
 *
 * Limits function execution to once per specified time period.
 * Essential for scroll/resize event handlers to prevent performance issues.
 *
 * @example
 * ```tsx
 * const handleScroll = throttle(() => {
 *   console.log('Scrolled!');
 * }, 100);
 *
 * window.addEventListener('scroll', handleScroll);
 * ```
 *
 * @param func - Function to throttle
 * @param wait - Minimum time between executions (ms)
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastRan: number | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // eslint-disable-next-line ts/no-this-alias
    const context = this;

    if (!lastRan) {
      // First call - execute immediately
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      // Subsequent calls - throttle
      if (timeout) {
        clearTimeout(timeout);
      }

      const timeSinceLastRan = Date.now() - lastRan;

      if (timeSinceLastRan >= wait) {
        // Enough time has passed - execute now
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        // Not enough time - schedule for later
        timeout = setTimeout(
          () => {
            func.apply(context, args);
            lastRan = Date.now();
          },
          wait - timeSinceLastRan,
        );
      }
    }
  };
}

/**
 * Debounce Utility - Performance P1
 *
 * Delays function execution until after specified time has elapsed
 * since the last time it was invoked.
 *
 * @example
 * ```tsx
 * const handleSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * input.addEventListener('input', (e) => handleSearch(e.target.value));
 * ```
 *
 * @param func - Function to debounce
 * @param wait - Time to wait before execution (ms)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // eslint-disable-next-line ts/no-this-alias
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
