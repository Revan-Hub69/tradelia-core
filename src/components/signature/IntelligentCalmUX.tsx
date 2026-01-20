/**
 * INTELLIGENT CALM UX - Enterprise 2026
 *
 * Sistema UX intelligente che riduce gli stimoli visivi quando l'utente è in modalità focus
 * Basato su ricerca 2026: Calm Technology, Neuro-Adaptive Interfaces, Zero-Noise Design
 * 
 * Principi chiave:
 * - Calm Technology: informare senza richiedere focus
 * - Cognitive Load Reduction: minimizzare lo sforzo mentale
 * - Neuro-Adaptive: adattarsi allo stato emotivo/cognitivo
 * - Zero-Noise Interfaces: eliminare distrazioni non necessarie
 * - Context-Aware: rispondere al contesto di apprendimento
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useAccessibility } from '../../hooks/useAccessibility';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type CalmMode = 
  | 'off'          // Modalità normale - tutti gli stimoli attivi
  | 'learning'     // Modalità apprendimento - riduzione stimoli per focus
  | 'deep-focus'   // Focus profondo - minimalismo estremo
  | 'meditation'   // Modalità meditativa - calma totale
  | 'adaptive';    // Modalità adattiva - si adatta automaticamente

export type CognitiveState = 
  | 'fresh'        // Utente riposato e concentrato
  | 'focused'      // Utente in stato di flow
  | 'tired'        // Utente affaticato cognitivamente
  | 'stressed'     // Utente sotto stress
  | 'distracted'   // Utente distratto
  | 'overwhelmed'; // Utente sovraccaricato

export type VisualIntensity = 
  | 'minimal'      // Solo elementi essenziali
  | 'reduced'      // Stimoli ridotti del 70%
  | 'moderate'     // Stimoli ridotti del 40%
  | 'standard'     // Intensità normale
  | 'enhanced';    // Stimoli aumentati per engagement

export interface CalmUXConfig {
  mode: CalmMode;
  cognitiveState: CognitiveState;
  visualIntensity: VisualIntensity;
  adaptiveEnabled: boolean;
  breathingAnimations: boolean;
  softTransitions: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  ambientSounds: boolean;
  progressiveDisclosure: boolean;
}

export interface CalmUXContextType {
  config: CalmUXConfig;
  updateMode: (mode: CalmMode) => void;
  updateCognitiveState: (state: CognitiveState) => void;
  updateVisualIntensity: (intensity: VisualIntensity) => void;
  enableAdaptive: () => void;
  disableAdaptive: () => void;
  isInCalmMode: boolean;
  shouldReduceStimuli: boolean;
  shouldShowElement: (priority: 'essential' | 'important' | 'optional') => boolean;
  getCalmStyles: () => React.CSSProperties;
}

export interface IntelligentCalmUXProps {
  children: React.ReactNode;
  initialMode?: CalmMode;
  onModeChange?: (mode: CalmMode) => void;
  onCognitiveStateChange?: (state: CognitiveState) => void;
}

// ============================================================================
// CALM UX CONTEXT
// ============================================================================

const CalmUXContext = createContext<CalmUXContextType | null>(null);

export const useCalmUX = (): CalmUXContextType => {
  const context = useContext(CalmUXContext);
  if (!context) {
    throw new Error('useCalmUX must be used within IntelligentCalmUX provider');
  }
  return context;
};

// ============================================================================
// CALM UX CONFIGURATIONS
// ============================================================================

const CALM_MODE_CONFIGS: Record<CalmMode, Partial<CalmUXConfig>> = {
  off: {
    visualIntensity: 'standard',
    breathingAnimations: false,
    softTransitions: false,
    reducedMotion: false,
    progressiveDisclosure: false,
  },
  learning: {
    visualIntensity: 'reduced',
    breathingAnimations: true,
    softTransitions: true,
    reducedMotion: false,
    focusIndicators: true,
    progressiveDisclosure: true,
  },
  'deep-focus': {
    visualIntensity: 'minimal',
    breathingAnimations: true,
    softTransitions: true,
    reducedMotion: true,
    focusIndicators: true,
    progressiveDisclosure: true,
  },
  meditation: {
    visualIntensity: 'minimal',
    breathingAnimations: true,
    softTransitions: true,
    reducedMotion: true,
    focusIndicators: false,
    ambientSounds: true,
    progressiveDisclosure: false,
  },
  adaptive: {
    adaptiveEnabled: true,
    breathingAnimations: true,
    softTransitions: true,
    progressiveDisclosure: true,
  },
};

const COGNITIVE_STATE_ADAPTATIONS: Record<CognitiveState, Partial<CalmUXConfig>> = {
  fresh: {
    visualIntensity: 'standard',
    reducedMotion: false,
  },
  focused: {
    visualIntensity: 'moderate',
    reducedMotion: false,
    focusIndicators: true,
  },
  tired: {
    visualIntensity: 'reduced',
    softTransitions: true,
    reducedMotion: true,
  },
  stressed: {
    visualIntensity: 'reduced',
    breathingAnimations: true,
    softTransitions: true,
    reducedMotion: true,
  },
  distracted: {
    visualIntensity: 'reduced',
    focusIndicators: true,
    progressiveDisclosure: true,
  },
  overwhelmed: {
    visualIntensity: 'minimal',
    breathingAnimations: true,
    softTransitions: true,
    reducedMotion: true,
    progressiveDisclosure: true,
  },
};

// ============================================================================
// INTELLIGENT CALM UX PROVIDER
// ============================================================================

export const IntelligentCalmUX: React.FC<IntelligentCalmUXProps> = ({
  children,
  initialMode = 'off',
  onModeChange,
  onCognitiveStateChange,
}) => {
  const { announce } = useAccessibility();

  // State management
  const [config, setConfig] = useState<CalmUXConfig>({
    mode: initialMode,
    cognitiveState: 'fresh',
    visualIntensity: 'standard',
    adaptiveEnabled: false,
    breathingAnimations: false,
    softTransitions: false,
    reducedMotion: false,
    focusIndicators: false,
    ambientSounds: false,
    progressiveDisclosure: false,
  });

  // Adaptive behavior tracking
  const [interactionMetrics] = useState({
    clickAccuracy: 1.0,
    taskCompletionTime: 0,
    errorRate: 0,
    scrollSpeed: 1.0,
    pauseDuration: 0,
  });

  // Update mode with configuration merge
  const updateMode = useCallback((mode: CalmMode) => {
    const modeConfig = CALM_MODE_CONFIGS[mode];
    setConfig(prev => ({ ...prev, mode, ...modeConfig }));
    onModeChange?.(mode);
    announce(`Calm mode changed to ${mode}`, 'polite');
  }, [onModeChange, announce]);

  // Update cognitive state with adaptive response
  const updateCognitiveState = useCallback((state: CognitiveState) => {
    const stateConfig = COGNITIVE_STATE_ADAPTATIONS[state];
    setConfig(prev => ({ 
      ...prev, 
      cognitiveState: state,
      ...(prev.adaptiveEnabled ? stateConfig : {})
    }));
    onCognitiveStateChange?.(state);
    announce(`Cognitive state detected: ${state}`, 'polite');
  }, [onCognitiveStateChange, announce]);

  // Update visual intensity
  const updateVisualIntensity = useCallback((intensity: VisualIntensity) => {
    setConfig(prev => ({ ...prev, visualIntensity: intensity }));
  }, []);

  // Enable adaptive mode
  const enableAdaptive = useCallback(() => {
    setConfig(prev => ({ ...prev, adaptiveEnabled: true }));
    announce('Adaptive calm mode enabled', 'polite');
  }, [announce]);

  // Disable adaptive mode
  const disableAdaptive = useCallback(() => {
    setConfig(prev => ({ ...prev, adaptiveEnabled: false }));
    announce('Adaptive calm mode disabled', 'polite');
  }, [announce]);

  // Computed properties
  const isInCalmMode = config.mode !== 'off';
  const shouldReduceStimuli = ['learning', 'deep-focus', 'meditation'].includes(config.mode) || 
                              config.visualIntensity === 'minimal' || 
                              config.visualIntensity === 'reduced';

  // Element visibility based on priority and calm mode
  const shouldShowElement = useCallback((priority: 'essential' | 'important' | 'optional'): boolean => {
    if (!isInCalmMode) return true;

    switch (config.visualIntensity) {
      case 'minimal':
        return priority === 'essential';
      case 'reduced':
        return priority === 'essential' || priority === 'important';
      case 'moderate':
        return true; // Show all but with reduced styling
      default:
        return true;
    }
  }, [isInCalmMode, config.visualIntensity]);

  // Generate calm-specific styles
  const getCalmStyles = useCallback((): React.CSSProperties => {
    if (!isInCalmMode) return {};

    const baseStyles: React.CSSProperties = {
      transition: config.softTransitions ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
    };

    switch (config.visualIntensity) {
      case 'minimal':
        return {
          ...baseStyles,
          filter: 'contrast(0.8) brightness(0.9)',
          opacity: 0.9,
        };
      case 'reduced':
        return {
          ...baseStyles,
          filter: 'contrast(0.9) brightness(0.95)',
          opacity: 0.95,
        };
      case 'moderate':
        return {
          ...baseStyles,
          filter: 'contrast(0.95)',
        };
      default:
        return baseStyles;
    }
  }, [isInCalmMode, config.visualIntensity, config.softTransitions]);

  // Adaptive behavior detection
  useEffect(() => {
    if (!config.adaptiveEnabled) return;

    const detectCognitiveState = () => {
      const { clickAccuracy, errorRate, pauseDuration } = interactionMetrics;

      if (errorRate > 0.3 || clickAccuracy < 0.7) {
        updateCognitiveState('overwhelmed');
      } else if (pauseDuration > 5000) {
        updateCognitiveState('distracted');
      } else if (errorRate > 0.1) {
        updateCognitiveState('tired');
      } else if (clickAccuracy > 0.9 && errorRate < 0.05) {
        updateCognitiveState('focused');
      } else {
        updateCognitiveState('fresh');
      }
    };

    const interval = setInterval(detectCognitiveState, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [config.adaptiveEnabled, interactionMetrics, updateCognitiveState]);

  // Context value
  const contextValue: CalmUXContextType = {
    config,
    updateMode,
    updateCognitiveState,
    updateVisualIntensity,
    enableAdaptive,
    disableAdaptive,
    isInCalmMode,
    shouldReduceStimuli,
    shouldShowElement,
    getCalmStyles,
  };

  return (
    <CalmUXContext.Provider value={contextValue}>
      <div 
        className={`intelligent-calm-ux ${config.mode !== 'off' ? `calm-mode-${config.mode}` : ''}`}
        style={getCalmStyles()}
        data-calm-mode={config.mode}
        data-visual-intensity={config.visualIntensity}
        data-cognitive-state={config.cognitiveState}
      >
        {children}
      </div>
    </CalmUXContext.Provider>
  );
};

// ============================================================================
// CALM UX COMPONENTS
// ============================================================================

export interface CalmElementProps {
  children: React.ReactNode;
  priority?: 'essential' | 'important' | 'optional';
  className?: string;
  calmClassName?: string;
  style?: React.CSSProperties;
  calmStyle?: React.CSSProperties;
}

export const CalmElement: React.FC<CalmElementProps> = ({
  children,
  priority = 'important',
  className = '',
  calmClassName = '',
  style = {},
  calmStyle = {},
}) => {
  const { shouldShowElement, isInCalmMode, getCalmStyles } = useCalmUX();

  if (!shouldShowElement(priority)) {
    return null;
  }

  const finalClassName = isInCalmMode && calmClassName ? calmClassName : className;
  const finalStyle = isInCalmMode ? { ...style, ...calmStyle, ...getCalmStyles() } : style;

  return (
    <div className={finalClassName} style={finalStyle}>
      {children}
    </div>
  );
};

export interface BreathingElementProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export const BreathingElement: React.FC<BreathingElementProps> = ({
  children,
  className = '',
  duration = 4000,
  intensity = 'subtle',
}) => {
  const { config } = useCalmUX();
  const { shouldAnimate: performanceAnimate } = usePerformanceOptimization();

  const shouldBreathe = config.breathingAnimations && performanceAnimate('low');

  const breathingStyle: React.CSSProperties = shouldBreathe ? {
    animation: `calm-breathing-${intensity} ${duration}ms ease-in-out infinite`,
  } : {};

  return (
    <div className={`breathing-element ${className}`} style={breathingStyle}>
      {children}
    </div>
  );
};

export interface FocusIndicatorProps {
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  isActive = false,
  children,
  className = '',
}) => {
  const { config } = useCalmUX();

  if (!config.focusIndicators) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`focus-indicator ${isActive ? 'active' : ''} ${className}`}
      data-focus-active={isActive}
    >
      {children}
      {isActive && (
        <div className="focus-indicator-ring" aria-hidden="true" />
      )}
    </div>
  );
};

export default IntelligentCalmUX;