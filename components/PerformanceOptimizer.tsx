'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Critical CSS inlining
    const inlineCriticalCSS = () => {
      const criticalCSS = `
        .dashboard-preview{min-height:400px;width:100%;contain:layout}
        .hero-section{min-height:600px;contain:layout}
        .bg-background\/80{min-height:200px;contain:layout}
        body{font-family:system-ui,-apple-system,sans-serif}
      `;
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    };

    // Optimize font loading with font-display swap
    const optimizeFonts = () => {
      // Remove existing font loading from PerformanceOptimizer
      // Fonts are now handled in layout.tsx with preload
    };

    // Reduce CLS by reserving space
    const reduceCLS = () => {
      // Set explicit dimensions for dynamic content
      const dashboardPreview = document.querySelector('.dashboard-preview');
      if (dashboardPreview) {
        (dashboardPreview as HTMLElement).style.minHeight = '400px';
      }
    };

    // Run optimizations immediately
    inlineCriticalCSS();
    reduceCLS();

    // Defer non-critical optimizations
    requestIdleCallback(() => {
      optimizeFonts();
    });

  }, []);

  return null;
}