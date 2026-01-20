/*
 * SETTINGS ICON - Tradelia Custom SVG
 *
 * Design: Ingranaggio con dettagli premium
 * Optical weight: Bilanciato, non troppo complesso
 * Semantic: Configurazione e controllo
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const SettingsIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Ingranaggio principale */}
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />

      {/* Denti ingranaggio */}
      <path
        d="M12 1v6m0 8v6M4.22 4.22l4.24 4.24m8.48 8.48l4.24 4.24M1 12h6m8 0h6M4.22 19.78l4.24-4.24m8.48-8.48l4.24-4.24"
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* Centro ingranaggio */}
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.8" />

      {/* Dettagli premium - piccoli punti */}
      <circle cx="12" cy="6" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="6" cy="12" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="18" cy="12" r="0.5" fill="currentColor" opacity="0.4" />
    </IconBase>
  );
};
