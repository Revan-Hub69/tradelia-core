/**
 * HAPTIC VISUAL FEEDBACK - Enterprise 2026
 *
 * Sistema di feedback visivo che simula sensazioni tattili senza suono
 * Basato su ricerca 2026: Sensory Web Design, Visual Tactility, Micro-Movements as Mood
 * 
 * Caratteristiche innovative:
 * - Simulazione tattile attraverso micro-animazioni precise
 * - Feedback visivo che "parla al sistema nervoso"
 * - Texture visive che ingannano il cervello percependo tattilità
 * - Ritmo e tempo che creano mood emotivo
 * - Feedback multi-sensoriale senza hardware aggiuntivo
 */

import React, { useCallback, useState } from 'react';

import { useAccessibility } from '../../hooks/useAccessibility';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type HapticFeedbackType = 
  | 'press'        // Pressione profonda con rimbalzo elastico
  | 'tap'          // Tocco leggero con vibrazione visiva
  | 'stroke'       // Carezza con movimento fluido
  | 'pulse'        // Pulsazione ritmica per conferma
  | 'ripple'       // Ondulazione che si espande
  | 'friction'     // Attrito con resistenza visiva
  | 'magnetic'     // Attrazione magnetica con snap
  | 'elastic'      // Elasticità con overshoot controllato
  | 'texture'      // Texture tattile con micro-movimenti
  | 'breath';      // Respirazione organica per calma

export type HapticIntensity = 'subtle' | 'medium' | 'strong' | 'premium';

export type HapticTexture = 
  | 'smooth'       // Superficie liscia come vetro
  | 'grain'        // Grana fine come carta
  | 'fabric'       // Morbidezza tessile
  | 'metal'        // Durezza metallica
  | 'liquid'       // Fluidità liquida
  | 'rubber'       // Elasticità gommosa
  | 'velvet'       // Velluto premium
  | 'glass';       // Cristallo trasparente

export interface HapticVisualFeedbackProps {
  children: React.ReactNode;
  type?: HapticFeedbackType;
  intensity?: HapticIntensity;
  texture?: HapticTexture;
  trigger?: boolean;
  duration?: number;
  className?: string;
  onFeedbackComplete?: () => void;
  disabled?: boolean;
}

// ============================================================================
// HAPTIC FEEDBACK CONFIGURATIONS
// ============================================================================

