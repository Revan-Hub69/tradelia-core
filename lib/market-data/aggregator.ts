// Candle Aggregator - Deterministic OHLCV Construction
// Professional candle building with multiple timeframes

import { createHash } from 'crypto';
import { 
  CandleAggregator, 
  TradeEvent, 
  OrderBookEvent, 
  CandleData, 
  CandleState, 
  Timeframe 
} from './types';

interface ActiveCandle {
  symbol: string;
  timeframe: Timeframe;
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  firstTradeTime?: number;
  lastTradeTime?: number;
}

export class DeterministicCandleAggregator implements CandleAggregator {
  private activeCandles: Map<string, ActiveCandle> = new Map();
  private completedCandles: Map<string, CandleData[]> = new Map();
  private readonly timeframes: Timeframe[] = ['M1', 'M5', 'M15', 'H1', 'H4'];
  
  processTrade(trade: TradeEvent): CandleData[] {
    const completedCandles: CandleData[] = [];
    
    for (const timeframe of this.timeframes) {
      const candleKey = this.getCandleKey(trade.symbol, timeframe, trade.timestamp);
      const existing = this.activeCandles.get(candleKey);
      
      if (existing) {
        // Update existing candle
        existing.high = Math.max(existing.high, trade.price);
        existing.low = Math.min(existing.low, trade.price);
        existing.close = trade.price;
        existing.volume += trade.quantity;
        existing.trades += 1;
        existing.lastTradeTime = trade.timestamp;
        
      } else {
        // Check if we need to complete previous candle
        const prevCandleKey = this.getPreviousCandleKey(trade.symbol, timeframe, trade.timestamp);
        const prevCandle = this.activeCandles.get(prevCandleKey);
        
        if (prevCandle && this.shouldCompleteCandle(prevCandle, trade.timestamp)) {
          const completed = this.completeCandle(prevCandle);
          completedCandles.push(completed);
          this.activeCandles.delete(prevCandleKey);
        }
        
        // Create new candle
        const { openTime, closeTime } = this.getCandleTimeRange(timeframe, trade.timestamp);
        const newCandle: ActiveCandle = {
          symbol: trade.symbol,
          timeframe,
          openTime,
          closeTime,
          open: trade.price,
          high: trade.price,
          low: trade.price,
          close: trade.price,
          volume: trade.quantity,
          trades: 1,
          firstTradeTime: trade.timestamp,
          lastTradeTime: trade.timestamp,
        };
        
        this.activeCandles.set(candleKey, newCandle);
      }
    }
    
    return completedCandles;
  }

  processOrderBook(orderbook: OrderBookEvent): void {
    // Order book updates don't directly affect OHLCV candles
    // But we could use them for volume-weighted prices or spread analysis
    // For now, this is a no-op as per the interface
  }

  getCandle(symbol: string, timeframe: Timeframe, timestamp: number): CandleData | null {
    // First check active candles
    const candleKey = this.getCandleKey(symbol, timeframe, timestamp);
    const activeCandle = this.activeCandles.get(candleKey);
    
    if (activeCandle) {
      return this.activeCandleToData(activeCandle);
    }
    
    // Then check completed candles
    const completedKey = `${symbol}:${timeframe}`;
    const completed = this.completedCandles.get(completedKey) || [];
    
    return completed.find(candle => 
      candle.openTime <= timestamp && timestamp <= candle.closeTime
    ) || null;
  }

  getCandles(symbol: string, timeframe: Timeframe, from: number, to: number): CandleData[] {
    const completedKey = `${symbol}:${timeframe}`;
    const completed = this.completedCandles.get(completedKey) || [];
    
    const filtered = completed.filter(candle => 
      candle.openTime >= from && candle.closeTime <= to
    );
    
    // Add any active candles that fall in the range
    for (const [key, activeCandle] of this.activeCandles) {
      if (activeCandle.symbol === symbol && 
          activeCandle.timeframe === timeframe &&
          activeCandle.openTime >= from && 
          activeCandle.closeTime <= to) {
        filtered.push(this.activeCandleToData(activeCandle));
      }
    }
    
    return filtered.sort((a, b) => a.openTime - b.openTime);
  }

  getCurrentState(symbol: string): CandleState {
    const timeframes: Record<Timeframe, CandleData | null> = {
      M1: null,
      M5: null,
      M15: null,
      H1: null,
      H4: null,
    };
    
    let lastUpdate = 0;
    
    for (const timeframe of this.timeframes) {
      // Find the most recent candle for this timeframe
      const completedKey = `${symbol}:${timeframe}`;
      const completed = this.completedCandles.get(completedKey) || [];
      
      if (completed.length > 0) {
        const latest = completed[completed.length - 1];
        timeframes[timeframe] = latest;
        lastUpdate = Math.max(lastUpdate, latest.closeTime);
      }
      
      // Check active candles
      for (const [key, activeCandle] of this.activeCandles) {
        if (activeCandle.symbol === symbol && activeCandle.timeframe === timeframe) {
          timeframes[timeframe] = this.activeCandleToData(activeCandle);
          lastUpdate = Math.max(lastUpdate, activeCandle.lastTradeTime || 0);
        }
      }
    }
    
    return {
      symbol,
      timeframes,
      lastUpdate,
    };
  }

