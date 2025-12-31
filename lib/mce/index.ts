// MCE Public Contract - Single Source of Truth
// This is the ONLY file that should be imported from outside /lib/mce/

// Re-export core types from schemas (single source of truth)
export type {
  KlineType,
  FeatureVectorType,
  DataQualityType,
  RegimeSignatureType,
  MCEConfigType,
} from "./schemas";

// Re-export essential types from types.ts
export type {
  Symbol,
  TF,
  TrendClass,
  VolClass,
  MCEError,
  DataQualityError,
  ClassificationError,
} from "./types";

// Main pipeline function
export { runMCEPipeline } from "./pipeline/runOnce";

// API helpers (if needed externally)
export type { PipelineResult, PipelineConfig } from "./pipeline/runOnce";

// Validation schemas (for API endpoints)
export {
  RegimeSignatureSchema,
  KlineSchema,
  RegimeHistoryQuerySchema,
} from "./schemas";

// This is the contract: UI/API should ONLY import from this file
// Internal MCE modules can import from their specific files