const HAPTIC_ANIMATIONS = {
  press: {
    transform: 'scale(0.95) translateY(2px)',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    recovery: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  tap: {
    transform: 'scale(0.98)',
    transition: 'all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    shadow: '0 0 0 4px rgba(59, 130, 246, 0.15)',
    recovery: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  stroke: {
    transform: 'translateX(2px) skewX(-1deg)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    shadow: '2px 0 8px rgba(0,0,0,0.05)',
    recovery: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  pulse: {
    transform: 'scale(1.02)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)',
    shadow: '0 0 0 8px rgba(16, 185, 129, 0.2)',
    recovery: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1)',
  },
  ripple: {
    transform: 'scale(1.05)',
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    shadow: '0 0 0 12px rgba(59, 130, 246, 0.1), 0 0 0 24px rgba(59, 130, 246, 0.05)',
    recovery: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
  },
  friction: {
    transform: 'translateX(-1px) scale(0.99)',
    transition: 'all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    shadow: 'inset 2px 0 4px rgba(0,0,0,0.08)',
    recovery: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  magnetic: {
    transform: 'scale(1.03) translateY(-1px)',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    recovery: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1)',
  },
  elastic: {
    transform: 'scale(1.1)',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    shadow: '0 2px 8px rgba(0,0,0,0.1)',
    recovery: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  texture: {
    transform: 'translateY(-0.5px) scale(1.01)',
    transition: 'all 0.15s steps(3, end)',
    shadow: '0 1px 3px rgba(0,0,0,0.12)',
    recovery: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breath: {
    transform: 'scale(1.01)',
    transition: 'all 2s cubic-bezier(0.4, 0, 0.6, 1)',
    shadow: '0 0 0 2px rgba(16, 185, 129, 0.1)',
    recovery: 'all 2s cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

const TEXTURE_EFFECTS = {
  smooth: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(0.5px)',
  },
  grain: {
    background: `
      radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0),
      radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 0.5px, transparent 0)
    `,
    backgroundSize: '3px 3px, 5px 5px',
  },
  fabric: {
    background: `
      repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px),
      repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)
    `,
  },
  metal: {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(255,255,255,0.2) 100%)',
    backgroundSize: '200% 100%',
  },
  liquid: {
    background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
    backdropFilter: 'blur(1px)',
  },
  rubber: {
    background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.05) 100%)',
  },
  velvet: {
    background: `
      radial-gradient(circle at 50% 50%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
      linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%)
    `,
    backgroundSize: '4px 4px, 8px 8px',
  },
  glass: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(2px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
} as const;

const INTENSITY_MULTIPLIERS = {
  subtle: 0.5,
  medium: 1,
  strong: 1.5,
  premium: 2,
} as const;

// ============================================================================
// HAPTIC VISUAL FEEDBACK COMPONENT
// ============================================================================

export const HapticVisualFeedback: React.FC<HapticVisualFeedbackProps> = ({
  children,
  type = 'tap',
  intensity = 'medium',
  texture = 'smooth',
  trigger = false,
  duration = 300,
  className = '',
  onFeedbackComplete,
  disabled = false,
}) => {
  const { shouldAnimate } = usePerformanceOptimization();
  const { announce } = useAccessibility();
  
  const [isActive, setIsActive] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const animation = HAPTIC_ANIMATIONS[type];
  const textureEffect = TEXTURE_EFFECTS[texture];
  const multiplier = INTENSITY_MULTIPLIERS[intensity];

  // Handle haptic feedback trigger
  const triggerFeedback = useCallback(() => {
    if (disabled || !shouldAnimate('medium')) return;

    setIsActive(true);
    
    // Announce haptic feedback for accessibility
    announce(`${type} feedback activated`, 'polite');

    // Start recovery phase
    setTimeout(() => {
      setIsActive(false);
      setIsRecovering(true);
      
      // Complete feedback cycle
      setTimeout(() => {
        setIsRecovering(false);
        onFeedbackComplete?.();
      }, duration * multiplier);
    }, duration * 0.3 * multiplier);
  }, [disabled, shouldAnimate, type, duration, multiplier, announce, onFeedbackComplete]);

  // Trigger feedback when prop changes
  React.useEffect(() => {
    if (trigger) {
      triggerFeedback();
    }
  }, [trigger, triggerFeedback]);

  // Generate dynamic styles based on state
  const getDynamicStyles = useCallback(() => {
    const baseStyles = {
      position: 'relative' as const,
      display: 'inline-block',
      willChange: 'transform, box-shadow',
      cursor: disabled ? 'not-allowed' : 'pointer',
    };

    if (isActive) {
      return {
        ...baseStyles,
        transform: animation.transform,
        transition: animation.transition,
        boxShadow: animation.shadow,
        ...textureEffect,
      };
    }

    if (isRecovering) {
      return {
        ...baseStyles,
        transform: 'none',
        transition: animation.recovery,
        boxShadow: 'none',
        ...textureEffect,
      };
    }

    return {
      ...baseStyles,
      ...textureEffect,
    };
  }, [isActive, isRecovering, animation, textureEffect, disabled]);

  // Generate texture overlay for premium effects
  const renderTextureOverlay = useCallback(() => {
    if (!shouldAnimate('low') || texture === 'smooth') return null;

    return (
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          ...textureEffect,
          borderRadius: 'inherit',
          zIndex: 1,
        }}
      />
    );
  }, [shouldAnimate, texture, textureEffect]);

  // Generate haptic pulse effect for premium intensity
  const renderPulseEffect = useCallback(() => {
    if (!shouldAnimate('medium') || intensity !== 'premium' || !isActive) return null;

    return (
      <div 
        className="absolute inset-0 pointer-events-none animate-ping opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          borderRadius: 'inherit',
          zIndex: 0,
        }}
      />
    );
  }, [shouldAnimate, intensity, isActive]);

  return (
    <div
      className={`haptic-visual-feedback ${className}`}
      style={getDynamicStyles()}
      onClick={triggerFeedback}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Haptic feedback: ${type} with ${texture} texture`}
      aria-disabled={disabled}
    >
      {/* Pulse Effect for Premium */}
      {renderPulseEffect()}
      
      {/* Texture Overlay */}
      {renderTextureOverlay()}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Haptic Indicator for Accessibility */}
      {isActive && (
        <div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

// ============================================================================
// PRESET HAPTIC COMPONENTS
// ============================================================================

export const HapticButton: React.FC<Omit<HapticVisualFeedbackProps, 'type'>> = (props) => (
  <HapticVisualFeedback type="press" texture="smooth" {...props} />
);

export const HapticCard: React.FC<Omit<HapticVisualFeedbackProps, 'type' | 'texture'>> = (props) => (
  <HapticVisualFeedback type="tap" texture="glass" {...props} />
);

export const HapticPremiumAction: React.FC<Omit<HapticVisualFeedbackProps, 'type' | 'intensity' | 'texture'>> = (props) => (
  <HapticVisualFeedback type="magnetic" intensity="premium" texture="velvet" {...props} />
);

export const HapticCalmBreath: React.FC<Omit<HapticVisualFeedbackProps, 'type' | 'duration'>> = (props) => (
  <HapticVisualFeedback type="breath" duration={2000} texture="smooth" {...props} />
);

export const HapticTextureDemo: React.FC<Omit<HapticVisualFeedbackProps, 'type'>> = (props) => (
  <HapticVisualFeedback type="texture" {...props} />
);

export default HapticVisualFeedback;