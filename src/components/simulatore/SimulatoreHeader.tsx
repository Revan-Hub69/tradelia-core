'use client';

import { AppConfig } from '@/utils/AppConfig';
import { Logo } from '@/templates/Logo';

export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${AppConfig.name} \u2014 Simulatore`, url });
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
        <Logo href="/" size="sm" />

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
            <svg className="sim-header__share-icon sim-header__share-icon--default" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M10.5 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4.5 5.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M10.5 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M6.35 6.35l2.3-1.2M6.35 8.65l2.3 1.2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            <svg className="sim-header__share-icon sim-header__share-icon--copied" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M3 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="sim-header__share-label">Condividi</span>
          </button>
          <span className="sim-tooltip" role="tooltip">Copia link</span>
        </div>
      </div>
    </header>
  );
}
