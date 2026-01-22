/*
 * LEARN ICON - Tradelia Signature v2026
 *
 * Design: Libro aperto con nodo signature geometrico.
 * Grid: 24px, stroke 1.75.
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type LearnIconProps = IconBaseProps & {
  isActive?: boolean;
};

export const LearnIcon: React.FC<LearnIconProps> = ({
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
      <path d="M4.5 7.5h6.2a2.8 2.8 0 0 1 2.8 2.8V20" />
      <path d="M19.5 7.5h-6.2a2.8 2.8 0 0 0-2.8 2.8V20" />
      <path d="M4.5 16.5h6.2a2.8 2.8 0 0 1 2.8 2.8" />
      <path d="M19.5 16.5h-6.2a2.8 2.8 0 0 0-2.8 2.8" />
      <path d="M18 4.5l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
};
