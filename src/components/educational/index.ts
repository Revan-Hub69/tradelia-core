/**
 * EDUCATIONAL UX PATTERNS - Export Index
 *
 * Sistema completo di pattern UX educativi enterprise 2026
 * Basato su ricerca cognitiva e neuro-adaptive design:
 * - Cognitive Load Theory applicata alle interfacce
 * - Progressive disclosure per gerarchia informativa
 * - Visual noise reduction per concentrazione
 * - Focus mode per riduzione distrazioni
 */

// Focus Mode System
export {
  type DistractionLevel,
  type FocusContext,
  FocusControl,
  type FocusLevel,
  FocusModeProvider,
  type FocusSettings,
  type FocusState,
  FocusWrapper,
  ProgressiveDisclosure,
  type ProgressiveDisclosureConfig,
  useFocusMode,
} from './FocusMode';

// Visual Noise Reduction System
export {
  BreathingSpace,
  CalmInterface,
  EssentialHighlighter,
  type NoiseLevel,
  type NoiseReductionConfig,
  NoiseReductionTester,
  NoiseReductionWrapper,
  type NoiseType,
  useVisualNoiseReduction,
  type VisualElement,
} from './VisualNoiseReduction';

// Anti-Error Guidance System
export {
  type ActionGuidance,
  type ActionRiskLevel,
  AntiErrorProvider,
  AntiErrorTester,
  type ConfirmationType,
  ErrorPreventionGuide,
  type GuidanceIntensity,
  type RiskyActionConfig,
  RiskyActionGuard,
  type SafePathConfig,
  SafePathHighlighter,
  useAntiError,
} from './AntiErrorGuidance';

// Explanatory Animations System
export {
  type AnimationConfig,
  type AnimationSpeed,
  type AnimationStep,
  type AnimationType,
  type ConceptAnimation,
  ConceptAnimationPlayer,
  type ConceptComplexity,
  ProgressiveReveal,
  useExplanatoryAnimations,
} from './ExplanatoryAnimations';

// Blockchain Concept Animations
export { BlockchainConceptAnimations } from './BlockchainConceptAnimations';

// Explanatory Animations Components
export { ExplanatoryAnimationsExample } from './ExplanatoryAnimationsExample';
export { ExplanatoryAnimationsShowcase } from './ExplanatoryAnimationsShowcase';

// Re-export defaults for convenience
export { default as AntiErrorGuidance } from './AntiErrorGuidance';
export { default as ExplanatoryAnimations } from './ExplanatoryAnimations';
export { default as FocusMode } from './FocusMode';
export { default as VisualNoiseReduction } from './VisualNoiseReduction';
