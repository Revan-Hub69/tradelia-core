// UCM Hysteresis Engine - Anti-flip logic for stable universe selection
// Implements enter/exit confirmation periods and cooldown management

import { EligibilitySnapshotType, UniverseStateType } from "../schemas";
import { UCM_CONFIG, isInCooldown, isBlacklisted } from "../config";
import { isEligible, shouldBlacklist } from "./ranking";

export interface HysteresisResult {
  symbol: string;
  currentStatus: "ACTIVE" | "INACTIVE" | "BLACKLISTED";
  newStatus: "ACTIVE" | "INACTIVE" | "BLACKLISTED";
  action: "ENTER" | "EXIT" | "BLACKLIST" | "MAINTAIN" | "COOLDOWN_WAIT" | "BLACKLIST_WAIT";
  reason: string;
  confirmationProgress?: {
    required: number;
    current: number;
    percentage: number;
  };
}

export interface HysteresisCheck {
  canEnter: boolean;
  canExit: boolean;
  shouldBlacklist: boolean;
  inCooldown: boolean;
  isBlacklisted: boolean;
  enterProgress: number;
  exitProgress: number;
}

export function checkEnterHysteresis(
  symbol: string, 
  history: EligibilitySnapshotType[]
): boolean {
  const confirmMinutes = UCM_CONFIG.ENTER_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
  
  if (history.length < requiredSnapshots) return false;
  
  // Check last N snapshots are all eligible
  const recentHistory = history.slice(-requiredSnapshots);
  return recentHistory.every(snapshot => isEligible(snapshot));
}

export function checkExitHysteresis(
  symbol: string,
  history: EligibilitySnapshotType[]
): boolean {
  const confirmMinutes = UCM_CONFIG.EXIT_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
  
  if (history.length < requiredSnapshots) return false;
  
  // Check last N snapshots are all non-eligible
  const recentHistory = history.slice(-requiredSnapshots);
  return recentHistory.every(snapshot => !isEligible(snapshot));
}

export function getEnterProgress(
  symbol: string,
  history: EligibilitySnapshotType[]
): number {
  const confirmMinutes = UCM_CONFIG.ENTER_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
  
  if (history.length === 0) return 0;
  
  // Count consecutive eligible snapshots from the end
  let consecutiveEligible = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (isEligible(history[i])) {
      consecutiveEligible++;
    } else {
      break;
    }
  }
  
  return Math.min(consecutiveEligible, requiredSnapshots);
}

export function getExitProgress(
  symbol: string,
  history: EligibilitySnapshotType[]
): number {
  const confirmMinutes = UCM_CONFIG.EXIT_CONFIRM_MINUTES;
  const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
  
  if (history.length === 0) return 0;
  
  // Count consecutive non-eligible snapshots from the end
  let consecutiveNonEligible = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (!isEligible(history[i])) {
      consecutiveNonEligible++;
    } else {
      break;
    }
  }
  
  return Math.min(consecutiveNonEligible, requiredSnapshots);
}

export function performHysteresisCheck(
  symbol: string,
  currentState: UniverseStateType | null,
  history: EligibilitySnapshotType[]
): HysteresisCheck {
  const latestSnapshot = history[history.length - 1];
  
  if (!latestSnapshot) {
    return {
      canEnter: false,
      canExit: false,
      shouldBlacklist: false,
      inCooldown: false,
      isBlacklisted: false,
      enterProgress: 0,
      exitProgress: 0,
    };
  }
  
  const inCooldown = currentState ? isInCooldown(currentState.cooldownUntil) : false;
  const isCurrentlyBlacklisted = currentState ? isBlacklisted(currentState.blacklistUntil) : false;
  const shouldBlacklistNow = shouldBlacklist(latestSnapshot);
  
  const canEnter = !inCooldown && 
                   !isCurrentlyBlacklisted && 
                   !shouldBlacklistNow &&
                   checkEnterHysteresis(symbol, history);
  
  const canExit = checkExitHysteresis(symbol, history);
  
  const enterProgress = getEnterProgress(symbol, history);
  const exitProgress = getExitProgress(symbol, history);
  
  return {
    canEnter,
    canExit,
    shouldBlacklist: shouldBlacklistNow,
    inCooldown,
    isBlacklisted: isCurrentlyBlacklisted,
    enterProgress,
    exitProgress,
  };
}

