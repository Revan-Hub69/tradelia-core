/*
 * MOON ICON - Tradelia Custom SVG (Dark Mode)
 *
 * Design: Luna crescente elegante
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle rotation on toggle
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const MoonIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Luna crescente - path ottimizzato */}
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </IconBase>
  );
};
