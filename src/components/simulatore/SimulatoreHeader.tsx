'use client';

import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';

/**
 * Header dedicato alla pagina standalone Simulatore.
 * - Logo Tradelia (torna alla home)
 * - Titolo sessione / step indicator (placeholder)
 * - CTA condividi
 * - Dark mode nativa (il layout forza data-theme="dark")
 */
export function SimulatoreHeader() {
  return (
    <header className="sim-header">
      {/* Left: back + logo */}
      <div className="sim-header__left">
        <Link href="/" className="sim-header__back" aria-label="Torna alla home">
          <ArrowLeft size={18} strokeWidth={1.75} />
        </Link>

        <Link href="/" className="sim-header__logo" aria-label="Tradelia">
          {/* SVG logo inline — monochrome, currentColor */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="sim-header__logo-mark"
          >
            {/* T-mark geometrico */}
            <rect x="3" y="3" width="22" height="3" rx="1.5" fill="currentColor" />
            <rect x="11.5" y="3" width="5" height="22" rx="1.5" fill="currentColor" />
            {/* accento teal bottom-right */}
            <circle cx="22" cy="22" r="3" fill="var(--sim-accent)" />
          </svg>
          <span className="sim-header__logo-text">tradelia</span>
        </Link>
      </div>

      {/* Center: titolo strumento / breadcrumb */}
      <div className="sim-header__center">
        <span className="sim-header__title">Simulatore</span>
        <span className="sim-header__sep" aria-hidden="true">/</span>
        <span className="sim-header__subtitle" id="sim-session-label">
          Nuova simulazione
        </span>
      </div>

      {/* Right: azioni */}
      <div className="sim-header__right">
        <button
          type="button"
          className="sim-header__btn-share"
          aria-label="Condividi simulazione"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Tradelia Simulatore',
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          <Share2 size={16} strokeWidth={1.75} />
          <span>Condividi</span>
        </button>
      </div>
    </header>
  );
}
