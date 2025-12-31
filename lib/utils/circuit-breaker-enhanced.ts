// Enhanced Circuit Breaker - Production Reliability
// Professional fault tolerance with monitoring and recovery

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringWindow: number;
  halfOpenMaxCalls: number;
  slowCallThreshold: number;
  slowCallRateThreshold: number;
  minimumThroughput: number;
}

export interface CircuitBreakerStats {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  totalCalls: number;
  slowCalls: number;
  lastFailureTime: number;
  lastSuccessTime: number;
  stateChangedAt: number;
  averageResponseTime: number;
  failureRate: number;
  slowCallRate: number;
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerEvent {
  type: 'STATE_CHANGE' | 'CALL_SUCCESS' | 'CALL_FAILURE' | 'CALL_TIMEOUT' | 'CALL_SLOW';
  timestamp: number;
  state: CircuitBreakerState;
  duration?: number;
  error?: string;
}

export class EnhancedCircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private totalCalls = 0;
  private slowCalls = 0;
  private lastFailureTime = 0;
  private lastSuccessTime = 0;
  private stateChangedAt = Date.now();
  private halfOpenCalls = 0;
  private responseTimes: number[] = [];
  private readonly maxResponseTimeHistory = 100;
  
  private readonly config: CircuitBreakerConfig;
  private readonly eventListeners: ((event: CircuitBreakerEvent) => void)[] = [];

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      monitoringWindow: 60000, // 1 minute
      halfOpenMaxCalls: 3,
      slowCallThreshold: 5000, // 5 seconds
      slowCallRateThreshold: 0.5, // 50%
      minimumThroughput: 10,
      ...config,
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Check if circuit is open
      if (this.state === 'OPEN') {
        if (this.shouldAttemptReset()) {
          this.transitionTo('HALF_OPEN');
        } else {
          this.emitEvent({
            type: 'CALL_FAILURE',
            timestamp: Date.now(),
            state: this.state,
            error: 'Circuit breaker is OPEN',
          });
          
          if (fallback) {
            return await fallback();
          }
          throw new Error('Circuit breaker is OPEN - service unavailable');
        }
      }

      // Check half-open call limit
      if (this.state === 'HALF_OPEN' && this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        this.emitEvent({
          type: 'CALL_FAILURE',
          timestamp: Date.now(),
          state: this.state,
          error: 'Half-open call limit exceeded',
        });
        
        if (fallback) {
          return await fallback();
        }
        throw new Error('Circuit breaker half-open call limit exceeded');
      }

      // Execute operation with optional timeout
      let result: T;
      if (timeout) {
        result = await Promise.race([
          operation(),
          this.createTimeoutPromise<T>(timeout),
        ]);
      } else {
        result = await operation();
      }

