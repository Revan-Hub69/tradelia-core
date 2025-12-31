// Setup Detection Engine - Professional Trading System
// Best practice: numerical rules, no visual patterns, deterministic

import { 
  MarketState, 
  SetupCandidate, 
  SetupType, 
  Evidence, 
  SetupEngineConfig,
  DEFAULT_SETUP_CONFIG 
} from '../types';
import { setupLogger } from '../logger';
import { createHash } from 'crypto';
import * as breakoutRules from './breakout-rules';

export class SetupDetector {
  constructor(private readonly config: SetupEngineConfig = DEFAULT_SETUP_CONFIG) {}

  // ============================================================================
  // MAIN DETECTION ENGINE
  // ============================================================================

  async detectSetups(marketState: MarketState): Promise<SetupCandidate[]> {
    const candidates: SetupCandidate[] = [];
    
    // Context filter - fail-closed
    const contextGate = await this.checkContextGate(marketState);
    if (!contextGate.allowed) {
      await setupLogger.logContextFilter(
        'ALL_SYMBOLS',
        false,
        contextGate.reasonCodes,
        marketState
      );
      return [];
    }

    // Process each symbol in the universe
    const symbols = Object.keys(marketState.structure);
    
    for (const symbol of symbols) {
      try {
        // Check if symbol has required data
        if (!this.hasRequiredData(symbol, marketState)) {
          continue;
        }

        // Log structure analysis
        await setupLogger.logStructureAnalysis(
          symbol,
          marketState.structure[symbol],
          marketState
        );

        // Log orderflow analysis
        if (marketState.orderflow[symbol]) {
          await setupLogger.logOrderflowAnalysis(
            symbol,
            marketState.orderflow[symbol],
            marketState
          );
        }

        // Detect each setup type
        const breakoutSetup = await this.detectBreakoutAcceptance(symbol, marketState);
        const pullbackSetup = await this.detectPullbackStructural(symbol, marketState);
        const liquiditySetup = await this.detectLiquiditySweepReversal(symbol, marketState);

        // Collect valid candidates
        if (breakoutSetup) candidates.push(breakoutSetup);
        if (pullbackSetup) candidates.push(pullbackSetup);
        if (liquiditySetup) candidates.push(liquiditySetup);

      } catch (error) {
        console.error(`Setup detection error for ${symbol}:`, error);
        // Continue with other symbols
      }
    }

    return candidates;
  }

  // ============================================================================
  // CONTEXT GATE - MARKET CONDITIONS CHECK
  // ============================================================================

  private async checkContextGate(marketState: MarketState): Promise<{
    allowed: boolean;
    reasonCodes: string[];
    regimeCompatible: boolean;
    sessionValid: boolean;
    volatilityAdequate: boolean;
    msfEnabled: boolean;
  }> {
    const reasonCodes: string[] = [];
    
    // Check regime compatibility
    const regimeCompatible = this.isRegimeCompatible(marketState.regime);
    if (!regimeCompatible) {
      reasonCodes.push('regime_incompatible');
    }

    // Check session validity
    const sessionValid = this.isSessionValid(marketState.session);
    if (!sessionValid) {
      reasonCodes.push('session_invalid');
    }

    // Check MSF day gate
    const msfEnabled = marketState.universeFit.dayGate.tradableDay;
    if (!msfEnabled) {
      reasonCodes.push('msf_day_gate_closed');
    }

    // Check volatility conditions
    const volatilityAdequate = this.isVolatilityAdequate(marketState.volatility);
    if (!volatilityAdequate) {
      reasonCodes.push('volatility_inadequate');
    }

    const allowed = regimeCompatible && sessionValid && msfEnabled && volatilityAdequate;

    return {
      allowed,
      reasonCodes,
      regimeCompatible,
      sessionValid,
      volatilityAdequate,
      msfEnabled,
    };
  }

