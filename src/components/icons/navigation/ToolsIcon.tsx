/*
 * TOOLS ICON - Tradelia Custom SVG
 *
 * Design: Grafico a barre crescente
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle bars animation on active
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const ToolsIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Grafico a barre */}
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </IconBase>
  );
};
