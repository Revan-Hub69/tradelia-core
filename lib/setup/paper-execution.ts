// Paper Execution System - Minimal order management for setup lifecycle
// Simulates order fills, stop/target hits, and outcome tracking

import { SetupCandidate, SetupOutcome } from './types';
import { setupLogger } from './logger';

interface PaperOrder {
  orderId: string;
  setupId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'STOP';
  price: number;
  quantity: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';
  createdAt: number;
  filledAt?: number;
  filledPrice?: number;
}

interface PaperPosition {
  setupId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  stopPrice: number;
  targetPrice: number;
  enteredAt: number;
  maxRunup: number;
  maxDrawdown: number;
  status: 'OPEN' | 'STOPPED' | 'TARGET_HIT' | 'EXPIRED';
}

export class PaperExecutionEngine {
  private orders: Map<string, PaperOrder> = new Map();
  private positions: Map<string, PaperPosition> = new Map();
  
  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================
  
  async submitSetupOrder(setup: SetupCandidate): Promise<string> {
    const orderId = `order_${setup.setupId}_${Date.now()}`;
    
    const order: PaperOrder = {
      orderId,
      setupId: setup.setupId,
      symbol: setup.symbol,
      side: setup.direction === 'LONG' ? 'BUY' : 'SELL',
      type: setup.entryModel.type as 'LIMIT' | 'STOP',
      price: setup.entryModel.price,
      quantity: setup.maxRisk / Math.abs(setup.entryModel.price - setup.stopModel.level), // Position size based on risk
      status: 'PENDING',
      createdAt: Date.now(),
    };
    
    this.orders.set(orderId, order);
    
    console.log(`📋 Paper order submitted: ${orderId} - ${order.side} ${order.symbol} @ ${order.price}`);
    
    return orderId;
  }
  
  async checkOrderFills(currentPrices: Record<string, number>): Promise<void> {
    for (const [orderId, order] of this.orders.entries()) {
      if (order.status !== 'PENDING') continue;
      
      const currentPrice = currentPrices[order.symbol];
      if (!currentPrice) continue;
      
      let shouldFill = false;
      
      // Check fill conditions based on order type
      if (order.type === 'LIMIT') {
        if (order.side === 'BUY' && currentPrice <= order.price) {
          shouldFill = true;
        } else if (order.side === 'SELL' && currentPrice >= order.price) {
          shouldFill = true;
        }
      } else if (order.type === 'STOP') {
        if (order.side === 'BUY' && currentPrice >= order.price) {
          shouldFill = true;
        } else if (order.side === 'SELL' && currentPrice <= order.price) {
          shouldFill = true;
        }
      }
      
      if (shouldFill) {
        await this.fillOrder(orderId, currentPrice);
      }
    }
  }
  
