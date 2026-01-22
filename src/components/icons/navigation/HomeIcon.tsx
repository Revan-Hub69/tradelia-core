/*
 * HOME ICON - Tradelia Signature v2026
 *
 * Design: Casa precisa con nodo signature geometrico.
 * Grid: 24px, stroke 1.75.
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type HomeIconProps = IconBaseProps & {
  isActive?: boolean;
};

export const HomeIcon: React.FC<HomeIconProps> = ({
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
      <path d="M4 11.5l8-6.5 8 6.5" />
      <path d="M6.5 10.5v8.5a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-8.5" />
      <path d="M10.5 20v-4.5a1.5 1.5 0 0 1 3 0V20" />
      <path d="M18 4.5l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
};
