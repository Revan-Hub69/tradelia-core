/*
 * HOME ICON - Tradelia Custom SVG
 *
 * Design: Casa elegante e minimalista
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle scale on active
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const HomeIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Casa con tetto */}
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      
      {/* Porta */}
      <path d="M9 22V12h6v10" />
    </IconBase>
  );
};
