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
  'strokeWidth'?: 1.5 | 1.75 | 2;
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
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        // Base styles
        'flex-shrink-0',
        // Motion - solo transform/opacity per performance
        'transition-transform duration-150 ease-out',
        // State variations
        {
          'scale-100 opacity-100': state === 'default',
          'scale-110 opacity-100': state === 'active',
          'scale-95 opacity-90': state === 'pressed',
          'scale-100 opacity-40': state === 'disabled',
        },
        className,
      )}
      style={{
        // Ensure proper rendering for 3D transforms
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        // Hardware acceleration
        willChange: 'transform',
      }}
    >
      {children}
    </svg>
  );
};
