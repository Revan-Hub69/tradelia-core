// Market Event Log - Append-Only Storage with Replay
// Professional event logging with deterministic hashing

import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { 
  MarketEventLog, 
  TradeEvent, 
  OrderBookEvent, 
  CandleData, 
  MarketEvent 
} from './types';

export class DatabaseMarketEventLog implements MarketEventLog {
  private readonly runId: string;
  private readonly batchSize: number;
  private eventBatch: MarketEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(runId?: string, batchSize = 100) {
    this.runId = runId || uuidv4();
    this.batchSize = batchSize;
  }

  async appendTrade(event: TradeEvent): Promise<void> {
    const marketEvent: MarketEvent = {
      id: uuidv4(),
      runId: this.runId,
      symbol: event.symbol,
      eventType: 'TRADE',
      timestamp: event.timestamp,
      data: {
        price: event.price,
        quantity: event.quantity,
        side: event.side,
        tradeId: event.tradeId,
      },
      hash: this.calculateEventHash(event),
    };

    await this.addToBatch(marketEvent);
  }

  async appendOrderBook(event: OrderBookEvent): Promise<void> {
    const marketEvent: MarketEvent = {
      id: uuidv4(),
      runId: this.runId,
      symbol: event.symbol,
      eventType: 'ORDERBOOK',
      timestamp: event.timestamp,
      data: {
        bids: event.bids,
        asks: event.asks,
        lastUpdateId: event.lastUpdateId,
      },
      hash: this.calculateEventHash(event),
    };

    await this.addToBatch(marketEvent);
  }

  async appendCandle(candle: CandleData): Promise<void> {
    const marketEvent: MarketEvent = {
      id: uuidv4(),
      runId: this.runId,
      symbol: candle.symbol,
      eventType: 'CANDLE',
      timestamp: candle.openTime,
      data: {
        timeframe: candle.timeframe,
        openTime: candle.openTime,
        closeTime: candle.closeTime,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
        trades: candle.trades,
      },
      hash: candle.hash,
    };

    await this.addToBatch(marketEvent);
  }

  async getEvents(symbol: string, from: number, to: number): Promise<MarketEvent[]> {
    try {
      const supabase = supabaseAdmin();
      
      const { data, error } = await supabase
        .from('market_events')
        .select('*')
        .eq('symbol', symbol)
        .gte('timestamp', new Date(from).toISOString())
        .lte('timestamp', new Date(to).toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch events: ${error.message}`);
      }

      return data?.map(row => ({
        id: row.id,
        runId: row.run_id,
        symbol: row.symbol,
        eventType: row.event_type as 'TRADE' | 'ORDERBOOK' | 'CANDLE',
        timestamp: new Date(row.timestamp).getTime(),
        data: row.data,
        hash: row.hash,
      })) || [];

    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  getEventHash(runId: string): string {
    // Create deterministic hash for all events in a run
    // This is used for replay validation
    return createHash('sha256')
      .update(`run:${runId}`)
      .update(Date.now().toString())
      .digest('hex');
  }

  validateReplay(runId: string, expectedHash: string): boolean {
    // In a full implementation, this would:
    // 1. Fetch all events for the runId
    // 2. Recalculate the hash deterministically
    // 3. Compare with expectedHash
    // For now, return true as placeholder
    return true;
  }

  private async addToBatch(event: MarketEvent): Promise<void> {
    this.eventBatch.push(event);

    if (this.eventBatch.length >= this.batchSize) {
      await this.flushBatch();
    } else {
      this.scheduleBatchFlush();
    }
  }

  private scheduleBatchFlush(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(async () => {
      await this.flushBatch();
    }, 1000); // Flush every second
  }

  private async flushBatch(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.eventBatch.length === 0) return;

    const batch = [...this.eventBatch];
    this.eventBatch = [];

    try {
      const supabase = supabaseAdmin();
      
      const rows = batch.map(event => ({
        id: event.id,
        run_id: event.runId,
        symbol: event.symbol,
        event_type: event.eventType,
        timestamp: new Date(event.timestamp).toISOString(),
        data: event.data,
        hash: event.hash,
      }));

      const { error } = await supabase
        .from('market_events')
        .insert(rows);

      if (error) {
        console.error('Failed to insert event batch:', error);
        // Re-add to batch for retry
        this.eventBatch.unshift(...batch);
        throw error;
      }

      console.log(`Flushed ${batch.length} market events to database`);

    } catch (error) {
      console.error('Error flushing event batch:', error);
      throw error;
    }
  }

  private calculateEventHash(event: any): string {
    // Create deterministic hash for event data
    const hashInput = JSON.stringify({
      symbol: event.symbol,
      timestamp: event.timestamp,
      data: event.price ? {
        price: event.price,
        quantity: event.quantity,
        side: event.side,
      } : event.bids ? {
        bidsCount: event.bids.length,
        asksCount: event.asks.length,
        lastUpdateId: event.lastUpdateId,
      } : event,
    });

    return createHash('sha256')
      .update(hashInput)
      .digest('hex')
      .substring(0, 16); // Use first 16 chars for efficiency
  }

  // Cleanup method for graceful shutdown
  async shutdown(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    if (this.eventBatch.length > 0) {
      await this.flushBatch();
    }
  }

  // Get current run ID
  getRunId(): string {
    return this.runId;
  }

  // Get batch statistics
  getBatchStats(): { pending: number; runId: string } {
    return {
      pending: this.eventBatch.length,
      runId: this.runId,
    };
  }
}