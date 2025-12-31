// Breakout + Acceptance Rules - Professional Trading System
// Best practice: precise numerical criteria, no visual interpretation

import { StructureMap, StructureLevel, OrderflowState, VolState } from '../types';

export interface StructuralBreak {
  level: number;
  direction: 'LONG' | 'SHORT';
  timeframe: 'H4' | 'H1' | 'M15';
  strength: number;          // 0-1 confidence in break
  breakTime: number;         // When break occurred
  breakDistance: number;     // How far beyond level
  volumeConfirmation: boolean;
}

export interface AcceptanceCheck {
  confirmed: boolean;
  duration: number;          // Time spent above/below break
  retestCount: number;       // Number of retests
  holdingStrength: number;   // 0-1 how well it's holding
}

export interface OrderflowAlignment {
  aligned: boolean;
  strength: string;          // 'WEAK' | 'MODERATE' | 'STRONG'
  confidence: number;        // 0-1
  cvdTrend: string;
  imbalanceSupport: boolean;
  aggressionBias: string;
}

// ============================================================================
// STRUCTURAL BREAK DETECTION
// ============================================================================

export function detectStructuralBreak(structure: StructureMap[string]): StructuralBreak | null {
  // Priority: H1 > M15 > H4 (intraday focus)
  const timeframes: Array<keyof typeof structure> = ['H1', 'M15', 'H4'];
  
  for (const tf of timeframes) {
    const levels = structure[tf];
    if (!levels || levels.length === 0) continue;
    
    // Find the most significant recent break
    const recentBreak = findRecentBreak(levels, tf);
    if (recentBreak) {
      return recentBreak;
    }
  }
  
  return null;
}

function findRecentBreak(levels: StructureLevel[], timeframe: string): StructuralBreak | null {
  const now = Date.now();
  const maxAge = getMaxBreakAge(timeframe);
  
  // Sort by strength and recency
  const candidates = levels
    .filter(level => {
      // Must be recent enough
      const age = now - (level.lastTouch || 0);
      return age <= maxAge;
    })
    .filter(level => {
      // Must be significant level
      return level.strength >= getMinBreakStrength(timeframe);
    })
    .sort((a, b) => {
      // Sort by strength * recency score
      const aScore = a.strength * getRecencyScore(now - (a.lastTouch || 0), maxAge);
      const bScore = b.strength * getRecencyScore(now - (b.lastTouch || 0), maxAge);
      return bScore - aScore;
    });
  
  if (candidates.length === 0) return null;
  
  const bestCandidate = candidates[0];
  
  // Determine break direction and validate
  const breakAnalysis = analyzeBreakDirection(bestCandidate);
  if (!breakAnalysis.isValid) return null;
  
  return {
    level: bestCandidate.level,
    direction: breakAnalysis.direction,
    timeframe: timeframe as any,
    strength: bestCandidate.strength,
    breakTime: bestCandidate.lastTouch || now,
    breakDistance: breakAnalysis.distance,
    volumeConfirmation: breakAnalysis.volumeConfirmed,
  };
}

function getMaxBreakAge(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 4 * 60 * 60 * 1000;    // 4 hours
    case 'H1': return 2 * 60 * 60 * 1000;    // 2 hours  
    case 'M15': return 30 * 60 * 1000;       // 30 minutes
    default: return 60 * 60 * 1000;          // 1 hour
  }
}

function getMinBreakStrength(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 0.8;   // Very high confidence for H4
    case 'H1': return 0.6;   // Moderate confidence for H1
    case 'M15': return 0.5;  // Lower threshold for M15
    default: return 0.6;
  }
}

function getRecencyScore(age: number, maxAge: number): number {
  // Linear decay from 1.0 to 0.1
  const ratio = Math.min(age / maxAge, 1);
  return 1.0 - (ratio * 0.9);
}

