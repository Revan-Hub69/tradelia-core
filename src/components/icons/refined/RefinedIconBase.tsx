/*
 * REFINED ICON BASE - Tradelia Signature 2026
 *
 * Sistema di icone raffinate e leggiadre:
 * - SVG minimalisti e eleganti
 * - Animazioni solo su interazione
 * - Design premium senza eccessi
 * - Performance ottimizzate
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { cn } from '@/utils/Helpers';

// ============================================================================
// Types & Design Tokens
// ============================================================================

export type RefinedIconSize = 16 | 20 | 24 | 28 | 32;
export type RefinedIconWeight = 'light' | 'regular' | 'medium';
export type RefinedIconState = 'default' | 'hover' | 'active' | 'disabled';

// Design tokens raffinati
export const REFINED_TOKENS = {
  sizes: {
    16: { size: 16, strokeWidth: 1.5 },
    20: { size: 20, strokeWidth: 1.75 },
    24: { size: 24, strokeWidth: 2 },
    28: { size: 28, strokeWidth: 2.25 },
    32: { size: 32, strokeWidth: 2.5 },
  },
  weights: {
    light: 1.25,
    regular: 1.75,
    medium: 2.25,
  },
  // Transizioni eleganti e discrete
  transitions: {
    gentle: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
    smooth: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
} as const;

export type RefinedIconProps = {
  size?: RefinedIconSize;
  weight?: RefinedIconWeight;
  state?: RefinedIconState;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  children: React.ReactNode;
  // Interazioni discrete
  onHover?: () => void;
  onPress?: () => void;
};

// ============================================================================
// Refined Icon Base Component
// ============================================================================

export const RefinedIconBase: React.FC<RefinedIconProps> = ({
  size = 20,
  weight = 'regular',
  state = 'default',
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  children,
  onHover,
  onPress,
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeToken = REFINED_TOKENS.sizes[size];
  const strokeWidth = REFINED_TOKENS.weights[weight];
  
  // Animazioni discrete - solo su interazione
  const getAnimationProps = () => {
    if (prefersReducedMotion) {
      return {};
    }

    switch (state) {
      case 'hover':
        return {
          scale: 1.05,
          opacity: 0.9,
        };
      case 'active':
        return {
          scale: 1.1,
          opacity: 1,
        };
      case 'disabled':
        return {
          scale: 1,
          opacity: 0.4,
        };
      default:
        return {
          scale: 1,
          opacity: 1,
        };
    }
  };

  return (
    <motion.svg
      width={sizeToken.size}
      height={sizeToken.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        // Base styles eleganti
        'flex-shrink-0 select-none',
        // Performance
        'transform-gpu',
        // Accessibility
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1',
        className,
      )}
      // Animazioni discrete
      animate={getAnimationProps()}
      transition={REFINED_TOKENS.transitions.gentle}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05, opacity: 0.9 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      // Event handlers
      onHoverStart={onHover}
      onTapStart={onPress}
    >
      {children}
    </motion.svg>
  );
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook per stati delle icone raffinate
 */
export const useRefinedIconState = (initialState: RefinedIconState = 'default') => {
  const [state, setState] = React.useState<RefinedIconState>(initialState);

  const handlers = {
    onMouseEnter: () => setState('hover'),
    onMouseLeave: () => setState('default'),
    onMouseDown: () => setState('active'),
    onMouseUp: () => setState('hover'),
    onFocus: () => setState('hover'),
    onBlur: () => setState('default'),
  };

  return { state, setState, handlers };
};