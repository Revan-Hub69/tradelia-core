// Market Data Adapter - Binance WebSocket Integration
// Professional real-time market data with connection management

import { 
  MarketDataAdapter, 
  TradeEvent, 
  OrderBookEvent, 
  KlineEvent, 
  ConnectionStatus,
  MarketDataConfig,
  DEFAULT_CONFIG 
} from './types';
import { EnhancedCircuitBreaker } from '@/lib/utils/circuit-breaker-enhanced';
import { retryNetworkOperation } from '@/lib/utils/retry-enhanced';

export class BinanceMarketDataAdapter implements MarketDataAdapter {
  private ws: WebSocket | null = null;
  private config: MarketDataConfig;
  private connectionStatus: ConnectionStatus;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private circuitBreaker: EnhancedCircuitBreaker;
  
  // Event callbacks
  private tradeCallback: ((event: TradeEvent) => void) | null = null;
  private orderBookCallback: ((event: OrderBookEvent) => void) | null = null;
  private klineCallback: ((event: KlineEvent) => void) | null = null;
  
  // Connection redundancy
  private primaryWs: WebSocket | null = null;
  private backupWs: WebSocket | null = null;
  private activeConnection: 'primary' | 'backup' = 'primary';
  
  constructor(config: Partial<MarketDataConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.connectionStatus = {
      connected: false,
      lastHeartbeat: 0,
      reconnectCount: 0,
      latency: 0,
    };
    
    // Initialize circuit breaker for connection management
    this.circuitBreaker = new EnhancedCircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 30000, // 30 seconds
      slowCallThreshold: 10000, // 10 seconds
    });
  }

  async connect(symbols: string[]): Promise<void> {
    return this.circuitBreaker.execute(async () => {
      return retryNetworkOperation(async () => {
        await this.establishConnection(symbols);
      }, 3, 2000);
    });
  }

  private async establishConnection(symbols: string[]): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      await this.disconnect();
    }

    return new Promise((resolve, reject) => {
      try {
        // Build WebSocket URL for multiple streams
        const streams = this.buildStreamNames(symbols);
        const wsUrl = `wss://stream.binance.com:9443/ws/${streams.join('/')}`;
        
        console.log(`Connecting to Binance WebSocket: ${wsUrl}`);
        this.ws = new WebSocket(wsUrl);
        
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000); // 10 second timeout
        
        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('Binance WebSocket connected');
          this.connectionStatus.connected = true;
          this.connectionStatus.lastHeartbeat = Date.now();
          this.reconnectAttempts = 0;
          
          this.startHeartbeat();
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          try {
            this.handleMessage(event.data);
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
            // Don't throw here to avoid breaking the connection
          }
        };
        
        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket closed: ${event.code} ${event.reason}`);
          this.connectionStatus.connected = false;
          this.stopHeartbeat();
          
          if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnects) {
            this.scheduleReconnect(symbols);
          }
        };
        
        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('WebSocket error:', error);
          reject(new Error('WebSocket connection failed'));
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
    
    this.connectionStatus.connected = false;
  }

  onTrade(callback: (event: TradeEvent) => void): void {
    this.tradeCallback = callback;
  }

  onOrderBook(callback: (event: OrderBookEvent) => void): void {
    this.orderBookCallback = callback;
  }

  onKline(callback: (event: KlineEvent) => void): void {
    this.klineCallback = callback;
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  getLatency(): number {
    return this.connectionStatus.latency;
  }

  private buildStreamNames(symbols: string[]): string[] {
    const streams: string[] = [];
    
    for (const symbol of symbols) {
      const lowerSymbol = symbol.toLowerCase();
      
      // Trade stream
      streams.push(`${lowerSymbol}@trade`);
      
      // Depth stream (order book)
      streams.push(`${lowerSymbol}@depth20@100ms`);
      
      // Kline streams for all timeframes
      for (const timeframe of this.config.timeframes) {
        const binanceInterval = this.mapTimeframeToBinance(timeframe);
        streams.push(`${lowerSymbol}@kline_${binanceInterval}`);
      }
    }
    
    return streams;
  }

  private mapTimeframeToBinance(timeframe: string): string {
    const mapping: Record<string, string> = {
      'M1': '1m',
      'M5': '5m',
      'M15': '15m',
      'H1': '1h',
      'H4': '4h',
    };
    return mapping[timeframe] || '1m';
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      // Update latency if server time is available
      if (message.E) {
        this.connectionStatus.latency = Date.now() - message.E;
      }
      
      // Route message based on stream type
      if (message.stream) {
        const streamName = message.stream;
        const eventData = message.data;
        
        if (streamName.includes('@trade')) {
          this.handleTradeEvent(eventData);
        } else if (streamName.includes('@depth')) {
          this.handleDepthEvent(eventData);
        } else if (streamName.includes('@kline')) {
          this.handleKlineEvent(eventData);
        }
      } else {
        // Single stream format
        if (message.e === 'trade') {
          this.handleTradeEvent(message);
        } else if (message.e === 'depthUpdate') {
          this.handleDepthEvent(message);
        } else if (message.e === 'kline') {
          this.handleKlineEvent(message);
        }
      }
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleTradeEvent(data: any): void {
    if (!this.tradeCallback) return;
    
    try {
      const tradeEvent: TradeEvent = {
        symbol: data.s,
        price: parseFloat(data.p),
        quantity: parseFloat(data.q),
        timestamp: data.T || data.E,
        side: data.m ? 'SELL' : 'BUY', // m = true means buyer is market maker (sell)
        tradeId: data.t?.toString() || data.a?.toString(),
      };
      
      this.tradeCallback(tradeEvent);
    } catch (error) {
      console.error('Error processing trade event:', error);
    }
  }

  private handleDepthEvent(data: any): void {
    if (!this.orderBookCallback) return;
    
    try {
      const orderBookEvent: OrderBookEvent = {
        symbol: data.s,
        bids: data.b?.map((bid: string[]) => [parseFloat(bid[0]), parseFloat(bid[1])]) || [],
        asks: data.a?.map((ask: string[]) => [parseFloat(ask[0]), parseFloat(ask[1])]) || [],
        timestamp: data.E,
        lastUpdateId: data.u || data.U,
      };
      
      this.orderBookCallback(orderBookEvent);
    } catch (error) {
      console.error('Error processing depth event:', error);
    }
  }

  private handleKlineEvent(data: any): void {
    if (!this.klineCallback) return;
    
    try {
      const klineData = data.k || data;
      const timeframe = this.mapBinanceToTimeframe(klineData.i);
      
      if (!timeframe) return;
      
      const klineEvent: KlineEvent = {
        symbol: klineData.s,
        timeframe,
        openTime: klineData.t,
        closeTime: klineData.T,
        open: parseFloat(klineData.o),
        high: parseFloat(klineData.h),
        low: parseFloat(klineData.l),
        close: parseFloat(klineData.c),
        volume: parseFloat(klineData.v),
        trades: parseInt(klineData.n) || 0,
      };
      
      this.klineCallback(klineEvent);
    } catch (error) {
      console.error('Error processing kline event:', error);
    }
  }

  private mapBinanceToTimeframe(interval: string): string | null {
    const mapping: Record<string, string> = {
      '1m': 'M1',
      '5m': 'M5',
      '15m': 'M15',
      '1h': 'H1',
      '4h': 'H4',
    };
    return mapping[interval] || null;
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Send ping frame
        this.ws.ping();
        this.connectionStatus.lastHeartbeat = Date.now();
      } else {
        this.connectionStatus.connected = false;
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(symbols: string[]): void {
    if (this.reconnectTimer) return;
    
    this.reconnectAttempts++;
    this.connectionStatus.reconnectCount++;
    
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.connect(symbols);
      } catch (error) {
        console.error('Reconnect failed:', error);
        if (this.reconnectAttempts < this.config.maxReconnects) {
          this.scheduleReconnect(symbols);
        }
      }
    }, delay);
  }
}