function analyzeBreakDirection(level: StructureLevel): {
  isValid: boolean;
  direction: 'LONG' | 'SHORT';
  distance: number;
  volumeConfirmed: boolean;
} {
  // This would analyze current price vs level to determine break direction
  // For now, simplified logic based on level type
  
  const currentPrice = getCurrentPrice(); // Mock function
  const distance = Math.abs(currentPrice - level.level) / level.level;
  
  // Minimum break distance (0.1% for crypto, 0.05% for forex)
  const minDistance = 0.001;
  if (distance < minDistance) {
    return { isValid: false, direction: 'LONG', distance: 0, volumeConfirmed: false };
  }
  
  const direction = currentPrice > level.level ? 'LONG' : 'SHORT';
  
  // Volume confirmation would check if break had volume support
  const volumeConfirmed = checkVolumeConfirmation(level, direction);
  
  return {
    isValid: true,
    direction,
    distance,
    volumeConfirmed,
  };
}

// ============================================================================
// ACCEPTANCE CHECK
// ============================================================================

export function checkAcceptance(
  structuralBreak: StructuralBreak, 
  currentTimestamp: number
): AcceptanceCheck {
  const breakAge = currentTimestamp - structuralBreak.breakTime;
  const minAcceptanceTime = getMinAcceptanceTime(structuralBreak.timeframe);
  
  if (breakAge < minAcceptanceTime) {
    return {
      confirmed: false,
      duration: breakAge,
      retestCount: 0,
      holdingStrength: 0,
    };
  }
  
  // Check if price is still holding above/below break level
  const currentPrice = getCurrentPrice();
  const isHolding = checkIfHolding(currentPrice, structuralBreak);
  
  if (!isHolding.holding) {
    return {
      confirmed: false,
      duration: breakAge,
      retestCount: isHolding.retestCount,
      holdingStrength: 0,
    };
  }
  
  // Calculate holding strength based on:
  // 1. Time spent holding
  // 2. Distance from break level
  // 3. Number of successful retests
  const holdingStrength = calculateHoldingStrength(
    breakAge,
    isHolding.distance,
    isHolding.retestCount,
    structuralBreak.timeframe
  );
  
  return {
    confirmed: holdingStrength >= 0.6, // 60% minimum holding strength
    duration: breakAge,
    retestCount: isHolding.retestCount,
    holdingStrength,
  };
}

function getMinAcceptanceTime(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 15 * 60 * 1000;   // 15 minutes
    case 'H1': return 10 * 60 * 1000;   // 10 minutes
    case 'M15': return 5 * 60 * 1000;   // 5 minutes
    default: return 10 * 60 * 1000;
  }
}

function checkIfHolding(currentPrice: number, structuralBreak: StructuralBreak): {
  holding: boolean;
  distance: number;
  retestCount: number;
} {
  const level = structuralBreak.level;
  const direction = structuralBreak.direction;
  
  // Check if still on correct side of break
  const onCorrectSide = direction === 'LONG' ? currentPrice > level : currentPrice < level;
  
  if (!onCorrectSide) {
    return { holding: false, distance: 0, retestCount: 0 };
  }
  
  const distance = Math.abs(currentPrice - level) / level;
  
  // Count retests (simplified - would need historical data)
  const retestCount = estimateRetestCount(structuralBreak);
  
  return {
    holding: true,
    distance,
    retestCount,
  };
}

function calculateHoldingStrength(
  duration: number,
  distance: number,
  retestCount: number,
  timeframe: string
): number {
  // Time component (0-0.4)
  const maxDuration = getMaxAcceptanceTime(timeframe);
  const timeScore = Math.min(duration / maxDuration, 1) * 0.4;
  
  // Distance component (0-0.4)
  const idealDistance = 0.005; // 0.5%
  const distanceScore = Math.min(distance / idealDistance, 1) * 0.4;
  
  // Retest component (0-0.2)
  const retestScore = Math.min(retestCount / 3, 1) * 0.2; // Max 3 retests
  
  return timeScore + distanceScore + retestScore;
}

