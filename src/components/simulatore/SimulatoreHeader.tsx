'use client';

import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

/**
 * Header standalone del simulatore — SOTA 2026.
 *
 * Pattern: 44px, logo + titolo left, actions right.
 * - Niente breadcrumb verboso (ridondante sulla pagina simulatore)
 * - Logo wordmark flat senza gradient sharp — colore piatto #e8e7e5
 * - Share: icon-only con tooltip su desktop, testo visibile su mobile
 * - Keyboard shortcut [S] per share
 */
export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${AppConfig.name} — Simulatore`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Feedback visivo inline sul bottone — no toast
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
      {/* LEFT: Logo — identico alla home, niente gradient */}
      <div className="sim-header__left">
        <Link href="/" className="sim-logo" aria-label={`${AppConfig.name} — torna alla home`}>
          <svg
            width="26" height="26" viewBox="0 0 32 32"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true" style={{ flexShrink: 0 }}
          >
            <rect width="32" height="32" rx="8" fill="#3d9aa8" />
            <path d="M8 11h16M16 11v12" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <circle cx="22" cy="11" r="2" fill="rgba(255,255,255,0.6)" />
          </svg>
          <span className="sim-logo__wordmark" aria-label={AppConfig.name}>
            <span style={{
              fontWeight: 700,
              fontSize: '0.9375rem',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              color: '#e8e7e5',
              fontFamily: 'var(--s-sans)',
            }}>
              {AppConfig.name}
            </span>
          </span>
        </Link>

        {/* Divisore + label pagina */}
        <span className="sim-header__page-label" aria-hidden="true">
          <span className="sim-header__page-sep">/</span>
          <span className="sim-header__page-name">Simulatore</span>
        </span>
      </div>

      {/* RIGHT: Share icon-only + tooltip */}
      <div className="sim-header__right">
        <div className="sim-tooltip-wrap">
          <button
            type="button"
            className="sim-header__btn-share"
            aria-label="Condividi questa simulazione"
            onClick={handleShare}
          >
            {/* Stato normale: share icon */}
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
            {/* Stato copiato: checkmark */}
            <svg
              className="sim-header__share-icon sim-header__share-icon--copied"
              width="15" height="15" viewBox="0 0 15 15"
              fill="none" aria-hidden="true"
            >
              <path d="M3 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Testo visibile solo su mobile */}
            <span className="sim-header__share-label">Condividi</span>
          </button>
          <span className="sim-tooltip" role="tooltip">Copia link</span>
        </div>
      </div>
    </header>
  );
}
