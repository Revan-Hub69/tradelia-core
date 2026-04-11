'use client';

import Link from 'next/link';
import { Share2 } from 'lucide-react';
import { AppConfig } from '@/utils/AppConfig';

/**
 * Header standalone del simulatore.
 *
 * Usa il MEDESIMO mark SVG del Logo della home — identico rx, identica T + punto accento.
 * Il wordmark replica la logica del gradient 45° MA con colori hardcoded dark-safe:
 * non dipende da hsl(var(--foreground)) che nel contesto sim-root non è definita.
 *
 * Invariante: l'icona è pixel-perfect identica al Logo della home.
 */
export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${AppConfig.name} — Simulatore`, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <header className="sim-header">
      {/* LEFT: Logo */}
      <div className="sim-header__left">
        <Link href="/" className="sim-logo" aria-label={`${AppConfig.name} — torna alla home`}>
          {/*
           * Icona: identica al Logo della home.
           * fill="#3d9aa8" = --s-ac (teal accento sim) che approssima
           * il colore `primary` del tema chiaro senza usare CSS vars esterne.
           */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <rect width="32" height="32" rx="8" fill="#3d9aa8" />
            <path
              d="M8 11h16M16 11v12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="22" cy="11" r="2" fill="rgba(255,255,255,0.6)" />
          </svg>

          {/*
           * Wordmark: gradient diagonale SHARP 45° — identico alla home.
           * Home usa: hsl(var(--foreground)) 50%, hsl(var(--primary)) 50%
           * Qui usiamo colori espliciti per il contesto dark:
           *   — #e8e7e5 (bianco caldo) al posto di --foreground
           *   — #3d9aa8 (teal) al posto di --primary
           */}
          <span
            className="sim-logo__wordmark"
            aria-label={AppConfig.name}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                background: 'linear-gradient(45deg, #e8e7e5 50%, #3d9aa8 50%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--s-sans)',
              }}
            >
              {AppConfig.name}
            </span>
          </span>
        </Link>
      </div>

      {/* CENTER: breadcrumb */}
      <div className="sim-header__center" aria-label="Posizione corrente">
        <span className="sim-header__title">Simulatore</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: 0.3 }}>
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sim-header__subtitle">Confronto strumenti</span>
      </div>

      {/* RIGHT */}
      <div className="sim-header__right">
        <button
          type="button"
          className="sim-header__btn-share"
          aria-label="Condividi questa simulazione"
          onClick={handleShare}
        >
          <Share2 size={13} strokeWidth={1.75} aria-hidden="true" />
          <span>Condividi</span>
        </button>
      </div>
    </header>
  );
}
