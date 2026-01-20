/*
 * PROFILE ICON - Tradelia Custom SVG
 *
 * Design: Avatar con badge/achievement indicator
 * Rappresenta: Profilo utente, progressi, achievements
 * Optical weight: Bilanciato per percezione personale
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const ProfileIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Avatar principale */}
      <circle cx="12" cy="8" r="4" strokeWidth="1.5" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeWidth="1.5" />

      {/* Badge achievement - piccolo cerchio */}
      <circle cx="16" cy="6" r="2" strokeWidth="1.2" opacity="0.8" />
      <path d="M15 6l1 1 2-2" strokeWidth="1" opacity="0.8" />

      {/* Dettagli premium */}
      <circle cx="12" cy="8" r="1.5" fill="none" strokeWidth="1" opacity="0.3" />

      {/* Indicatore livello - piccole stelle */}
      <path
        d="M8 4l0.5 1 1 0.5-1 0.5L8 7l-0.5-1L6.5 5.5l1-0.5L8 4z"
        strokeWidth="0.8"
        opacity="0.4"
        fill="currentColor"
      />
    </IconBase>
  );
};
