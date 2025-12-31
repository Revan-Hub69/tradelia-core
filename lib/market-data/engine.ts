// Market Data Engine - Phase 1 Integration Coordinator
// Professional real-time market data processing with setup integration

import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { BinanceMarketDataAdapter } from './adapter';
import { DatabaseMarketEventLog } from './event-log';
import { DeterministicCandleAggregator } from './aggregator';
import { SimulatedPaperOMS } from './paper-oms';
import { SetupEngine } from '@/lib/setup/engine';
import { MarketState } from '@/lib/setup/types';
import { RegimeSignature } from '@/lib/mce/types';
import { 
  MarketDataConfig, 
  DEFAULT_CONFIG, 
  TradeEvent, 
  OrderBookEvent, 
  KlineEvent,
  CandleData 
} from './types';

export interface MarketDataEngineConfig extends MarketDataConfig {
  enableSetupDetection: boolean;
  enablePaperTrading: boolean;
  autoReconnect: boolean;
}

export class MarketDataEngine {
  private readonly config: MarketDataEngineConfig;
  private readonly runId: string;
  
  // Core components
  private adapter: BinanceMarketDataAdapter;
  private eventLog: DatabaseMarketEventLog;
  private aggregator: DeterministicCandleAggregator;
  private paperOMS: SimulatedPaperOMS;
  private setupEngine?: SetupEngine;
  
  // State management
  private isRunning = false;
  private startTime?: number;
  private stats = {
    tradesProcessed: 0,
    orderbooksProcessed: 0,
    candlesGenerated: 0,
    setupsDetected: 0,
    tradesExecuted: 0,
  };

  constructor(config: Partial<MarketDataEngineConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      enableSetupDetection: true,
      enablePaperTrading: true,
      autoReconnect: true,
      ...config,
    };
    
    this.runId = uuidv4();
    
    // Initialize components
    this.adapter = new BinanceMarketDataAdapter(this.config);
    this.eventLog = new DatabaseMarketEventLog(this.runId, this.config.batchSize);
    this.aggregator = new DeterministicCandleAggregator();
    this.paperOMS = new SimulatedPaperOMS();
    
    if (this.config.enableSetupDetection) {
      this.setupEngine = new SetupEngine();
    }
    
