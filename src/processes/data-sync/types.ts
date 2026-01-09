/**
 * Data Synchronization Process Types - Tradelia 2026
 */

export interface DataSyncFlow {
  currentStep: SyncStep;
  lastSyncTime?: Date;
  isLoading: boolean;
  error?: string;
  conflictCount: number;
}

export type SyncStep = 
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'uploading'
  | 'resolving-conflicts'
  | 'completed'
  | 'error';

export interface DataSyncConfig {
  autoSyncInterval: number;
  enableConflictResolution: boolean;
  maxRetries: number;
  batchSize: number;
}