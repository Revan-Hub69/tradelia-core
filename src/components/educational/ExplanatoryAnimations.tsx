/**
 * EXPLANATORY ANIMATIONS SYSTEM - Educational UX 2026
 *
 * Sistema di animazioni che spiegano concetti invece di solo decorare
 * Basato su ricerca 2026 su:
 * - Progressive reveal per cognitive load management
 * - Dual coding theory (visual + verbal channels)
 * - Attention management through anticipation
 * - Educational animation best practices
 *
 * Implementa:
 * - Concept explanation animations per crypto/blockchain
 * - Progressive reveal sequences
 * - Interactive step-by-step visualizations
 * - Context-aware educational micro-interactions
 */

import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusMode } from './FocusMode';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AnimationType = 'progressive-reveal' | 'concept-build' | 'process-flow' | 'comparison' | 'transformation';
export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'adaptive';
export type ConceptComplexity = 'simple' | 'moderate' | 'complex' | 'advanced';

export type AnimationStep = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly visual: React.ReactNode;
  readonly duration: number;
  readonly delay?: number;
  readonly voiceOver?: string;
  readonly interactionRequired?: boolean;
};

export type ConceptAnimation = {
  readonly id: string;
  readonly title: string;
  readonly concept: string;
  readonly complexity: ConceptComplexity;
  readonly type: AnimationType;
  readonly steps: readonly AnimationStep[];
  readonly totalDuration: number;
  readonly educationalGoal: string;
};

export type AnimationConfig = {
  speed: AnimationSpeed;
  autoPlay: boolean;
  showControls: boolean;
  enableVoiceOver: boolean;
  respectCognitiveLoad: boolean;
  adaptToFocusMode: boolean;
};

// ============================================================================
// EXPLANATORY ANIMATIONS HOOK
// ============================================================================

