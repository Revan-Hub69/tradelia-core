/*
 * COMMUNITY ICON - Tradelia Custom SVG
 * 
 * Design: Network di persone connesse
 * Rappresenta: Community educativa, connessioni, networking
 * Optical weight: Bilanciato per percezione sociale
 */

import React from 'react';
import { IconBase, type IconBaseProps } from '../IconBase';

export const CommunityIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Persona centrale */}
      <circle cx="12" cy="8" r="3" strokeWidth="1.5" />
      <path d="M12 14c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5z" strokeWidth="1.5" />
      
      {/* Persona sinistra */}
      <circle cx="6" cy="6" r="2" strokeWidth="1.2" opacity="0.7" />
      <path d="M2 18c0-2 2-3 4-3" strokeWidth="1.2" opacity="0.7" />
      
      {/* Persona destra */}
      <circle cx="18" cy="6" r="2" strokeWidth="1.2" opacity="0.7" />
      <path d="M22 18c0-2-2-3-4-3" strokeWidth="1.2" opacity="0.7" />
      
      {/* Connessioni network - linee sottili */}
      <path d="M9 8c-1-1-2-1-3-1" strokeWidth="0.8" opacity="0.4" />
      <path d="M15 8c1-1 2-1 3-1" strokeWidth="0.8" opacity="0.4" />
      
      {/* Simbolo comunicazione - piccole onde */}
      <path d="M8 4c0-1 1-2 2-2s2 1 2 2" strokeWidth="0.8" opacity="0.3" />
      <path d="M14 4c0-1 1-2 2-2s2 1 2 2" strokeWidth="0.8" opacity="0.3" />
    </IconBase>
  );
};