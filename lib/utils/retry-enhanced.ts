// Enhanced Retry System - Production Reliability
// Professional retry mechanisms with backoff strategies and monitoring

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed' | 'fibonacci';
  jitter: boolean;
  retryCondition?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
  timeout?: number;
  abortSignal?: AbortSignal;
}

export interface RetryStats {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  totalDelay: number;
  averageDelay: number;
  lastError?: string;
  lastSuccessTime?: number;
  lastFailureTime?: number;
}

export class RetryError extends Error {
  public readonly attempts: number;
  public readonly totalDelay: number;
  public readonly lastError: Error;

  constructor(message: string, attempts: number, totalDelay: number, lastError: Error) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
    this.totalDelay = totalDelay;
    this.lastError = lastError;
  }
}

export class EnhancedRetry {
  private stats: RetryStats = {
    totalAttempts: 0,
    successfulAttempts: 0,
    failedAttempts: 0,
    totalDelay: 0,
    averageDelay: 0,
  };

  async execute<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffStrategy: 'exponential',
      jitter: true,
      ...config,
    };

    let lastError: Error;
    let totalDelay = 0;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      this.stats.totalAttempts++;

      try {
        // Check for abort signal
        if (finalConfig.abortSignal?.aborted) {
          throw new Error('Operation aborted');
        }

        // Execute operation with optional timeout
        const result = finalConfig.timeout
          ? await this.executeWithTimeout(operation, finalConfig.timeout)
          : await operation();

        // Success
        this.stats.successfulAttempts++;
        this.stats.lastSuccessTime = Date.now();
        
        return result;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.stats.failedAttempts++;
        this.stats.lastFailureTime = Date.now();
        this.stats.lastError = lastError.message;

        // Check if we should retry this error
        if (finalConfig.retryCondition && !finalConfig.retryCondition(lastError, attempt)) {
          throw lastError;
        }

        // Don't retry on last attempt
        if (attempt === finalConfig.maxAttempts) {
          break;
        }

        // Calculate delay
        const delay = this.calculateDelay(attempt, finalConfig);
        totalDelay += delay;
        this.stats.totalDelay += delay;
        this.stats.averageDelay = this.stats.totalDelay / this.stats.totalAttempts;

        // Call retry callback
        if (finalConfig.onRetry) {
          try {
            finalConfig.onRetry(lastError, attempt, delay);
          } catch (callbackError) {
            console.error('Retry callback error:', callbackError);
          }
        }

        // Wait before retry
        await this.delay(delay);

        // Check for abort signal after delay
        if (finalConfig.abortSignal?.aborted) {
          throw new Error('Operation aborted during retry delay');
        }
      }
    }

    // All attempts failed
    throw new RetryError(
      `Operation failed after ${finalConfig.maxAttempts} attempts`,
      finalConfig.maxAttempts,
      totalDelay,
      lastError!
    );
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay: number;

    switch (config.backoffStrategy) {
      case 'exponential':
        delay = config.baseDelay * Math.pow(2, attempt - 1);
        break;
      
      case 'linear':
        delay = config.baseDelay * attempt;
        break;
      
      case 'fixed':
        delay = config.baseDelay;
        break;
      
      case 'fibonacci':
        delay = config.baseDelay * this.fibonacci(attempt);
        break;
      
      default:
        delay = config.baseDelay * Math.pow(2, attempt - 1);
    }

    // Apply jitter to avoid thundering herd
    if (config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }

    // Cap at max delay
    return Math.min(delay, config.maxDelay);
  }

  private fibonacci(n: number): number {
    if (n <= 1) return 1;
    let a = 1, b = 1;
    for (let i = 2; i < n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeout}ms`)), timeout);
      }),
    ]);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats(): RetryStats {
    return { ...this.stats };
  }

  resetStats(): void {
    this.stats = {
      totalAttempts: 0,
      successfulAttempts: 0,
      failedAttempts: 0,
      totalDelay: 0,
      averageDelay: 0,
    };
  }
}

// Predefined retry conditions
export const RetryConditions = {
  // Retry on network errors
  networkErrors: (error: any): boolean => {
    const message = error.message?.toLowerCase() || '';
    return message.includes('network') ||
           message.includes('timeout') ||
           message.includes('connection') ||
           message.includes('econnreset') ||
           message.includes('enotfound');
  },

  // Retry on HTTP 5xx errors
  serverErrors: (error: any): boolean => {
    return error.status >= 500 && error.status < 600;
  },

  // Retry on specific HTTP status codes
  httpStatus: (codes: number[]) => (error: any): boolean => {
    return codes.includes(error.status);
  },

  // Retry on rate limiting
  rateLimited: (error: any): boolean => {
    return error.status === 429 || error.message?.includes('rate limit');
  },

  // Combine multiple conditions with OR logic
  any: (...conditions: ((error: any) => boolean)[]): ((error: any) => boolean) => {
    return (error: any) => conditions.some(condition => condition(error));
  },

  // Combine multiple conditions with AND logic
  all: (...conditions: ((error: any) => boolean)[]): ((error: any) => boolean) => {
    return (error: any) => conditions.every(condition => condition(error));
  },

  // Never retry
  never: (): boolean => false,

  // Always retry
  always: (): boolean => true,
};

// Retry registry for managing multiple retry instances
export class RetryRegistry {
  private retries = new Map<string, EnhancedRetry>();

  get(name: string): EnhancedRetry {
    if (!this.retries.has(name)) {
      this.retries.set(name, new EnhancedRetry());
    }
    return this.retries.get(name)!;
  }

  getAllStats(): Record<string, RetryStats> {
    const stats: Record<string, RetryStats> = {};
    for (const [name, retry] of this.retries) {
      stats[name] = retry.getStats();
    }
    return stats;
  }

  resetAllStats(): void {
    for (const retry of this.retries.values()) {
      retry.resetStats();
    }
  }

  remove(name: string): boolean {
    return this.retries.delete(name);
  }

  clear(): void {
    this.retries.clear();
  }
}

// Global registry instance
export const retryRegistry = new RetryRegistry();

// Convenience functions
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retry = new EnhancedRetry();
  return retry.execute(operation, config);
}

export async function retryNetworkOperation<T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  return retryWithBackoff(operation, {
    maxAttempts,
    baseDelay,
    backoffStrategy: 'exponential',
    jitter: true,
    retryCondition: RetryConditions.any(
      RetryConditions.networkErrors,
      RetryConditions.serverErrors,
      RetryConditions.rateLimited
    ),
    onRetry: (error, attempt, delay) => {
      console.log(`Network operation failed (attempt ${attempt}), retrying in ${delay}ms:`, error.message);
    },
  });
}

export async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxAttempts = 5,
  baseDelay = 500
): Promise<T> {
  return retryWithBackoff(operation, {
    maxAttempts,
    baseDelay,
    maxDelay: 10000,
    backoffStrategy: 'exponential',
    jitter: true,
    retryCondition: (error) => {
      const message = error.message?.toLowerCase() || '';
      return message.includes('connection') ||
             message.includes('timeout') ||
             message.includes('deadlock') ||
             message.includes('lock wait timeout') ||
             error.code === 'ECONNRESET';
    },
    onRetry: (error, attempt, delay) => {
      console.log(`Database operation failed (attempt ${attempt}), retrying in ${delay}ms:`, error.message);
    },
  });
}

export async function retryWithCircuitBreaker<T>(
  name: string,
  operation: () => Promise<T>,
  retryConfig: Partial<RetryConfig> = {},
  circuitBreakerConfig?: any
): Promise<T> {
  const { withCircuitBreaker } = await import('./circuit-breaker-enhanced');
  
  return withCircuitBreaker(
    name,
    () => retryWithBackoff(operation, retryConfig),
    circuitBreakerConfig
  );
}