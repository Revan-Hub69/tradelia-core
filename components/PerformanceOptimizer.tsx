'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Critical resource hints
    const addResourceHints = () => {
      const head = document.head;
      
      // DNS prefetch for external domains
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = '//fonts.googleapis.com';
      head.appendChild(dnsPrefetch);
      
      // Preconnect for critical resources
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.gstatic.com';
      preconnect.crossOrigin = 'anonymous';
      head.appendChild(preconnect);
    };

    // Optimize font loading
    const optimizeFonts = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.media = 'print';
      fontLink.onload = () => { fontLink.media = 'all'; };
      document.head.appendChild(fontLink);
    };

    // Run optimizations
    requestIdleCallback(() => {
      addResourceHints();
      optimizeFonts();
    });

  }, []);

  return null;
}