  restoreState(symbol: string, state: CandleState): void {
    // Clear existing state for this symbol
    for (const [key, candle] of this.activeCandles) {
      if (candle.symbol === symbol) {
        this.activeCandles.delete(key);
      }
    }
    
    // Restore completed candles
    for (const timeframe of this.timeframes) {
      const candle = state.timeframes[timeframe];
      if (candle) {
        const completedKey = `${symbol}:${timeframe}`;
        const existing = this.completedCandles.get(completedKey) || [];
        
        // Add if not already present
        if (!existing.find(c => c.openTime === candle.openTime)) {
          existing.push(candle);
          existing.sort((a, b) => a.openTime - b.openTime);
          this.completedCandles.set(completedKey, existing);
        }
      }
    }
  }

  private getCandleKey(symbol: string, timeframe: Timeframe, timestamp: number): string {
    const { openTime } = this.getCandleTimeRange(timeframe, timestamp);
    return `${symbol}:${timeframe}:${openTime}`;
  }

  private getPreviousCandleKey(symbol: string, timeframe: Timeframe, timestamp: number): string {
    const intervalMs = this.getTimeframeMs(timeframe);
    const { openTime } = this.getCandleTimeRange(timeframe, timestamp);
    const prevOpenTime = openTime - intervalMs;
    return `${symbol}:${timeframe}:${prevOpenTime}`;
  }

  private getCandleTimeRange(timeframe: Timeframe, timestamp: number): { openTime: number; closeTime: number } {
    const intervalMs = this.getTimeframeMs(timeframe);
    
    // Align to timeframe boundaries
    const openTime = Math.floor(timestamp / intervalMs) * intervalMs;
    const closeTime = openTime + intervalMs - 1;
    
    return { openTime, closeTime };
  }

  private getTimeframeMs(timeframe: Timeframe): number {
    const intervals: Record<Timeframe, number> = {
      M1: 60 * 1000,           // 1 minute
      M5: 5 * 60 * 1000,       // 5 minutes
      M15: 15 * 60 * 1000,     // 15 minutes
      H1: 60 * 60 * 1000,      // 1 hour
      H4: 4 * 60 * 60 * 1000,  // 4 hours
    };
    
    return intervals[timeframe];
  }

  private shouldCompleteCandle(candle: ActiveCandle, currentTimestamp: number): boolean {
    return currentTimestamp > candle.closeTime;
  }

  private completeCandle(activeCandle: ActiveCandle): CandleData {
    const candleData: CandleData = {
      symbol: activeCandle.symbol,
      timeframe: activeCandle.timeframe,
      openTime: activeCandle.openTime,
      closeTime: activeCandle.closeTime,
      open: activeCandle.open,
      high: activeCandle.high,
      low: activeCandle.low,
      close: activeCandle.close,
      volume: activeCandle.volume,
      trades: activeCandle.trades,
      hash: this.calculateCandleHash(activeCandle),
    };
    
    // Store in completed candles
    const completedKey = `${activeCandle.symbol}:${activeCandle.timeframe}`;
    const existing = this.completedCandles.get(completedKey) || [];
    existing.push(candleData);
    
    // Keep only last 1000 candles per timeframe to manage memory
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }
    
    this.completedCandles.set(completedKey, existing);
    
    return candleData;
  }

  private activeCandleToData(activeCandle: ActiveCandle): CandleData {
    return {
      symbol: activeCandle.symbol,
      timeframe: activeCandle.timeframe,
      openTime: activeCandle.openTime,
      closeTime: activeCandle.closeTime,
      open: activeCandle.open,
      high: activeCandle.high,
      low: activeCandle.low,
      close: activeCandle.close,
      volume: activeCandle.volume,
      trades: activeCandle.trades,
      hash: this.calculateCandleHash(activeCandle),
    };
  }

  private calculateCandleHash(candle: ActiveCandle): string {
    // Create deterministic hash for candle data
    const hashInput = JSON.stringify({
      symbol: candle.symbol,
      timeframe: candle.timeframe,
      openTime: candle.openTime,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      trades: candle.trades,
    });

    return createHash('sha256')
      .update(hashInput)
      .digest('hex')
      .substring(0, 16);
  }

  // Utility methods for monitoring and debugging
  getActiveCandles(): Map<string, ActiveCandle> {
    return new Map(this.activeCandles);
  }

  getCompletedCandlesCount(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const [key, candles] of this.completedCandles) {
      counts[key] = candles.length;
    }
    return counts;
  }

  // Cleanup old completed candles to manage memory
  cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    
    for (const [key, candles] of this.completedCandles) {
      const filtered = candles.filter(candle => candle.closeTime > cutoff);
      if (filtered.length !== candles.length) {
        this.completedCandles.set(key, filtered);
        console.log(`Cleaned up ${candles.length - filtered.length} old candles for ${key}`);
      }
    }
  }
}