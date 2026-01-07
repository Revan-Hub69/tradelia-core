'use client';

import { useEffect } from 'react';

export function PerformanceOptimizer() {
  useEffect(() => {
    // Critical resource hints
    const addResourceHints = () => {
      const head = document.head;
      
      // Preconnect for fonts
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.gstatic.com';
      preconnect.crossOrigin = 'anonymous';
      head.appendChild(preconnect);
    };

    // Optimize font loading with font-display swap
    const optimizeFonts = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.media = 'print';
      fontLink.onload = () => { fontLink.media = 'all'; };
      document.head.appendChild(fontLink);
    };

    // Reduce CLS by reserving space
    const reduceCLS = () => {
      // Add size hints to prevent layout shifts
      const style = document.createElement('style');
      style.textContent = `
        .dashboard-preview { min-height: 400px; }
        .hero-section { min-height: 600px; }
        img { aspect-ratio: attr(width) / attr(height); }
      `;
      document.head.appendChild(style);
    };

    // Run optimizations
    requestIdleCallback(() => {
      addResourceHints();
      optimizeFonts();
      reduceCLS();
    });

  }, []);

  return null;
}