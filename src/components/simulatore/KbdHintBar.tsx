'use client';

import React from 'react';

interface KbdHintBarProps {
  visible: boolean;
}

/**
 * Barra istruzioni tastiera — appare la prima volta che l'utente
 * usa Tab nel panel, si auto-nasconde dopo 3.5s.
 * Richiamabile manualmente con il tasto '?'.
 */
export function KbdHintBar({ visible }: KbdHintBarProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="kbd-hint"
      data-visible={visible ? 'true' : 'false'}
    >
      <span className="kbd-hint__row">
        <kbd>←</kbd><kbd>→</kbd>
        <span>naviga nel gruppo</span>
      </span>
      <span className="kbd-hint__sep" aria-hidden="true" />
      <span className="kbd-hint__row">
        <kbd>Tab</kbd>
        <span>cambia gruppo</span>
      </span>
      <span className="kbd-hint__sep" aria-hidden="true" />
      <span className="kbd-hint__row">
        <kbd>Space</kbd>
        <span>seleziona</span>
      </span>
      <span className="kbd-hint__sep" aria-hidden="true" />
      <span className="kbd-hint__row">
        <kbd>?</kbd>
        <span>questo aiuto</span>
      </span>
    </div>
  );
}
