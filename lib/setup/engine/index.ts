// Setup Engine - Professional Trading System
// Best practice: coordinated detection, validation, and decision making

import { SetupDetector } from './detector';
import { SetupValidator } from './validator';
import { 
  MarketState, 
  SetupCandidate, 
  SetupDecision, 
  SetupEngineConfig,
  DEFAULT_SETUP_CONFIG 
} from '../types';
import { setupLogger } from '../logger';

export class SetupEngine {
  private readonly detector: SetupDetector;
  private readonly validator: SetupValidator;
  private activeSetups: Map<string, SetupCandidate> = new Map();

  constructor(private readonly config: SetupEngineConfig = DEFAULT_SETUP_CONFIG) {
    this.detector = new SetupDetector(config);
    this.validator = new SetupValidator(config);
  }

  // ============================================================================
  // MAIN ENGINE METHODS
  // ============================================================================

  async processMarketState(marketState: MarketState): Promise<SetupDecision> {
    try {
      console.log(`🔍 Processing market state at ${new Date(marketState.asOf).toISOString()}`);
      
      // 1. DETECT SETUP CANDIDATES
      const candidates = await this.detector.detectSetups(marketState);
      console.log(`📊 Detected ${candidates.length} setup candidates`);

      if (candidates.length === 0) {
        return {
          asOf: marketState.asOf,
          allowed: false,
          setups: [],
          reasonCodes: ['no_setups_detected'],
          contextGate: {
            allowed: false,
            reasonCodes: ['no_candidates'],
            regimeCompatible: true,
            sessionValid: true,
            volatilityAdequate: true,
            msfEnabled: true,
          },
        };
      }

      // 2. VALIDATE EACH CANDIDATE
      const validatedSetups: SetupCandidate[] = [];
      const rejectionReasons: string[] = [];
      const existingSetups = Array.from(this.activeSetups.values());

      for (const candidate of candidates) {
        console.log(`🔍 Validating ${candidate.setupType} setup for ${candidate.symbol}`);
        
        const validation = await this.validator.validateSetup(
          candidate,
          marketState,
          existingSetups
        );

        if (validation.valid) {
          validatedSetups.push(validation.adjustedSetup || candidate);
          console.log(`✅ Setup ${candidate.setupId} validated successfully`);
        } else {
          rejectionReasons.push(...validation.rejectionReasons);
          console.log(`❌ Setup ${candidate.setupId} rejected: ${validation.rejectionReasons.join(', ')}`);
        }
      }

      // 3. APPLY FINAL FILTERS
      const finalSetups = await this.applyFinalFilters(validatedSetups, marketState);

      // 4. UPDATE ACTIVE SETUPS
      this.updateActiveSetups(finalSetups);

      // 5. CREATE DECISION
      const decision: SetupDecision = {
        asOf: marketState.asOf,
        allowed: finalSetups.length > 0,
        setups: finalSetups,
        reasonCodes: finalSetups.length === 0 ? rejectionReasons : [],
        contextGate: {
          allowed: true,
          reasonCodes: [],
          regimeCompatible: true,
          sessionValid: true,
          volatilityAdequate: true,
          msfEnabled: marketState.universeFit.dayGate.tradableDay,
        },
      };

      console.log(`🎯 Final decision: ${finalSetups.length} setups approved`);
      return decision;

    } catch (error) {
      console.error('Setup engine processing error:', error);
      
      return {
        asOf: marketState.asOf,
        allowed: false,
        setups: [],
        reasonCodes: ['engine_processing_error'],
        contextGate: {
          allowed: false,
          reasonCodes: ['system_error'],
          regimeCompatible: false,
          sessionValid: false,
          volatilityAdequate: false,
          msfEnabled: false,
        },
      };
    }
  }

  // ============================================================================
  // SETUP LIFECYCLE MANAGEMENT
  // ============================================================================

  async triggerSetup(setupId: string, actualEntryPrice: number, marketState: MarketState): Promise<boolean> {
    const setup = this.activeSetups.get(setupId);
    if (!setup) {
      console.error(`Setup ${setupId} not found in active setups`);
      return false;
    }

    try {
      // Calculate slippage
      const expectedPrice = setup.entryModel.price;
      const slippage = Math.abs(actualEntryPrice - expectedPrice) / expectedPrice;

      // Log entry trigger
      await setupLogger.logEntryTriggered(
        setupId,
        setup.symbol,
        actualEntryPrice,
        slippage,
        marketState
      );

      console.log(`🚀 Setup ${setupId} triggered at ${actualEntryPrice} (slippage: ${(slippage * 100).toFixed(3)}%)`);
      return true;

    } catch (error) {
      console.error(`Failed to trigger setup ${setupId}:`, error);
      return false;
    }
  }

