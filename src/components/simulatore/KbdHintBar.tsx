'use client';

import React from 'react';

/**
 * Barra di suggerimento tastiera — appare una volta, poi sparisce.
 *
 * Stili inline per essere self-contained; le variabili CSS del
 * design system (--s-surface-2, --s-t2, ecc.) sono già definite
 * nel foglio globale del simulatore.
 */
export function KbdHintBar({ visible }: { visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sim-kbd-hint"
      data-visible={visible ? 'true' : 'false'}
      aria-hidden={!visible}
    >
      <span className="sim-kbd-hint__icon" aria-hidden="true">⌨</span>
      <span className="sim-kbd-hint__text">
        <kbd>←</kbd><kbd>→</kbd> naviga &nbsp;·&nbsp;
        <kbd>Tab</kbd> cambia gruppo &nbsp;·&nbsp;
        <kbd>Spazio</kbd> seleziona
      </span>
    </div>
  );
}
