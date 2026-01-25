/**
 * Web Vitals Monitor - Performance P2 + Phase 3 Task 1
 *
 * Monitors Core Web Vitals (LCP, INP, CLS) in real-time
 * Logs to console in development, sends to analytics in production
 *
 * Phase 3 Enhancement: Advanced INP monitoring with detailed interaction tracking
 *
 * Based on tier-1 research:
 * - Google web-vitals library (official)
 * - Core Web Vitals 2026 standards
 * - PerformanceObserver API for detailed INP tracking
 *
 * @see https://github.com/GoogleChrome/web-vitals
 */

'use client';

import { useEffect } from 'react';

import { useINPMonitoring } from '@/hooks/useINPMonitoring';

export function WebVitalsMonitor() {
  // Phase 3 Task 1: Advanced INP monitoring with detailed interaction tracking
  useINPMonitoring({
    enabled: true,
    reportThreshold: 200, // Report interactions > 200ms
    debug: process.env.NODE_ENV === 'development',
    onReport: (report) => {
      // Log detailed INP report in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 INP Report:', {
          average: `${report.averageINP}ms`,
          max: `${report.maxINP}ms`,
          poorCount: report.poorInteractions,
          total: report.totalInteractions,
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to Vercel Analytics or Google Analytics
        // Example: sendToAnalytics('INP_DETAILED', report);
      }
    },
  });

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Dynamic import to avoid SSR issues
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      // Core Web Vitals 2026
      onLCP((metric) => {
        // LCP (Largest Contentful Paint)
        // Target: < 2.5s (good), < 4s (needs improvement)
        const status = metric.value < 2500 ? '✅' : metric.value < 4000 ? '⚠️' : '❌';
        console.log(`${status} LCP:`, {
          value: `${(metric.value / 1000).toFixed(2)}s`,
          rating: metric.rating,
          target: '< 2.5s',
        });

        // Send to analytics in production
        if (process.env.NODE_ENV === 'production') {
          // TODO: Send to Vercel Analytics or Google Analytics
          // Example: sendToAnalytics('LCP', metric);
        }
      });

      onINP((metric) => {
        // INP (Interaction to Next Paint) - NEW in 2026
        // Target: < 200ms (good), < 500ms (needs improvement)
        const status = metric.value < 200 ? '✅' : metric.value < 500 ? '⚠️' : '❌';
        console.log(`${status} INP:`, {
          value: `${metric.value.toFixed(0)}ms`,
          rating: metric.rating,
          target: '< 200ms',
        });

        if (process.env.NODE_ENV === 'production') {
          // TODO: Send to analytics
        }
      });

      onCLS((metric) => {
        // CLS (Cumulative Layout Shift)
        // Target: < 0.1 (good), < 0.25 (needs improvement)
        const status = metric.value < 0.1 ? '✅' : metric.value < 0.25 ? '⚠️' : '❌';
        console.log(`${status} CLS:`, {
          value: metric.value.toFixed(3),
          rating: metric.rating,
          target: '< 0.1',
        });

        if (process.env.NODE_ENV === 'production') {
          // TODO: Send to analytics
        }
      });

      // Additional metrics for diagnostics
      onFCP((metric) => {
        // FCP (First Contentful Paint)
        // Target: < 1.8s (good), < 3s (needs improvement)
        const status = metric.value < 1800 ? '✅' : metric.value < 3000 ? '⚠️' : '❌';
        console.log(`${status} FCP:`, {
          value: `${(metric.value / 1000).toFixed(2)}s`,
          rating: metric.rating,
          target: '< 1.8s',
        });
      });

      onTTFB((metric) => {
        // TTFB (Time to First Byte)
        // Target: < 800ms (good), < 1800ms (needs improvement)
        const status = metric.value < 800 ? '✅' : metric.value < 1800 ? '⚠️' : '❌';
        console.log(`${status} TTFB:`, {
          value: `${metric.value.toFixed(0)}ms`,
          rating: metric.rating,
          target: '< 800ms',
        });
      });
    });
  }, []);

  // No UI - monitoring only
  return null;
}
