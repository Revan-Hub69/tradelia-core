/**
 * SEMANTIC ANIMATIONS SYSTEM v2.0 - Enterprise 2026
 *
 * Sistema di animazioni semantiche che assegna significato specifico
 * a diversi tipi di transizioni e feedback
 *
 * Basato su ricerca UX 2026:
 * - Enter ≠ Exit ≠ Error ≠ Success
 * - Ogni animazione comunica intento e stato
 * - Consistenza semantica attraverso l'interfaccia
 */

'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import { cn } from '../../utils/Helpers';

// Tipi semantici per le animazioni
export type SemanticType =
  | 'enter' // Elementi che entrano nella vista - welcoming
  | 'exit' // Elementi che escono dalla vista - gentle departure
  | 'success' // Feedback positivo - celebration
  | 'error' // Feedback di errore - attention without jarring
  | 'warning' // Avvisi - cautious attention
  | 'info' // Informazioni - neutral presentation
  | 'loading' // Stati di caricamento - patient waiting
  | 'focus' // Stati di focus - gentle emphasis
  | 'hover' // Interazioni hover - anticipatory
  | 'press' // Feedback di pressione - immediate response
  | 'complete' // Completamento task - achievement
  | 'progress'; // Progresso in corso - forward momentum;

export type AnimationContext =
  | 'navigation' // Navigazione tra pagine/sezioni
  | 'modal' // Apertura/chiusura modali
  | 'form' // Interazioni form
  | 'feedback' // Messaggi di feedback
  | 'content' // Contenuto dinamico
  | 'ui'; // Elementi UI generici;

