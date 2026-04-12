'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * usePanelSheet — 2 snap soli: collapsed | full
 * Apre/chiude SOLO via click/tap sull'handle.
 * Nessun drag, nessun touch handler sul content.
 */
export type SnapPoint = 'collapsed' | 'full';

export function usePanelSheet(defaultSnap: SnapPoint = 'collapsed') {
  const [snap, setSnap] = useState<SnapPoint>(defaultSnap);
  const sheetRef = useRef<HTMLDivElement>(null);

  const open     = useCallback(() => setSnap('full'),      []);
  const close    = useCallback(() => setSnap('collapsed'), []);
  const toggle   = useCallback(() => setSnap(p => p === 'collapsed' ? 'full' : 'collapsed'), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && snap === 'full') setSnap('collapsed');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [snap]);

  return { snap, open, close, toggle, sheetRef };
}