export const useExplanatoryAnimations = () => {
  const { focusState } = useFocusMode();
  const [currentAnimation, setCurrentAnimation] = useState<ConceptAnimation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState<AnimationConfig>({
    speed: 'adaptive',
    autoPlay: false,
    showControls: true,
    enableVoiceOver: false,
    respectCognitiveLoad: true,
    adaptToFocusMode: true,
  });

  // Adapt animation speed based on focus mode and complexity
  const getAdaptiveSpeed = useCallback((complexity: ConceptComplexity): number => {
    let baseMultiplier = 1;

    // Complexity adjustment
    switch (complexity) {
      case 'simple':
        baseMultiplier = 0.8;
        break;
      case 'moderate':
        baseMultiplier = 1;
        break;
      case 'complex':
        baseMultiplier = 1.3;
        break;
      case 'advanced':
        baseMultiplier = 1.6;
        break;
      default:
        baseMultiplier = 1;
    }

    // Focus mode adjustment
    if (config.adaptToFocusMode && focusState.isActive) {
      switch (focusState.level) {
        case 'minimal':
          baseMultiplier *= 0.9;
          break;
        case 'moderate':
          baseMultiplier *= 1.1;
          break;
        case 'deep':
          baseMultiplier *= 1.3;
          break;
        case 'immersive':
          baseMultiplier *= 1.5;
          break;
        default:
          break;
      }
    }

    // Speed setting adjustment
    switch (config.speed) {
      case 'slow': return baseMultiplier * 1.5;
      case 'normal': return baseMultiplier;
      case 'fast': return baseMultiplier * 0.7;
      case 'adaptive': return baseMultiplier;
      default: return baseMultiplier;
    }
  }, [config.speed, config.adaptToFocusMode, focusState]);

  const startAnimation = useCallback((animation: ConceptAnimation) => {
    setCurrentAnimation(animation);
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentAnimation && currentStep < currentAnimation.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentAnimation, currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const resetAnimation = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  return {
    currentAnimation,
    currentStep,
    isPlaying,
    config,
    setConfig,
    startAnimation,
    pauseAnimation,
    resumeAnimation,
    nextStep,
    previousStep,
    resetAnimation,
    getAdaptiveSpeed,
  };
};

// ============================================================================
// PROGRESSIVE REVEAL COMPONENT
// ============================================================================

type ProgressiveRevealProps = {
  steps: readonly AnimationStep[];
  currentStep: number;
  speed: number;
  onStepComplete?: (stepIndex: number) => void;
  className?: string;
};

export const ProgressiveReveal: React.FC<ProgressiveRevealProps> = ({
  steps,
  currentStep,
  speed,
  onStepComplete,
  className = '',
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      if (step) {
        const duration = (step.duration * speed) / 1000;

        controls.start({
          opacity: 1,
          scale: 1,
          transition: { duration, ease: 'easeOut' },
        }).then(() => {
          onStepComplete?.(currentStep);
        });
      }
    }
  }, [currentStep, steps, speed, controls, onStepComplete]);

  return (
    <div className={`progressive-reveal ${className}`}>
      <AnimatePresence mode="wait">
        {steps.slice(0, currentStep + 1).map(step => (
          <motion.div
            key={step.id}
            className="reveal-step"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={controls}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              duration: (step.duration * speed) / 1000,
              delay: (step.delay || 0) / 1000,
              ease: 'easeOut',
            }}
          >
            <div className="step-content">
              <div className="step-visual">{step.visual}</div>
              <div className="step-text">
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// CONCEPT ANIMATION PLAYER
// ============================================================================

type ConceptAnimationPlayerProps = {
  animation: ConceptAnimation;
  config?: Partial<AnimationConfig>;
  onComplete?: () => void;
  className?: string;
};

const defaultConfig: Partial<AnimationConfig> = {};

export const ConceptAnimationPlayer: React.FC<ConceptAnimationPlayerProps> = ({
  animation,
  config: configOverride = defaultConfig,
  onComplete,
  className = '',
}) => {
  const {
    currentStep,
    isPlaying,
    config,
    setConfig,
    nextStep,
    previousStep,
    resetAnimation,
    pauseAnimation,
    resumeAnimation,
    getAdaptiveSpeed,
  } = useExplanatoryAnimations();

  const [hasStarted, setHasStarted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Apply config overrides
  useEffect(() => {
    if (configOverride) {
      setConfig(prev => ({ ...prev, ...configOverride }));
    }
  }, [configOverride, setConfig]);

  // Auto-advance steps
  useEffect(() => {
    if (isPlaying && hasStarted) {
      const currentStepData = animation.steps[currentStep];
      if (currentStepData && !currentStepData.interactionRequired) {
        const speed = getAdaptiveSpeed(animation.complexity);
        const duration = currentStepData.duration * speed;

        timeoutRef.current = setTimeout(() => {
          if (currentStep < animation.steps.length - 1) {
            nextStep();
          } else {
            onComplete?.();
          }
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStep, hasStarted, animation, getAdaptiveSpeed, nextStep, onComplete]);

  const handleStart = () => {
    setHasStarted(true);
    resumeAnimation();
  };

  const handleInteractionContinue = () => {
    if (currentStep < animation.steps.length - 1) {
      nextStep();
    } else {
      onComplete?.();
    }
  };

  const currentStepData = animation.steps[currentStep];
  const progress = ((currentStep + 1) / animation.steps.length) * 100;

  return (
    <div className={`concept-animation-player ${className}`}>
      <div className="animation-header">
        <h3 className="animation-title">{animation.title}</h3>
        <p className="animation-goal">{animation.educationalGoal}</p>
        <div className="animation-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            {currentStep + 1}
            {' '}
            /
            {' '}
            {animation.steps.length}
          </span>
        </div>
      </div>

      <div className="animation-content">
        {!hasStarted
          ? (
              <div className="animation-start">
                <div className="start-info">
                  <h4>Pronto per imparare?</h4>
                  <p>
                    Questa animazione ti spiegherà:
                    {' '}
                    {animation.concept}
                  </p>
                  <div className="animation-meta">
                    <span className="complexity">
                      Complessità:
                      {' '}
                      {animation.complexity}
                    </span>
                    <span className="duration">
                      Durata: ~
                      {Math.round(animation.totalDuration / 1000)}
                      s
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary start-button"
                  onClick={handleStart}
                >
                  ▶️ Inizia Animazione
                </button>
              </div>
            )
          : (
              <div className="animation-stage">
                <ProgressiveReveal
                  steps={animation.steps}
                  currentStep={currentStep}
                  speed={getAdaptiveSpeed(animation.complexity)}
                  className="main-animation"
                />

                {currentStepData?.interactionRequired && (
                  <div className="interaction-prompt">
                    <p>Clicca per continuare quando hai compreso il concetto</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleInteractionContinue}
                    >
                      Ho Capito, Continua
                    </button>
                  </div>
                )}
              </div>
            )}
      </div>

      {config.showControls && hasStarted && (
        <div className="animation-controls">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            ⏮️ Precedente
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={isPlaying ? pauseAnimation : resumeAnimation}
          >
            {isPlaying ? '⏸️ Pausa' : '▶️ Riprendi'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={nextStep}
            disabled={currentStep === animation.steps.length - 1}
          >
            ⏭️ Successivo
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={resetAnimation}
          >
            🔄 Ricomincia
          </button>
        </div>
      )}
    </div>
  );
};

export default ConceptAnimationPlayer;
