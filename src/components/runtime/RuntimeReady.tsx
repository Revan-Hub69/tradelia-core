/*
 * RUNTIME READY - FOUC Prevention Bootstrap
 * 
 * Sets data-tradelia-runtime attribute on <html> to control CSS transitions
 * 
 * States:
 * - "boot" = Initial load, all transitions disabled
 * - "ready" = After hydration, transitions enabled
 * 
 * This prevents "ghost animations" on first render
 */

'use client';

import { useEffect } from 'react';

export function RuntimeReady() {
  useEffect(() => {
    // Set to "ready" after hydration completes
    document.documentElement.setAttribute('data-tradelia-runtime', 'ready');

    return () => {
      // Cleanup on unmount (hot reload)
      document.documentElement.removeAttribute('data-tradelia-runtime');
    };
  }, []);

  return null; // No visual output
}
