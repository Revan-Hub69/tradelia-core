// UCM Universe Engine - Main logic for generating active universe
// Combines ranking, hysteresis, and core symbol logic to create stable universe

import { 
  UniversePoolType, 
  UniverseActiveType, 
  EligibilitySnapshotType, 
  UniverseStateType,
  generateUniverseActiveHash,
  generateEligibilityBatchHash,
  UniverseGenerationError
} from "../schemas";
import { UCM_CONFIG, getCooldownTimestamp, getBlacklistTimestamp } from "../config";
import { rankSymbols, RankingResult } from "./ranking";
import { processStateTransitions, HysteresisResult } from "./hysteresis";

export interface UniverseGenerationResult {
  universeActive: UniverseActiveType;
  stats: {
    totalSymbols: number;
    eligibleSymbols: number;
    activeSymbols: number;
    coreSymbols: number;
    addedSymbols: number;
    removedSymbols: number;
    blacklistedSymbols: number;
    rankingStats: {
      avgScore: number;
      topScore: number;
      bottomScore: number;
    };
  };
  changes: {
    added: string[];
    removed: string[];
    blacklisted: string[];
    maintained: string[];
  };
  warnings: string[];
}

export async function generateUniverseActive(
  pool: UniversePoolType,
  eligibilitySnapshots: EligibilitySnapshotType[],
  currentStates: UniverseStateType[],
  prevActive?: UniverseActiveType | null
): Promise<UniverseActiveType> {
  const result = await generateUniverseWithStats(pool, eligibilitySnapshots, currentStates, prevActive);
  return result.universeActive;
}