function getMaxAcceptanceTime(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 60 * 60 * 1000;   // 1 hour
    case 'H1': return 30 * 60 * 1000;   // 30 minutes
    case 'M15': return 15 * 60 * 1000;  // 15 minutes
    default: return 30 * 60 * 1000;
  }
}

// ============================================================================
// ORDERFLOW ALIGNMENT CHECK
// ============================================================================

export function checkOrderflowAlignment(
  orderflow: OrderflowState[string],
  direction: 'LONG' | 'SHORT'
): OrderflowAlignment {
  if (!orderflow) {
    return {
      aligned: false,
      strength: 'WEAK',
      confidence: 0,
      cvdTrend: 'FLAT',
      imbalanceSupport: false,
      aggressionBias: 'NEUTRAL',
    };
  }
  
  let alignmentScore = 0;
  let confidence = 0;
  
  // 1. CVD Trend Alignment (40% weight)
  const cvdAligned = checkCVDAlignment(orderflow.cvdTrend, direction);
  if (cvdAligned) {
    alignmentScore += 0.4;
    confidence += 0.4;
  }
  
  // 2. Imbalance Support (30% weight)
  const imbalanceSupport = checkImbalanceSupport(orderflow.imbalance, direction);
  if (imbalanceSupport) {
    alignmentScore += 0.3;
    confidence += 0.3;
  }
  
  // 3. Aggression Bias (20% weight)
  const aggressionAligned = checkAggressionAlignment(orderflow.aggressionBias, direction);
  if (aggressionAligned) {
    alignmentScore += 0.2;
    confidence += 0.2;
  }
  
  // 4. No Absorption/Exhaustion (10% weight)
  const noNegativeSignals = !orderflow.absorption && !orderflow.exhaustion;
  if (noNegativeSignals) {
    alignmentScore += 0.1;
    confidence += 0.1;
  }
  
  const strength = getAlignmentStrength(alignmentScore);
  const aligned = alignmentScore >= 0.6; // 60% minimum alignment
  
  return {
    aligned,
    strength,
    confidence,
    cvdTrend: orderflow.cvdTrend,
    imbalanceSupport,
    aggressionBias: orderflow.aggressionBias,
  };
}

function checkCVDAlignment(cvdTrend: string, direction: 'LONG' | 'SHORT'): boolean {
  if (direction === 'LONG') return cvdTrend === 'UP';
  if (direction === 'SHORT') return cvdTrend === 'DOWN';
  return false;
}

function checkImbalanceSupport(imbalance: number, direction: 'LONG' | 'SHORT'): boolean {
  const threshold = 0.1; // 10% imbalance threshold
  
  if (direction === 'LONG') return imbalance > threshold;
  if (direction === 'SHORT') return imbalance < -threshold;
  return false;
}

function checkAggressionAlignment(aggressionBias: string, direction: 'LONG' | 'SHORT'): boolean {
  if (direction === 'LONG') return aggressionBias === 'BUY';
  if (direction === 'SHORT') return aggressionBias === 'SELL';
  return false;
}

function getAlignmentStrength(score: number): 'WEAK' | 'MODERATE' | 'STRONG' {
  if (score >= 0.8) return 'STRONG';
  if (score >= 0.6) return 'MODERATE';
  return 'WEAK';
}

// ============================================================================
// ENTRY/STOP/TARGET CALCULATIONS
// ============================================================================

export function calculateBreakoutEntry(structuralBreak: StructuralBreak): number {
  const level = structuralBreak.level;
  const direction = structuralBreak.direction;
  
  // Entry slightly beyond break level to confirm momentum
  const buffer = level * 0.0005; // 0.05% buffer
  
  if (direction === 'LONG') {
    return level + buffer;
  } else {
    return level - buffer;
  }
}