export function determineStateTransition(
  symbol: string,
  currentState: UniverseStateType | null,
  history: EligibilitySnapshotType[]
): HysteresisResult {
  const currentStatus = currentState?.status || "INACTIVE";
  const hysteresisCheck = performHysteresisCheck(symbol, currentState, history);
  
  // Handle blacklist first (highest priority)
  if (hysteresisCheck.shouldBlacklist) {
    return {
      symbol,
      currentStatus,
      newStatus: "BLACKLISTED",
      action: "BLACKLIST",
      reason: "Hard disqualification criteria met",
    };
  }
  
  // Handle blacklist expiry
  if (currentStatus === "BLACKLISTED" && !hysteresisCheck.isBlacklisted) {
    return {
      symbol,
      currentStatus,
      newStatus: "INACTIVE",
      action: "MAINTAIN",
      reason: "Blacklist period expired, returning to inactive",
    };
  }
  
  // If currently blacklisted and still blacklisted, maintain
  if (currentStatus === "BLACKLISTED" && hysteresisCheck.isBlacklisted) {
    return {
      symbol,
      currentStatus,
      newStatus: "BLACKLISTED",
      action: "BLACKLIST_WAIT",
      reason: "Still in blacklist period",
    };
  }
  
  // Handle state transitions based on current status
  switch (currentStatus) {
    case "INACTIVE":
      if (hysteresisCheck.inCooldown) {
        return {
          symbol,
          currentStatus,
          newStatus: "INACTIVE",
          action: "COOLDOWN_WAIT",
          reason: "In cooldown period",
        };
      }
      
      if (hysteresisCheck.canEnter) {
        return {
          symbol,
          currentStatus,
          newStatus: "ACTIVE",
          action: "ENTER",
          reason: "Hysteresis confirmation completed",
        };
      }
      
      if (hysteresisCheck.enterProgress > 0) {
        const confirmMinutes = UCM_CONFIG.ENTER_CONFIRM_MINUTES;
        const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
        
        return {
          symbol,
          currentStatus,
          newStatus: "INACTIVE",
          action: "MAINTAIN",
          reason: "Building enter confirmation",
          confirmationProgress: {
            required: requiredSnapshots,
            current: hysteresisCheck.enterProgress,
            percentage: Math.round((hysteresisCheck.enterProgress / requiredSnapshots) * 100),
          },
        };
      }
      
      return {
        symbol,
        currentStatus,
        newStatus: "INACTIVE",
        action: "MAINTAIN",
        reason: "Not eligible or insufficient confirmation",
      };
    
    case "ACTIVE":
      if (hysteresisCheck.canExit) {
        return {
          symbol,
          currentStatus,
          newStatus: "INACTIVE",
          action: "EXIT",
          reason: "Exit hysteresis confirmation completed",
        };
      }
      
      if (hysteresisCheck.exitProgress > 0) {
        const confirmMinutes = UCM_CONFIG.EXIT_CONFIRM_MINUTES;
        const requiredSnapshots = Math.ceil(confirmMinutes / UCM_CONFIG.PIPELINE.interval_minutes);
        
        return {
          symbol,
          currentStatus,
          newStatus: "ACTIVE",
          action: "MAINTAIN",
          reason: "Building exit confirmation",
          confirmationProgress: {
            required: requiredSnapshots,
            current: hysteresisCheck.exitProgress,
            percentage: Math.round((hysteresisCheck.exitProgress / requiredSnapshots) * 100),
          },
        };
      }
      
      return {
        symbol,
        currentStatus,
        newStatus: "ACTIVE",
        action: "MAINTAIN",
        reason: "Still eligible, maintaining active status",
      };
    
    default:
      return {
        symbol,
        currentStatus,
        newStatus: currentStatus,
        action: "MAINTAIN",
        reason: "Unknown status, maintaining current state",
      };
  }
}

