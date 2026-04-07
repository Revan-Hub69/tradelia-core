'use client';

import { useEffect } from 'react';

/**
 * ScrollProgressBar — iOS 26 / Linear style thin progress line
 *
 * - Zero render output: il componente non produce markup React.
 *   La <div> viene iniettata nel DOM direttamente per evitare
 *   conflitti con SSR e hydration mismatch.
 * - FOUC-safe: la barra parte opacity:0 (definito in landing.css)
 *   e riceve .is-active solo dopo il primo evento scroll.
 * - Perf: listener passive, rAF throttle, will-change:width già
 *   nel CSS, nessuna re-render React.
 */
export const ScrollProgressBar = () => {
  useEffect(() => {
    // --- 1. Crea o trova la barra nel DOM ---
    let bar = document.querySelector<HTMLDivElement>('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      document.body.prepend(bar);
    }

    const htmlEl = document.documentElement;
    let rafId: number | null = null;
    let completeTimer: ReturnType<typeof setTimeout> | null = null;

    // --- 2. Calcola e applica il progresso ---
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = htmlEl.scrollHeight - htmlEl.clientHeight;
      const ratio = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      // CSS custom property su <html> — width calcolata in CSS
      htmlEl.style.setProperty('--scroll-progress', String(ratio));

      // Attiva la barra al primo scroll
      if (!bar!.classList.contains('is-active')) {
        bar!.classList.add('is-active');
      }

      // Gestisci stato completato
      if (ratio >= 0.999) {
        bar!.classList.add('is-complete');
        // Rimuovi is-complete dopo il fade-out (300ms definiti nel CSS)
        if (!completeTimer) {
          completeTimer = setTimeout(() => {
            bar!.classList.remove('is-complete', 'is-active');
            completeTimer = null;
          }, 400);
        }
      } else {
        if (completeTimer) {
          clearTimeout(completeTimer);
          completeTimer = null;
        }
        bar!.classList.remove('is-complete');
        // Ri-attiva se torna a scrollare dopo il top
        if (ratio > 0.01 && !bar!.classList.contains('is-active')) {
          bar!.classList.add('is-active');
        }
      }

      rafId = null;
    };

    // --- 3. Listener con rAF throttle ---
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Esegui subito per stato iniziale (pagina già scrollata al mount)
    update();

    // --- 4. Cleanup ---
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (completeTimer !== null) clearTimeout(completeTimer);
      // Rimuovi la barra se il componente viene smontato
      bar?.remove();
      htmlEl.style.removeProperty('--scroll-progress');
    };
  }, []);

  // Nessun markup React: la barra è gestita direttamente nel DOM
  return null;
};
