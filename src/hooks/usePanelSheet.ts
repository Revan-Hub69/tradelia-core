'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * usePanelSheet
 * Bottom sheet mobile a 3 snap points.
 * Il posizionamento avviene SOLO via classi CSS:
 *   .sim-sheet--collapsed → translateY(calc(100% - 56px))
 *   .sim-sheet--half      → translateY(50%)
 *   .sim-sheet--full      → translateY(0)
 * Nessun style inline — zero rischi di conflitto con hydration SSR.
 */
export type SnapPoint = 'collapsed' | 'half' | 'full';

export function usePanelSheet() {
  const [snap, setSnap] = useState<SnapPoint>('collapsed');
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartSnap = useRef<SnapPoint>('collapsed');

  const snapTo = useCallback((s: SnapPoint) => setSnap(s), []);

  const toggle = useCallback(() =>
    setSnap(prev => prev === 'collapsed' ? 'half' : 'collapsed'), []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartSnap.current = snap;
  }, [snap]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = dragStartY.current - e.changedTouches[0].clientY;
    if (delta > 60) {
      setSnap(prev => prev === 'collapsed' ? 'half' : 'full');
    } else if (delta < -60) {
      setSnap(prev => prev === 'full' ? 'half' : 'collapsed');
    }
  }, []);

  // Chiudi con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && snap !== 'collapsed') setSnap('collapsed');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [snap]);

  return { snap, snapTo, toggle, onTouchStart, onTouchEnd, sheetRef };
}