export function processStateTransitions(
  symbols: string[],
  currentStates: Map<string, UniverseStateType>,
  eligibilityHistory: Map<string, EligibilitySnapshotType[]>
): HysteresisResult[] {
  return symbols.map(symbol => {
    const currentState = currentStates.get(symbol) || null;
    const history = eligibilityHistory.get(symbol) || [];
    
    return determineStateTransition(symbol, currentState, history);
  });
}

// Utility functions for hysteresis analysis
export function getHysteresisStats(results: HysteresisResult[]): {
  actions: Record<string, number>;
  statusCounts: Record<string, number>;
  confirmationInProgress: number;
  avgConfirmationProgress: number;
} {
  const actions: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  let confirmationInProgress = 0;
  let totalProgress = 0;
  let progressCount = 0;
  
  results.forEach(result => {
    // Count actions
    actions[result.action] = (actions[result.action] || 0) + 1;
    
    // Count new statuses
    statusCounts[result.newStatus] = (statusCounts[result.newStatus] || 0) + 1;
    
    // Track confirmation progress
    if (result.confirmationProgress) {
      confirmationInProgress++;
      totalProgress += result.confirmationProgress.percentage;
      progressCount++;
    }
  });
  
  return {
    actions,
    statusCounts,
    confirmationInProgress,
    avgConfirmationProgress: progressCount > 0 ? Math.round(totalProgress / progressCount) : 0,
  };
}

// Debug function for hysteresis analysis
export function explainHysteresis(
  symbol: string,
  currentState: UniverseStateType | null,
  history: EligibilitySnapshotType[]
): {
  symbol: string;
  currentStatus: string;
  historyLength: number;
  recentEligibility: boolean[];
  hysteresisCheck: HysteresisCheck;
  transition: HysteresisResult;
  timeline: {
    enterRequired: number;
    exitRequired: number;
    enterProgress: number;
    exitProgress: number;
    cooldownRemaining?: number;
    blacklistRemaining?: number;
  };
} {
  const currentStatus = currentState?.status || "INACTIVE";
  const hysteresisCheck = performHysteresisCheck(symbol, currentState, history);
  const transition = determineStateTransition(symbol, currentState, history);
  
  // Get recent eligibility pattern (last 10 snapshots)
  const recentEligibility = history.slice(-10).map(s => isEligible(s));
  
  const confirmMinutesEnter = UCM_CONFIG.ENTER_CONFIRM_MINUTES;
  const confirmMinutesExit = UCM_CONFIG.EXIT_CONFIRM_MINUTES;
  const requiredSnapshotsEnter = Math.ceil(confirmMinutesEnter / UCM_CONFIG.PIPELINE.interval_minutes);
  const requiredSnapshotsExit = Math.ceil(confirmMinutesExit / UCM_CONFIG.PIPELINE.interval_minutes);
  
  const timeline = {
    enterRequired: requiredSnapshotsEnter,
    exitRequired: requiredSnapshotsExit,
    enterProgress: hysteresisCheck.enterProgress,
    exitProgress: hysteresisCheck.exitProgress,
    cooldownRemaining: currentState?.cooldownUntil ? 
      Math.max(0, Math.ceil((currentState.cooldownUntil - Date.now()) / (60 * 1000))) : undefined,
    blacklistRemaining: currentState?.blacklistUntil ? 
      Math.max(0, Math.ceil((currentState.blacklistUntil - Date.now()) / (24 * 60 * 60 * 1000))) : undefined,
  };
  
  return {
    symbol,
    currentStatus,
    historyLength: history.length,
    recentEligibility,
    hysteresisCheck,
    transition,
    timeline,
  };
}