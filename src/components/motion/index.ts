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
  HoverAnticipatory,
  LongPressAnticipatory,
  PressAnticipatory,
} from './AnticipatoryFeedback';
export { hapticPatterns, useAnticipatoryFeedback } from './AnticipatoryFeedback.utils';
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
  LoadingAnimation,
  ProgressAnimation,
  SemanticAnimation,
  type SemanticType,
  SuccessAnimation,
  WarningAnimation,
} from './SemanticAnimations';
export { getSemanticAnimation, semanticAnimationDefinitions, useSemanticAnimations } from './SemanticAnimations.utils';
export {
  ErrorMotion,
  FocusMotion,
  HoverMotion,
  type MotionIntensity,
  type MotionType,
  PressMotion,
  StaggerContainer,
  type StaggerDirection,
  SuccessMotion,
  TradeliaMotion,
} from './TradeliaMotion';
export { motionTokens, useTradeliaMotion } from './TradeliaMotion.utils';

// Re-export tutto come default per convenienza
