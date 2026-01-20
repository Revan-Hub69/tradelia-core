/**
 * TRADELIA MOTION SYSTEM v2.0 - Enterprise 2026
 *
 * Sistema di motion design basato su best practice enterprise:
 * - Microsoft Fluent 2 Design System
 * - Apple Human Interface Guidelines
 * - Material Design Motion
 * - Linear/Stripe performance standards
 *
 * Implementa signature motion patterns con personalità Tradelia
 */

'use client';

import { cn } from '../../utils/Helpers';
import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

// Tipi per le animazioni signature Tradelia
export type MotionType =
  | 'enter'
  | 'exit'
  | 'success'
  | 'error'
  | 'focus'
  | 'press'
  | 'hover';

export type MotionIntensity = 'micro' | 'small' | 'medium' | 'large';

export type StaggerDirection = 'up' | 'down' | 'left' | 'right';

// Props per il componente motion principale
type TradeliaMotionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  type?: MotionType;
  intensity?: MotionIntensity;
  delay?: number;
  disabled?: boolean;
  stagger?: boolean;
  staggerDirection?: StaggerDirection;
  anticipatory?: boolean;
};

// Props per animazioni specifiche
type PressMotionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  disabled?: boolean;
  anticipatory?: boolean;
};

type HoverMotionProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  disabled?: boolean;
  subtle?: boolean;
};

type StaggerContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  intensity?: MotionIntensity;
  direction?: StaggerDirection;
  disabled?: boolean;
};

/**
 * Componente principale per motion Tradelia
 * Applica signature motion patterns con personalità enterprise
 */
export const TradeliaMotion = forwardRef<HTMLDivElement, TradeliaMotionProps>(
  ({
    children,
    type = 'enter',
    intensity = 'medium',
    delay = 0,
    disabled = false,
    stagger = false,
    staggerDirection = 'up',
    anticipatory = false,
    className,
    style,
    ...props
  }, ref) => {
    // Calcola le classi CSS basate sui props
    const motionClasses = cn(
      // Classe base per motion Tradelia
      'tradelia-motion',

      // Tipo di animazione
      type && `animate-tradelia-${type}`,

      // Intensità (influenza timing e easing)
      intensity && `motion-intensity-${intensity}`,

      // Stagger se abilitato
      stagger && 'stagger-children',
      stagger && intensity && `stagger-children-${intensity}`,

      // Anticipatory feedback
      anticipatory && 'motion-anticipatory',

      // Disabilita motion se richiesto
      disabled && 'motion-disabled',

      className,
    );

    // Style personalizzato con delay
    const motionStyle = {
      '--motion-delay': delay ? `${delay}ms` : undefined,
      '--stagger-direction': staggerDirection,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={motionClasses}
        style={motionStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TradeliaMotion.displayName = 'TradeliaMotion';

/**
 * Componente per press feedback con anticipazione
 * Implementa il sistema di feedback tattile visivo
 */
export const PressMotion = forwardRef<HTMLDivElement, PressMotionProps>(
  ({ children, disabled = false, anticipatory = true, className, ...props }, ref) => {
    const pressClasses = cn(
      'press-feedback',
      anticipatory && 'press-anticipatory',
      disabled && 'press-disabled',
      className,
    );

    return (
      <div
        ref={ref}
        className={pressClasses}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PressMotion.displayName = 'PressMotion';

/**
 * Componente per hover motion con anticipazione
 * Implementa hover states premium con micro-delays
 */
export const HoverMotion = forwardRef<HTMLDivElement, HoverMotionProps>(
  ({ children, disabled = false, subtle = false, className, ...props }, ref) => {
    const hoverClasses = cn(
      'hover-anticipation',
      subtle && 'hover-subtle',
      disabled && 'hover-disabled',
      className,
    );

    return (
      <div
        ref={ref}
        className={hoverClasses}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HoverMotion.displayName = 'HoverMotion';

/**
 * Container per animazioni staggered
 * Implementa choreografia intelligente per gruppi di elementi
 */
export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({
    children,
    intensity = 'medium',
    direction = 'up',
    disabled = false,
    className,
    style,
    ...props
  }, ref) => {
    const staggerClasses = cn(
      'stagger-container',
      `stagger-children-${intensity}`,
      `stagger-direction-${direction}`,
      disabled && 'stagger-disabled',
      className,
    );

    const staggerStyle = {
      '--stagger-direction': direction,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={staggerClasses}
        style={staggerStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

StaggerContainer.displayName = 'StaggerContainer';

/**
 * Hook per motion personalizzato
 * Fornisce controllo programmatico delle animazioni
 */
export const useTradeliaMotion = () => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [motionPreference, setMotionPreference] = React.useState<'full' | 'reduced' | 'none'>('full');

  // Rileva preferenze motion dell'utente
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionPreference(e.matches ? 'reduced' : 'full');
    };

    setMotionPreference(mediaQuery.matches ? 'reduced' : 'full');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Funzioni per controllo animazioni
  const triggerMotion = React.useCallback((type: MotionType, duration?: number) => {
    if (motionPreference === 'none') {
      return;
    }

    setIsAnimating(true);

    const timeout = duration || (motionPreference === 'reduced' ? 150 : 300);
    setTimeout(() => setIsAnimating(false), timeout);
  }, [motionPreference]);

  const shouldAnimate = React.useCallback((motionType: MotionType) => {
    if (motionPreference === 'none') {
      return false;
    }
    if (motionPreference === 'reduced' && ['success', 'error'].includes(motionType)) {
      return false;
    }
    return true;
  }, [motionPreference]);

  return {
    isAnimating,
    motionPreference,
    triggerMotion,
    shouldAnimate,
  };
};

/**
 * Utility functions per motion tokens
 */
export const motionTokens = {
  // Durate basate su best practice 2026
  duration: {
    instant: 0,
    micro: 120,
    quick: 180,
    base: 280,
    smooth: 350,
    slow: 450,
  },

  // Delays per anticipatory feedback
  delay: {
    micro: 45,
    small: 65,
    medium: 100,
    large: 150,
  },

  // Easing curves signature Tradelia
  easing: {
    tradelia: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    confident: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    exit: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Stagger timing per choreografia
  stagger: {
    micro: 30,
    small: 50,
    medium: 80,
    large: 120,
  },
} as const;

/**
 * Componenti di convenienza per casi d'uso comuni
 */

// Success celebration motion
export const SuccessMotion: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <TradeliaMotion
    type="success"
    intensity="medium"
    anticipatory
    className={className}
  >
    {children}
  </TradeliaMotion>
);

// Error shake motion
export const ErrorMotion: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <TradeliaMotion
    type="error"
    intensity="small"
    className={className}
  >
    {children}
  </TradeliaMotion>
);

// Focus motion per accessibility
export const FocusMotion: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <TradeliaMotion
    type="focus"
    intensity="micro"
    anticipatory
    className={className}
  >
    {children}
  </TradeliaMotion>
);

// Export del sistema completo
export default {
  TradeliaMotion,
  PressMotion,
  HoverMotion,
  StaggerContainer,
  SuccessMotion,
  ErrorMotion,
  FocusMotion,
  useTradeliaMotion,
  motionTokens,
};