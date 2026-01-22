/*
 * PREMIUM ICON BASE v4.0 - Tradelia Signature 2026
 *
 * Sistema di icone premium con:
 * - Spring physics animations (Framer Motion)
 * - Microinterazioni Apple/Linear/Stripe level
 * - Design tokens per consistenza
 * - Accessibility compliant
 * - Performance optimized
 */

'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import React from 'react';

import { cn } from '@/utils/Helpers';

// ============================================================================
// Types & Design Tokens
// ============================================================================

export type IconSize = 12 | 16 | 20 | 24 | 28 | 32;
export type IconWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold';
export type IconState = 'default' | 'hover' | 'active' | 'pressed' | 'disabled';
export type MotionLevel = 'none' | 'reduced' | 'full';

// Design tokens per consistenza
export const ICON_TOKENS = {
  sizes: {
    12: { size: 12, strokeWidth: 1.25, viewBox: '0 0 24 24' },
    16: { size: 16, strokeWidth: 1.5, viewBox: '0 0 24 24' },
    20: { size: 20, strokeWidth: 1.75, viewBox: '0 0 24 24' },
    24: { size: 24, strokeWidth: 2, viewBox: '0 0 24 24' },
    28: { size: 28, strokeWidth: 2.25, viewBox: '0 0 24 24' },
    32: { size: 32, strokeWidth: 2.5, viewBox: '0 0 24 24' },
  },
  weights: {
    thin: 1,
    light: 1.25,
    regular: 1.5,
    medium: 1.75,
    bold: 2,
  },
  // Spring physics per animazioni premium
  springs: {
    gentle: { type: 'spring', stiffness: 300, damping: 30 },
    bouncy: { type: 'spring', stiffness: 400, damping: 25 },
    snappy: { type: 'spring', stiffness: 500, damping: 30 },
  },
} as const;

export type PremiumIconProps = {
  size?: IconSize;
  weight?: IconWeight;
  state?: IconState;
  motionLevel?: MotionLevel;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  children: React.ReactNode;
  // Microinterazioni premium
  onHover?: () => void;
  onPress?: () => void;
  // Haptic feedback
  enableHaptics?: boolean;
};

// ============================================================================
// Animation Variants
// ============================================================================

const createIconVariants = (motionLevel: MotionLevel): Variants => {
  if (motionLevel === 'none') {
    return {
      default: { scale: 1, rotate: 0 },
      hover: { scale: 1, rotate: 0 },
      active: { scale: 1, rotate: 0 },
      pressed: { scale: 1, rotate: 0 },
      disabled: { scale: 1, rotate: 0, opacity: 0.4 },
    };
  }

  if (motionLevel === 'reduced') {
    return {
      default: { scale: 1, rotate: 0, opacity: 1 },
      hover: { scale: 1.05, opacity: 1 },
      active: { scale: 1.1, opacity: 1 },
      pressed: { scale: 0.95, opacity: 0.9 },
      disabled: { scale: 1, rotate: 0, opacity: 0.4 },
    };
  }

  // Full motion - Premium microinterazioni
  return {
    default: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      filter: 'brightness(1) saturate(1)',
    },
    hover: { 
      scale: 1.1, 
      rotate: 2,
      opacity: 1,
      filter: 'brightness(1.1) saturate(1.1)',
    },
    active: { 
      scale: 1.15, 
      rotate: 5,
      opacity: 1,
      filter: 'brightness(1.2) saturate(1.2)',
    },
    pressed: { 
      scale: 0.9, 
      rotate: -1,
      opacity: 0.9,
      filter: 'brightness(0.9) saturate(0.9)',
    },
    disabled: { 
      scale: 1, 
      rotate: 0, 
      opacity: 0.4,
      filter: 'brightness(0.7) saturate(0.5)',
    },
  };
};

// ============================================================================
// Premium Icon Base Component
// ============================================================================

export const PremiumIconBase: React.FC<PremiumIconProps> = ({
  size = 20,
  weight = 'regular',
  state = 'default',
  motionLevel,
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  children,
  onHover,
  onPress,
  enableHaptics = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionLevel || (prefersReducedMotion ? 'reduced' : 'full');
  
  const sizeToken = ICON_TOKENS.sizes[size];
  const strokeWidth = ICON_TOKENS.weights[weight];
  const variants = createIconVariants(effectiveMotion);
  
  // Haptic feedback
  const triggerHaptic = (intensity: number = 30) => {
    if (enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(intensity);
    }
  };

  const handleHover = () => {
    onHover?.();
    if (effectiveMotion === 'full') {
      triggerHaptic(20);
    }
  };

  const handlePress = () => {
    onPress?.();
    if (effectiveMotion === 'full') {
      triggerHaptic(40);
    }
  };

  return (
    <motion.svg
      width={sizeToken.size}
      height={sizeToken.size}
      viewBox={sizeToken.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        // Base styles
        'flex-shrink-0 select-none',
        // Performance optimizations
        'transform-gpu will-change-transform',
        // Accessibility
        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
        className,
      )}
      style={{
        // Hardware acceleration
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
      // Animation
      variants={variants}
      initial="default"
      animate={state}
      whileHover="hover"
      whileTap="pressed"
      transition={ICON_TOKENS.springs.gentle}
      // Event handlers
      onHoverStart={handleHover}
      onTapStart={handlePress}
    >
      {children}
    </motion.svg>
  );
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook per gestire stati delle icone con microinterazioni
 */
export const useIconState = (initialState: IconState = 'default') => {
  const [state, setState] = React.useState<IconState>(initialState);

  const handlers = {
    onMouseEnter: () => setState('hover'),
    onMouseLeave: () => setState('default'),
    onMouseDown: () => setState('pressed'),
    onMouseUp: () => setState('hover'),
    onFocus: () => setState('hover'),
    onBlur: () => setState('default'),
  };

  return { state, setState, handlers };
};

/**
 * Hook per animazioni sequenziali (es. loading states)
 */
export const useIconSequence = (sequence: IconState[], duration: number = 500) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (sequence.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sequence.length);
    }, duration);

    return () => clearInterval(interval);
  }, [sequence, duration]);

  return sequence[currentIndex];
};