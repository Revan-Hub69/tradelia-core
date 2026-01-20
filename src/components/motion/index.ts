/**
 * TRADELIA MOTION SYSTEM - Export Index
 * 
 * Sistema completo di motion design enterprise 2026
 * Basato su best practice da Microsoft Fluent 2, Apple HIG, Material Design
 */

export {
  TradeliaMotion,
  PressMotion,
  HoverMotion,
  StaggerContainer,
  SuccessMotion,
  ErrorMotion,
  FocusMotion,
  useTradeliaMotion,
  motionTokens,
  type MotionType,
  type MotionIntensity,
  type StaggerDirection,
} from './TradeliaMotion';

export {
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
  type SemanticType,
  type AnimationContext,
} from './SemanticAnimations';

export {
  AnticipatoryFeedback,
  PressAnticipatory,
  HoverAnticipatory,
  LongPressAnticipatory,
  useAnticipatoryFeedback,
  hapticPatterns,
  type FeedbackType,
  type FeedbackIntensity,
  type HapticPattern,
} from './AnticipatoryFeedback';

export {
  default as MotionTokens,
  duration,
  delay,
  easing,
  semantic,
  anticipatory,
  stagger,
  responsive,
  haptic,
  utils,
  presets,
  validators,
  type Duration,
  type Delay,
  type Easing,
  type StaggerType,
  type ResponsiveMultiplier,
  type HapticPattern as HapticPatternType,
  type PresetCategory,
} from './MotionTokens';

// Re-export tutto come default per convenienza
export { default } from './TradeliaMotion';