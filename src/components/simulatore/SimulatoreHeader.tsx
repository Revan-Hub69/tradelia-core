'use client';

import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

/**
 * SimulatoreHeader — v3
 *
 * Logo mark F (definitivo):
 *   Traversa orizzontale  = orizzonte / baseline mercato
 *   Gamba verticale       = posizione / strumento selezionato
 *   Spark + punto         = performance, upside, confronto
 *
 * Due gesti, due colori, leggibile a 16px.
 * Non aggiunge: candele, wicks, gradienti, glows, pattern ripetuti.
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
        const orig = btn.getAttribute('aria-label') ?? '';
        btn.setAttribute('aria-label', 'Link copiato!');
        btn.setAttribute('data-copied', 'true');
        setTimeout(() => {
          btn.setAttribute('aria-label', orig);
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
           * MARK F — T + spark
           * viewBox 36×36
           *   rect (3,9 30×4 rx2)  = traversa T  → orizzonte/mercato
           *   rect (15,9 6×22 rx2) = gamba T     → posizione/strumento
           *   polyline (23,26→27,19→31,14) = spark ascendente
           *   circle (31,14 r2.5)  = terminale upside
           *
           * Colori:
           *   --s-ac   (#3d9aa8) per la T — brand color
           *   --s-t1   (#e8e7e5) per spark — contrasto attivo
           */}
          <svg
            width="26" height="26"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            {/* Traversa T = orizzonte mercato */}
            <rect x="3" y="9" width="30" height="4" rx="2" fill="var(--s-ac)" />
            {/* Gamba T = posizione / strumento */}
            <rect x="15" y="9" width="6" height="22" rx="2" fill="var(--s-ac)" />
            {/* Spark ascendente = performance, upside */}
            <polyline
              points="23,26 27,19 31,14"
              stroke="var(--s-t1)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Punto terminale */}
            <circle cx="31" cy="14" r="2.5" fill="var(--s-t1)" />
          </svg>

          {/* Wordmark */}
          <span style={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--s-t1)',
            fontFamily: 'var(--s-sans)',
            userSelect: 'none',
          }}>
            {AppConfig.name}
          </span>
        </Link>

        {/* breadcrumb: / Simulatore */}
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
            {/* Share icon */}
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
            {/* Check icon (copied state) */}
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
