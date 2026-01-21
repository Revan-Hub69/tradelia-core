/*
 * MORE VERTICAL ICON - Tradelia Custom SVG (Context Menu Trigger)
 *
 * Design: Tre punti verticali equidistanti
 * Optical weight: Bilanciato per 20px standard
 * Animation: Scale pulse on hover
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const MoreVerticalIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Punto superiore */}
      <circle cx="12" cy="5" r="1" />

      {/* Punto centrale */}
      <circle cx="12" cy="12" r="1" />

      {/* Punto inferiore */}
      <circle cx="12" cy="19" r="1" />
    </IconBase>
  );
};