  async expireSetup(setupId: string, marketState: MarketState): Promise<void> {
    const setup = this.activeSetups.get(setupId);
    if (!setup) return;

    try {
      // Log expiration
      const event = {
        eventId: require('uuid').v4(),
        setupId,
        symbol: setup.symbol,
        eventType: 'SETUP_EXPIRED' as const,
        timestamp: Date.now(),
        data: { reason: 'ttl_exceeded', originalTTL: setup.entryModel.ttlSec },
        marketState,
      };

      // Remove from active setups
      this.activeSetups.delete(setupId);
      
      console.log(`⏰ Setup ${setupId} expired`);

    } catch (error) {
      console.error(`Failed to expire setup ${setupId}:`, error);
    }
  }

  // ============================================================================
  // ACTIVE SETUP MANAGEMENT
  // ============================================================================

  getActiveSetups(): SetupCandidate[] {
    return Array.from(this.activeSetups.values());
  }

  getActiveSetup(setupId: string): SetupCandidate | undefined {
    return this.activeSetups.get(setupId);
  }

  removeActiveSetup(setupId: string): void {
    this.activeSetups.delete(setupId);
  }

  // ============================================================================
  // CLEANUP AND MAINTENANCE
  // ============================================================================

  async cleanupExpiredSetups(currentTimestamp: number): Promise<void> {
    const expiredSetups: string[] = [];

    for (const [setupId, setup] of this.activeSetups.entries()) {
      if (setup.expiresAt <= currentTimestamp) {
        expiredSetups.push(setupId);
      }
    }

    for (const setupId of expiredSetups) {
      this.activeSetups.delete(setupId);
      console.log(`🧹 Cleaned up expired setup ${setupId}`);
    }

    if (expiredSetups.length > 0) {
      console.log(`🧹 Cleaned up ${expiredSetups.length} expired setups`);
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async applyFinalFilters(
    setups: SetupCandidate[],
    marketState: MarketState
  ): Promise<SetupCandidate[]> {
    // Sort by confidence score (highest first)
    const sortedSetups = setups.sort((a, b) => b.confidenceScore - a.confidenceScore);

    // Apply maximum concurrent setups limit
    const maxSetups = this.config.maxConcurrentSetups;
    const existingCount = this.activeSetups.size;
    const availableSlots = Math.max(0, maxSetups - existingCount);

    if (availableSlots === 0) {
      console.log(`⚠️ No available slots for new setups (${existingCount}/${maxSetups})`);
      return [];
    }

    const finalSetups = sortedSetups.slice(0, availableSlots);

    // Apply diversification filter (max 1 setup per symbol)
    const diversifiedSetups: SetupCandidate[] = [];
    const usedSymbols = new Set<string>();

    // Add existing symbols to used set
    for (const setup of this.activeSetups.values()) {
      usedSymbols.add(setup.symbol);
    }

    for (const setup of finalSetups) {
      if (!usedSymbols.has(setup.symbol)) {
        diversifiedSetups.push(setup);
        usedSymbols.add(setup.symbol);
      }
    }

    if (diversifiedSetups.length < finalSetups.length) {
      console.log(`📊 Applied diversification filter: ${finalSetups.length} → ${diversifiedSetups.length} setups`);
    }

    return diversifiedSetups;
  }

  private updateActiveSetups(newSetups: SetupCandidate[]): void {
    for (const setup of newSetups) {
      this.activeSetups.set(setup.setupId, setup);
      console.log(`📝 Added setup ${setup.setupId} to active setups`);
    }

    console.log(`📊 Active setups: ${this.activeSetups.size}/${this.config.maxConcurrentSetups}`);
  }

  // ============================================================================
  // STATISTICS AND MONITORING
  // ============================================================================

  getEngineStats(): {
    activeSetups: number;
    maxConcurrentSetups: number;
    setupsByType: Record<string, number>;
    setupsBySymbol: Record<string, number>;
    avgConfidenceScore: number;
    avgRiskReward: number;
  } {
    const activeSetups = Array.from(this.activeSetups.values());
    
    const setupsByType: Record<string, number> = {};
    const setupsBySymbol: Record<string, number> = {};
    let totalConfidence = 0;
    let totalRiskReward = 0;

    for (const setup of activeSetups) {
      setupsByType[setup.setupType] = (setupsByType[setup.setupType] || 0) + 1;
      setupsBySymbol[setup.symbol] = (setupsBySymbol[setup.symbol] || 0) + 1;
      totalConfidence += setup.confidenceScore;
      totalRiskReward += setup.riskReward;
    }

    return {
      activeSetups: activeSetups.length,
      maxConcurrentSetups: this.config.maxConcurrentSetups,
      setupsByType,
      setupsBySymbol,
      avgConfidenceScore: activeSetups.length > 0 ? totalConfidence / activeSetups.length : 0,
      avgRiskReward: activeSetups.length > 0 ? totalRiskReward / activeSetups.length : 0,
    };
  }
}

// Export singleton instance
export const setupEngine = new SetupEngine();