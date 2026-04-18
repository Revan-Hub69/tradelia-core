'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * usePanelSheet — 3 snap points: collapsed | peek | full
 * SOTA 2026: supports swipe gestures, backdrop, aria-modal
 */
export type SnapPoint = 'collapsed' | 'peek' | 'full';

const SNAP_ORDER: SnapPoint[] = ['collapsed', 'peek', 'full'];

export interface UsePanelSheetReturn {
  snap: SnapPoint;
  setSnap: (s: SnapPoint) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  peek: () => void;
  next: () => void;
  prev: () => void;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  dragProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onPointerDown: (e: React.PointerEvent) => void;
  };
}

export function usePanelSheet(defaultSnap: SnapPoint = 'collapsed'): UsePanelSheetReturn {
  const [snap, setSnap] = useState<SnapPoint>(defaultSnap);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartSnap = useRef<SnapPoint>('collapsed');
  const currentTranslateY = useRef(0);

  const open = useCallback(() => setSnap('full'), []);
  const close = useCallback(() => setSnap('collapsed'), []);
  const peek = useCallback(() => setSnap('peek'), []);

  const toggle = useCallback(() => {
    setSnap(p => {
      if (p === 'collapsed') return 'full';
      if (p === 'peek') return 'full';
      return 'collapsed';
    });
  }, []);

  const next = useCallback(() => {
    setSnap(p => {
      const idx = SNAP_ORDER.indexOf(p);
      return SNAP_ORDER[Math.min(idx + 1, SNAP_ORDER.length - 1)];
    });
  }, []);

  const prev = useCallback(() => {
    setSnap(p => {
      const idx = SNAP_ORDER.indexOf(p);
      return SNAP_ORDER[Math.max(idx - 1, 0)];
    });
  }, []);

  // Keyboard handler: Escape closes to collapsed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (snap === 'full' || snap === 'peek')) {
        setSnap('collapsed');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [snap]);

  // Touch/pointer drag handlers for swipe gesture
  const handleDragStart = useCallback((clientY: number) => {
    dragStartY.current = clientY;
    dragStartSnap.current = snap;
    setIsDragging(true);

    // Calculate current translateY based on snap
    const sheet = sheetRef.current;
    if (!sheet) return;
    const height = sheet.offsetHeight;
    const sh = parseInt(getComputedStyle(sheet).getPropertyValue('--s-sh') || '72', 10);

    switch (snap) {
      case 'collapsed':
        currentTranslateY.current = height - sh;
        break;
      case 'peek':
        currentTranslateY.current = height * 0.55;
        break;
      case 'full':
        currentTranslateY.current = 0;
        break;
    }
  }, [snap]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = clientY - dragStartY.current;
    const newTranslate = Math.max(0, currentTranslateY.current + delta);

    const sheet = sheetRef.current;
    if (sheet) {
      sheet.style.transform = `translateY(${newTranslate}px)`;
      sheet.classList.add('sim-sheet--dragging');
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const sheet = sheetRef.current;
    if (!sheet) return;

    sheet.classList.remove('sim-sheet--dragging');
    sheet.style.transform = ''; // Reset inline style to let CSS classes take over

    // Determine which snap point based on current position
    const height = sheet.offsetHeight;
    const sh = parseInt(getComputedStyle(sheet).getPropertyValue('--s-sh') || '72', 10);
    const computedStyle = window.getComputedStyle(sheet);
    const matrix = new DOMMatrix(computedStyle.transform);
    const currentY = Math.abs(matrix.m42);

    // Snap thresholds: <30% full, 30-70% peek, >70% collapsed
    const ratio = currentY / height;
    if (ratio < 0.3) {
      setSnap('full');
    } else if (ratio < 0.7) {
      setSnap('peek');
    } else {
      setSnap('collapsed');
    }
  }, [isDragging]);

  const dragProps = {
    onTouchStart: (e: React.TouchEvent) => {
      // Only handle single touch on handle area
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientY);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault(); // Prevent body scroll while dragging
        handleDragMove(e.touches[0].clientY);
      }
    },
    onTouchEnd: handleDragEnd,
    onPointerDown: (e: React.PointerEvent) => {
      // Only handle primary pointer on handle area
      if (e.isPrimary && (e.pointerType === 'touch' || e.pointerType === 'pen')) {
        handleDragStart(e.clientY);
      }
    },
  };

  return {
    snap,
    setSnap,
    open,
    close,
    toggle,
    peek,
    next,
    prev,
    sheetRef,
    isDragging,
    dragProps,
  };
}
