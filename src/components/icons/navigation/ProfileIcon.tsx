/*
 * PROFILE ICON - Tradelia Signature v2026
 *
 * Design: Avatar essenziale con nodo signature geometrico.
 * Grid: 24px, stroke 1.75.
 */

import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type ProfileIconProps = IconBaseProps & {
  isActive?: boolean;
};

export const ProfileIcon: React.FC<ProfileIconProps> = ({
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
      <circle cx="12" cy="8.5" r="3" />
      <path d="M5 19a7 7 0 0 1 14 0" />
      <path d="M18 4.5l1.5 1.5-1.5 1.5-1.5-1.5z" fill="currentColor" stroke="none" />
    </IconBase>
  );
};
