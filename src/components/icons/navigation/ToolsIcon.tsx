/*
 * TOOLS ICON - Tradelia Signature v2026
 *
 * Design: Toolbox essenziale con nodo signature geometrico.
 * Grid: 24px, stroke 1.75.
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type ToolsIconProps = IconBaseProps & {
  isActive?: boolean;
};

export const ToolsIcon: React.FC<ToolsIconProps> = ({
  isActive = false,
  className,
  ...props
}) => {
  return (
    <IconBase
      className={className}
      state={isActive ? 'active' : 'default'}
      {...props}
    >
      <path d="M5 9h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" />
      <path d="M8 9V7.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V9" />
      <path d="M10 14h4" />
      <path d="M18 4.5l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
};
