/*
 * MOBILE DETECTION HOOK - Performance Optimized 2026
 *
 * Detects mobile viewport (< 768px) with:
 * - SSR-safe implementation
 * - Debounced resize listener
 * - Cleanup on unmount
 */

'use client';

import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    // Debounced resize listener
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
