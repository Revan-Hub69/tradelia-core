// ============================================================
// SIMULATOR ENGINE — barrel export
// ============================================================

export { normalizeToExposure, getNotionalPerUnit } from './normalizeToExposure';
export { computeInstrumentScore, rankInstrumentScores } from './computeInstrumentScore';

export type {
  NotionalGranularity,
  NormalizedExposureResult,
  ExposureFeasibility,
  ExposureWarnings,
} from './normalizeToExposure';

export type {
  InstrumentScoreResult,
  ScoreComponents,
  ExecutabilityInfo,
} from './computeInstrumentScore';
