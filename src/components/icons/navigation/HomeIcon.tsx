/*
 * HOME ICON - Tradelia Custom SVG
 * 
 * Design: Casa stilizzata con dettagli premium
 * Optical weight: Bilanciato per 20px standard
 * States: Supporta active/pressed con micro-variazioni
 */

import React from 'react';
import { IconBase, type IconBaseProps } from '../IconBase';

export const HomeIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Casa base con tetto angolare */}
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      
      {/* Dettaglio porta premium */}
      <path d="M12 16v3" strokeWidth="1.5" />
      
      {/* Dettaglio finestra */}
      <circle cx="9" cy="14" r="0.5" fill="currentColor" />
    </IconBase>
  );
};