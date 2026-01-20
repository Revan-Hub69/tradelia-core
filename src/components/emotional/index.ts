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
  MicroMoment,
  useMicroMoments,
  MicroMomentsProvider,
  LessonCompleteMoment,
  StreakSavedMoment,
  XPGainedMoment,
  AchievementMoment,
  MicroMomentTester,
  type MicroMomentType,
  type MicroMomentIntensity,
  type MicroMomentContext,
} from './MicroMoments';

// Reassurance System
export {
  ReassuranceMessage,
  useReassurance,
  ReassuranceProvider,
  AutoSaveIndicator,
  ProgressSecurityMessage,
  LearningEncouragement,
  SafeExplorationMessage,
  ReassuranceTester,
  type ReassuranceType,
  type ReassuranceContext,
  type ReassuranceTone,
} from './ReassuranceSystem';

// Educational Empty States
export {
  EducationalEmptyState,
  NewUserDashboard,
  NoProgressState,
  CompletedPathState,
  NoSearchResults,
  ConnectionErrorState,
  EmptyStateTester,
  type EmptyStateType,
  type EmptyStateTone,
  type EmptyStateContext,
} from './EducationalEmptyStates';

// Re-export tutto come default per convenienza
export { default as MicroMomentsSystem } from './MicroMoments';
export { default as ReassuranceSystem } from './ReassuranceSystem';
export { default as EmptyStatesSystem } from './EducationalEmptyStates';