// Setup Event Logger - Professional Trading System
// Best practice: structured logging, replay capability, KPI extraction

import { supabaseAdmin } from '../mce/db/supabase';
import { 
  SetupEvent, 
  SetupEventType, 
  SetupCandidate, 
  SetupOutcome, 
  MarketState,
  SetupKPIs,
  SetupType
} from './types';
import { v4 as uuidv4 } from 'uuid';

export class SetupEventLogger {
  private readonly batchSize = 100;
  private eventBuffer: SetupEvent[] = [];

  constructor() {
    // No auto-flush in serverless environment
  }

  // ============================================================================
  // EVENT LOGGING METHODS
  // ============================================================================

  async logContextFilter(
    symbol: string,
    allowed: boolean,
    reasonCodes: string[],
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      symbol,
      eventType: 'CONTEXT_FILTER',
      timestamp: Date.now(),
      data: {
        allowed,
        reasonCodes,
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logStructureAnalysis(
    symbol: string,
    structureData: any,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      symbol,
      eventType: 'STRUCTURE_ANALYSIS',
      timestamp: Date.now(),
      data: structureData,
      marketState,
    };

    await this.logEvent(event);
  }

  async logOrderflowAnalysis(
    symbol: string,
    orderflowData: any,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      symbol,
      eventType: 'ORDERFLOW_ANALYSIS',
      timestamp: Date.now(),
      data: orderflowData,
      marketState,
    };

    await this.logEvent(event);
  }

