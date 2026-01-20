/*
 * LEARN ICON - Tradelia Custom SVG
 *
 * Design: Libro aperto con simbolo crescita/freccia
 * Rappresenta: Apprendimento progressivo e crescita
 * Optical weight: Ottimizzato per percezione educativa
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const LearnIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Libro aperto base */}
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />

      {/* Pagina centrale */}
      <path d="M12 2v20" strokeWidth="1" opacity="0.6" />

      {/* Simbolo crescita - freccia stilizzata */}
      <path d="M8 12l2-2 2 2" strokeWidth="1.5" />
      <path d="M16 14l-2-2-2 2" strokeWidth="1.5" />

      {/* Dettagli pagina */}
      <path d="M8 8h2" strokeWidth="1" opacity="0.4" />
      <path d="M14 8h2" strokeWidth="1" opacity="0.4" />
    </IconBase>
  );
};
