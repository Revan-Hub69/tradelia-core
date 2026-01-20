/**
 * EMOTIONAL FEEDBACK SYSTEM - Export Index
 *
 * Sistema completo di feedback emotivo enterprise 2026
 * Basato su ricerca UX educativa e best practice da:
 * - Apple Human Interface Guidelines
 * - Microsoft Fluent Design
 * - Educational psychology research
 * - Financial UX best practices
 */

// Micro-Moments System
export {
  AchievementMoment,
  LessonCompleteMoment,
  MicroMoment,
  type MicroMomentContext,
  type MicroMomentIntensity,
  MicroMomentsProvider,
  MicroMomentTester,
  type MicroMomentType,
  StreakSavedMoment,
  useMicroMoments,
  XPGainedMoment,
} from './MicroMoments';

// Reassurance System
export {
  AutoSaveIndicator,
  LearningEncouragement,
  ProgressSecurityMessage,
  type ReassuranceContext,
  ReassuranceMessage,
  ReassuranceProvider,
  ReassuranceTester,
  type ReassuranceTone,
  type ReassuranceType,
  SafeExplorationMessage,
  useReassurance,
} from './ReassuranceSystem';

// Educational Empty States
export {
  CompletedPathState,
  ConnectionErrorState,
  EducationalEmptyState,
  type EmptyStateContext,
  EmptyStateTester,
  type EmptyStateTone,
  type EmptyStateType,
  NewUserDashboard,
  NoProgressState,
  NoSearchResults,
} from './EducationalEmptyStates';

// Re-export tutto come default per convenienza
export { default as EmptyStatesSystem } from './EducationalEmptyStates';
export { default as MicroMomentsSystem } from './MicroMoments';
export { default as ReassuranceSystem } from './ReassuranceSystem';
