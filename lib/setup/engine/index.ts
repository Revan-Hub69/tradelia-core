// Setup Engine - Professional Trading System
// Best practice: coordinated detection, validation, and decision making

import { v4 as uuidv4 } from 'uuid';
import { SetupDetector } from './detector';
import { SetupValidator } from './validator';
import { setupStateManager } from './state-manager';
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
      const existingSetups = await setupStateManager.getActiveSetups();

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

      // 4. UPDATE ACTIVE SETUPS (persist to database)
      await this.updateActiveSetups(finalSetups);

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
    const activeSetups = await setupStateManager.getActiveSetups();
    const setup = activeSetups.find(s => s.setupId === setupId);
    
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
    try {
      // Log expiration
      const event = {
        eventId: uuidv4(),
        setupId,
        symbol: 'UNKNOWN', // We'll get this from the database if needed
        eventType: 'SETUP_EXPIRED' as const,
        timestamp: Date.now(),
        data: { reason: 'ttl_exceeded' },
        marketState,
      };

      // Remove from active setups
      await setupStateManager.removeActiveSetup(setupId);
      
      console.log(`⏰ Setup ${setupId} expired`);

    } catch (error) {
      console.error(`Failed to expire setup ${setupId}:`, error);
    }
  }

  // ============================================================================
  // ACTIVE SETUP MANAGEMENT
  // ============================================================================

  async getActiveSetups(): Promise<SetupCandidate[]> {
    return await setupStateManager.getActiveSetups();
  }

  async getActiveSetup(setupId: string): Promise<SetupCandidate | undefined> {
    const activeSetups = await setupStateManager.getActiveSetups();
    return activeSetups.find(s => s.setupId === setupId);
  }

  async removeActiveSetup(setupId: string): Promise<void> {
    await setupStateManager.removeActiveSetup(setupId);
  }

  // ============================================================================
  // CLEANUP AND MAINTENANCE
  // ============================================================================

  async cleanupExpiredSetups(currentTimestamp?: number): Promise<void> {
    try {
      const deletedCount = await setupStateManager.cleanupExpiredSetups();
      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} expired setups`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired setups:', error);
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
    const existingSetups = await setupStateManager.getActiveSetups();
    const existingCount = existingSetups.length;
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
    for (const setup of existingSetups) {
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

  private async updateActiveSetups(newSetups: SetupCandidate[]): Promise<void> {
    for (const setup of newSetups) {
      try {
        await setupStateManager.addActiveSetup(setup);
        console.log(`📝 Added setup ${setup.setupId} to active setups`);
      } catch (error) {
        console.error(`Failed to add setup ${setup.setupId}:`, error);
      }
    }

    const totalActive = (await setupStateManager.getActiveSetups()).length;
    console.log(`📊 Active setups: ${totalActive}/${this.config.maxConcurrentSetups}`);
  }

  // ============================================================================
  // STATISTICS AND MONITORING
  // ============================================================================

  async getEngineStats(): Promise<{
    activeSetups: number;
    maxConcurrentSetups: number;
    setupsByType: Record<string, number>;
    setupsBySymbol: Record<string, number>;
    avgConfidenceScore: number;
    avgRiskReward: number;
  }> {
    return await setupStateManager.getEngineStats();
  }
}

// Export singleton instance
export const setupEngine = new SetupEngine();