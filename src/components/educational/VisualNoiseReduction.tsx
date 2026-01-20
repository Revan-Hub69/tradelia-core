/**
 * VISUAL NOISE REDUCTION SYSTEM - Educational UX 2026
 *
 * Sistema di riduzione del rumore visivo per migliorare la concentrazione
 * Basato su ricerca cognitiva e neuro-adaptive design patterns:
 * - Cognitive Load Theory applicata alle interfacce
 * - Attention restoration theory
 * - Visual hierarchy optimization
 * - Context-aware interface adaptation
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

import { useFocusMode } from './FocusMode';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type NoiseLevel = 'none' | 'minimal' | 'moderate' | 'aggressive';
export type NoiseType = 'visual' | 'motion' | 'color' | 'typography' | 'spacing';

export type NoiseReductionConfig = {
  level: NoiseLevel;
  types: NoiseType[];
  preserveEssential: boolean;
  adaptToContext: boolean;
  respectAccessibility: boolean;
};

export type VisualElement = {
  id: string;
  type: 'decoration' | 'functional' | 'essential';
  priority: 'low' | 'medium' | 'high' | 'critical';
  context: string[];
};

// ============================================================================
// VISUAL NOISE REDUCTION HOOK
// ============================================================================

export const useVisualNoiseReduction = () => {
  const { focusState } = useFocusMode();
  const [noiseConfig, setNoiseConfig] = useState<NoiseReductionConfig>({
    level: 'none',
    types: [],
    preserveEssential: true,
    adaptToContext: true,
    respectAccessibility: true,
  });

  // Update noise reduction based on focus state
  useEffect(() => {
    if (!focusState.isActive) {
      setNoiseConfig(prev => ({ ...prev, level: 'none', types: [] }));
      return;
    }

    const getNoiseLevel = (): NoiseLevel => {
      switch (focusState.level) {
        case 'minimal': return 'minimal';
        case 'moderate': return 'moderate';
        case 'deep': return 'moderate';
        case 'immersive': return 'aggressive';
        default: return 'none';
      }
    };

    const getNoiseTypes = (): NoiseType[] => {
      const types: NoiseType[] = [];

      if (focusState.adaptiveSettings.reduceAnimations) {
        types.push('motion');
      }

      if (focusState.adaptiveSettings.dimSecondary) {
        types.push('visual', 'color');
      }

      if (focusState.adaptiveSettings.hideNonEssential) {
        types.push('visual', 'spacing', 'typography');
      }

      return types;
    };

    setNoiseConfig({
      level: getNoiseLevel(),
      types: getNoiseTypes(),
      preserveEssential: true,
      adaptToContext: true,
      respectAccessibility: true,
    });
  }, [focusState]);

  // Apply noise reduction to document
  useEffect(() => {
    const applyNoiseReduction = () => {
      const root = document.documentElement;

      // Set CSS custom properties for noise reduction
      root.style.setProperty('--noise-level', noiseConfig.level);
      root.style.setProperty('--noise-visual', noiseConfig.types.includes('visual') ? '1' : '0');
      root.style.setProperty('--noise-motion', noiseConfig.types.includes('motion') ? '1' : '0');
      root.style.setProperty('--noise-color', noiseConfig.types.includes('color') ? '1' : '0');
      root.style.setProperty('--noise-typography', noiseConfig.types.includes('typography') ? '1' : '0');
      root.style.setProperty('--noise-spacing', noiseConfig.types.includes('spacing') ? '1' : '0');

      // Apply noise reduction class
      if (noiseConfig.level !== 'none') {
        root.classList.add('noise-reduction-active');
        root.classList.add(`noise-level-${noiseConfig.level}`);
      } else {
        root.classList.remove('noise-reduction-active');
        root.classList.remove('noise-level-minimal', 'noise-level-moderate', 'noise-level-aggressive');
      }
    };

    applyNoiseReduction();

    return () => {
      // Cleanup on unmount
      const root = document.documentElement;
      root.classList.remove('noise-reduction-active');
      root.classList.remove('noise-level-minimal', 'noise-level-moderate', 'noise-level-aggressive');
    };
  }, [noiseConfig]);

  const shouldReduceElement = useCallback((element: VisualElement): boolean => {
    if (noiseConfig.level === 'none') {
      return false;
    }
    if (element.priority === 'critical') {
      return false;
    }
    if (noiseConfig.preserveEssential && element.type === 'essential') {
      return false;
    }

    // Context-aware reduction
    if (noiseConfig.adaptToContext && focusState.isActive) {
      const isRelevantToContext = element.context.includes(focusState.context);
      if (isRelevantToContext && element.priority === 'high') {
        return false;
      }
    }

    // Apply reduction based on level and element type
    switch (noiseConfig.level) {
      case 'minimal':
        return element.type === 'decoration' && element.priority === 'low';
      case 'moderate':
        return element.type === 'decoration' || (element.type === 'functional' && element.priority === 'low');
      case 'aggressive':
        return element.type !== 'essential' && element.priority !== 'high';
      default:
        return false;
    }
  }, [noiseConfig, focusState]);

  return {
    noiseConfig,
    shouldReduceElement,
    setNoiseConfig,
  };
};

// ============================================================================
// NOISE REDUCTION WRAPPER COMPONENT
// ============================================================================

type NoiseReductionWrapperProps = {
  element: VisualElement;
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
};

export const NoiseReductionWrapper: React.FC<NoiseReductionWrapperProps> = ({
  element,
  children,
  className = '',
  fallback,
}) => {
  const { shouldReduceElement } = useVisualNoiseReduction();
  const { focusState } = useFocusMode();

  const isReduced = shouldReduceElement(element);

  const getReductionLevel = () => {
    if (!isReduced) {
      return 1;
    }

    switch (element.priority) {
      case 'low': return 0.1;
      case 'medium': return 0.3;
      case 'high': return 0.6;
      case 'critical': return 1;
      default: return 0.3;
    }
  };

  const getBlurLevel = () => {
    if (!isReduced) {
      return 0;
    }

    switch (element.type) {
      case 'decoration': return 2;
      case 'functional': return 1;
      case 'essential': return 0;
      default: return 1;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isReduced || !fallback
        ? (
            <motion.div
              key="full-element"
              className={`noise-reduction-wrapper ${className}`}
              data-element-type={element.type}
              data-element-priority={element.priority}
              data-noise-reduced={isReduced}
              animate={{
                opacity: getReductionLevel(),
                filter: `blur(${getBlurLevel()}px)`,
                scale: isReduced ? 0.98 : 1,
              }}
              transition={{
                duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.3,
                ease: 'easeOut',
              }}
            >
              {children}
            </motion.div>
          )
        : (
            <motion.div
              key="fallback-element"
              className={`noise-reduction-fallback ${className}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
            >
              {fallback}
            </motion.div>
          )}
    </AnimatePresence>
  );
};

// ============================================================================
// CALM INTERFACE COMPONENT
// ============================================================================

type CalmInterfaceProps = {
  children: React.ReactNode;
  intensity?: 'subtle' | 'moderate' | 'strong';
  className?: string;
};

export const CalmInterface: React.FC<CalmInterfaceProps> = ({
  children,
  intensity = 'moderate',
  className = '',
}) => {
  const { focusState } = useFocusMode();
  const [calmLevel, setCalmLevel] = useState(0);

  useEffect(() => {
    if (!focusState.isActive) {
      setCalmLevel(0);
      return;
    }

    const getIntensityMultiplier = () => {
      switch (intensity) {
        case 'subtle': return 0.3;
        case 'moderate': return 0.6;
        case 'strong': return 1;
        default: return 0.6;
      }
    };

    const getFocusMultiplier = () => {
      switch (focusState.level) {
        case 'minimal': return 0.2;
        case 'moderate': return 0.5;
        case 'deep': return 0.8;
        case 'immersive': return 1;
        default: return 0;
      }
    };

    setCalmLevel(getIntensityMultiplier() * getFocusMultiplier());
  }, [focusState, intensity]);

  return (
    <motion.div
      className={`calm-interface ${className}`}
      data-calm-level={intensity}
      animate={{
        '--calm-opacity': 1 - (calmLevel * 0.3),
        '--calm-saturation': 1 - (calmLevel * 0.4),
        '--calm-contrast': 1 - (calmLevel * 0.2),
        '--calm-brightness': 1 + (calmLevel * 0.1),
      } as any}
      transition={{
        duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.5,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// BREATHING SPACE COMPONENT
// ============================================================================

type BreathingSpaceProps = {
  size?: 'small' | 'medium' | 'large';
  adaptive?: boolean;
  className?: string;
};

export const BreathingSpace: React.FC<BreathingSpaceProps> = ({
  size = 'medium',
  adaptive = true,
  className = '',
}) => {
  const { focusState } = useFocusMode();

  const getSpacing = () => {
    const baseSpacing = {
      small: 1,
      medium: 2,
      large: 3,
    }[size];

    if (!adaptive || !focusState.isActive) {
      return `${baseSpacing}rem`;
    }

    const focusMultiplier = {
      minimal: 1.2,
      moderate: 1.5,
      deep: 2,
      immersive: 2.5,
    }[focusState.level] || 1;

    return `${baseSpacing * focusMultiplier}rem`;
  };

  return (
    <motion.div
      className={`breathing-space ${className}`}
      animate={{
        height: getSpacing(),
        marginTop: `calc(${getSpacing()} * 0.5)`,
        marginBottom: `calc(${getSpacing()} * 0.5)`,
      }}
      transition={{
        duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.4,
        ease: 'easeOut',
      }}
    />
  );
};

// ============================================================================
// ESSENTIAL CONTENT HIGHLIGHTER
// ============================================================================

type EssentialHighlighterProps = {
  children: React.ReactNode;
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
};

export const EssentialHighlighter: React.FC<EssentialHighlighterProps> = ({
  children,
  priority,
  className = '',
}) => {
  const { focusState } = useFocusMode();

  const getHighlightIntensity = () => {
    if (!focusState.isActive) {
      return 0;
    }

    const priorityMultiplier = {
      low: 0,
      medium: 0.2,
      high: 0.5,
      critical: 1,
    }[priority];

    const focusMultiplier = {
      minimal: 0.2,
      moderate: 0.5,
      deep: 0.8,
      immersive: 1,
    }[focusState.level] || 0;

    return priorityMultiplier * focusMultiplier;
  };

  const highlightIntensity = getHighlightIntensity();

  return (
    <motion.div
      className={`essential-highlighter priority-${priority} ${className}`}
      animate={{
        boxShadow: `0 0 ${highlightIntensity * 20}px rgba(var(--brand-primary), ${highlightIntensity * 0.3})`,
        borderColor: `rgba(var(--brand-primary), ${highlightIntensity * 0.4})`,
        backgroundColor: `rgba(var(--brand-primary), ${highlightIntensity * 0.05})`,
      }}
      transition={{
        duration: focusState.adaptiveSettings.reduceAnimations ? 0.1 : 0.4,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// NOISE REDUCTION TESTER COMPONENT
// ============================================================================

export const NoiseReductionTester: React.FC = () => {
  const { noiseConfig } = useVisualNoiseReduction();
  const { focusState } = useFocusMode();

  const testElements: VisualElement[] = [
    { id: 'decoration-low', type: 'decoration', priority: 'low', context: ['exploring'] },
    { id: 'functional-medium', type: 'functional', priority: 'medium', context: ['learning'] },
    { id: 'essential-high', type: 'essential', priority: 'high', context: ['learning', 'testing'] },
    { id: 'critical-element', type: 'essential', priority: 'critical', context: ['learning', 'testing', 'practicing'] },
  ];

  return (
    <div className="noise-reduction-tester">
      <h3>Visual Noise Reduction Tester</h3>

      <div className="tester-status">
        <p>
          Focus Active:
          {focusState.isActive ? 'Yes' : 'No'}
        </p>
        <p>
          Focus Level:
          {focusState.level}
        </p>
        <p>
          Noise Level:
          {noiseConfig.level}
        </p>
        <p>
          Noise Types:
          {noiseConfig.types.join(', ') || 'None'}
        </p>
      </div>

      <div className="test-elements">
        {testElements.map(element => (
          <NoiseReductionWrapper
            key={element.id}
            element={element}
            className="test-element"
            fallback={(
              <div className="test-fallback">
                Simplified:
                {element.id}
              </div>
            )}
          >
            <div className={`test-card ${element.type} ${element.priority}`}>
              <h4>{element.id}</h4>
              <p>
                Type:
                {element.type}
              </p>
              <p>
                Priority:
                {element.priority}
              </p>
              <p>
                Context:
                {element.context.join(', ')}
              </p>
            </div>
          </NoiseReductionWrapper>
        ))}
      </div>

      <CalmInterface intensity="moderate" className="calm-demo">
        <div className="calm-content">
          <h4>Calm Interface Demo</h4>
          <p>This content adapts its visual intensity based on focus mode.</p>
          <BreathingSpace size="large" adaptive />
          <EssentialHighlighter priority="high">
            <p>This is essential content that gets highlighted in focus mode.</p>
          </EssentialHighlighter>
        </div>
      </CalmInterface>
    </div>
  );
};

export default useVisualNoiseReduction;
