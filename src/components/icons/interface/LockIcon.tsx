/*
 * LOCK ICON - Tradelia Custom SVG (Policy Locks)
 *
 * Design: Lucchetto chiuso con arco
 * Optical weight: Bilanciato per 20px standard
 * Animation: Subtle shake on policy enforcement
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const LockIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      {/* Corpo del lucchetto */}
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      
      {/* Arco superiore */}
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconBase>
  );
};
