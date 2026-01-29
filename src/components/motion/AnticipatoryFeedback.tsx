/**
 * ANTICIPATORY FEEDBACK SYSTEM v2.0 - Enterprise 2026
 *
 * Sistema di feedback anticipatorio che guida le azioni dell'utente
 * invece di limitarsi a seguirle
 *
 * Basato su ricerca UX 2026:
 * - Micro-delays (40-60ms) per premium feel
 * - Feedback che anticipa l'azione, non la segue
 * - Haptic-like visual feedback senza haptic reale
 * - Press feedback che guida l'utente verso l'azione
 */

'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useCallback, useRef, useState } from 'react';

import { cn } from '../../utils/Helpers';

// Tipi per feedback anticipatorio
export type FeedbackType =
  | 'press' // Feedback di pressione con anticipazione
  | 'hover' // Hover con micro-delay anticipatorio
  | 'focus' // Focus con preparazione visiva
  | 'drag' // Feedback per drag operations
  | 'swipe' // Feedback per swipe gestures
  | 'long-press'; // Long press con buildup progressivo;

export type FeedbackIntensity = 'subtle' | 'normal' | 'prominent';

export type HapticPattern =
  | 'light' // Tap leggero
  | 'medium' // Tap medio
  | 'heavy' // Tap pesante
  | 'success' // Pattern di successo
  | 'warning' // Pattern di warning
  | 'error'; // Pattern di errore

// Props per componente anticipatory feedback
type AnticipatoryFeedbackProps = {
  children: ReactNode;
  type?: FeedbackType;
  intensity?: FeedbackIntensity;
  hapticPattern?: HapticPattern;
  anticipationDelay?: number;
  disabled?: boolean;
  onAnticipate?: () => void;
  onActivate?: () => void;
  onComplete?: () => void;
} & HTMLAttributes<HTMLDivElement>;

// Props per press feedback specifico
type PressAnticipatoryProps = {
  children: ReactNode;
  intensity?: FeedbackIntensity;
  hapticPattern?: HapticPattern;
  disabled?: boolean;
  onPress?: () => void;
  onRelease?: () => void;
} & HTMLAttributes<HTMLButtonElement>;

