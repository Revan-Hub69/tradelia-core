'use client';

import { useState, useId } from 'react';

type Props = {
  label: string;
  hint?: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

/**
 * PanelAccordion — SOTA 2026.
 * Label: 12px semibold normal-case (non più ALL-CAPS 10px tracked).
 * Animazione: CSS grid-template-rows 0fr→1fr, zero JS height calc.
 * Summary inline quando chiuso: valore attivo in mono teal.
 */
export function PanelAccordion({ label, hint, summary, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={`sim-accordion${open ? ' sim-accordion--open' : ''}`}>
      <button
        type="button"
        className="sim-accordion__trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(v => !v)}
      >
        <span className="sim-accordion__label">{label}</span>
        <span className="sim-accordion__right">
          {!open && summary && (
            <span className="sim-accordion__summary">{summary}</span>
          )}
          <svg
            className="sim-accordion__chevron"
            width="12" height="12" viewBox="0 0 12 12"
            fill="none" aria-hidden="true"
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div id={id} className="sim-accordion__body" role="region" aria-label={label}>
        <div className="sim-accordion__inner">
          {hint && <p className="sim-panel__hint">{hint}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
