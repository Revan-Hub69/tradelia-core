// Setup Engine Types - Professional Trading System
// Best practice: fail-closed, deterministic, replayable

import { RegimeSignature } from '../mce/types';
import { UniverseActiveType } from '../ucm/schemas';

// ============================================================================
// MARKET STATE INPUT (from existing systems)
// ============================================================================

export interface MarketState {
  regime: RegimeSignature;
  universeFit: MSFState;
  structure: StructureMap;
  orderflow: OrderflowState;
  volatility: VolState;
  session: SessionState;
  asOf: number;
}

export interface MSFState {
  dayGate: {
    tradableDay: boolean;
    countA: number;
    countB: number;
    reasons: string[];
  };
  marketFits: Array<{
    symbol: string;
    fitClass: 'A' | 'B' | 'C' | 'NO_TRADE';
    frictionScore: number;
    dataQuality: number;
  }>;
}

export interface StructureMap {
  [symbol: string]: {
    H4: StructureLevel[];
    H1: StructureLevel[];
    M15: StructureLevel[];
  };
}

export interface StructureLevel {
  level: number;
  type: 'SR' | 'RANGE' | 'SWING' | 'LIQUIDITY_POOL';
  tf: 'H4' | 'H1' | 'M15';
  strength: number;
  lastTouch?: number;
}

export interface OrderflowState {
  [symbol: string]: {
    cvdTrend: 'UP' | 'DOWN' | 'FLAT';
    absorption: boolean;
    exhaustion: boolean;
    aggressionBias: 'BUY' | 'SELL' | 'NEUTRAL';
    imbalance: number;
    stress: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export interface VolState {
  [symbol: string]: {
    atr: number;
    realized: number;
    expansion: boolean;
  };
}

export interface SessionState {
  current: 'ASIA' | 'EU' | 'US' | 'OVERLAP_EU_US';
  openingSoon: boolean;
  closingSoon: boolean;
}

// ============================================================================
// SETUP DEFINITIONS
// ============================================================================

export type SetupType = 'BREAKOUT_ACCEPTANCE' | 'PULLBACK_STRUCTURAL' | 'LIQUIDITY_SWEEP_REVERSAL';

export interface SetupCandidate {
  setupId: string;              // deterministic hash
  symbol: string;
  setupType: SetupType;
  direction: 'LONG' | 'SHORT';
  
  entryModel: {
    type: 'LIMIT' | 'STOP';
    price: number;
    ttlSec: number;
  };
  
  stopModel: {
    type: 'STRUCTURAL';
    level: number;
  };
  
  targets: {
    primary: number;
    secondary?: number;
  };
  
  confidenceScore: number;      // 0-1
  evidence: Evidence[];
  invalidationCodes: string[];
  expiresAt: number;
  
  // Risk metrics
  riskReward: number;
  maxRisk: number;              // in base currency
}

export interface Evidence {
  type: 'REGIME' | 'STRUCTURE' | 'ORDERFLOW' | 'LIQUIDITY' | 'VOLATILITY';
  description: string;
  weight: number;               // contribution to confidence
  data: Record<string, any>;
}

// ============================================================================
// SETUP LIFECYCLE EVENTS
// ============================================================================

export type SetupEventType = 
  | 'CONTEXT_FILTER'
  | 'STRUCTURE_ANALYSIS' 
  | 'ORDERFLOW_ANALYSIS'
  | 'SETUP_DETECTED'
  | 'SETUP_VALIDATED'
  | 'SETUP_REJECTED'
  | 'SETUP_EXPIRED'
  | 'ENTRY_TRIGGERED'
  | 'STOP_HIT'
  | 'TARGET_HIT'
  | 'MANUAL_EXIT';

export interface SetupEvent {
  eventId: string;              // UUID
  setupId?: string;             // links to setup if applicable
  symbol: string;
  eventType: SetupEventType;
  timestamp: number;
  
  // Event-specific data
  data: Record<string, any>;
  
  // Context snapshot
  marketState: Partial<MarketState>;
  
  // Outcome tracking
  outcome?: SetupOutcome;
}

export interface SetupOutcome {
  pnl: number;                  // in base currency
  pnlPct: number;               // percentage
  holdTime: number;             // milliseconds
  exitReason: 'STOP' | 'TARGET_PRIMARY' | 'TARGET_SECONDARY' | 'MANUAL' | 'EXPIRED';
  slippage: number;             // entry vs intended price
  maxDrawdown: number;          // during trade
  maxRunup: number;             // during trade
}

// ============================================================================
// CONTEXT GATES
// ============================================================================

export interface ContextGate {
  allowed: boolean;
  reasonCodes: string[];
  regimeCompatible: boolean;
  sessionValid: boolean;
  volatilityAdequate: boolean;
  msfEnabled: boolean;
}

export interface SetupDecision {
  asOf: number;
  allowed: boolean;
  setups: SetupCandidate[];
  reasonCodes: string[];
  contextGate: ContextGate;
}

// ============================================================================
// KPI TRACKING
// ============================================================================

export interface SetupKPIs {
  period: {
    from: number;
    to: number;
    days: number;
  };
  
  // Volume metrics
  totalSetups: number;
  setupsByType: Record<SetupType, number>;
  setupsBySymbol: Record<string, number>;
  
  // Quality metrics
  avgConfidenceScore: number;
  avgRiskReward: number;
  
  // Execution metrics
  triggered: number;
  triggerRate: number;          // triggered / total
  avgSlippage: number;
  
  // Performance metrics
  winners: number;
  losers: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  
  // Risk metrics
  maxDrawdown: number;
  avgHoldTime: number;
  largestLoss: number;
  
  // Regime breakdown
  performanceByRegime: Record<string, {
    count: number;
    winRate: number;
    expectancy: number;
  }>;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface SetupEngineConfig {
  // Context filters
  minConfidenceScore: number;
  minRiskReward: number;
  maxRiskPerTrade: number;       // in base currency
  
  // Setup-specific configs
  breakoutConfig: {
    minStructureStrength: number;
    maxRetestTime: number;
    requireOrderflowConfirmation: boolean;
  };
  
  pullbackConfig: {
    minTrendStrength: number;
    maxPullbackDepth: number;
    requireVolumeConfirmation: boolean;
  };
  
  liquiditySweepConfig: {
    minSweepDistance: number;
    maxAbsorptionTime: number;
    requireCVDFlip: boolean;
  };
  
  // Risk management
  maxConcurrentSetups: number;
  maxExposurePerSymbol: number;
  killSwitchEnabled: boolean;
}

export const DEFAULT_SETUP_CONFIG: SetupEngineConfig = {
  minConfidenceScore: 0.7,
  minRiskReward: 1.2,
  maxRiskPerTrade: 100,         // $100 max risk per trade
  
  breakoutConfig: {
    minStructureStrength: 0.6,
    maxRetestTime: 300000,      // 5 minutes
    requireOrderflowConfirmation: true,
  },
  
  pullbackConfig: {
    minTrendStrength: 0.7,
    maxPullbackDepth: 0.5,      // 50% retracement max
    requireVolumeConfirmation: true,
  },
  
  liquiditySweepConfig: {
    minSweepDistance: 0.002,    // 0.2% minimum sweep
    maxAbsorptionTime: 180000,  // 3 minutes
    requireCVDFlip: true,
  },
  
  maxConcurrentSetups: 3,
  maxExposurePerSymbol: 200,    // $200 max per symbol
  killSwitchEnabled: true,
};