      // Record success
      const duration = Date.now() - startTime;
      this.onSuccess(duration);
      
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.onFailure(duration, error);
      
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          throw error; // Throw original error, not fallback error
        }
      }
      
      throw error;
    }
  }

  private onSuccess(duration: number): void {
    this.successCount++;
    this.totalCalls++;
    this.lastSuccessTime = Date.now();
    this.recordResponseTime(duration);

    if (this.state === 'HALF_OPEN') {
      this.halfOpenCalls++;
      
      // If we've had enough successful calls in half-open, close the circuit
      if (this.halfOpenCalls >= this.config.halfOpenMaxCalls) {
        this.transitionTo('CLOSED');
        this.resetCounters();
      }
    } else if (this.state === 'CLOSED') {
      // Reset failure count on success in closed state
      this.failureCount = 0;
    }

    // Check for slow calls
    if (duration > this.config.slowCallThreshold) {
      this.slowCalls++;
      this.emitEvent({
        type: 'CALL_SLOW',
        timestamp: Date.now(),
        state: this.state,
        duration,
      });
    }

    this.emitEvent({
      type: 'CALL_SUCCESS',
      timestamp: Date.now(),
      state: this.state,
      duration,
    });

    this.evaluateState();
  }

  private onFailure(duration: number, error: any): void {
    this.failureCount++;
    this.totalCalls++;
    this.lastFailureTime = Date.now();
    this.recordResponseTime(duration);

    if (this.state === 'HALF_OPEN') {
      // Any failure in half-open state opens the circuit
      this.transitionTo('OPEN');
    }

    this.emitEvent({
      type: 'CALL_FAILURE',
      timestamp: Date.now(),
      state: this.state,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });

    this.evaluateState();
  }

  private evaluateState(): void {
    if (this.state === 'CLOSED') {
      const now = Date.now();
      const windowStart = now - this.config.monitoringWindow;
      
      // Only evaluate if we have minimum throughput
      if (this.totalCalls < this.config.minimumThroughput) {
        return;
      }

      // Check failure rate
      const failureRate = this.failureCount / this.totalCalls;
      const slowCallRate = this.slowCalls / this.totalCalls;

      if (
        this.failureCount >= this.config.failureThreshold ||
        failureRate > 0.5 || // 50% failure rate
        slowCallRate > this.config.slowCallRateThreshold
      ) {
        this.transitionTo('OPEN');
      }
    }
  }

  private shouldAttemptReset(): boolean {
    const now = Date.now();
    return now - this.stateChangedAt >= this.config.recoveryTimeout;
  }

  private transitionTo(newState: CircuitBreakerState): void {
    const oldState = this.state;
    this.state = newState;
    this.stateChangedAt = Date.now();

    if (newState === 'HALF_OPEN') {
      this.halfOpenCalls = 0;
    } else if (newState === 'CLOSED') {
      this.resetCounters();
    }

    this.emitEvent({
      type: 'STATE_CHANGE',
      timestamp: Date.now(),
      state: newState,
    });

    console.log(`Circuit breaker state changed: ${oldState} -> ${newState}`);
  }

  private resetCounters(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.totalCalls = 0;
    this.slowCalls = 0;
    this.halfOpenCalls = 0;
    this.responseTimes = [];
  }

  private recordResponseTime(duration: number): void {
    this.responseTimes.push(duration);
    if (this.responseTimes.length > this.maxResponseTimeHistory) {
      this.responseTimes.shift();
    }
  }

  private createTimeoutPromise<T>(timeout: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  private emitEvent(event: CircuitBreakerEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Circuit breaker event listener error:', error);
      }
    });
  }

  // Public API
  getStats(): CircuitBreakerStats {
    const averageResponseTime = this.responseTimes.length > 0 ?
      this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length :
      0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalCalls: this.totalCalls,
      slowCalls: this.slowCalls,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      stateChangedAt: this.stateChangedAt,
      averageResponseTime,
      failureRate: this.totalCalls > 0 ? this.failureCount / this.totalCalls : 0,
      slowCallRate: this.totalCalls > 0 ? this.slowCalls / this.totalCalls : 0,
    };
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  isCallAllowed(): boolean {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'HALF_OPEN') return this.halfOpenCalls < this.config.halfOpenMaxCalls;
    if (this.state === 'OPEN') return this.shouldAttemptReset();
    return false;
  }

  addEventListener(listener: (event: CircuitBreakerEvent) => void): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: (event: CircuitBreakerEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  // Manual control (for testing/debugging)
  forceOpen(): void {
    this.transitionTo('OPEN');
  }

  forceClose(): void {
    this.transitionTo('CLOSED');
    this.resetCounters();
  }

  forceHalfOpen(): void {
    this.transitionTo('HALF_OPEN');
  }

  reset(): void {
    this.transitionTo('CLOSED');
    this.resetCounters();
  }
}

// Circuit breaker registry for managing multiple instances
export class CircuitBreakerRegistry {
  private breakers = new Map<string, EnhancedCircuitBreaker>();

  get(name: string, config?: Partial<CircuitBreakerConfig>): EnhancedCircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new EnhancedCircuitBreaker(config));
    }
    return this.breakers.get(name)!;
  }

  getAll(): Map<string, EnhancedCircuitBreaker> {
    return new Map(this.breakers);
  }

  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }

  remove(name: string): boolean {
    return this.breakers.delete(name);
  }

  clear(): void {
    this.breakers.clear();
  }
}

// Global registry instance
export const circuitBreakers = new CircuitBreakerRegistry();

// Convenience function for common use cases
export function withCircuitBreaker<T>(
  name: string,
  operation: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>,
  fallback?: () => Promise<T>,
  timeout?: number
): Promise<T> {
  const breaker = circuitBreakers.get(name, config);
  return breaker.execute(operation, fallback, timeout);
}