  private isRegimeCompatible(regime: any): boolean {
    // Accept trend and expansion regimes, be cautious with range
    const classification = regime.classification;
    const strength = regime.strength || 0;
    
    if (classification === 'TREND' && strength >= 0.6) return true;
    if (classification === 'EXPANSION' && strength >= 0.7) return true;
    if (classification === 'RANGE' && strength >= 0.8) return true; // High confidence range only
    
    return false;
  }

  private isSessionValid(session: any): boolean {
    // Avoid Asian session (low liquidity), prefer EU/US
    return session.current !== 'ASIA';
  }

  private isVolatilityAdequate(volatility: any): boolean {
    // Check if we have sufficient volatility for intraday moves
    const symbols = Object.keys(volatility);
    if (symbols.length === 0) return false;
    
    // At least 50% of symbols should have adequate volatility
    const adequateCount = symbols.filter(symbol => {
      const vol = volatility[symbol];
      return vol.atr > 0 && vol.realized > 0.01; // Minimum 1% realized vol
    }).length;
    
    return adequateCount >= symbols.length * 0.5;
  }

  // ============================================================================
  // SETUP 1: BREAKOUT + ACCEPTANCE
  // ============================================================================

  private async detectBreakoutAcceptance(
    symbol: string, 
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. STRUCTURAL BREAK DETECTION
    const structuralBreak = this.detectStructuralBreak(structure);
    if (!structuralBreak) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `${structuralBreak.direction} break of ${structuralBreak.level} (${structuralBreak.timeframe})`,
      weight: 0.3,
      data: structuralBreak,
    });
    confidenceScore += 0.3 * structuralBreak.strength;

    // 2. ACCEPTANCE CHECK (price holding above/below break level)
    const acceptance = this.checkAcceptance(structuralBreak, marketState.asOf);
    if (!acceptance.confirmed) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `Acceptance confirmed: ${acceptance.duration}ms above break`,
      weight: 0.25,
      data: acceptance,
    });
    confidenceScore += 0.25;

    // 3. ORDERFLOW CONFIRMATION
    const orderflowConfirmation = this.checkOrderflowAlignment(
      orderflow, 
      structuralBreak.direction
    );
    
    if (this.config.breakoutConfig.requireOrderflowConfirmation && !orderflowConfirmation.aligned) {
      return null;
    }

    if (orderflowConfirmation.aligned) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `Orderflow aligned: ${orderflowConfirmation.strength}`,
        weight: 0.25,
        data: orderflowConfirmation,
      });
      confidenceScore += 0.25 * orderflowConfirmation.confidence;
    }

    // 4. REGIME ALIGNMENT
    const regimeAlignment = this.checkRegimeAlignment(
      marketState.regime, 
      structuralBreak.direction
    );
    
    evidence.push({
      type: 'REGIME',
      description: `Regime ${regimeAlignment.compatible ? 'supports' : 'neutral to'} ${structuralBreak.direction}`,
      weight: 0.2,
      data: regimeAlignment,
    });
    confidenceScore += 0.2 * regimeAlignment.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const entryPrice = this.calculateBreakoutEntry(structuralBreak);
    const stopLevel = this.calculateBreakoutStop(structuralBreak, structure);
    const targets = this.calculateBreakoutTargets(structuralBreak, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    // Risk-reward filter
    if (riskReward < this.config.minRiskReward) return null;

    // Confidence filter
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'BREAKOUT_ACCEPTANCE', marketState.asOf),
      symbol,
      setupType: 'BREAKOUT_ACCEPTANCE',
      direction: structuralBreak.direction,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: this.config.breakoutConfig.maxRetestTime / 1000,
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + this.config.breakoutConfig.maxRetestTime,
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100, // Assuming $100 position size
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // SETUP 2: PULLBACK STRUCTURAL
  // ============================================================================

  private async detectPullbackStructural(
    symbol: string,
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. TREND IDENTIFICATION
    const trend = this.identifyTrend(structure, marketState.regime);
    if (!trend || trend.strength < this.config.pullbackConfig.minTrendStrength) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `${trend.direction} trend identified, strength: ${trend.strength}`,
      weight: 0.3,
      data: trend,
    });
    confidenceScore += 0.3 * trend.strength;

    // 2. PULLBACK TO STRUCTURE
    const pullback = this.detectPullbackToStructure(structure, trend);
    if (!pullback) return null;

    const pullbackDepth = pullback.depth;
    if (pullbackDepth > this.config.pullbackConfig.maxPullbackDepth) return null;

    evidence.push({
      type: 'STRUCTURE',
      description: `Pullback to ${pullback.level} (${pullbackDepth * 100}% retracement)`,
      weight: 0.25,
      data: pullback,
    });
    confidenceScore += 0.25 * (1 - pullbackDepth); // Shallower pullbacks score higher

    // 3. ORDERFLOW RESUMPTION
    const orderflowResumption = this.checkOrderflowResumption(orderflow, trend.direction);
    
    if (this.config.pullbackConfig.requireVolumeConfirmation && !orderflowResumption.confirmed) {
      return null;
    }

    if (orderflowResumption.confirmed) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `Trend resumption confirmed: ${orderflowResumption.signal}`,
        weight: 0.25,
        data: orderflowResumption,
      });
      confidenceScore += 0.25 * orderflowResumption.strength;
    }

    // 4. REGIME ALIGNMENT
    const regimeAlignment = this.checkRegimeAlignment(marketState.regime, trend.direction);
    evidence.push({
      type: 'REGIME',
      description: `Regime alignment: ${regimeAlignment.score}`,
      weight: 0.2,
      data: regimeAlignment,
    });
    confidenceScore += 0.2 * regimeAlignment.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const entryPrice = this.calculatePullbackEntry(pullback);
    const stopLevel = this.calculatePullbackStop(pullback, trend);
    const targets = this.calculatePullbackTargets(trend, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    if (riskReward < this.config.minRiskReward) return null;
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'PULLBACK_STRUCTURAL', marketState.asOf),
      symbol,
      setupType: 'PULLBACK_STRUCTURAL',
      direction: trend.direction,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: 600, // 10 minutes for pullback entries
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + 600000, // 10 minutes
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100,
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // SETUP 3: LIQUIDITY SWEEP + REVERSAL
  // ============================================================================

  private async detectLiquiditySweepReversal(
    symbol: string,
    marketState: MarketState
  ): Promise<SetupCandidate | null> {
    const structure = marketState.structure[symbol];
    const orderflow = marketState.orderflow[symbol];
    const volatility = marketState.volatility[symbol];
    
    if (!structure || !orderflow || !volatility) return null;

    const evidence: Evidence[] = [];
    let confidenceScore = 0;

    // 1. LIQUIDITY SWEEP DETECTION
    const liquiditySweep = this.detectLiquiditySweep(structure);
    if (!liquiditySweep) return null;

    if (liquiditySweep.distance < this.config.liquiditySweepConfig.minSweepDistance) return null;

    evidence.push({
      type: 'LIQUIDITY',
      description: `Liquidity sweep detected: ${liquiditySweep.direction} beyond ${liquiditySweep.level}`,
      weight: 0.3,
      data: liquiditySweep,
    });
    confidenceScore += 0.3 * liquiditySweep.strength;

    // 2. ABSORPTION DETECTION
    const absorption = this.detectAbsorption(orderflow, liquiditySweep);
    if (!absorption.detected) return null;

    evidence.push({
      type: 'ORDERFLOW',
      description: `Absorption detected: ${absorption.intensity} at ${absorption.level}`,
      weight: 0.25,
      data: absorption,
    });
    confidenceScore += 0.25 * absorption.strength;

    // 3. CVD FLIP CONFIRMATION
    const cvdFlip = this.detectCVDFlip(orderflow, liquiditySweep.direction);
    
    if (this.config.liquiditySweepConfig.requireCVDFlip && !cvdFlip.confirmed) {
      return null;
    }

    if (cvdFlip.confirmed) {
      evidence.push({
        type: 'ORDERFLOW',
        description: `CVD flip confirmed: ${cvdFlip.direction}`,
        weight: 0.25,
        data: cvdFlip,
      });
      confidenceScore += 0.25 * cvdFlip.strength;
    }

    // 4. REGIME COMPATIBILITY
    const regimeCompatibility = this.checkLiquiditySweepRegimeCompatibility(
      marketState.regime, 
      liquiditySweep
    );
    
    evidence.push({
      type: 'REGIME',
      description: `Regime compatibility: ${regimeCompatibility.score}`,
      weight: 0.2,
      data: regimeCompatibility,
    });
    confidenceScore += 0.2 * regimeCompatibility.score;

    // 5. CALCULATE ENTRY/STOP/TARGETS
    const reversalDirection = liquiditySweep.direction === 'LONG' ? 'SHORT' : 'LONG';
    const entryPrice = this.calculateLiquiditySweepEntry(liquiditySweep, absorption);
    const stopLevel = this.calculateLiquiditySweepStop(liquiditySweep);
    const targets = this.calculateLiquiditySweepTargets(liquiditySweep, structure, volatility);

    const riskReward = Math.abs(targets.primary - entryPrice) / Math.abs(entryPrice - stopLevel);
    
    if (riskReward < this.config.minRiskReward) return null;
    if (confidenceScore < this.config.minConfidenceScore) return null;

    const setupCandidate: SetupCandidate = {
      setupId: this.generateSetupId(symbol, 'LIQUIDITY_SWEEP_REVERSAL', marketState.asOf),
      symbol,
      setupType: 'LIQUIDITY_SWEEP_REVERSAL',
      direction: reversalDirection,
      
      entryModel: {
        type: 'LIMIT',
        price: entryPrice,
        ttlSec: this.config.liquiditySweepConfig.maxAbsorptionTime / 1000,
      },
      
      stopModel: {
        type: 'STRUCTURAL',
        level: stopLevel,
      },
      
      targets,
      
      confidenceScore,
      evidence,
      invalidationCodes: [],
      expiresAt: marketState.asOf + this.config.liquiditySweepConfig.maxAbsorptionTime,
      riskReward,
      maxRisk: Math.abs(entryPrice - stopLevel) * 100,
    };

    await setupLogger.logSetupDetected(setupCandidate, marketState);
    return setupCandidate;
  }

  // ============================================================================
  // PUBLIC METHODS FOR TESTING
  // ============================================================================

  generateSetupId(symbol: string, setupType: SetupType, timestamp: number): string {
    const data = `${symbol}-${setupType}-${timestamp}`;
    return createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private hasRequiredData(symbol: string, marketState: MarketState): boolean {
    return !!(
      marketState.structure[symbol] &&
      marketState.orderflow[symbol] &&
      marketState.volatility[symbol]
    );
  }

  // ============================================================================
  // BREAKOUT SETUP IMPLEMENTATION
  // ============================================================================

  private detectStructuralBreak(structure: any): any {
    return breakoutRules.detectStructuralBreak(structure);
  }

  private checkAcceptance(structuralBreak: any, timestamp: number): any {
    return breakoutRules.checkAcceptance(structuralBreak, timestamp);
  }

  private checkOrderflowAlignment(orderflow: any, direction: 'LONG' | 'SHORT'): any {
    return breakoutRules.checkOrderflowAlignment(orderflow, direction);
  }

  private checkRegimeAlignment(regime: any, direction: 'LONG' | 'SHORT'): any {
    // Regime alignment logic
    const classification = regime.classification;
    const strength = regime.strength || 0;
    
    let score = 0;
    let compatible = false;
    
    if (classification === 'TREND') {
      // Trend regime supports both directions if strong enough
      score = strength;
      compatible = strength >= 0.6;
    } else if (classification === 'EXPANSION') {
      // Expansion regime is good for breakouts
      score = strength * 0.9; // Slightly lower than trend
      compatible = strength >= 0.7;
    } else if (classification === 'RANGE') {
      // Range regime is less favorable for breakouts
      score = strength * 0.5;
      compatible = strength >= 0.8; // Need very strong range
    }
    
    return { compatible, score };
  }

  private calculateBreakoutEntry(structuralBreak: any): number {
    return breakoutRules.calculateBreakoutEntry(structuralBreak);
  }

  private calculateBreakoutStop(structuralBreak: any, structure: any): number {
    return breakoutRules.calculateBreakoutStop(structuralBreak, structure);
  }

  private calculateBreakoutTargets(structuralBreak: any, structure: any, volatility: any): any {
    return breakoutRules.calculateBreakoutTargets(structuralBreak, structure, volatility);
  }
  
  private identifyTrend(structure: any, regime: any): any {
    // Look for clear trend structure across timeframes
    const h4Levels = structure.H4 || [];
    const h1Levels = structure.H1 || [];
    
    if (h4Levels.length < 2 || h1Levels.length < 2) return null;
    
    // Check for ascending/descending structure levels
    const h4Swings = h4Levels.filter((l: any) => l.type === 'SWING').sort((a: any, b: any) => a.level - b.level);
    const h1Swings = h1Levels.filter((l: any) => l.type === 'SWING').sort((a: any, b: any) => a.level - b.level);
    
    if (h4Swings.length < 2 || h1Swings.length < 2) return null;
    
    // Determine trend direction based on structure progression
    const h4TrendUp = h4Swings[h4Swings.length - 1].level > h4Swings[0].level;
    const h1TrendUp = h1Swings[h1Swings.length - 1].level > h1Swings[0].level;
    
    // Both timeframes must agree
    if (h4TrendUp !== h1TrendUp) return null;
    
    const direction = h4TrendUp ? 'LONG' : 'SHORT';
    
    // Calculate trend strength based on regime and structure consistency
    let strength = 0.5; // Base strength
    
    if (regime.classification === 'TREND') {
      strength += regime.strength * 0.3;
    }
    
    // Add strength for structure consistency
    const structureConsistency = Math.min(h4Swings.length, h1Swings.length) / 5; // Max 5 levels
    strength += structureConsistency * 0.2;
    
    return {
      direction,
      strength: Math.min(strength, 1.0),
      h4Levels: h4Swings,
      h1Levels: h1Swings,
    };
  }

  private detectPullbackToStructure(structure: any, trend: any): any {
    const m15Levels = structure.M15 || [];
    const h1Levels = trend.h1Levels;
    
    if (m15Levels.length === 0 || h1Levels.length === 0) return null;
    
    // Find the most recent H1 structure level that could act as support/resistance
    const relevantH1Level = trend.direction === 'LONG' 
      ? h1Levels.filter((l: any) => l.level < (m15Levels[0]?.level || 0)).pop() // Support below
      : h1Levels.filter((l: any) => l.level > (m15Levels[0]?.level || 0)).shift(); // Resistance above
    
    if (!relevantH1Level) return null;
    
    // Check if current price is near this level (within 0.5% for pullback)
    const currentPrice = m15Levels[0]?.level || 0;
    const pullbackDistance = Math.abs(currentPrice - relevantH1Level.level) / relevantH1Level.level;
    
    if (pullbackDistance > 0.005) return null; // Too far from structure
    
    // Calculate pullback depth from recent high/low
    const recentExtremes = m15Levels.filter((l: any) => l.type === 'SWING').slice(0, 3);
    if (recentExtremes.length === 0) return null;
    
    const recentExtreme = trend.direction === 'LONG' 
      ? Math.max(...recentExtremes.map((l: any) => l.level))
      : Math.min(...recentExtremes.map((l: any) => l.level));
    
    const depth = Math.abs(currentPrice - recentExtreme) / Math.abs(relevantH1Level.level - recentExtreme);
    
    return {
      level: relevantH1Level.level,
      depth,
      currentPrice,
      recentExtreme,
      pullbackDistance,
    };
  }

  private checkOrderflowResumption(orderflow: any, direction: string): any {
    const expectedBias = direction === 'LONG' ? 'BUY' : 'SELL';
    const expectedCVD = direction === 'LONG' ? 'UP' : 'DOWN';
    
    let strength = 0;
    let signals: string[] = [];
    
    // Check aggression bias alignment
    if (orderflow.aggressionBias === expectedBias) {
      strength += 0.4;
      signals.push('aggression_aligned');
    }
    
    // Check CVD trend alignment
    if (orderflow.cvdTrend === expectedCVD) {
      strength += 0.4;
      signals.push('cvd_aligned');
    }
    
    // Check for low stress (good for trend continuation)
    if (orderflow.stress === 'LOW') {
      strength += 0.2;
      signals.push('low_stress');
    }
    
    return {
      confirmed: strength >= 0.6,
      strength,
      signal: signals.join(', '),
    };
  }

  private calculatePullbackEntry(pullback: any): number {
    // Enter slightly above/below the structure level for better fill probability
    const buffer = pullback.level * 0.001; // 0.1% buffer
    return pullback.level + (pullback.depth > 0 ? buffer : -buffer);
  }

  private calculatePullbackStop(pullback: any, trend: any): number {
    // Stop beyond the pullback structure level
    const buffer = pullback.level * 0.002; // 0.2% buffer beyond structure
    return trend.direction === 'LONG' 
      ? pullback.level - buffer
      : pullback.level + buffer;
  }

  private calculatePullbackTargets(trend: any, structure: any, volatility: any): any {
    const atr = volatility.atr || 0;
    const currentPrice = trend.h1Levels[0]?.level || 0;
    
    // Primary target: 1.5x ATR in trend direction
    const primaryDistance = atr * 1.5;
    const primary = trend.direction === 'LONG' 
      ? currentPrice + primaryDistance
      : currentPrice - primaryDistance;
    
    // Secondary target: next structure level or 2.5x ATR
    const secondaryDistance = atr * 2.5;
    const secondary = trend.direction === 'LONG'
      ? currentPrice + secondaryDistance
      : currentPrice - secondaryDistance;
    
    return { primary, secondary };
  }
  
  private detectLiquiditySweep(structure: any): any {
    const m15Levels = structure.M15 || [];
    const h1Levels = structure.H1 || [];
    
    if (m15Levels.length === 0 || h1Levels.length === 0) return null;
    
    // Look for recent liquidity pools (support/resistance levels)
    const liquidityPools = [...m15Levels, ...h1Levels].filter((l: any) => l.type === 'LIQUIDITY_POOL');
    if (liquidityPools.length === 0) return null;
    
    // Find the most recent pool that might have been swept
    const recentPool = liquidityPools
      .filter((l: any) => l.lastTouch && Date.now() - l.lastTouch < 300000) // Within 5 minutes
      .sort((a: any, b: any) => (b.lastTouch || 0) - (a.lastTouch || 0))[0];
    
    if (!recentPool) return null;
    
    // Check if price has moved beyond the pool (sweep)
    const currentPrice = m15Levels[0]?.level || 0;
    const sweepDistance = Math.abs(currentPrice - recentPool.level) / recentPool.level;
    
    // Must be a meaningful sweep (at least 0.1%)
    if (sweepDistance < 0.001) return null;
    
    const direction = currentPrice > recentPool.level ? 'LONG' : 'SHORT';
    
    return {
      level: recentPool.level,
      direction,
      distance: sweepDistance,
      strength: Math.min(sweepDistance * 100, 1.0), // Cap at 1.0
      timeframe: recentPool.tf,
      lastTouch: recentPool.lastTouch,
    };
  }

  private detectAbsorption(orderflow: any, liquiditySweep: any): any {
    // Absorption should be present for liquidity sweep reversals
    if (!orderflow.absorption) {
      return { detected: false, strength: 0 };
    }
    
    // Check if absorption aligns with sweep direction (counter-trend absorption)
    const expectedBias = liquiditySweep.direction === 'LONG' ? 'SELL' : 'BUY';
    
    let intensity = 'MEDIUM';
    let strength = 0.5;
    
    // Strong absorption if aggression bias is counter to sweep
    if (orderflow.aggressionBias === expectedBias) {
      intensity = 'HIGH';
      strength = 0.8;
    }
    
    // Check imbalance for additional confirmation
    if (Math.abs(orderflow.imbalance) > 0.3) {
      const imbalanceDirection = orderflow.imbalance > 0 ? 'BUY' : 'SELL';
      if (imbalanceDirection === expectedBias) {
        strength = Math.min(strength + 0.2, 1.0);
      }
    }
    
    return {
      detected: true,
      intensity,
      strength,
      level: liquiditySweep.level,
    };
  }

  private detectCVDFlip(orderflow: any, sweepDirection: string): any {
    const expectedCVD = sweepDirection === 'LONG' ? 'DOWN' : 'UP'; // Counter-trend CVD
    
    let strength = 0;
    let signals: string[] = [];
    
    // Check if CVD is moving counter to sweep (reversal signal)
    if (orderflow.cvdTrend === expectedCVD) {
      strength += 0.6;
      signals.push('cvd_counter_trend');
    }
    
    // Check for exhaustion (additional reversal signal)
    if (orderflow.exhaustion) {
      strength += 0.4;
      signals.push('exhaustion_detected');
    }
    
    return {
      confirmed: strength >= 0.6,
      strength,
      direction: expectedCVD,
    };
  }

  private checkLiquiditySweepRegimeCompatibility(regime: any, liquiditySweep: any): any {
    const classification = regime.classification;
    const strength = regime.strength || 0;
    
    let score = 0;
    
    // Liquidity sweeps work best in range-bound markets or late trends
    if (classification === 'RANGE') {
      score = strength * 0.9; // Range markets are ideal
    } else if (classification === 'TREND' && strength >= 0.8) {
      score = 0.7; // Late trend exhaustion
    } else if (classification === 'EXPANSION') {
      score = strength * 0.3; // Less favorable in expansion
    }
    
    return { score };
  }

  private calculateLiquiditySweepEntry(liquiditySweep: any, absorption: any): number {
    // Enter at the absorption level (where liquidity was absorbed)
    return absorption.level;
  }

  private calculateLiquiditySweepStop(liquiditySweep: any): number {
    // Stop beyond the sweep level
    const buffer = liquiditySweep.level * 0.003; // 0.3% buffer
    return liquiditySweep.direction === 'LONG' 
      ? liquiditySweep.level + buffer
      : liquiditySweep.level - buffer;
  }

  private calculateLiquiditySweepTargets(liquiditySweep: any, structure: any, volatility: any): any {
    const atr = volatility.atr || 0;
    const entryLevel = liquiditySweep.level;
    
    // Primary target: 1x ATR back toward structure
    const primaryDistance = atr * 1.0;
    const primary = liquiditySweep.direction === 'LONG' 
      ? entryLevel - primaryDistance
      : entryLevel + primaryDistance;
    
    // Secondary target: 2x ATR or next structure level
    const secondaryDistance = atr * 2.0;
    const secondary = liquiditySweep.direction === 'LONG'
      ? entryLevel - secondaryDistance
      : entryLevel + secondaryDistance;
    
    return { primary, secondary };
  }
}