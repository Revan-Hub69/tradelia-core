'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * usePanelCollapse
 * Gestisce il collasso del panel desktop su schermi 860-1100px.
 * Persiste stato in-memory (no localStorage — sandboxed iframe safe).
 */
export function usePanelCollapse() {
  const [collapsed, setCollapsed] = useState(false);

  // Su resize: se torna ≥1100 forza espanso
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setCollapsed(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => setCollapsed(v => !v), []);

  return { collapsed, toggle };
}
