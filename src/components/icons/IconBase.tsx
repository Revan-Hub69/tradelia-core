/*
 * TRADELIA ICON BASE v2.0 - Enterprise 2026
 * 
 * Base component per tutte le icone SVG custom
 * Standard: 24x24 grid, stroke 1.75, optical balance
 */

import { cn } from '@/utils/Helpers';
import React from 'react';

export interface IconBaseProps {
  size?: 16 | 20 | 24;
  strokeWidth?: 1.5 | 1.75 | 2;
  state?: 'default' | 'active' | 'pressed' | 'disabled';
  className?: string;
  'aria-hidden'?: boolean;
}

export interface IconProps extends IconBaseProps {
  children: React.ReactNode;
}

export const IconBase: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  state = 'default',
  className,
  'aria-hidden': ariaHidden = true,
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
      className={cn(
        // Base styles
        'flex-shrink-0',
        // Motion - solo transform/opacity per performance
        'transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]',
        // State variations
        {
          'scale-100 opacity-100': state === 'default',
          'scale-110 opacity-100': state === 'active',
          'scale-95 opacity-90': state === 'pressed',
          'scale-100 opacity-40': state === 'disabled',
        },
        className
      )}
    >
      {children}
    </svg>
  );
};