  private async fillOrder(orderId: string, fillPrice: number): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) return;
    
    // Add realistic slippage (0.01-0.05%)
    const slippage = (Math.random() * 0.0004 + 0.0001) * (order.side === 'BUY' ? 1 : -1);
    const actualFillPrice = fillPrice * (1 + slippage);
    
    // Update order
    order.status = 'FILLED';
    order.filledAt = Date.now();
    order.filledPrice = actualFillPrice;
    
    console.log(`✅ Paper order filled: ${orderId} @ ${actualFillPrice} (slippage: ${(slippage * 100).toFixed(3)}%)`);
    
    // Create position
    await this.createPosition(order);
    
    // Log entry trigger
    await setupLogger.logEntryTriggered(
      order.setupId,
      order.symbol,
      actualFillPrice,
      Math.abs(slippage),
      {} as any // MarketState placeholder
    );
  }
  
  // ============================================================================
  // POSITION MANAGEMENT
  // ============================================================================
  
  private async createPosition(order: PaperOrder): Promise<void> {
    // Get setup details to determine stop/target levels
    // For now, use simple logic - in real system would get from setup data
    const stopDistance = order.price * 0.02; // 2% stop
    const targetDistance = order.price * 0.04; // 4% target (2:1 R/R)
    
    const position: PaperPosition = {
      setupId: order.setupId,
      symbol: order.symbol,
      side: order.side === 'BUY' ? 'LONG' : 'SHORT',
      entryPrice: order.filledPrice!,
      quantity: order.quantity,
      stopPrice: order.side === 'BUY' 
        ? order.filledPrice! - stopDistance 
        : order.filledPrice! + stopDistance,
      targetPrice: order.side === 'BUY' 
        ? order.filledPrice! + targetDistance 
        : order.filledPrice! - targetDistance,
      enteredAt: Date.now(),
      maxRunup: 0,
      maxDrawdown: 0,
      status: 'OPEN',
    };
    
    this.positions.set(order.setupId, position);
    
    console.log(`🎯 Paper position opened: ${position.side} ${position.symbol} @ ${position.entryPrice}`);
    console.log(`   Stop: ${position.stopPrice}, Target: ${position.targetPrice}`);
  }
  
  async updatePositions(currentPrices: Record<string, number>): Promise<void> {
    for (const [setupId, position] of this.positions.entries()) {
      if (position.status !== 'OPEN') continue;
      
      const currentPrice = currentPrices[position.symbol];
      if (!currentPrice) continue;
      
      // Update max runup/drawdown
      const pnl = this.calculatePnL(position, currentPrice);
      position.maxRunup = Math.max(position.maxRunup, pnl);
      position.maxDrawdown = Math.min(position.maxDrawdown, pnl);
      
      // Check stop/target hits
      let exitReason: string | null = null;
      
      if (position.side === 'LONG') {
        if (currentPrice <= position.stopPrice) {
          exitReason = 'STOP';
        } else if (currentPrice >= position.targetPrice) {
          exitReason = 'TARGET_PRIMARY';
        }
      } else {
        if (currentPrice >= position.stopPrice) {
          exitReason = 'STOP';
        } else if (currentPrice <= position.targetPrice) {
          exitReason = 'TARGET_PRIMARY';
        }
      }
      
      if (exitReason) {
        await this.closePosition(setupId, currentPrice, exitReason);
      }
    }
  }
  
  private async closePosition(setupId: string, exitPrice: number, exitReason: string): Promise<void> {
    const position = this.positions.get(setupId);
    if (!position) return;
    
    const pnl = this.calculatePnL(position, exitPrice);
    const pnlPct = (pnl / (position.entryPrice * position.quantity)) * 100;
    const holdTime = Date.now() - position.enteredAt;
    
    // Create outcome
    const outcome: SetupOutcome = {
      pnl,
      pnlPct,
      holdTime,
      exitReason: exitReason as any,
      slippage: 0.0002, // Assume 0.02% exit slippage
      maxDrawdown: position.maxDrawdown,
      maxRunup: position.maxRunup,
    };
    
    // Update position status
    position.status = exitReason === 'STOP' ? 'STOPPED' : 'TARGET_HIT';
    
    console.log(`🏁 Paper position closed: ${position.symbol} ${exitReason}`);
    console.log(`   PnL: $${pnl.toFixed(2)} (${pnlPct.toFixed(2)}%)`);
    console.log(`   Hold time: ${Math.round(holdTime / 1000)}s`);
    
    // Log outcome
    if (exitReason === 'STOP') {
      await setupLogger.logStopHit(setupId, position.symbol, exitPrice, outcome, {} as any);
    } else {
      await setupLogger.logTargetHit(setupId, position.symbol, exitPrice, outcome, {} as any);
    }
  }
  
  private calculatePnL(position: PaperPosition, currentPrice: number): number {
    const priceChange = currentPrice - position.entryPrice;
    const multiplier = position.side === 'LONG' ? 1 : -1;
    return priceChange * multiplier * position.quantity;
  }
  
  // ============================================================================
  // STATISTICS
  // ============================================================================
  
  getExecutionStats(): {
    totalOrders: number;
    filledOrders: number;
    fillRate: number;
    activePositions: number;
    closedPositions: number;
    totalPnL: number;
    winRate: number;
  } {
    const orders = Array.from(this.orders.values());
    const positions = Array.from(this.positions.values());
    
    const filledOrders = orders.filter(o => o.status === 'FILLED').length;
    const activePositions = positions.filter(p => p.status === 'OPEN').length;
    const closedPositions = positions.filter(p => p.status !== 'OPEN');
    
    const winners = closedPositions.filter(p => {
      const finalPrice = p.status === 'TARGET_HIT' ? p.targetPrice : p.stopPrice;
      return this.calculatePnL(p, finalPrice) > 0;
    }).length;
    
    const totalPnL = closedPositions.reduce((sum, p) => {
      const finalPrice = p.status === 'TARGET_HIT' ? p.targetPrice : p.stopPrice;
      return sum + this.calculatePnL(p, finalPrice);
    }, 0);
    
    return {
      totalOrders: orders.length,
      filledOrders,
      fillRate: orders.length > 0 ? filledOrders / orders.length : 0,
      activePositions,
      closedPositions: closedPositions.length,
      totalPnL,
      winRate: closedPositions.length > 0 ? winners / closedPositions.length : 0,
    };
  }
}

// Singleton instance
export const paperExecutionEngine = new PaperExecutionEngine();