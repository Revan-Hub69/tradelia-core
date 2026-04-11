'use client';

import { Share2 } from 'lucide-react';
import { Logo } from '@/templates/Logo';

export function SimulatoreHeader() {
  const handleShare = () => {
    if (typeof navigator === 'undefined') return;
    if (navigator.share) {
      navigator.share({ title: 'Tradelia Simulatore', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="sim-header">
      <div className="sim-header__left">
        <Logo href="/" size="sm" />
      </div>
      <div className="sim-header__center">
        <span className="sim-header__title">Simulatore</span>
        <span className="sim-header__sep" aria-hidden="true">/</span>
        <span className="sim-header__subtitle" id="sim-session-label">Nuova simulazione</span>
      </div>
      <div className="sim-header__right">
        <button
          type="button"
          className="sim-header__btn-share"
          aria-label="Condividi simulazione"
          onClick={handleShare}
        >
          <Share2 size={16} strokeWidth={1.75} />
          <span>Condividi</span>
        </button>
      </div>
    </header>
  );
}
