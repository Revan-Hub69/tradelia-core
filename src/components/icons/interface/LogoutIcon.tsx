/*
 * LOGOUT ICON - Tradelia Custom SVG
 * 
 * Design: Porta con freccia uscita
 * Optical weight: Chiaro ma non aggressivo
 * Semantic: Rappresenta uscita sicura
 */

import React from 'react';
import { IconBase, type IconBaseProps } from '../IconBase';

export const LogoutIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Porta/frame */}
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="1.5" />
      
      {/* Freccia uscita */}
      <polyline points="16,17 21,12 16,7" strokeWidth="1.5" />
      <line x1="21" y1="12" x2="9" y2="12" strokeWidth="1.5" />
      
      {/* Dettaglio maniglia */}
      <circle cx="7" cy="12" r="0.5" fill="currentColor" opacity="0.6" />
    </IconBase>
  );
};