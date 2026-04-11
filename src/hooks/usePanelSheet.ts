'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * usePanelSheet
 * Gestisce il bottom sheet mobile a 3 snap points.
 * Usa transform translateY — GPU-accelerated, zero reflow.
 *
 * Snap points (px dal basso):
 *   COLLAPSED = 64px visibili
 *   HALF      = 50vh visibili
 *   FULL      = 90vh visibili
 */
export type SnapPoint = 'collapsed' | 'half' | 'full';

const COLLAPSED_H = 64;

function getSnapHeights() {
  if (typeof window === 'undefined') return { collapsed: COLLAPSED_H, half: 400, full: 700 };
  return {
    collapsed: COLLAPSED_H,
    half: Math.round(window.innerHeight * 0.5),
    full: Math.round(window.innerHeight * 0.9),
  };
}

export function usePanelSheet() {
  const [snap, setSnap] = useState<SnapPoint>('collapsed');
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartSnap = useRef<SnapPoint>('collapsed');

  const snapTo = useCallback((s: SnapPoint) => setSnap(s), []);
  const toggle = useCallback(() =>
    setSnap(prev => prev === 'collapsed' ? 'half' : 'collapsed'), []);

  // Calcola translateY dal snap point corrente
  const getTranslateY = useCallback((s: SnapPoint) => {
    const heights = getSnapHeights();
    const maxH = heights.full;
    return maxH - heights[s];
  }, []);

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartSnap.current = snap;
    setIsDragging(true);
  }, [snap]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsDragging(false);
    const delta = dragStartY.current - e.changedTouches[0].clientY;
    const heights = getSnapHeights();

    // Drag verso l'alto = delta positivo = espandi
    // Drag verso il basso = delta negativo = collassa
    if (delta > 60) {
      setSnap(prev => prev === 'collapsed' ? 'half' : 'full');
    } else if (delta < -60) {
      setSnap(prev => prev === 'full' ? 'half' : 'collapsed');
    }
    // else: rimbalza al punto di partenza
    void heights;
  }, []);

  // Chiudi con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && snap !== 'collapsed') setSnap('collapsed');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [snap]);

  return { snap, snapTo, toggle, isDragging, getTranslateY, onTouchStart, onTouchEnd, sheetRef };
}
