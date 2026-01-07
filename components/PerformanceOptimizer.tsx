'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Handle font loading asynchronously
    const handleFontLoading = () => {
      const preloadLink = document.querySelector('link[rel="preload"][as="style"]') as HTMLLinkElement;
      if (preloadLink) {
        preloadLink.onload = () => {
          preloadLink.rel = 'stylesheet';
        };
      }
    };

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

    // Reduce CLS by reserving space
    const reduceCLS = () => {
      const dashboardPreview = document.querySelector('.dashboard-preview');
      if (dashboardPreview) {
        (dashboardPreview as HTMLElement).style.minHeight = '400px';
      }
    };

    // Run optimizations immediately
    handleFontLoading();
    inlineCriticalCSS();
    reduceCLS();

  }, []);

  return null;
}