export async function generateUniverseWithStats(
  pool: UniversePoolType,
  eligibilitySnapshots: EligibilitySnapshotType[],
  currentStates: UniverseStateType[],
  prevActive?: UniverseActiveType | null
): Promise<UniverseGenerationResult> {
  const warnings: string[] = [];
  const asOf = Date.now();
  
  try {
    // 1. Create state maps for efficient lookup
    const stateMap = new Map<string, UniverseStateType>();
    currentStates.forEach(state => stateMap.set(state.symbol, state));
    
    const snapshotMap = new Map<string, EligibilitySnapshotType>();
    eligibilitySnapshots.forEach(snapshot => snapshotMap.set(snapshot.symbol, snapshot));
    
    // 2. Ensure all pool symbols have snapshots
    const missingSnapshots = pool.symbols.filter(symbol => !snapshotMap.has(symbol));
    if (missingSnapshots.length > 0) {
      warnings.push(`Missing eligibility snapshots for ${missingSnapshots.length} symbols: ${missingSnapshots.slice(0, 5).join(', ')}${missingSnapshots.length > 5 ? '...' : ''}`);
    }
    
    // 3. Filter to symbols with snapshots
    const availableSymbols = pool.symbols.filter(symbol => snapshotMap.has(symbol));
    const availableSnapshots = availableSymbols.map(symbol => snapshotMap.get(symbol)!);
    
    // 4. Calculate rankings for all available symbols
    const rankings = rankSymbols(availableSnapshots);
    
    // 5. Create eligibility history map (for now, just current snapshot)
    // TODO: In full implementation, this would contain historical data
    const eligibilityHistory = new Map<string, EligibilitySnapshotType[]>();
    availableSymbols.forEach(symbol => {
      const snapshot = snapshotMap.get(symbol)!;
      eligibilityHistory.set(symbol, [snapshot]); // Simplified for v1
    });
    
    // 6. Process state transitions with hysteresis
    const transitions = processStateTransitions(availableSymbols, stateMap, eligibilityHistory);
    
    // 7. Apply state changes and build new active universe
    const { newStates, changes } = applyStateTransitions(transitions, stateMap, asOf);
    
    // 8. Select active symbols based on new states and rankings
    const activeSelection = selectActiveSymbols(
      pool.coreSymbols,
      rankings,
      newStates,
      prevActive?.symbols || []
    );
    
    // 9. Generate universe active object
    const eligibilityBatchHash = generateEligibilityBatchHash(availableSnapshots);
    
    const universeActiveWithoutHash: Omit<UniverseActiveType, 'hash'> = {
      v: "ucm.active.v1",
      asOf,
      target: UCM_CONFIG.TARGET,
      min: UCM_CONFIG.MIN_ACTIVE,
      max: UCM_CONFIG.MAX_ACTIVE,
      symbols: activeSelection.symbols,
      coreIncluded: activeSelection.coreIncluded,
      meta: {
        added: changes.added,
        removed: changes.removed,
        blacklisted: changes.blacklisted,
      },
      basedOn: {
        poolHash: pool.hash,
        eligibilityBatchHash,
        prevActiveHash: prevActive?.hash,
      },
    };
    
    const hash = generateUniverseActiveHash(universeActiveWithoutHash);
    const universeActive: UniverseActiveType = { ...universeActiveWithoutHash, hash };
    
    // 10. Calculate stats
    const stats = calculateUniverseStats(rankings, activeSelection, changes);
    
    return {
      universeActive,
      stats,
      changes,
      warnings,
    };
    
  } catch (error) {
    throw new UniverseGenerationError(
      `Failed to generate universe active: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

interface StateTransitionResult {
  newStates: Map<string, UniverseStateType>;
  changes: {
    added: string[];
    removed: string[];
    blacklisted: string[];
    maintained: string[];
  };
}

function applyStateTransitions(
  transitions: HysteresisResult[],
  currentStates: Map<string, UniverseStateType>,
  asOf: number
): StateTransitionResult {
  const newStates = new Map<string, UniverseStateType>();
  const changes = {
    added: [] as string[],
    removed: [] as string[],
    blacklisted: [] as string[],
    maintained: [] as string[],
  };
  
  transitions.forEach(transition => {
    const currentState = currentStates.get(transition.symbol);
    
    let newState: UniverseStateType = {
      symbol: transition.symbol,
      status: transition.newStatus,
      enteredAt: currentState?.enteredAt,
      exitedAt: currentState?.exitedAt,
      cooldownUntil: currentState?.cooldownUntil,
      blacklistUntil: currentState?.blacklistUntil,
    };
    
    // Apply state changes based on action
    switch (transition.action) {
      case "ENTER":
        newState.enteredAt = asOf;
        newState.exitedAt = undefined;
        newState.cooldownUntil = undefined;
        if (currentState?.status !== "ACTIVE") {
          changes.added.push(transition.symbol);
        }
        break;
        
      case "EXIT":
        newState.exitedAt = asOf;
        newState.cooldownUntil = getCooldownTimestamp();
        if (currentState?.status === "ACTIVE") {
          changes.removed.push(transition.symbol);
        }
        break;
        
      case "BLACKLIST":
        newState.blacklistUntil = getBlacklistTimestamp();
        newState.exitedAt = asOf;
        newState.cooldownUntil = undefined;
        changes.blacklisted.push(transition.symbol);
        if (currentState?.status === "ACTIVE") {
          changes.removed.push(transition.symbol);
        }
        break;
        
      default:
        changes.maintained.push(transition.symbol);
        break;
    }
    
    newStates.set(transition.symbol, newState);
  });
  
  return { newStates, changes };
}

interface ActiveSelectionResult {
  symbols: string[];
  coreIncluded: boolean;
  selectionReason: string;
}

function selectActiveSymbols(
  coreSymbols: string[],
  rankings: RankingResult[],
  states: Map<string, UniverseStateType>,
  prevActiveSymbols: string[]
): ActiveSelectionResult {
  // 1. Get all active symbols from states
  const activeSymbols = Array.from(states.entries())
    .filter(([_, state]) => state.status === "ACTIVE")
    .map(([symbol, _]) => symbol);
  
  // 2. Separate core and non-core active symbols
  const activeCoreSymbols = activeSymbols.filter(symbol => coreSymbols.includes(symbol));
  const activeNonCoreSymbols = activeSymbols.filter(symbol => !coreSymbols.includes(symbol));
  
  // 3. Check core inclusion
  const coreIncluded = activeCoreSymbols.length === coreSymbols.length;
  
  // 4. Rank active non-core symbols by their ranking score
  const rankedActiveNonCore = activeNonCoreSymbols
    .map(symbol => rankings.find(r => r.symbol === symbol))
    .filter((ranking): ranking is RankingResult => ranking !== undefined)
    .sort((a, b) => b.rankScore - a.rankScore);
  
  // 5. Apply universe size constraints
  let selectedSymbols: string[] = [];
  let selectionReason = "";
  
  // Always include active core symbols first
  selectedSymbols.push(...activeCoreSymbols);
  
  // Add non-core symbols up to MAX_ACTIVE
  const remainingSlots = UCM_CONFIG.MAX_ACTIVE - selectedSymbols.length;
  const selectedNonCore = rankedActiveNonCore.slice(0, remainingSlots);
  selectedSymbols.push(...selectedNonCore.map(r => r.symbol));
  
  // Check size constraints
  if (selectedSymbols.length > UCM_CONFIG.MAX_ACTIVE) {
    // Trim non-core symbols (keep core symbols always)
    const trimmedNonCore = selectedNonCore.slice(0, UCM_CONFIG.MAX_ACTIVE - activeCoreSymbols.length);
    selectedSymbols = [...activeCoreSymbols, ...trimmedNonCore.map(r => r.symbol)];
    selectionReason = `Trimmed to MAX_ACTIVE (${UCM_CONFIG.MAX_ACTIVE})`;
  } else if (selectedSymbols.length < UCM_CONFIG.MIN_ACTIVE) {
    // This shouldn't happen with proper hysteresis, but handle gracefully
    selectionReason = `Below MIN_ACTIVE (${UCM_CONFIG.MIN_ACTIVE}), need more eligible symbols`;
  } else {
    selectionReason = `Normal selection (${selectedSymbols.length} symbols)`;
  }
  
  return {
    symbols: selectedSymbols,
    coreIncluded,
    selectionReason,
  };
}

function calculateUniverseStats(
  rankings: RankingResult[],
  activeSelection: ActiveSelectionResult,
  changes: { added: string[]; removed: string[]; blacklisted: string[]; maintained: string[] }
): UniverseGenerationResult['stats'] {
  const eligibleRankings = rankings.filter(r => r.eligible);
  const activeRankings = rankings.filter(r => activeSelection.symbols.includes(r.symbol));
  
  const avgScore = rankings.length > 0 ? 
    rankings.reduce((sum, r) => sum + r.rankScore, 0) / rankings.length : 0;
  
  const topScore = rankings.length > 0 ? Math.max(...rankings.map(r => r.rankScore)) : 0;
  const bottomScore = rankings.length > 0 ? Math.min(...rankings.map(r => r.rankScore)) : 0;
  
  return {
    totalSymbols: rankings.length,
    eligibleSymbols: eligibleRankings.length,
    activeSymbols: activeSelection.symbols.length,
    coreSymbols: activeSelection.symbols.filter(s => 
      rankings.find(r => r.symbol === s)?.symbol
    ).length,
    addedSymbols: changes.added.length,
    removedSymbols: changes.removed.length,
    blacklistedSymbols: changes.blacklisted.length,
    rankingStats: {
      avgScore: Math.round(avgScore * 100) / 100,
      topScore: Math.round(topScore * 100) / 100,
      bottomScore: Math.round(bottomScore * 100) / 100,
    },
  };
}

// Utility functions for universe analysis
export function validateUniverseActive(universeActive: UniverseActiveType): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check size constraints
  if (universeActive.symbols.length > universeActive.max) {
    errors.push(`Too many symbols: ${universeActive.symbols.length} > ${universeActive.max}`);
  }
  
  if (universeActive.symbols.length < universeActive.min) {
    warnings.push(`Below minimum symbols: ${universeActive.symbols.length} < ${universeActive.min}`);
  }
  
  // Check for duplicates
  const uniqueSymbols = new Set(universeActive.symbols);
  if (uniqueSymbols.size !== universeActive.symbols.length) {
    errors.push("Duplicate symbols found in active universe");
  }
  
  // Check hash integrity
  const recalculatedHash = generateUniverseActiveHash({
    v: universeActive.v,
    asOf: universeActive.asOf,
    target: universeActive.target,
    min: universeActive.min,
    max: universeActive.max,
    symbols: universeActive.symbols,
    coreIncluded: universeActive.coreIncluded,
    meta: universeActive.meta,
    basedOn: universeActive.basedOn,
  });
  
  if (recalculatedHash !== universeActive.hash) {
    errors.push("Hash integrity check failed");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function compareUniverseActive(
  prev: UniverseActiveType | null,
  current: UniverseActiveType
): {
  identical: boolean;
  symbolChanges: {
    added: string[];
    removed: string[];
    maintained: string[];
    reordered: boolean;
  };
  metaChanges: {
    targetChanged: boolean;
    coreIncludedChanged: boolean;
  };
} {
  if (!prev) {
    return {
      identical: false,
      symbolChanges: {
        added: current.symbols,
        removed: [],
        maintained: [],
        reordered: false,
      },
      metaChanges: {
        targetChanged: false,
        coreIncludedChanged: false,
      },
    };
  }
  
  const prevSet = new Set(prev.symbols);
  const currentSet = new Set(current.symbols);
  
  const added = current.symbols.filter(s => !prevSet.has(s));
  const removed = prev.symbols.filter(s => !currentSet.has(s));
  const maintained = current.symbols.filter(s => prevSet.has(s));
  
  const reordered = maintained.length > 0 && 
    JSON.stringify(prev.symbols.filter(s => currentSet.has(s))) !== 
    JSON.stringify(current.symbols.filter(s => prevSet.has(s)));
  
  const identical = added.length === 0 && removed.length === 0 && !reordered &&
    prev.target === current.target && prev.coreIncluded === current.coreIncluded;
  
  return {
    identical,
    symbolChanges: {
      added,
      removed,
      maintained,
      reordered,
    },
    metaChanges: {
      targetChanged: prev.target !== current.target,
      coreIncludedChanged: prev.coreIncluded !== current.coreIncluded,
    },
  };
}