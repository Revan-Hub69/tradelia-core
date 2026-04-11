'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * usePanelSheet — SOTA 2026.
 *
 * Bottom sheet a 3 snap points con drag fluido via onTouchMove.
 * Il drag segue il dito in tempo reale (transform inline su ref),
 * poi al release scatta allo snap point più vicino.
 *
 * Snap points (altezza visibile dal basso):
 *   COLLAPSED = handle 56px (safe-area aware)
 *   HALF      = 52dvh
 *   FULL      = 92dvh
 *
 * Usa dvh per safe-area corretto su notched devices.
 * Haptic feedback via navigator.vibrate (Android) dove disponibile.
 */

export type SnapPoint = 'collapsed' | 'half' | 'full';

// Altezze visibili in dvh-fraction (0-1)
const SNAP_FRACTIONS: Record<SnapPoint, number> = {
  collapsed: 0,    // solo handle visibile — calcolato come px fissi
  half:      0.52,
  full:      0.92,
};

const HANDLE_H = 56; // px visibili nello stato collapsed
const DRAG_THRESHOLD = 48; // px minimi per cambiare snap

function getViewportH() {
  if (typeof window === 'undefined') return 800;
  // visualViewport per correttezza con tastiera aperta su mobile
  return window.visualViewport?.height ?? window.innerHeight;
}

function snapToTranslateY(s: SnapPoint): number {
  const vh = getViewportH();
  if (s === 'collapsed') return vh - HANDLE_H;
  return vh - Math.round(vh * SNAP_FRACTIONS[s]);
}

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* non supportato */ }
}

export function usePanelSheet() {
  const [snap, setSnap] = useState<SnapPoint>('collapsed');
  const sheetRef = useRef<HTMLDivElement>(null);

  // Drag state — ref per evitare re-render durante il drag
  const dragStartY    = useRef(0);
  const dragStartTY   = useRef(0);
  const isDragging    = useRef(false);
  const currentTY     = useRef(snapToTranslateY('collapsed'));

  // Applica translateY direttamente sull'elemento (no state = no reflow)
  const applyTranslate = useCallback((ty: number) => {
    if (!sheetRef.current) return;
    sheetRef.current.style.transform = `translateY(${ty}px)`;
    sheetRef.current.style.transition = 'none';
    currentTY.current = ty;
  }, []);

  // Snap a un punto con transizione spring
  const snapTo = useCallback((s: SnapPoint, fromDrag = false) => {
    const ty = snapToTranslateY(s);
    if (sheetRef.current) {
      sheetRef.current.style.transition =
        'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)';
      sheetRef.current.style.transform = `translateY(${ty}px)`;
      currentTY.current = ty;
    }
    if (fromDrag) vibrate(8);
    setSnap(s);
  }, []);

  const toggle = useCallback(() => {
    setSnap(prev => {
      const next = prev === 'collapsed' ? 'half' : 'collapsed';
      snapTo(next);
      return next;
    });
  }, [snapTo]);

  // Ricalcola translateY iniziale al mount e al resize
  useEffect(() => {
    snapTo('collapsed');
    const onResize = () => snapTo(snap);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Touch: start
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current  = e.touches[0].clientY;
    dragStartTY.current = currentTY.current;
    isDragging.current  = true;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  }, []);

  // Touch: move — segue il dito in tempo reale
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    const vh    = getViewportH();
    const minTY = snapToTranslateY('full');
    const maxTY = vh - HANDLE_H;
    const newTY = Math.min(maxTY, Math.max(minTY, dragStartTY.current + delta));
    applyTranslate(newTY);
    // Previeni scroll della pagina solo se il drag è verticale
    e.preventDefault();
  }, [applyTranslate]);

  // Touch: end — scatta allo snap più vicino
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = dragStartY.current - e.changedTouches[0].clientY;

    setSnap(prev => {
      let next: SnapPoint = prev;
      if (delta > DRAG_THRESHOLD) {
        next = prev === 'collapsed' ? 'half' : 'full';
      } else if (delta < -DRAG_THRESHOLD) {
        next = prev === 'full' ? 'half' : 'collapsed';
      }
      // Anche se next === prev, riesegui snapTo per la transizione spring
      snapTo(next, next !== prev);
      return next;
    });
  }, [snapTo]);

  // Escape chiude
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && snap !== 'collapsed') snapTo('collapsed');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [snap, snapTo]);

  return { snap, snapTo, toggle, onTouchStart, onTouchMove, onTouchEnd, sheetRef };
}
