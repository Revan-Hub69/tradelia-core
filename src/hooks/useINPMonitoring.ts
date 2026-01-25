/**
 * INP (Interaction to Next Paint) Monitoring Hook
 *
 * Monitors and reports INP metrics for performance optimization
 * Based on 2026 Core Web Vitals standards
 *
 * INP Thresholds:
 * - Good: < 200ms
 * - Needs Improvement: 200-500ms
 * - Poor: > 500ms
 */

'use client';

import { useEffect, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type INPMetric = {
  value: number; // Duration in milliseconds
  rating: 'good' | 'needs-improvement' | 'poor';
  target: string; // Element that was interacted with
  eventType: string; // click, keydown, etc.
  timestamp: number;
};

export type INPReport = {
  metrics: INPMetric[];
  averageINP: number;
  maxINP: number;
  poorInteractions: number;
  totalInteractions: number;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const INP_THRESHOLDS = {
  GOOD: 200,
  NEEDS_IMPROVEMENT: 500,
} as const;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get INP rating based on value
 */
function getINPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
  if (value <= INP_THRESHOLDS.GOOD) {
 return 'good';
}
  if (value <= INP_THRESHOLDS.NEEDS_IMPROVEMENT) {
 return 'needs-improvement';
}
  return 'poor';
}

/**
 * Get element selector for reporting
 * CRITICAL FIX: Robust check for getAttribute method (handles SVG, non-Element objects)
 */
function getElementSelector(element: Element | null): string {
  if (!element) {
 return 'unknown';
}

  // CRITICAL: Check if element has getAttribute method (handles non-Element objects)
  if (typeof element.getAttribute !== 'function') {
    return element.tagName?.toLowerCase() || 'unknown';
  }

  // Try ID first
  if (element.id) {
 return `#${element.id}`;
}

  // Try data attributes
  const dataAttr = element.getAttribute('data-testid') ||
    element.getAttribute('data-name');
  if (dataAttr) {
 return `[data-*="${dataAttr}"]`;
}

  // Try class (handle both HTMLElement and SVGElement)
  const className = element.getAttribute('class');
  if (className) {
    const classes = className.split(' ').filter(Boolean).slice(0, 2).join('.');
    if (classes) {
 return `.${classes}`;
}
  }

  // Fallback to tag name
  return element.tagName.toLowerCase();
}

// ============================================================================
// HOOK
// ============================================================================

export function useINPMonitoring(options: {
  enabled?: boolean;
  reportThreshold?: number; // Only report if INP > threshold
  onReport?: (report: INPReport) => void;
  debug?: boolean;
} = {}) {
  const {
    enabled = true,
    reportThreshold = INP_THRESHOLDS.GOOD,
    onReport,
    debug = false,
  } = options;

  const metricsRef = useRef<INPMetric[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
 return undefined;
}

    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) {
      if (debug) {
        console.warn('[INP] PerformanceObserver not supported');
      }
      return undefined;
    }

    try {
      // Create observer for event timing
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Type guard for PerformanceEventTiming
          if ('processingStart' in entry && 'processingEnd' in entry) {
            const eventEntry = entry as PerformanceEventTiming;

            // Calculate INP (processing + rendering)
            const processingTime = eventEntry.processingEnd - eventEntry.processingStart;
            const renderTime = eventEntry.startTime + eventEntry.duration - eventEntry.processingEnd;
            const inp = processingTime + renderTime;

            // Only track significant interactions
            if (inp > 16) { // > 1 frame at 60fps
              const metric: INPMetric = {
                value: Math.round(inp),
                rating: getINPRating(inp),
                target: getElementSelector(eventEntry.target as Element),
                eventType: eventEntry.name,
                timestamp: Date.now(),
              };

              metricsRef.current.push(metric);

              // Debug logging
              if (debug && inp > reportThreshold) {
                console.log('[INP] Slow interaction detected:', {
                  inp: `${metric.value}ms`,
                  rating: metric.rating,
                  target: metric.target,
                  eventType: metric.eventType,
                });
              }

              // Report if threshold exceeded
              if (inp > reportThreshold && onReport) {
                const report = generateReport(metricsRef.current);
                onReport(report);
              }
            }
          }
        }
      });

      // Observe event timing entries
      observer.observe({
        type: 'event',
        buffered: true, // Include past events
        durationThreshold: 16, // Only events > 16ms (1 frame)
      });

      observerRef.current = observer;

      // Cleanup
      return () => {
        observer.disconnect();
        observerRef.current = null;
      };
    } catch (error) {
      if (debug) {
        console.error('[INP] Failed to initialize observer:', error);
      }
      return undefined;
    }
  }, [enabled, reportThreshold, onReport, debug]);

  // Generate report on unmount
  useEffect(() => {
    return () => {
      if (metricsRef.current.length > 0 && onReport) {
        const report = generateReport(metricsRef.current);
        onReport(report);
      }
    };
  }, [onReport]);

  return {
    getReport: () => generateReport(metricsRef.current),
    clearMetrics: () => {
      metricsRef.current = [];
    },
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport(metrics: INPMetric[]): INPReport {
  if (metrics.length === 0) {
    return {
      metrics: [],
      averageINP: 0,
      maxINP: 0,
      poorInteractions: 0,
      totalInteractions: 0,
    };
  }

  const values = metrics.map(m => m.value);
  const averageINP = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const maxINP = Math.max(...values);
  const poorInteractions = metrics.filter(m => m.rating === 'poor').length;

  return {
    metrics,
    averageINP,
    maxINP,
    poorInteractions,
    totalInteractions: metrics.length,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Send INP report to analytics
 */
export function sendINPReport(report: INPReport) {
  if (typeof window === 'undefined') {
 return;
}

  // Send to analytics (e.g., Vercel Analytics, Google Analytics)
  if ('gtag' in window) {
    (window as any).gtag('event', 'inp_report', {
      average_inp: report.averageINP,
      max_inp: report.maxINP,
      poor_interactions: report.poorInteractions,
      total_interactions: report.totalInteractions,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[INP Report]', {
      averageINP: `${report.averageINP}ms`,
      maxINP: `${report.maxINP}ms`,
      poorInteractions: report.poorInteractions,
      totalInteractions: report.totalInteractions,
      rating: report.averageINP <= INP_THRESHOLDS.GOOD ? '✅ Good' :
              report.averageINP <= INP_THRESHOLDS.NEEDS_IMPROVEMENT ? '⚠️ Needs Improvement' :
              '❌ Poor',
    });
  }
}

/**
 * Get worst INP interactions
 */
export function getWorstInteractions(report: INPReport, limit = 5): INPMetric[] {
  return [...report.metrics]
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
