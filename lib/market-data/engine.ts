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
      const marketState: MarketState = {
        timestamp: currentTime,
        symbols: {},
        regime: {
          classification: 'NORMAL', // Simplified for now
          confidence: 0.8,
          since: currentTime - 3600000, // 1 hour ago
          volatility: 'MEDIUM',
          trend: 'SIDEWAYS',
        },
        session: {
          name: this.getCurrentSession(currentTime),
          openTime: this.getSessionOpenTime(currentTime),
          closeTime: this.getSessionCloseTime(currentTime),
          isActive: true,
        },
      };

      // Add symbol data from aggregator
      for (const symbol of this.config.symbols) {
        const candleState = this.aggregator.getCurrentState(symbol);
        if (candleState.timeframes.M1) {
          const candle = candleState.timeframes.M1;
          marketState.symbols[symbol] = {
            price: candle.close,
            volume24h: candle.volume,
            change24h: 0, // Would need historical data
            change24hPct: 0,
            structure: {
              trend: 'SIDEWAYS',
              support: candle.low,
              resistance: candle.high,
              keyLevels: [candle.low, candle.high],
            },
            orderflow: {
              buyPressure: 0.5,
              sellPressure: 0.5,
              imbalance: 0,
              volumeProfile: [],
            },
            volatility: {
              atr: Math.abs(candle.high - candle.low),
              realized: 0.02,
              implied: 0.025,
              percentile: 50,
            },
          };
        }
      }

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

      // Run setup detection for each symbol
      for (const symbol of this.config.symbols) {
        const decisions = await this.setupEngine.processSymbol(symbol, marketState);
        
        for (const decision of decisions) {
          this.stats.setupsDetected++;
          
          // If setup is validated and paper trading is enabled, execute trade
          if (this.config.enablePaperTrading && decision.action === 'ENTER') {
            await this.executePaperTrade(decision, marketState);
          }
        }
      }
      
    } catch (error) {
      console.error('Error in setup detection:', error);
    }
  }

  private async executePaperTrade(decision: any, marketState: MarketState): Promise<void> {
    try {
      const symbol = decision.symbol;
      const symbolData = marketState.symbols[symbol];
      
      if (!symbolData) return;

      // Create order intent
      const orderIntent = {
        setupId: decision.setupId,
        symbol,
        side: decision.direction === 'LONG' ? 'BUY' as const : 'SELL' as const,
        type: 'MARKET' as const,
        quantity: 0.001, // Fixed quantity for simulation
        ttlSec: 60,
      };

      // Submit order
      const result = await this.paperOMS.submitOrder(orderIntent);
      
      if (result.status === 'FILLED') {
        this.stats.tradesExecuted++;
        console.log(`Paper trade executed: ${symbol} ${orderIntent.side} at ${result.fillPrice}`);
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

  private getCurrentSession(timestamp: number): string {
    const hour = new Date(timestamp).getUTCHours();
    
    if (hour >= 0 && hour < 8) return 'ASIA';
    if (hour >= 8 && hour < 16) return 'EUROPE';
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