// Props per hover anticipatorio
type HoverAnticipatoryProps = {
  children: ReactNode;
  intensity?: FeedbackIntensity;
  anticipationDelay?: number;
  disabled?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Componente principale per feedback anticipatorio
 */
export const AnticipatoryFeedback = forwardRef<HTMLDivElement, AnticipatoryFeedbackProps>(
  ({
    children,
    type = 'press',
    intensity = 'normal',
    hapticPattern = 'medium',
    anticipationDelay = 45, // Default micro-delay
    disabled = false,
    onAnticipate,
    onActivate,
    onComplete,
    className,
    style,
    ...props
  }, ref) => {
    const [isAnticipating, setIsAnticipating] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const anticipationTimeoutRef = useRef<NodeJS.Timeout>();
    const activeTimeoutRef = useRef<NodeJS.Timeout>();

    // Cleanup timeouts
    const clearTimeouts = useCallback(() => {
      if (anticipationTimeoutRef.current) {
        clearTimeout(anticipationTimeoutRef.current);
      }
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
      }
    }, []);

    // Handle anticipation start
    const handleAnticipationStart = useCallback(() => {
      if (disabled) {
        return;
      }

      clearTimeouts();

      // Start anticipation after micro-delay
      anticipationTimeoutRef.current = setTimeout(() => {
        setIsAnticipating(true);
        onAnticipate?.();
      }, anticipationDelay);
    }, [disabled, anticipationDelay, onAnticipate, clearTimeouts]);

    // Handle activation
    const handleActivation = useCallback(() => {
      if (disabled) {
        return;
      }

      clearTimeouts();
      setIsAnticipating(false);
      setIsActive(true);
      onActivate?.();

      // Complete after feedback duration
      activeTimeoutRef.current = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 120); // Standard press feedback duration
    }, [disabled, onActivate, onComplete, clearTimeouts]);

    // Handle deactivation
    const handleDeactivation = useCallback(() => {
      clearTimeouts();
      setIsAnticipating(false);
      setIsActive(false);
    }, [clearTimeouts]);

    // Cleanup on unmount
    React.useEffect(() => {
      return clearTimeouts;
    }, [clearTimeouts]);

    // Event handlers basati sul tipo
    const eventHandlers = React.useMemo(() => {
      switch (type) {
        case 'press':
          return {
            onMouseDown: handleAnticipationStart,
            onMouseUp: handleActivation,
            onMouseLeave: handleDeactivation,
            onTouchStart: handleAnticipationStart,
            onTouchEnd: handleActivation,
          };
        case 'hover':
          return {
            onMouseEnter: handleAnticipationStart,
            onMouseLeave: handleDeactivation,
            onFocus: handleAnticipationStart,
            onBlur: handleDeactivation,
          };
        case 'focus':
          return {
            onFocus: handleAnticipationStart,
            onBlur: handleDeactivation,
          };
        default:
          return {};
      }
    }, [type, handleAnticipationStart, handleActivation, handleDeactivation]);

    // Classi CSS per feedback
    const feedbackClasses = cn(
      'anticipatory-feedback',
      `feedback-${type}`,
      `feedback-intensity-${intensity}`,
      `feedback-haptic-${hapticPattern}`,
      isAnticipating && 'feedback-anticipating',
      isActive && 'feedback-active',
      disabled && 'feedback-disabled',
      className,
    );

    // Style con delay personalizzato
    const feedbackStyle = {
      '--anticipation-delay': `${anticipationDelay}ms`,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={feedbackClasses}
        style={feedbackStyle}
        {...eventHandlers}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AnticipatoryFeedback.displayName = 'AnticipatoryFeedback';

/**
 * Press feedback anticipatorio specializzato
 */
export const PressAnticipatory = forwardRef<HTMLButtonElement, PressAnticipatoryProps>(
  ({
    children,
    intensity = 'normal',
    hapticPattern = 'medium',
    disabled = false,
    onPress,
    onRelease,
    className,
    ...props
  }, ref) => {
    const [pressState, setPressState] = useState<'idle' | 'anticipating' | 'pressed'>('idle');
    const pressTimeoutRef = useRef<NodeJS.Timeout>();

    // Handle press start con anticipazione
    const handlePressStart = useCallback(() => {
      if (disabled) {
        return;
      }

      setPressState('anticipating');

      // Micro-delay per anticipazione
      pressTimeoutRef.current = setTimeout(() => {
        setPressState('pressed');
        onPress?.();
      }, 45); // Signature Tradelia micro-delay
    }, [disabled, onPress]);

    // Handle press end
    const handlePressEnd = useCallback(() => {
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }

      setPressState('idle');
      onRelease?.();
    }, [onRelease]);

    // Cleanup
    React.useEffect(() => {
      return () => {
        if (pressTimeoutRef.current) {
          clearTimeout(pressTimeoutRef.current);
        }
      };
    }, []);

    const pressClasses = cn(
      'press-anticipatory',
      `press-intensity-${intensity}`,
      `press-haptic-${hapticPattern}`,
      `press-state-${pressState}`,
      disabled && 'press-disabled',
      className,
    );

    return (
      <button
        ref={ref}
        type="button"
        className={pressClasses}
        disabled={disabled}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PressAnticipatory.displayName = 'PressAnticipatory';

/**
 * Hover feedback anticipatorio
 */
export const HoverAnticipatory = forwardRef<HTMLDivElement, HoverAnticipatoryProps>(
  ({
    children,
    intensity = 'normal',
    anticipationDelay = 25, // Più veloce per hover
    disabled = false,
    onHoverStart,
    onHoverEnd,
    className,
    ...props
  }, ref) => {
    const [hoverState, setHoverState] = useState<'idle' | 'anticipating' | 'hovering'>('idle');
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();

    const handleHoverStart = useCallback(() => {
      if (disabled) {
        return;
      }

      setHoverState('anticipating');

      hoverTimeoutRef.current = setTimeout(() => {
        setHoverState('hovering');
        onHoverStart?.();
      }, anticipationDelay);
    }, [disabled, anticipationDelay, onHoverStart]);

    const handleHoverEnd = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      setHoverState('idle');
      onHoverEnd?.();
    }, [onHoverEnd]);

    React.useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }, []);

    const hoverClasses = cn(
      'hover-anticipatory',
      `hover-intensity-${intensity}`,
      `hover-state-${hoverState}`,
      disabled && 'hover-disabled',
      className,
    );

    const hoverStyle = {
      '--hover-anticipation-delay': `${anticipationDelay}ms`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={hoverClasses}
        style={hoverStyle}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onFocus={handleHoverStart}
        onBlur={handleHoverEnd}
        role="button"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  },
);

HoverAnticipatory.displayName = 'HoverAnticipatory';

/**
 * Long press con buildup progressivo
 */
export const LongPressAnticipatory: React.FC<{
  children: ReactNode;
  onLongPress: () => void;
  duration?: number;
  className?: string;
}> = ({
  children,
  onLongPress,
  duration = 800,
  className,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startLongPress = useCallback(() => {
    setIsPressed(true);
    setProgress(0);

    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalRef.current!);
        onLongPress();
      }
    }, 16); // 60fps updates

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current!);
      onLongPress();
    }, duration);
  }, [duration, onLongPress]);

  const endLongPress = useCallback(() => {
    setIsPressed(false);
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const longPressClasses = cn(
    'long-press-anticipatory',
    isPressed && 'long-press-active',
    className,
  );

  const progressStyle = {
    '--long-press-progress': `${progress}%`,
  } as React.CSSProperties;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={longPressClasses}
      style={progressStyle}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
    >
      {children}
      {isPressed && (
        // eslint-disable-next-line tailwindcss/no-custom-classname
        <div className="long-press-progress-indicator">
          <div
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className="long-press-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
