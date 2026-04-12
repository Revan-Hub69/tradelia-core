import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Mostra il kbd hint bar la prima volta che l'utente usa Tab
 * dentro il panel. Si auto-nasconde dopo `duration` ms.
 * Usa aria-live="polite" nel componente KbdHintBar.
 */
export function useKbdHint(duration = 3500) {
  const [visible, setVisible] = useState(false);
  const [everShown, setEverShown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (everShown) return;
    setEverShown(true);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), duration);
  }, [everShown, duration]);

  // Shortcut '?' apre/chiude manualmente
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setVisible(v => !v);
        if (!everShown) setEverShown(true);
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [everShown]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { visible, show };
}
