import { useState, useCallback, useRef } from 'react';

/**
 * Gestisce la visibilità del kbd hint bar.
 *
 * - La prima volta che viene chiamato show(), il hint diventa visibile.
 * - Si nasconde automaticamente dopo `duration` ms.
 * - Non si mostra più dopo la prima volta (una-tantum per sessione).
 */
export function useKbdHint(duration = 4000) {
  const [visible, setVisible] = useState(false);
  const shown    = useRef(false);
  const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (shown.current) return;
    shown.current = true;
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), duration);
  }, [duration]);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  return { visible, show, dismiss };
}
