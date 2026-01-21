/*
 * COMMUNITY ICON - Tradelia Custom SVG
 *
 * Design: Gruppo di persone stilizzato
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle scale on active
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const CommunityIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Persona centrale */}
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />

      {/* Persona destra */}
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="16" cy="7" r="3" />
    </IconBase>
  );
};
