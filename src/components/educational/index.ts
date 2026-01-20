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
  FocusModeProvider,
  useFocusMode,
  FocusWrapper,
  FocusControl,
  ProgressiveDisclosure,
  type FocusLevel,
  type FocusContext,
  type DistractionLevel,
  type FocusState,
  type FocusSettings,
  type ProgressiveDisclosureConfig,
} from './FocusMode';

// Visual Noise Reduction System
export {
  useVisualNoiseReduction,
  NoiseReductionWrapper,
  CalmInterface,
  BreathingSpace,
  EssentialHighlighter,
  NoiseReductionTester,
  type NoiseLevel,
  type NoiseType,
  type NoiseReductionConfig,
  type VisualElement,
} from './VisualNoiseReduction';

// Re-export defaults for convenience
export { default as FocusMode } from './FocusMode';
export { default as VisualNoiseReduction } from './VisualNoiseReduction';