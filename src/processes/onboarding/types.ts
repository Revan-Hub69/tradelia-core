/**
 * User Onboarding Process Types - Tradelia 2026
 */

export interface OnboardingFlow {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isLoading: boolean;
  canSkip: boolean;
  progress: number;
}

export type OnboardingStep = 
  | 'welcome'
  | 'profile-setup'
  | 'preferences'
  | 'tutorial'
  | 'first-card'
  | 'completed';

export interface OnboardingConfig {
  enableSkipping: boolean;
  showProgress: boolean;
  autoAdvance: boolean;
  stepTimeout: number;
}