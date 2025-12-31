// Paper OMS - Simulated Order Management System
// Professional order execution simulation with realistic slippage

import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { 
  PaperOMS, 
  OrderIntent, 
  OrderResult, 
  OrderStatus, 
  FillResult, 
  TradeOutcome 
} from './types';

interface PendingOrder {
  orderId: string;
  intent: OrderIntent;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  createdAt: number;
  ttlExpiry: number;
  fillPrice?: number;
  fillQuantity?: number;
  slippage?: number;
}

export class SimulatedPaperOMS implements PaperOMS {
  private pendingOrders: Map<string, PendingOrder> = new Map();
  private completedOrders: Map<string, PendingOrder> = new Map();
  private ttlTimers: Map<string, NodeJS.Timeout> = new Map();
  
  // Slippage model parameters
  private readonly baseSlippage = 0.0001; // 0.01% base slippage
  private readonly volumeImpact = 0.00001; // Additional slippage per $1000 volume
  private readonly spreadMultiplier = 0.5; // Use 50% of spread as slippage

  async submitOrder(intent: OrderIntent): Promise<OrderResult> {
    const orderId = uuidv4();
    const now = Date.now();
    const ttlExpiry = now + (intent.ttlSec * 1000);

    try {
      // Validate order intent
      const validation = this.validateOrderIntent(intent);
      if (!validation.valid) {
        return {
          orderId,
          status: 'REJECTED',
        };
      }

      // Create pending order
      const pendingOrder: PendingOrder = {
        orderId,
        intent,
        status: 'PENDING',
        createdAt: now,
        ttlExpiry,
      };

      this.pendingOrders.set(orderId, pendingOrder);

      // Set TTL timer
      const ttlTimer = setTimeout(() => {
        this.handleTTLExpiry(orderId);
      }, intent.ttlSec * 1000);

      this.ttlTimers.set(orderId, ttlTimer);

      // For market orders, simulate immediate fill
      if (intent.type === 'MARKET') {
        const marketPrice = await this.getCurrentMarketPrice(intent.symbol);
        if (marketPrice) {
          const fillResult = this.simulateFill(intent, marketPrice);
          await this.fillOrder(orderId, fillResult);
          
          return {
            orderId,
            status: 'FILLED',
            fillPrice: fillResult.fillPrice,
            fillQuantity: fillResult.fillQuantity,
            slippage: fillResult.slippage,
          };
        }
      }

      return {
        orderId,
        status: 'PENDING',
      };

    } catch (error) {
      console.error('Error submitting order:', error);
      return {
        orderId,
        status: 'REJECTED',
      };
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.pendingOrders.get(orderId);
    if (!order || order.status !== 'PENDING') {
      return false;
    }

    // Cancel TTL timer
    const timer = this.ttlTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      this.ttlTimers.delete(orderId);
    }

    // Update order status
    order.status = 'CANCELLED';
    this.completedOrders.set(orderId, order);
    this.pendingOrders.delete(orderId);

    console.log(`Order ${orderId} cancelled`);
    return true;
  }

  getOrderStatus(orderId: string): OrderStatus {
    const pending = this.pendingOrders.get(orderId);
    const completed = this.completedOrders.get(orderId);
    const order = pending || completed;

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    return {
      orderId,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.createdAt, // Simplified for now
      ttlExpiry: order.ttlExpiry,
    };
  }

  simulateFill(order: OrderIntent, marketPrice: number): FillResult {
    const slippage = this.calculateSlippage(order, marketPrice);
    const fillPrice = this.applySlippage(marketPrice, slippage, order.side);
    
    return {
      fillPrice,
      fillQuantity: order.quantity,
      slippage,
      timestamp: Date.now(),
    };
  }

  calculateSlippage(order: OrderIntent, fillPrice: number): number {
    // Calculate volume impact
    const notionalValue = order.quantity * fillPrice;
    const volumeSlippage = (notionalValue / 1000) * this.volumeImpact;
    
    // Total slippage
    const totalSlippage = this.baseSlippage + volumeSlippage;
    
    // Add some randomness to simulate market conditions
    const randomFactor = 0.5 + Math.random(); // 0.5x to 1.5x
    
    return Math.min(totalSlippage * randomFactor, 0.005); // Cap at 0.5%
  }

