'use client';

import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

/**
 * SimulatoreHeader — v2
 *
 * Logo mark: candlestick + trend integrati.
 * Concept: due candele (bullish/bearish) con un segmento trend ascendente
 * che le attraversa — leggibile a 18px, riconoscibile a 64px.
 * Geometria: rette pulite, nessun arrotondamento eccessivo.
 *
 * Struttura header:
 *   LEFT: mark + wordmark + / + Simulatore
 *   RIGHT: share icon-only (desktop), share con testo (mobile)
 */
export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${AppConfig.name} — Simulatore`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.querySelector<HTMLButtonElement>('.sim-header__btn-share');
        if (!btn) return;
        const original = btn.getAttribute('aria-label') ?? '';
        btn.setAttribute('aria-label', 'Link copiato!');
        btn.setAttribute('data-copied', 'true');
        setTimeout(() => {
          btn.setAttribute('aria-label', original);
          btn.removeAttribute('data-copied');
        }, 1800);
      });
    }
  };

  return (
    <header className="sim-header">
      <div className="sim-header__left">
        <Link href="/" className="sim-logo" aria-label={`${AppConfig.name} — torna alla home`}>
          {/*
           * LOGO MARK v2 — Candlestick + Trend
           *
           * Composizione:
           * - 2 candele OHLC stilizzate (corpo rettangolare + shadow verticale)
           *   Prima: bearish (rossa tenue) — wick top/bottom
           *   Seconda: bullish (teal, prominente) — wick top/bottom
           * - Linea trend diagonale ascendente che attraversa entrambe
           * - Sfondo: nessuno (trasparente) — mark si integra in qualsiasi header
           *
           * Colori:
           * - Candela 1 corpo: rgba(184,79,138,0.55) — bearish, tenue
           * - Candela 2 corpo: #3d9aa8 — bullish, brand teal pieno
           * - Wicks: rgba(255,255,255,0.3)
           * - Trend line: #3d9aa8 con leggero glow
           *
           * viewBox 24×24 — resa ottimale da 16px a 40px
           */}
          <svg
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            {/* Wick candela 1 (bearish, sinistra) */}
            <line x1="7" y1="3.5" x2="7" y2="18.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
            {/* Corpo candela 1: bearish — si apre in alto, chiude in basso */}
            <rect x="4.5" y="7" width="5" height="7" rx="0.5"
              fill="rgba(184,79,138,0.45)" stroke="rgba(184,79,138,0.6)" strokeWidth="0.75"/>

            {/* Wick candela 2 (bullish, destra) */}
            <line x1="17" y1="4.5" x2="17" y2="20.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
            {/* Corpo candela 2: bullish — si apre in basso, chiude in alto */}
            <rect x="14.5" y="8" width="5" height="8.5" rx="0.5"
              fill="#3d9aa8" stroke="#4fb3c2" strokeWidth="0.75"/>
            {/* Highlight interno candela bullish — senso di profondità */}
            <rect x="15.5" y="9" width="2" height="2" rx="0.25"
              fill="rgba(255,255,255,0.15)"/>

            {/* Trend line ascendente: dal basso-sx all'alto-dx, attraversa entrambe le candele */}
            <line
              x1="2" y1="20"
              x2="22" y2="5"
              stroke="#3d9aa8"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />

            {/* Punto terminale del trend — segnala la direzione */}
            <circle cx="21.5" cy="5.5" r="1.5" fill="#3d9aa8" fillOpacity="0.9"/>
          </svg>

          {/* Wordmark: nome brand, weight 700, kerning stretto */}
          <span style={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: '#e8e7e5',
            fontFamily: 'var(--s-sans)',
            userSelect: 'none',
          }}>
            {AppConfig.name}
          </span>
        </Link>

        {/* Divisore / Simulatore */}
        <span className="sim-header__page-label" aria-hidden="true">
          <span className="sim-header__page-sep">/</span>
          <span className="sim-header__page-name">Simulatore</span>
        </span>
      </div>

      <div className="sim-header__right">
        <div className="sim-tooltip-wrap">
          <button
            type="button"
            className="sim-header__btn-share"
            aria-label="Condividi questa simulazione"
            onClick={handleShare}
          >
            <svg
              className="sim-header__share-icon sim-header__share-icon--default"
              width="15" height="15" viewBox="0 0 15 15"
              fill="none" aria-hidden="true"
            >
              <path
                d="M10.5 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4.5 5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10.5 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                stroke="currentColor" strokeWidth="1.25"
              />
              <path
                d="M6.35 6.35l2.3-1.2M6.35 8.65l2.3 1.2"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
              />
            </svg>
            <svg
              className="sim-header__share-icon sim-header__share-icon--copied"
              width="15" height="15" viewBox="0 0 15 15"
              fill="none" aria-hidden="true"
            >
              <path d="M3 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sim-header__share-label">Condividi</span>
          </button>
          <span className="sim-tooltip" role="tooltip">Copia link</span>
        </div>
      </div>
    </header>
  );
}
