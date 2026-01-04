// Desk-grade formatting utilities for trading data

/**
 * Format basis points with proper precision for trading desks
 * - < 0.01: show "<0.01"
 * - < 0.1: show 2 decimals
 * - >= 0.1: show 1 decimal
 */
export function fmtBps(x: number): string {
  if (!Number.isFinite(x)) return "—";
  if (x < 0.01) return "<0.01";
  if (x < 0.1) return x.toFixed(2);
  return x.toFixed(1);
}

/**
 * Format percentage change with appropriate precision
 */
export function fmtPctChange(x: number): string {
  if (!Number.isFinite(x)) return "—";
  const abs = Math.abs(x);
  if (abs < 0.01) return "0.00%";
  if (abs < 1) return x.toFixed(2) + "%";
  return x.toFixed(1) + "%";
}

/**
 * Format time ago with appropriate units
 */
export function fmtTimeAgo(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms ago`;
  if (seconds < 60) return `${seconds.toFixed(3)}s ago`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
  return `${Math.round(seconds / 3600)}h ago`;
}

/**
 * Format score with consistent precision
 */
export function fmtScore(x: number): string {
  if (!Number.isFinite(x)) return "—";
  return Math.round(x).toString();
}

/**
 * Throttle function for UI updates
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}