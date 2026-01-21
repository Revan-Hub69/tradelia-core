/*
 * PROFILE ICON - Tradelia Custom SVG
 *
 * Design: Avatar utente elegante
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle scale on active
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const ProfileIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Avatar */}
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconBase>
  );
};