  async logSetupDetected(
    setup: SetupCandidate,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId: setup.setupId,
      symbol: setup.symbol,
      eventType: 'SETUP_DETECTED',
      timestamp: Date.now(),
      data: {
        setupType: setup.setupType,
        direction: setup.direction,
        confidenceScore: setup.confidenceScore,
        riskReward: setup.riskReward,
        evidence: setup.evidence,
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logSetupValidated(
    setup: SetupCandidate,
    validationData: any,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId: setup.setupId,
      symbol: setup.symbol,
      eventType: 'SETUP_VALIDATED',
      timestamp: Date.now(),
      data: {
        ...validationData,
        finalConfidenceScore: setup.confidenceScore,
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logSetupRejected(
    setupId: string,
    symbol: string,
    rejectionReasons: string[],
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType: 'SETUP_REJECTED',
      timestamp: Date.now(),
      data: {
        rejectionReasons,
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logEntryTriggered(
    setupId: string,
    symbol: string,
    entryPrice: number,
    slippage: number,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType: 'ENTRY_TRIGGERED',
      timestamp: Date.now(),
      data: {
        entryPrice,
        slippage,
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logSetupExpired(
    setupId: string,
    symbol: string,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType: 'SETUP_EXPIRED',
      timestamp: Date.now(),
      data: {
        reason: 'ttl_exceeded',
        expiredAt: marketState.asOf || Date.now(),
      },
      marketState,
    };

    await this.logEvent(event);
  }

  async logTradeExit(
    setupId: string,
    symbol: string,
    outcome: SetupOutcome,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const eventType = outcome.exitReason === 'STOP' ? 'STOP_HIT' : 
                     outcome.exitReason.startsWith('TARGET') ? 'TARGET_HIT' : 'MANUAL_EXIT';

    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType,
      timestamp: Date.now(),
      data: {
        exitPrice: outcome.pnl, // Will be calculated from entry
        exitReason: outcome.exitReason,
      },
      marketState,
      outcome,
    };

    await this.logEvent(event);
  }

  async logStopHit(
    setupId: string,
    symbol: string,
    exitPrice: number,
    outcome: SetupOutcome,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType: 'STOP_HIT',
      timestamp: Date.now(),
      data: {
        exitPrice,
        exitReason: outcome.exitReason,
      },
      marketState,
      outcome,
    };

    await this.logEvent(event);
  }

  async logTargetHit(
    setupId: string,
    symbol: string,
    exitPrice: number,
    outcome: SetupOutcome,
    marketState: Partial<MarketState>
  ): Promise<void> {
    const event: SetupEvent = {
      eventId: uuidv4(),
      setupId,
      symbol,
      eventType: 'TARGET_HIT',
      timestamp: Date.now(),
      data: {
        exitPrice,
        exitReason: outcome.exitReason,
      },
      marketState,
      outcome,
    };

    await this.logEvent(event);
  }

  // ============================================================================
  // CORE LOGGING
  // ============================================================================

  private async logEvent(event: SetupEvent): Promise<void> {
    // In serverless, always write directly for important events
    if (this.isImportantEvent(event.eventType)) {
      await this.writeEventToDb(event);
    } else {
      // Buffer less important events and flush when batch is full
      this.eventBuffer.push(event);
      
      if (this.eventBuffer.length >= this.batchSize) {
        await this.flush();
      }
    }
  }

  private isImportantEvent(eventType: SetupEventType): boolean {
    return [
      'SETUP_DETECTED',
      'SETUP_VALIDATED', 
      'SETUP_REJECTED',
      'ENTRY_TRIGGERED',
      'STOP_HIT',
      'TARGET_HIT'
    ].includes(eventType);
  }

  async flush(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      const sb = supabaseAdmin();
      
      const { error } = await sb
        .from('setup_events')
        .insert(events.map(event => ({
          event_id: event.eventId,
          setup_id: event.setupId,
          symbol: event.symbol,
          event_type: event.eventType,
          timestamp: new Date(event.timestamp).toISOString(),
          data: event.data,
          market_state: event.marketState,
          outcome: event.outcome,
        })));

      if (error) {
        console.error('Failed to flush setup events:', error);
        // Re-add events to buffer for retry
        this.eventBuffer.unshift(...events);
      }
    } catch (error) {
      console.error('Setup event flush error:', error);
      this.eventBuffer.unshift(...events);
    }
  }

  private async writeEventToDb(event: SetupEvent): Promise<void> {
    try {
      const sb = supabaseAdmin();
      
      const { error } = await sb
        .from('setup_events')
        .insert({
          event_id: event.eventId,
          setup_id: event.setupId,
          symbol: event.symbol,
          event_type: event.eventType,
          timestamp: new Date(event.timestamp).toISOString(),
          data: event.data,
          market_state: event.marketState,
          outcome: event.outcome,
        });

      if (error) {
        console.error('Failed to write setup event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Setup event write error:', error);
      throw error;
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  async destroy(): Promise<void> {
    await this.flush(); // Final flush
  }

  // ============================================================================
  // KPI EXTRACTION
  // ============================================================================

  async extractKPIs(fromTimestamp: number, toTimestamp: number): Promise<SetupKPIs> {
    const sb = supabaseAdmin();
    
    // Get all setup events in the period
    const { data: events, error } = await sb
      .from('setup_events')
      .select('*')
      .gte('timestamp', new Date(fromTimestamp).toISOString())
      .lte('timestamp', new Date(toTimestamp).toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Failed to extract setup KPIs: ${error.message}`);
    }

    return this.calculateKPIs(events || [], fromTimestamp, toTimestamp);
  }

  private calculateKPIs(events: any[], fromTimestamp: number, toTimestamp: number): SetupKPIs {
    const setupEvents = events.filter(e => e.event_type === 'SETUP_DETECTED');
    const entryEvents = events.filter(e => e.event_type === 'ENTRY_TRIGGERED');
    const exitEvents = events.filter(e => e.event_type === 'STOP_HIT' || e.event_type === 'TARGET_HIT' || e.event_type === 'MANUAL_EXIT');

    // Group by setup type
    const setupsByType: Record<SetupType, number> = {
      'BREAKOUT_ACCEPTANCE': 0,
      'PULLBACK_STRUCTURAL': 0,
      'LIQUIDITY_SWEEP_REVERSAL': 0,
    };

    const setupsBySymbol: Record<string, number> = {};
    let totalConfidence = 0;
    let totalRiskReward = 0;

    setupEvents.forEach(event => {
      const setupType = event.data.setupType as SetupType;
      setupsByType[setupType]++;
      
      setupsBySymbol[event.symbol] = (setupsBySymbol[event.symbol] || 0) + 1;
      
      totalConfidence += event.data.confidenceScore || 0;
      totalRiskReward += event.data.riskReward || 0;
    });

    // Calculate execution metrics
    const triggered = entryEvents.length;
    const triggerRate = setupEvents.length > 0 ? triggered / setupEvents.length : 0;
    
    const totalSlippage = entryEvents.reduce((sum, e) => sum + (e.data.slippage || 0), 0);
    const avgSlippage = triggered > 0 ? totalSlippage / triggered : 0;

    // Calculate performance metrics
    const completedTrades = exitEvents.filter(e => e.outcome);
    const winners = completedTrades.filter(e => e.outcome.pnl > 0).length;
    const losers = completedTrades.filter(e => e.outcome.pnl < 0).length;
    const winRate = completedTrades.length > 0 ? winners / completedTrades.length : 0;

    const totalPnl = completedTrades.reduce((sum, e) => sum + e.outcome.pnl, 0);
    const winningTrades = completedTrades.filter(e => e.outcome.pnl > 0);
    const losingTrades = completedTrades.filter(e => e.outcome.pnl < 0);
    
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, e) => sum + e.outcome.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
      losingTrades.reduce((sum, e) => sum + e.outcome.pnl, 0) / losingTrades.length : 0;
    
    const expectancy = completedTrades.length > 0 ? totalPnl / completedTrades.length : 0;

    // Risk metrics
    const maxDrawdown = completedTrades.reduce((max, e) => 
      Math.min(max, e.outcome.maxDrawdown || 0), 0);
    const avgHoldTime = completedTrades.length > 0 ? 
      completedTrades.reduce((sum, e) => sum + e.outcome.holdTime, 0) / completedTrades.length : 0;
    const largestLoss = Math.min(...completedTrades.map(e => e.outcome.pnl), 0);

    // Regime breakdown (simplified - would need regime data from market_state)
    const performanceByRegime: Record<string, any> = {
      'TREND': { count: 0, winRate: 0, expectancy: 0 },
      'RANGE': { count: 0, winRate: 0, expectancy: 0 },
      'EXPANSION': { count: 0, winRate: 0, expectancy: 0 },
    };

    return {
      period: {
        from: fromTimestamp,
        to: toTimestamp,
        days: Math.ceil((toTimestamp - fromTimestamp) / (24 * 60 * 60 * 1000)),
      },
      
      totalSetups: setupEvents.length,
      setupsByType,
      setupsBySymbol,
      
      avgConfidenceScore: setupEvents.length > 0 ? totalConfidence / setupEvents.length : 0,
      avgRiskReward: setupEvents.length > 0 ? totalRiskReward / setupEvents.length : 0,
      
      triggered,
      triggerRate,
      avgSlippage,
      
      winners,
      losers,
      winRate,
      avgWin,
      avgLoss,
      expectancy,
      
      maxDrawdown,
      avgHoldTime,
      largestLoss,
      
      performanceByRegime,
    };
  }

  // ============================================================================
  // REPLAY CAPABILITY
  // ============================================================================

  async replaySetup(setupId: string): Promise<SetupEvent[]> {
    const sb = supabaseAdmin();
    
    const { data: events, error } = await sb
      .from('setup_events')
      .select('*')
      .eq('setup_id', setupId)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Failed to replay setup ${setupId}: ${error.message}`);
    }

    return events?.map(e => ({
      eventId: e.event_id,
      setupId: e.setup_id,
      symbol: e.symbol,
      eventType: e.event_type,
      timestamp: new Date(e.timestamp).getTime(),
      data: e.data,
      marketState: e.market_state,
      outcome: e.outcome,
    })) || [];
  }
}

// Singleton instance
export const setupLogger = new SetupEventLogger();