export function calculateBreakoutStop(
  structuralBreak: StructuralBreak,
  structure: StructureMap[string]
): number {
  const level = structuralBreak.level;
  const direction = structuralBreak.direction;
  const timeframe = structuralBreak.timeframe;
  
  // Find next significant level in opposite direction
  const oppositeLevels = structure[timeframe]
    ?.filter(l => {
      if (direction === 'LONG') {
        return l.level < level && l.strength >= 0.5;
      } else {
        return l.level > level && l.strength >= 0.5;
      }
    })
    .sort((a, b) => {
      // Sort by proximity to break level
      const aDist = Math.abs(a.level - level);
      const bDist = Math.abs(b.level - level);
      return aDist - bDist;
    });
  
  if (oppositeLevels && oppositeLevels.length > 0) {
    const stopLevel = oppositeLevels[0].level;
    
    // Add small buffer beyond structural level
    const buffer = level * 0.0003; // 0.03% buffer
    
    if (direction === 'LONG') {
      return stopLevel - buffer;
    } else {
      return stopLevel + buffer;
    }
  }
  
  // Fallback: ATR-based stop
  const atrMultiplier = getATRMultiplier(timeframe);
  const atr = estimateATR(level); // Mock function
  
  if (direction === 'LONG') {
    return level - (atr * atrMultiplier);
  } else {
    return level + (atr * atrMultiplier);
  }
}

export function calculateBreakoutTargets(
  structuralBreak: StructuralBreak,
  structure: StructureMap[string],
  volatility: VolState[string]
): { primary: number; secondary?: number } {
  const level = structuralBreak.level;
  const direction = structuralBreak.direction;
  const timeframe = structuralBreak.timeframe;
  
  // Find next resistance/support levels in direction of break
  const targetLevels = structure[timeframe]
    ?.filter(l => {
      if (direction === 'LONG') {
        return l.level > level && l.strength >= 0.4;
      } else {
        return l.level < level && l.strength >= 0.4;
      }
    })
    .sort((a, b) => {
      // Sort by proximity to break level
      const aDist = Math.abs(a.level - level);
      const bDist = Math.abs(b.level - level);
      return aDist - bDist;
    });
  
  if (targetLevels && targetLevels.length > 0) {
    const primary = targetLevels[0].level;
    const secondary = targetLevels.length > 1 ? targetLevels[1].level : undefined;
    
    return { primary, secondary };
  }
  
  // Fallback: ATR-based targets
  const atr = volatility.atr;
  const primaryMultiplier = getPrimaryTargetMultiplier(timeframe);
  const secondaryMultiplier = primaryMultiplier * 1.6;
  
  if (direction === 'LONG') {
    return {
      primary: level + (atr * primaryMultiplier),
      secondary: level + (atr * secondaryMultiplier),
    };
  } else {
    return {
      primary: level - (atr * primaryMultiplier),
      secondary: level - (atr * secondaryMultiplier),
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS (MOCKS - TO BE REPLACED WITH REAL DATA)
// ============================================================================

function getCurrentPrice(): number {
  // Mock function - would get real current price
  return 45000;
}

function checkVolumeConfirmation(level: StructureLevel, direction: string): boolean {
  // Mock function - would check if break had volume support
  return Math.random() > 0.3; // 70% chance of volume confirmation
}

function estimateRetestCount(structuralBreak: StructuralBreak): number {
  // Mock function - would analyze recent price action for retests
  return Math.floor(Math.random() * 3);
}

function estimateATR(price: number): number {
  // Mock function - would get real ATR
  return price * 0.02; // 2% ATR estimate
}

function getATRMultiplier(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 2.0;
    case 'H1': return 1.5;
    case 'M15': return 1.0;
    default: return 1.5;
  }
}

function getPrimaryTargetMultiplier(timeframe: string): number {
  switch (timeframe) {
    case 'H4': return 3.0;
    case 'H1': return 2.0;
    case 'M15': return 1.5;
    default: return 2.0;
  }
}