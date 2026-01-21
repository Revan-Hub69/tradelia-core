/*
 * LEARN ICON - Tradelia Custom SVG
 *
 * Design: Libro aperto elegante
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle page flip on active
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const LearnIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Libro aperto */}
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </IconBase>
  );
};
