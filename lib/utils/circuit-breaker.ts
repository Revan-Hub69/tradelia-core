// Circuit Breaker pattern implementation
// Prevents cascade failures when external services are down

export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  recoveryTimeout: number;     // Time to wait before trying again (ms)
  monitoringPeriod: number;    // Time window for failure counting (ms)
  expectedErrors?: string[];   // Error types that should trip the breaker
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  nextAttemptTime: number | null;
}

export class CircuitBreaker<T> {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private nextAttemptTime: number | null = null;
  private readonly config: CircuitBreakerConfig;
  private readonly name: string;

  constructor(
    private readonly operation: (...args: any[]) => Promise<T>,
    config: Partial<CircuitBreakerConfig> = {},
    name = 'CircuitBreaker'
  ) {
    this.config = {
      failureThreshold: 5,
      recoveryTimeout: 30000, // 30 seconds
      monitoringPeriod: 60000, // 1 minute
      expectedErrors: ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'],
      ...config
    };
    this.name = name;
  }

  async execute(...args: any[]): Promise<T> {
    const now = Date.now();

    // Check if we should reset failure count (monitoring period expired)
    if (this.lastFailureTime && (now - this.lastFailureTime) > this.config.monitoringPeriod) {
      this.reset();
    }

    switch (this.state) {
      case CircuitState.OPEN:
        if (this.nextAttemptTime && now < this.nextAttemptTime) {
          throw new CircuitBreakerError(
            `Circuit breaker is OPEN. Next attempt in ${Math.ceil((this.nextAttemptTime - now) / 1000)}s`,
            this.getStats()
          );
        }
        // Time to try again
        this.state = CircuitState.HALF_OPEN;
        console.log(`[${this.name}] Circuit breaker transitioning to HALF_OPEN`);
        break;

      case CircuitState.HALF_OPEN:
        // In half-open state, only allow one request through
        break;

      case CircuitState.CLOSED:
        // Normal operation
        break;
    }

    try {
      const result = await this.operation(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess(): void {
    this.successCount++;
    
    if (this.state === CircuitState.HALF_OPEN) {
      console.log(`[${this.name}] Circuit breaker closing after successful request`);
      this.reset();
    }
  }

  private onFailure(error: any): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    // Check if this is an expected error that should trip the breaker
    const isExpectedError = this.config.expectedErrors?.some(expectedError => 
      error.code === expectedError || 
      error.message?.includes(expectedError) ||
      error.name === expectedError
    );

    if (isExpectedError || this.shouldTripBreaker(error)) {
      if (this.state === CircuitState.HALF_OPEN) {
        // Failed in half-open, go back to open
        this.state = CircuitState.OPEN;
        this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
        console.log(`[${this.name}] Circuit breaker opening after failed half-open attempt`);
      } else if (this.failureCount >= this.config.failureThreshold) {
        // Too many failures, open the circuit
        this.state = CircuitState.OPEN;
        this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
        console.log(`[${this.name}] Circuit breaker opening after ${this.failureCount} failures`);
      }
    }
  }

  private shouldTripBreaker(error: any): boolean {
    // Add custom logic here for determining if an error should trip the breaker
    // For now, trip on network errors and timeouts
    return (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.name === 'TimeoutError' ||
      (error.response && error.response.status >= 500)
    );
  }

  private reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }

  // Manual control methods
  forceOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    console.log(`[${this.name}] Circuit breaker manually opened`);
  }

  forceClose(): void {
    this.reset();
    console.log(`[${this.name}] Circuit breaker manually closed`);
  }
}

export class CircuitBreakerError extends Error {
  constructor(message: string, public readonly stats: CircuitBreakerStats) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

// Pre-configured circuit breakers for common services
export const circuitBreakers = {
  binance: new CircuitBreaker(
    async (url: string, options?: RequestInit) => {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10s timeout
      });
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    },
    {
      failureThreshold: 3,
      recoveryTimeout: 30000, // 30s
      monitoringPeriod: 60000, // 1min
      expectedErrors: ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'AbortError']
    },
    'BinanceAPI'
  ),

  supabase: new CircuitBreaker(
    async (operation: () => Promise<any>) => {
      return await operation();
    },
    {
      failureThreshold: 5,
      recoveryTimeout: 15000, // 15s
      monitoringPeriod: 120000, // 2min
    },
    'SupabaseDB'
  )
};

// Health check for all circuit breakers
export function getCircuitBreakerHealth(): Record<string, CircuitBreakerStats> {
  return {
    binance: circuitBreakers.binance.getStats(),
    supabase: circuitBreakers.supabase.getStats()
  };
}