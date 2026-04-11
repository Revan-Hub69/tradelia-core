'use client';

import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { AppConfig } from '@/utils/AppConfig';

/**
 * Header standalone del simulatore.
 * Logo completamente inline e dark-safe — non dipende dalle CSS vars del tema globale.
 * Il wordmark usa colori hardcoded per il contesto dark-first del simulatore.
 */
export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof navigator === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Tradelia Simulatore', url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // feedback visivo gestito dal CSS :active sul bottone
      });
    }
  };

  return (
    <header className="sim-header">
      {/* LEFT: Logo inline dark-safe */}
      <div className="sim-header__left">
        <Link href="/" className="sim-logo" aria-label="Torna alla home Tradelia">
          {/* Icon */}
          <svg
            className="sim-logo__icon"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="32" height="32" rx="8" fill="#4f98a3" />
            <path
              d="M8 11h16M16 11v12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="22" cy="11" r="2" fill="rgba(255,255,255,0.6)" />
          </svg>
          {/* Wordmark */}
          <span className="sim-logo__wordmark">
            <span className="sim-logo__wordmark-dark">Trade</span>
            <span className="sim-logo__wordmark-accent">lia</span>
          </span>
        </Link>
      </div>

      {/* CENTER: breadcrumb */}
      <div className="sim-header__center">
        <span className="sim-header__title">Simulatore</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{opacity: 0.3}}>
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="sim-header__subtitle" id="sim-session-label">
          Nuova simulazione
        </span>
      </div>

      {/* RIGHT: actions */}
      <div className="sim-header__right">
        <button
          type="button"
          className="sim-header__btn-share"
          aria-label="Condividi simulazione"
          onClick={handleShare}
        >
          <Share2 size={14} strokeWidth={1.75} />
          <span>Condividi</span>
        </button>
      </div>
    </header>
  );
}
