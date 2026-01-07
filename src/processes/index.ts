/**
 * Processes Layer - Tradelia 2026
 * 
 * Processi di business che orchestrano features e widgets per
 * implementare flussi complessi dell'applicazione.
 */

// Authentication process
// export { AuthenticationProcess } from './authentication/AuthenticationProcess';

// Dashboard initialization process
// export { DashboardInitProcess } from './dashboard-init/DashboardInitProcess';

// Data synchronization process
// export { DataSyncProcess } from './data-sync/DataSyncProcess';

// User onboarding process
// export { OnboardingProcess } from './onboarding/OnboardingProcess';

// Type exports
export type { AuthenticationFlow, AuthStep, AuthenticationConfig } from './authentication/types';
export type { DashboardInitFlow, InitStep, DashboardInitConfig } from './dashboard-init/types';
export type { DataSyncFlow, SyncStep, DataSyncConfig } from './data-sync/types';
export type { OnboardingFlow, OnboardingStep, OnboardingConfig } from './onboarding/types';