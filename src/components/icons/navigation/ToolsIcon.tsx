/*
 * TOOLS ICON - Tradelia Custom SVG
 *
 * Design: Grafico trading con strumenti analisi
 * Rappresenta: Strumenti professionali crypto/trading
 * Optical weight: Bilanciato per percezione "pro tools"
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const ToolsIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Grafico base - candlestick stilizzato */}
      <path d="M3 21h18" strokeWidth="1.5" />
      <path d="M6 16v5" strokeWidth="2" />
      <path d="M10 12v9" strokeWidth="2" />
      <path d="M14 8v13" strokeWidth="2" />
      <path d="M18 4v17" strokeWidth="2" />

      {/* Trend line crescente */}
      <path d="M3 18l4-4 4 2 6-8" strokeWidth="1.5" opacity="0.7" />

      {/* Indicatori analisi */}
      <circle cx="7" cy="14" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="11" cy="10" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="15" cy="6" r="1" fill="currentColor" opacity="0.6" />

      {/* Simbolo strumento - piccolo ingranaggio */}
      <circle cx="19" cy="5" r="1.5" strokeWidth="1" opacity="0.5" />
      <path d="M19 3.5v3M20.5 5h-3" strokeWidth="0.8" opacity="0.5" />
    </IconBase>
  );
};
