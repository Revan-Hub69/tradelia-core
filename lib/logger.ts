/**
 * Structured Logging System - Tradelia Dashboard
 * Implements enterprise-grade observability with trace IDs and context
 */

export interface LogContext {
  traceId: string;
  userId?: string;
  sessionId?: string;
  component: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  traceId: string;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  performance?: {
    duration: number;
    memory?: number;
  };
}

// Extended performance type for memory info
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Error with optional code property
interface ErrorWithCode extends Error {
  code?: string;
}

class Logger {
  private context: Partial<LogContext> = {};
  private static instance: Logger;
  
  constructor() {
    // Initialize with default trace ID
    this.context.traceId = this.generateTraceId();
  }
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }
  
  clearContext(): void {
    const traceId = this.context.traceId;
    this.context = traceId ? { traceId } : {};
  }
  
  debug(message: string, extra?: Record<string, unknown>): void {
    this.log('debug', message, extra);
  }
  
  info(message: string, extra?: Record<string, unknown>): void {
    this.log('info', message, extra);
  }
  
  warn(message: string, extra?: Record<string, unknown>): void {
    this.log('warn', message, extra);
  }
  
  error(message: string, error?: Error, extra?: Record<string, unknown>): void {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      code: (error as ErrorWithCode).code
    } : undefined;
    
    this.log('error', message, { 
      ...extra, 
      error: errorData
    });
  }
  
  performance(message: string, startTime: number, extra?: Record<string, unknown>): void {
    const duration = Date.now() - startTime;
    const perfWithMemory = typeof performance !== 'undefined' ? performance as PerformanceWithMemory : undefined;
    const memory = perfWithMemory?.memory ? 
      Math.round(perfWithMemory.memory.usedJSHeapSize / 1024 / 1024) : undefined;
    
    this.log('info', message, {
      ...extra,
      performance: {
        duration,
        memory
      }
    });
  }
  
  private log(level: LogEntry['level'], message: string, extra?: Record<string, unknown>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: this.sanitizeString(message),
      traceId: this.context.traceId || this.generateTraceId()
    };
    
    // Add optional properties only if they exist
    if (this.context.component) {
      logEntry.component = this.context.component;
    }
    if (this.context.action) {
      logEntry.action = this.context.action;
    }
    if (this.context.userId) {
      logEntry.userId = this.context.userId;
    }
    if (this.context.sessionId) {
      logEntry.sessionId = this.context.sessionId;
    }
    
    // Add extra properties
    if (extra) {
      Object.assign(logEntry, extra);
    }
    
    // Sanitize the entire entry
    const sanitized = this.sanitize(logEntry) as LogEntry;
    
    // Output based on environment
    if (typeof window !== 'undefined') {
      // Browser environment
      this.outputToBrowser(sanitized);
    } else {
      // Server environment
      this.outputToServer(sanitized);
    }
  }
  
  private outputToBrowser(entry: LogEntry): void {
    const style = this.getConsoleStyle(entry.level);
    
    if (entry.level === 'error') {
      console.error(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style, entry);
    } else if (entry.level === 'warn') {
      console.warn(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style, entry);
    } else if (entry.level === 'debug') {
      console.debug(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style, entry);
    } else {
      console.log(`%c[${entry.level.toUpperCase()}] ${entry.message}`, style, entry);
    }
  }
  
  private outputToServer(entry: LogEntry): void {
    // Structured JSON output for server logs
    console.log(JSON.stringify(entry));
  }
  
  private getConsoleStyle(level: LogEntry['level']): string {
    const styles = {
      debug: 'color: #6b7280; font-weight: normal;',
      info: 'color: #3b82f6; font-weight: normal;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;'
    };
    return styles[level];
  }
  
  private sanitize(entry: unknown): unknown {
    if (typeof entry === 'string') {
      return this.sanitizeString(entry);
    }
    
    if (Array.isArray(entry)) {
      return entry.map(item => this.sanitize(item));
    }
    
    if (entry && typeof entry === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(entry)) {
        // Skip sensitive fields
        if (this.isSensitiveField(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[this.sanitizeString(key)] = this.sanitize(value);
        }
      }
      return sanitized;
    }
    
    return entry;
  }
  
  private sanitizeString(str: string): string {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .slice(0, 1000); // Limit length
  }
  
  private isSensitiveField(key: string): boolean {
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'auth', 'credential',
      'email', 'phone', 'ssn', 'credit', 'card', 'account'
    ];
    
    const lowerKey = key.toLowerCase();
    return sensitiveFields.some(field => lowerKey.includes(field));
  }
  
  private generateTraceId(): string {
    // Generate a unique trace ID
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without crypto API
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

// Singleton instance
export const logger = Logger.getInstance();

// Convenience functions for common logging patterns
export const logApiRequest = (method: string, url: string, startTime: number) => {
  logger.setContext({ 
    component: 'api', 
    action: `${method.toLowerCase()}_request` 
  });
  logger.performance(`API ${method} ${url}`, startTime, { 
    method, 
    url 
  });
};

export const logUserAction = (action: string, userId?: string, metadata?: Record<string, unknown>) => {
  const context: Partial<LogContext> = { 
    component: 'user_interaction', 
    action
  };
  
  if (userId) {
    context.userId = userId;
  }
  
  logger.setContext(context);
  logger.info(`User action: ${action}`, metadata);
};

export const logError = (error: Error, component: string, action?: string) => {
  const context: Partial<LogContext> = { component };
  
  if (action) {
    context.action = action;
  }
  
  logger.setContext(context);
  logger.error(`Error in ${component}`, error);
};

export const logPerformance = (operation: string, startTime: number, component: string) => {
  logger.setContext({ component, action: 'performance_measurement' });
  logger.performance(`Performance: ${operation}`, startTime);
};

// React hook for component logging
export const useLogger = (component: string) => {
  const componentLogger = {
    debug: (message: string, extra?: Record<string, unknown>) => {
      logger.setContext({ component });
      logger.debug(message, extra);
    },
    info: (message: string, extra?: Record<string, unknown>) => {
      logger.setContext({ component });
      logger.info(message, extra);
    },
    warn: (message: string, extra?: Record<string, unknown>) => {
      logger.setContext({ component });
      logger.warn(message, extra);
    },
    error: (message: string, error?: Error, extra?: Record<string, unknown>) => {
      logger.setContext({ component });
      logger.error(message, error, extra);
    },
    performance: (message: string, startTime: number, extra?: Record<string, unknown>) => {
      logger.setContext({ component });
      logger.performance(message, startTime, extra);
    }
  };
  
  return componentLogger;
};