/**
 * TRADELIA MOTION SYSTEM - Export Index
 *
 * Sistema completo di motion design enterprise 2026
 * Basato su best practice da Microsoft Fluent 2, Apple HIG, Material Design
 */

export {
  AnticipatoryFeedback,
  type FeedbackIntensity,
  type FeedbackType,
  type HapticPattern,
  hapticPatterns,
  HoverAnticipatory,
  LongPressAnticipatory,
  PressAnticipatory,
  useAnticipatoryFeedback,
} from './AnticipatoryFeedback';
export {
  anticipatory,
  type Delay,
  delay,
  type Duration,
  duration,
  type Easing,
  easing,
  haptic,
  type HapticPattern as HapticPatternType,
  default as MotionTokens,
  type PresetCategory,
  presets,
  responsive,
  type ResponsiveMultiplier,
  semantic,
  stagger,
  type StaggerType,
  utils,
  validators,
} from './MotionTokens';
export {
  type AnimationContext,
  CompleteAnimation,
  EnterAnimation,
  ErrorAnimation,
  ExitAnimation,
  getSemanticAnimation,
  LoadingAnimation,
  ProgressAnimation,
  SemanticAnimation,
  semanticAnimationDefinitions,
  type SemanticType,
  SuccessAnimation,
  useSemanticAnimations,
  WarningAnimation,
} from './SemanticAnimations';
export {
  ErrorMotion,
  FocusMotion,
  HoverMotion,
  type MotionIntensity,
  motionTokens,
  type MotionType,
  PressMotion,
  StaggerContainer,
  type StaggerDirection,
  SuccessMotion,
  TradeliaMotion,
  useTradeliaMotion,
} from './TradeliaMotion';

// Re-export tutto come default per convenienza
export { default } from './TradeliaMotion';
