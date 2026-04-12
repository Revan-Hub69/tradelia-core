import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Gestisce la visibilità del kbd hint bar.
 *
 * - La barra compare SOLO se il focus arriva da tastiera (Tab/frecce),
 *   non da click mouse o touch — rilevato tramite il flag globale
 *   `data-using-keyboard` su <html>.
 * - La prima volta che show() viene invocato con focus da tastiera,
 *   il hint diventa visibile.
 * - Si nasconde automaticamente dopo `duration` ms.
 * - Non si mostra più dopo la prima volta (una-tantum per sessione).
 */
export function useKbdHint(duration = 4000) {
  const [visible, setVisible]  = useState(false);
  const shown   = useRef(false);
  const timer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Registra i listener globali una volta sola per tracciare
     se l'utente sta usando la tastiera o il mouse/touch. */
  useEffect(() => {
    const markKbd   = () => document.documentElement.setAttribute('data-using-keyboard', 'true');
    const markMouse = () => document.documentElement.removeAttribute('data-using-keyboard');

    window.addEventListener('keydown',   markKbd,   { passive: true, capture: true });
    window.addEventListener('mousedown', markMouse, { passive: true, capture: true });
    window.addEventListener('pointerdown', markMouse, { passive: true, capture: true });

    return () => {
      window.removeEventListener('keydown',    markKbd,   { capture: true });
      window.removeEventListener('mousedown',  markMouse, { capture: true });
      window.removeEventListener('pointerdown', markMouse, { capture: true });
    };
  }, []);

  const show = useCallback(() => {
    /* Ignora se già mostrato o se non si sta usando la tastiera */
    if (shown.current) return;
    if (!document.documentElement.hasAttribute('data-using-keyboard')) return;

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
