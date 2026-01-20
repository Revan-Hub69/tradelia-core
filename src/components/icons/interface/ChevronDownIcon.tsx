/*
 * CHEVRON DOWN ICON - Tradelia Custom SVG
 *
 * Design: Freccia giù stilizzata per dropdown
 * Optical weight: Sottile ma visibile, non invasiva
 * States: Supporta rotazione per expand/collapse
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export const ChevronDownIcon: React.FC<IconBaseProps> = (props) => {
  return (
    <IconBase {...props}>
      <path d="M6 9l6 6 6-6" strokeWidth="1.5" />
    </IconBase>
  );
};