  async recordOutcome(setupId: string, outcome: TradeOutcome): Promise<void> {
    try {
      const supabase = supabaseAdmin();
      
      const { error } = await supabase
        .from('paper_trades')
        .insert({
          setup_id: setupId,
          symbol: outcome.symbol,
          side: outcome.entryPrice < outcome.exitPrice ? 'BUY' : 'SELL',
          order_type: 'MARKET', // Simplified for now
          entry_price: outcome.entryPrice,
          exit_price: outcome.exitPrice,
          quantity: outcome.quantity,
          pnl: outcome.pnl,
          pnl_pct: outcome.pnlPct,
          r_multiple: outcome.rMultiple,
          hold_time: outcome.holdTime,
          slippage: outcome.slippage,
          exit_reason: outcome.exitReason,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to record outcome: ${error.message}`);
      }

      console.log(`Recorded trade outcome for setup ${setupId}: ${outcome.pnlPct.toFixed(2)}%`);

    } catch (error) {
      console.error('Error recording outcome:', error);
      throw error;
    }
  }

  async getOutcomes(from: number, to: number): Promise<TradeOutcome[]> {
    try {
      const supabase = supabaseAdmin();
      
      const { data, error } = await supabase
        .from('paper_trades')
        .select('*')
        .gte('completed_at', new Date(from).toISOString())
        .lte('completed_at', new Date(to).toISOString())
        .order('completed_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch outcomes: ${error.message}`);
      }

      return data?.map(row => ({
        setupId: row.setup_id,
        symbol: row.symbol,
        entryPrice: parseFloat(row.entry_price),
        exitPrice: parseFloat(row.exit_price || '0'),
        quantity: parseFloat(row.quantity),
        pnl: parseFloat(row.pnl || '0'),
        pnlPct: parseFloat(row.pnl_pct || '0'),
        rMultiple: parseFloat(row.r_multiple || '0'),
        holdTime: row.hold_time || 0,
        slippage: parseFloat(row.slippage || '0'),
        exitReason: row.exit_reason as 'STOP' | 'TARGET' | 'TTL' | 'MANUAL',
      })) || [];

    } catch (error) {
      console.error('Error fetching outcomes:', error);
      throw error;
    }
  }

  private validateOrderIntent(intent: OrderIntent): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!intent.symbol || intent.symbol.length === 0) {
      errors.push('Symbol is required');
    }

    if (intent.quantity <= 0) {
      errors.push('Quantity must be positive');
    }

    if (intent.ttlSec <= 0 || intent.ttlSec > 3600) {
      errors.push('TTL must be between 1 and 3600 seconds');
    }

    if (intent.type === 'LIMIT' && !intent.price) {
      errors.push('Price is required for limit orders');
    }

    if (intent.price && intent.price <= 0) {
      errors.push('Price must be positive');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private async getCurrentMarketPrice(symbol: string): Promise<number | null> {
    // In a real implementation, this would fetch from market data
    // For simulation, we'll use a placeholder price
    const basePrices: Record<string, number> = {
      'BTCUSDT': 45000,
      'ETHUSDT': 3000,
      'ADAUSDT': 0.5,
    };

    const basePrice = basePrices[symbol];
    if (!basePrice) return null;

    // Add some random variation (±0.1%)
    const variation = (Math.random() - 0.5) * 0.002;
    return basePrice * (1 + variation);
  }

  private applySlippage(marketPrice: number, slippage: number, side: 'BUY' | 'SELL'): number {
    if (side === 'BUY') {
      return marketPrice * (1 + slippage); // Pay more when buying
    } else {
      return marketPrice * (1 - slippage); // Receive less when selling
    }
  }

  private async fillOrder(orderId: string, fillResult: FillResult): Promise<void> {
    const order = this.pendingOrders.get(orderId);
    if (!order || order.status !== 'PENDING') {
      return;
    }

    // Cancel TTL timer
    const timer = this.ttlTimers.get(orderId);
    if (timer) {
      clearTimeout(timer);
      this.ttlTimers.delete(orderId);
    }

    // Update order
    order.status = 'FILLED';
    order.fillPrice = fillResult.fillPrice;
    order.fillQuantity = fillResult.fillQuantity;
    order.slippage = fillResult.slippage;

    // Move to completed orders
    this.completedOrders.set(orderId, order);
    this.pendingOrders.delete(orderId);

    console.log(`Order ${orderId} filled at ${fillResult.fillPrice} (slippage: ${(fillResult.slippage * 100).toFixed(3)}%)`);
  }

  private handleTTLExpiry(orderId: string): void {
    const order = this.pendingOrders.get(orderId);
    if (!order || order.status !== 'PENDING') {
      return;
    }

    console.log(`Order ${orderId} expired due to TTL`);
    this.cancelOrder(orderId);
  }

  // Utility methods for monitoring
  getPendingOrdersCount(): number {
    return this.pendingOrders.size;
  }

  getCompletedOrdersCount(): number {
    return this.completedOrders.size;
  }

  getOrderStats(): { pending: number; completed: number; filled: number; cancelled: number } {
    const completed = Array.from(this.completedOrders.values());
    
    return {
      pending: this.pendingOrders.size,
      completed: completed.length,
      filled: completed.filter(o => o.status === 'FILLED').length,
      cancelled: completed.filter(o => o.status === 'CANCELLED').length,
    };
  }

  // Cleanup method for graceful shutdown
  async shutdown(): Promise<void> {
    // Cancel all TTL timers
    for (const timer of this.ttlTimers.values()) {
      clearTimeout(timer);
    }
    this.ttlTimers.clear();

    // Cancel all pending orders
    const pendingOrderIds = Array.from(this.pendingOrders.keys());
    for (const orderId of pendingOrderIds) {
      await this.cancelOrder(orderId);
    }

    console.log('Paper OMS shutdown complete');
  }
}