// Props per animazioni semantiche
type SemanticAnimationProps = {
  children: ReactNode;
  type: SemanticType;
  context?: AnimationContext;
  intensity?: 'subtle' | 'normal' | 'prominent';
  duration?: 'fast' | 'normal' | 'slow' | number;
  delay?: number;
  disabled?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Componente principale per animazioni semantiche
 */
export const SemanticAnimation = forwardRef<HTMLDivElement, SemanticAnimationProps>(
  ({
    children,
    type,
    context = 'ui',
    intensity = 'normal',
    duration = 'normal',
    delay = 0,
    disabled = false,
    className,
    style,
    ...props
  }, ref) => {
    // Calcola le classi CSS semantiche
    const semanticClasses = cn(
      'semantic-animation',
      `semantic-${type}`,
      `semantic-context-${context}`,
      `semantic-intensity-${intensity}`,
      typeof duration === 'string' && `semantic-duration-${duration}`,
      disabled && 'semantic-disabled',
      className,
    );

    // Style con durata personalizzata e delay
    const semanticStyle = {
      '--semantic-duration': typeof duration === 'number' ? `${duration}ms` : undefined,
      '--semantic-delay': delay ? `${delay}ms` : undefined,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={semanticClasses}
        style={semanticStyle}
        {...props}
      >
        {children}
      </div>
    );
  },
);

SemanticAnimation.displayName = 'SemanticAnimation';

/**
 * Componenti specializzati per casi d'uso specifici
 */

// Animazione di entrata - welcoming e inviting
export const EnterAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'ui', className }) => (
  <SemanticAnimation
    type="enter"
    context={context}
    intensity="normal"
    className={cn('animate-enter', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di uscita - gentle e confident
export const ExitAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'ui', className }) => (
  <SemanticAnimation
    type="exit"
    context={context}
    intensity="normal"
    duration="fast"
    className={cn('animate-exit', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di successo - celebratory ma non eccessiva
export const SuccessAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  prominent?: boolean;
  className?: string;
}> = ({ children, context = 'feedback', prominent = false, className }) => (
  <SemanticAnimation
    type="success"
    context={context}
    intensity={prominent ? 'prominent' : 'normal'}
    duration="slow"
    className={cn('animate-success', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di errore - attention senza essere jarring
export const ErrorAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'feedback', className }) => (
  <SemanticAnimation
    type="error"
    context={context}
    intensity="normal"
    className={cn('animate-error', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di warning - cautious attention
export const WarningAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'feedback', className }) => (
  <SemanticAnimation
    type="warning"
    context={context}
    intensity="normal"
    className={cn('animate-warning', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di loading - patient e reassuring
export const LoadingAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'ui', className }) => (
  <SemanticAnimation
    type="loading"
    context={context}
    intensity="subtle"
    duration="slow"
    className={cn('animate-loading', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di completamento - achievement celebration
export const CompleteAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'feedback', className }) => (
  <SemanticAnimation
    type="complete"
    context={context}
    intensity="prominent"
    duration="slow"
    delay={65} // Micro-delay per anticipazione
    className={cn('animate-complete', className)}
  >
    {children}
  </SemanticAnimation>
);

// Animazione di progresso - forward momentum
export const ProgressAnimation: React.FC<{
  children: ReactNode;
  context?: AnimationContext;
  className?: string;
}> = ({ children, context = 'ui', className }) => (
  <SemanticAnimation
    type="progress"
    context={context}
    intensity="subtle"
    className={cn('animate-progress', className)}
  >
    {children}
  </SemanticAnimation>
);

/**
 * Hook per gestione semantica delle animazioni
 */
export const useSemanticAnimations = () => {
  const [currentAnimation, setCurrentAnimation] = React.useState<SemanticType | null>(null);
  const [animationQueue, setAnimationQueue] = React.useState<SemanticType[]>([]);

  // Trigger animazione semantica
  const triggerAnimation = React.useCallback((type: SemanticType) => {
    setCurrentAnimation(type);

    // Durate basate sul tipo semantico
    const durations = {
      enter: 300,
      exit: 200,
      success: 600,
      error: 400,
      warning: 350,
      info: 250,
      loading: 1200,
      focus: 200,
      hover: 180,
      press: 120,
      complete: 800,
      progress: 400,
    };

    const duration = durations[type];

    setTimeout(() => {
      setCurrentAnimation(null);
    }, duration);
  }, []);

  // Queue multiple animations
  const queueAnimation = React.useCallback((type: SemanticType) => {
    setAnimationQueue(prev => [...prev, type]);
  }, []);

  // Process animation queue
  React.useEffect(() => {
    if (animationQueue.length > 0 && !currentAnimation) {
      const nextAnimation = animationQueue[0];
      if (nextAnimation) {
        setAnimationQueue(prev => prev.slice(1));
        triggerAnimation(nextAnimation);
      }
    }
  }, [animationQueue, currentAnimation, triggerAnimation]);

  return {
    currentAnimation,
    triggerAnimation,
    queueAnimation,
    isAnimating: currentAnimation !== null,
  };
};

/**
 * Definizioni delle animazioni semantiche in CSS-in-JS
 * Per uso programmatico o integrazione con librerie di animazione
 */
export const semanticAnimationDefinitions = {
  enter: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-enter
      },
    },
  },

  exit: {
    exit: {
      opacity: 0,
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.55, 0.055, 0.675, 0.19], // ease-exit
      },
    },
  },

  success: {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.3, 1],
        ease: [0.34, 1.56, 0.64, 1], // ease-tradelia
      },
    },
  },

  error: {
    animate: {
      x: [0, -4, 4, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.265, 1.55], // ease-bounce
      },
    },
  },

  warning: {
    animate: {
      scale: [1, 1.02, 1],
      y: [0, -2, 0],
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-gentle
      },
    },
  },

  loading: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  complete: {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
      y: [0, -5, 0],
      transition: {
        duration: 0.8,
        times: [0, 0.4, 1],
        ease: [0.175, 0.885, 0.32, 1.275], // ease-elastic
      },
    },
  },

  progress: {
    animate: {
      x: [0, 10, 0],
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-gentle
      },
    },
  },
} as const;

/**
 * Utility per mapping semantico
 */
export const getSemanticAnimation = (type: SemanticType, context?: AnimationContext) => {
  const baseClass = `semantic-${type}`;
  const contextClass = context ? `semantic-context-${context}` : '';

  return cn(baseClass, contextClass);
};

// Export del sistema completo
export default {
  SemanticAnimation,
  EnterAnimation,
  ExitAnimation,
  SuccessAnimation,
  ErrorAnimation,
  WarningAnimation,
  LoadingAnimation,
  CompleteAnimation,
  ProgressAnimation,
  useSemanticAnimations,
  semanticAnimationDefinitions,
  getSemanticAnimation,
};
