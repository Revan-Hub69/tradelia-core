/*
 * COMMUNITY ICON - Tradelia Signature v2026
 *
 * Design: Gruppo essenziale con nodo signature geometrico.
 * Grid: 24px, stroke 1.75.
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type CommunityIconProps = IconBaseProps & {
  isActive?: boolean;
};

export const CommunityIcon: React.FC<CommunityIconProps> = ({
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
      <circle cx="12" cy="9" r="2.6" />
      <circle cx="6.2" cy="10.5" r="1.6" />
      <circle cx="17.8" cy="10.5" r="1.6" />
      <path d="M5 19a7 7 0 0 1 14 0" />
      <path d="M3.8 17.6a4 4 0 0 1 4.2-2.4" />
      <path d="M20.2 17.6a4 4 0 0 0-4.2-2.4" />
      <path d="M18 4.5l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
};
