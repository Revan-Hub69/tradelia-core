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
