'use client';

import { useEffect } from 'react';

export function DeferredScripts() {
  useEffect(() => {
    // Load non-critical scripts after page load
    const loadDeferredScripts = () => {
      // Analytics (example)
      if (typeof window !== 'undefined' && !window.gtag) {
        const script = document.createElement('script');
        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    // Load after page is fully loaded
    if (document.readyState === 'complete') {
      loadDeferredScripts();
    } else {
      window.addEventListener('load', loadDeferredScripts);
      return () => window.removeEventListener('load', loadDeferredScripts);
    }
  }, []);

  return null;
}