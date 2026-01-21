/*
 * GLOBE ICON - Tradelia Custom SVG (Language Switcher)
 *
 * Design: Globo con meridiani e paralleli
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle rotate on hover
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const GlobeIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Cerchio esterno */}
      <circle cx="12" cy="12" r="10" />
      
      {/* Paralleli (linee orizzontali) */}
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </IconBase>
  );
};
