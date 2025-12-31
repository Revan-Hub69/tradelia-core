// UCM Public Contract - Single Source of Truth for Universe Control Module
// This is the ONLY file that should be imported from outside /lib/ucm/

// Re-export core types from schemas (single source of truth)
export type {
  UniversePoolType,
  UniverseActiveType,
  EligibilitySnapshotType,
  UniverseStateType,
  UniverseDiffType,
} from "./schemas";

// Re-export essential error types
export {
  UCMError,
  EligibilityError,
  HysteresisError,
  UniverseGenerationError,
} from "./schemas";

// Main pipeline function
export { runUCMPipeline } from "./pipeline/runOnce";
export type { UCMPipelineResult } from "./pipeline/runOnce";

// Data collection
export { collectEligibilitySnapshots } from "./pipeline/collect";
export type { CollectionResult } from "./pipeline/collect";

// Universe generation
export { generateUniverseActive } from "./engine/universe";
export type { UniverseGenerationResult } from "./engine/universe";

// Repository for direct database access (if needed)
export { UCMRepository } from "./db/repo";

// Configuration access
export { UCM_CONFIG } from "./config";
export type { UCMConfig } from "./config";

// Validation schemas (for API endpoints)
export {
  UniverseActiveSchema,
  UniversePoolSchema,
  UniverseDiffQuerySchema,
  UniverseActiveApiResponseSchema,
  UniversePoolApiResponseSchema,
} from "./schemas";

// Utility functions
export {
  validateUniverseActive,
  compareUniverseActive,
} from "./engine/universe";

export {
  validateUCMConfig,
  getConfigSummary,
} from "./config";

// This is the contract: UI/API should ONLY import from this file
// Internal UCM modules can import from their specific files