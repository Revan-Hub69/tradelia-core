/**
 * MOTION TOKENS v2.0 - Enterprise 2026
 * 
 * Esportazione programmatica dei motion tokens per uso in JavaScript/TypeScript
 * Sincronizzato con motion-tokens.css
 * 
 * Basato su best practice enterprise:
 * - Microsoft Fluent 2 Design System
 * - Apple Human Interface Guidelines
 * - Material Design Motion
 * - Linear/Stripe performance standards
 */

// Durate base (in millisecondi)
export const duration = {
  instant: 0,
  micro: 120,        // Button press, toggle, hover feedback
  quick: 180,        // Small element transitions
  base: 280,         // Modal open, card expand
  smooth: 350,       // Page transitions, large movements
  slow: 450,         // Complex animations, onboarding
} as const;

// Delays per anticipatory feedback (in millisecondi)
export const delay = {
  micro: 45,         // Subtle anticipation before action
  small: 65,         // Staggered animations start
  medium: 100,       // Sequential element reveals
  large: 150,        // Dramatic effect spacing
} as const;

// Easing curves signature Tradelia
export const easing = {
  // Signature Tradelia curves
  tradelia: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  confident: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Context-specific easing
  enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',    // Welcoming entry
  exit: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',   // Confident exit
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful feedback
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elastic response
} as const;

// Semantic motion patterns
export const semantic = {
  success: {
    duration: 600,
    ease: easing.tradelia,
    delay: delay.small,
  },
  error: {
    duration: 400,
    ease: easing.bounce,
    delay: delay.micro,
  },
  loading: {
    duration: 1200,
    ease: 'linear',
    delay: 0,
  },
  focus: {
    duration: 200,
    ease: easing.gentle,
    delay: delay.micro,
  },
} as const;

// Anticipatory feedback system
export const anticipatory = {
  press: {
    anticipationDelay: delay.micro,
    feedbackDuration: duration.micro,
    recoveryDuration: duration.micro * 1.2,
    ease: easing.confident,
  },
  hover: {
    anticipationDelay: 20,
    feedbackDuration: duration.quick,
    ease: easing.gentle,
  },
} as const;

// Stagger timing per choreografia
export const stagger = {
  micro: 30,         // Tight grouping
  small: 50,         // Related items
  medium: 80,        // Distinct groups
  large: 120,        // Dramatic reveals
} as const;

// Responsive multipliers
export const responsive = {
  mobile: 0.8,       // Più veloce per touch immediato
  desktop: 1.0,      // Standard per precisione mouse
  highRefresh: 0.7,  // Ottimizzazione per 120Hz+
} as const;

// Haptic-like patterns
export const haptic = {
  light: {
    intensity: 'subtle' as const,
    duration: 80,
    scale: 0.98,
  },
  medium: {
    intensity: 'normal' as const,
    duration: 120,
    scale: 0.96,
  },
  heavy: {
    intensity: 'prominent' as const,
    duration: 160,
    scale: 0.94,
  },
  success: {
    intensity: 'normal' as const,
    duration: 200,
    scale: 1.02,
    bounce: true,
  },
  warning: {
    intensity: 'normal' as const,
    duration: 150,
    scale: 0.98,
    shake: true,
  },
  error: {
    intensity: 'prominent' as const,
    duration: 180,
    scale: 0.96,
    shake: true,
  },
} as const;

// Utility functions per calcoli dinamici
export const utils = {
  /**
   * Calcola durata basata su distanza e velocità
   */
  calculateDuration: (distance: number, baseSpeed: number = 1000): number => {
    return Math.max(duration.micro, Math.min(duration.slow, distance / baseSpeed * 1000));
  },

  /**
   * Calcola delay per stagger basato su indice
   */
  calculateStaggerDelay: (index: number, staggerType: keyof typeof stagger = 'medium'): number => {
    return stagger[staggerType] * index;
  },

  /**
   * Applica moltiplicatore responsive
   */
  applyResponsiveMultiplier: (baseDuration: number, multiplier: keyof typeof responsive): number => {
    return baseDuration * responsive[multiplier];
  },

  /**
   * Genera CSS custom property string
   */
  toCSSCustomProperty: (value: number | string): string => {
    return typeof value === 'number' ? `${value}ms` : value;
  },

  /**
   * Converte easing name in CSS value
   */
  getEasingValue: (easingName: keyof typeof easing): string => {
    return easing[easingName];
  },
} as const;

// Presets per casi d'uso comuni
export const presets = {
  // Button interactions
  button: {
    hover: {
      duration: duration.quick,
      ease: easing.gentle,
      delay: anticipatory.hover.anticipationDelay,
    },
    press: {
      duration: duration.micro,
      ease: easing.confident,
      delay: anticipatory.press.anticipationDelay,
    },
  },

  // Modal animations
  modal: {
    enter: {
      duration: duration.base,
      ease: easing.enter,
      delay: delay.small,
    },
    exit: {
      duration: duration.quick,
      ease: easing.exit,
      delay: 0,
    },
  },

  // Navigation transitions
  navigation: {
    pageTransition: {
      duration: duration.smooth,
      ease: easing.gentle,
      delay: 0,
    },
    menuSlide: {
      duration: duration.base,
      ease: easing.tradelia,
      delay: delay.micro,
    },
  },

  // Feedback animations
  feedback: {
    success: semantic.success,
    error: semantic.error,
    loading: semantic.loading,
  },

  // List animations
  list: {
    staggerEnter: {
      duration: duration.base,
      ease: easing.enter,
      stagger: stagger.medium,
    },
    staggerExit: {
      duration: duration.quick,
      ease: easing.exit,
      stagger: stagger.small,
    },
  },
} as const;

// Validazione e type guards
export const validators = {
  /**
   * Verifica se una durata è valida
   */
  isValidDuration: (value: number): boolean => {
    return value >= 0 && value <= 2000; // Max 2 secondi
  },

  /**
   * Verifica se un delay è ragionevole
   */
  isValidDelay: (value: number): boolean => {
    return value >= 0 && value <= 500; // Max 500ms delay
  },

  /**
   * Verifica se un easing è valido
   */
  isValidEasing: (value: string): boolean => {
    return Object.values(easing).includes(value as any) || 
           /^cubic-bezier\([\d\.\-,\s]+\)$/.test(value) ||
           ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(value);
  },
} as const;

// Export del sistema completo come default
export default {
  duration,
  delay,
  easing,
  semantic,
  anticipatory,
  stagger,
  responsive,
  haptic,
  utils,
  presets,
  validators,
} as const;

// Type exports per TypeScript
export type Duration = keyof typeof duration;
export type Delay = keyof typeof delay;
export type Easing = keyof typeof easing;
export type StaggerType = keyof typeof stagger;
export type ResponsiveMultiplier = keyof typeof responsive;
export type HapticPattern = keyof typeof haptic;
export type PresetCategory = keyof typeof presets;