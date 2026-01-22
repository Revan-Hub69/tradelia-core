/*
 * TRADELIA ICON BASE v3.0 - Signature Premium 2026
 *
 * Base component per tutte le icone SVG custom con signature animations
 * Standard: 24x24 grid, stroke 1.75, optical balance
 * Premium: Framer Motion integration, motion preferences, haptic feedback
 */

'use client';

import React from 'react';

import { cn } from '@/utils/Helpers';

export type IconBaseProps = {
  'size'?: 16 | 20 | 24;
  'strokeWidth'?: 1.75 | 2;
  'state'?: 'default' | 'active' | 'pressed' | 'disabled';
  'className'?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
};

export type IconProps = {
  children: React.ReactNode;
} & IconBaseProps;

export const IconBase: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  state = 'default',
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  children,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      shapeRendering="geometricPrecision"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      data-state={state}
      className={cn(
        'tradelia-icon',
        'icon-tone-default',
        `icon-state-${state}`,
        className,
      )}
    >
      {children}
    </svg>
  );
};