    this.setupEventHandlers();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Market data engine is already running');
    }

    try {
      console.log(`Starting Market Data Engine (Run ID: ${this.runId})`);
      
      // Record run start
      await this.recordRunStart();
      
      // Connect to market data
      await this.adapter.connect(this.config.symbols);
      
      this.isRunning = true;
      this.startTime = Date.now();
      
      console.log(`Market Data Engine started for symbols: ${this.config.symbols.join(', ')}`);
      
    } catch (error) {
      console.error('Failed to start Market Data Engine:', error);
      await this.recordRunError(error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping Market Data Engine...');
    
    try {
      // Disconnect from market data
      await this.adapter.disconnect();
      
      // Shutdown components
      await this.eventLog.shutdown();
      await this.paperOMS.shutdown();
      
      // Record run completion
      await this.recordRunCompletion();
      
      this.isRunning = false;
      
      console.log('Market Data Engine stopped');
      
    } catch (error) {
      console.error('Error stopping Market Data Engine:', error);
      await this.recordRunError(error);
      throw error;
    }
  }

  getRunId(): string {
    return this.runId;
  }

  getStats(): typeof this.stats & { 
    isRunning: boolean; 
    uptime: number; 
    connectionStatus: any;
    batchStats: any;
    orderStats: any;
  } {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      connectionStatus: this.adapter.getConnectionStatus(),
      batchStats: this.eventLog.getBatchStats(),
      orderStats: this.paperOMS.getOrderStats(),
    };
  }

  async getMarketState(timestamp?: number): Promise<MarketState | null> {
    if (!this.setupEngine) {
      return null;
    }

    try {
      // Build market state from current candle data
      const currentTime = timestamp || Date.now();
      
      // Create a simplified regime signature for testing
      const regime: RegimeSignature = {
        v: "mce.v1",
        symbol: "BTCUSDT",
        tf: "1m",
        asOf: currentTime,
        trend: 'range',
        volatility: 'normal',
        confidence: 0.8,
        features: {
          atr14: 0,
          atr50: 0,
          atrPct7d: 50,
          atrPct30d: 50,
          emaFast: 0,
          emaSlow: 0,
          trendStrength: 0.5,
          volNorm: 0.5,
        },
        quality: {
          completeness: 1.0,
          gaps: 0,
          freshnessSec: 0,
          source: "binance",
          valid: true,
        },
        change: {
          changed: false,
          prevAsOf: undefined,
          prevTrend: undefined,
          prevVol: undefined,
        },
        hash: "simplified-hash",
      };

      const marketState: MarketState = {
        regime,
        universeFit: {
          dayGate: {
            tradableDay: true,
            countA: 0,
            countB: 0,
            reasons: [],
          },
          marketFits: [],
        },
        structure: {},
        orderflow: {},
        volatility: {},
        session: {
          current: this.getCurrentSession(currentTime) as 'ASIA' | 'EU' | 'US' | 'OVERLAP_EU_US',
          openingSoon: false,
          closingSoon: false,
        },
        asOf: currentTime,
      };

      // Add symbol data from aggregator (simplified for now)
      // In a full implementation, this would populate structure, orderflow, volatility
      
      return marketState;
      
    } catch (error) {
      console.error('Error building market state:', error);
      return null;
    }
  }

  private setupEventHandlers(): void {
    // Trade events
    this.adapter.onTrade(async (trade: TradeEvent) => {
      try {
        this.stats.tradesProcessed++;
        
        // Log the trade event
        await this.eventLog.appendTrade(trade);
        
        // Process through aggregator
        const completedCandles = this.aggregator.processTrade(trade);
        
        // Log completed candles
        for (const candle of completedCandles) {
          await this.eventLog.appendCandle(candle);
          this.stats.candlesGenerated++;
        }
        
        // Trigger setup detection if enabled
        if (this.config.enableSetupDetection && completedCandles.length > 0) {
          await this.processSetupDetection();
        }
        
      } catch (error) {
        console.error('Error processing trade event:', error);
      }
    });

    // Order book events
    this.adapter.onOrderBook(async (orderbook: OrderBookEvent) => {
      try {
        this.stats.orderbooksProcessed++;
        
        // Log the orderbook event
        await this.eventLog.appendOrderBook(orderbook);
        
        // Process through aggregator (no-op for now)
        this.aggregator.processOrderBook(orderbook);
        
      } catch (error) {
        console.error('Error processing orderbook event:', error);
      }
    });

    // Kline events (from Binance WebSocket)
    this.adapter.onKline(async (kline: KlineEvent) => {
      try {
        // Convert to candle data
        const candle: CandleData = {
          symbol: kline.symbol,
          timeframe: kline.timeframe,
          openTime: kline.openTime,
          closeTime: kline.closeTime,
          open: kline.open,
          high: kline.high,
          low: kline.low,
          close: kline.close,
          volume: kline.volume,
          trades: kline.trades,
          hash: this.calculateCandleHash(kline),
        };
        
        // Log the candle
        await this.eventLog.appendCandle(candle);
        this.stats.candlesGenerated++;
        
      } catch (error) {
        console.error('Error processing kline event:', error);
      }
    });
  }

  private async processSetupDetection(): Promise<void> {
    if (!this.setupEngine) return;

    try {
      const marketState = await this.getMarketState();
      if (!marketState) return;

      // Run setup detection
      const decision = await this.setupEngine.processMarketState(marketState);
      
      if (decision.allowed && decision.setups.length > 0) {
        this.stats.setupsDetected += decision.setups.length;
        
        // If paper trading is enabled, execute trades for valid setups
        if (this.config.enablePaperTrading) {
          for (const setup of decision.setups) {
            await this.executePaperTrade(setup, marketState);
          }
        }
      }
      
    } catch (error) {
      console.error('Error in setup detection:', error);
    }
  }

  private async executePaperTrade(setup: any, marketState: MarketState): Promise<void> {
    try {
      // Create order intent from setup
      const orderIntent = {
        setupId: setup.setupId || 'test-setup-' + Date.now(),
        symbol: setup.symbol || 'BTCUSDT',
        side: setup.direction === 'LONG' ? 'BUY' as const : 'SELL' as const,
        type: 'MARKET' as const,
        quantity: 0.001, // Fixed quantity for simulation
        ttlSec: 60,
      };

      // Submit order
      const result = await this.paperOMS.submitOrder(orderIntent);
      
      if (result.status === 'FILLED') {
        this.stats.tradesExecuted++;
        console.log(`Paper trade executed: ${orderIntent.symbol} ${orderIntent.side} at ${result.fillPrice}`);
      }
      
    } catch (error) {
      console.error('Error executing paper trade:', error);
    }
  }

  private async recordRunStart(): Promise<void> {
    try {
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
        .from('market_data_runs')
        .insert({
          run_id: this.runId,
          symbols: this.config.symbols,
          timeframes: this.config.timeframes,
          start_time: new Date().toISOString(),
          status: 'RUNNING',
        });

      if (error) {
        console.error('Failed to record run start:', error);
      }
      
    } catch (error) {
      console.error('Error recording run start:', error);
    }
  }

  private async recordRunCompletion(): Promise<void> {
    try {
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
        .from('market_data_runs')
        .update({
          end_time: new Date().toISOString(),
          status: 'COMPLETED',
          events_processed: this.stats.tradesProcessed + this.stats.orderbooksProcessed,
          candles_generated: this.stats.candlesGenerated,
          trades_executed: this.stats.tradesExecuted,
        })
        .eq('run_id', this.runId);

      if (error) {
        console.error('Failed to record run completion:', error);
      }
      
    } catch (error) {
      console.error('Error recording run completion:', error);
    }
  }

  private async recordRunError(error: any): Promise<void> {
    try {
      const supabase = supabaseAdmin();
      
      const { error: dbError } = await supabase
        .from('market_data_runs')
        .update({
          end_time: new Date().toISOString(),
          status: 'FAILED',
          error_message: error instanceof Error ? error.message : String(error),
        })
        .eq('run_id', this.runId);

      if (dbError) {
        console.error('Failed to record run error:', dbError);
      }
      
    } catch (dbError) {
      console.error('Error recording run error:', dbError);
    }
  }

  private calculateCandleHash(kline: KlineEvent): string {
    const crypto = require('crypto');
    const hashInput = JSON.stringify({
      symbol: kline.symbol,
      timeframe: kline.timeframe,
      openTime: kline.openTime,
      open: kline.open,
      high: kline.high,
      low: kline.low,
      close: kline.close,
      volume: kline.volume,
      trades: kline.trades,
    });

    return crypto.createHash('sha256')
      .update(hashInput)
      .digest('hex')
      .substring(0, 16);
  }

  private getCurrentSession(timestamp: number): 'ASIA' | 'EU' | 'US' | 'OVERLAP_EU_US' {
    const hour = new Date(timestamp).getUTCHours();
    
    if (hour >= 0 && hour < 8) return 'ASIA';
    if (hour >= 8 && hour < 16) return 'EU';
    if (hour >= 14 && hour < 18) return 'OVERLAP_EU_US'; // Overlap period
    return 'US';
  }

  private getSessionOpenTime(timestamp: number): number {
    const date = new Date(timestamp);
    const hour = date.getUTCHours();
    
    if (hour >= 0 && hour < 8) {
      date.setUTCHours(0, 0, 0, 0);
    } else if (hour >= 8 && hour < 16) {
      date.setUTCHours(8, 0, 0, 0);
    } else {
      date.setUTCHours(16, 0, 0, 0);
    }
    
    return date.getTime();
  }

  private getSessionCloseTime(timestamp: number): number {
    return this.getSessionOpenTime(timestamp) + (8 * 60 * 60 * 1000); // 8 hours
  }
}