'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the visual viewport height (iOS/Android software keyboard aware).
 * Returns `null` during SSR or if VisualViewport API is unavailable — callers
 * should fall back to `100dvh`.
 */
export function useVisualViewportHeight(enabled: boolean = true): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setHeight(null);
      return;
    }
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => setHeight(vv.height);
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [enabled]);

  return height;
}
