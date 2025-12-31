// Production Configuration - Environment Management
// Professional configuration with validation and security

import { z } from 'zod';

// Configuration schema with validation
const ConfigSchema = z.object({
  // Environment
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  
  // API Configuration
  api: z.object({
    enableAuth: z.boolean().default(true),
    rateLimiting: z.object({
      enabled: z.boolean().default(true),
      strict: z.boolean().default(false),
      windowMs: z.number().default(60000),
      maxRequests: z.number().default(100),
    }),
    cors: z.object({
      enabled: z.boolean().default(true),
      origins: z.array(z.string()).default(['http://localhost:3000']),
    }),
  }),
  
  // Database Configuration
  database: z.object({
    url: z.string().url(),
    serviceRoleKey: z.string().min(1),
    connectionPool: z.object({
      min: z.number().default(2),
      max: z.number().default(20),
      idleTimeoutMs: z.number().default(30000),
      connectionTimeoutMs: z.number().default(2000),
    }),
  }),
  
  // Market Data Configuration
  marketData: z.object({
    binance: z.object({
      apiKey: z.string().optional(),
      apiSecret: z.string().optional(),
      testnet: z.boolean().default(false),
      wsUrl: z.string().url().default('wss://stream.binance.com:9443'),
    }),
    symbols: z.array(z.string()).default(['BTCUSDT', 'ETHUSDT', 'ADAUSDT']),
    timeframes: z.array(z.string()).default(['M1', 'M5', 'M15', 'H1', 'H4']),
    batchSize: z.number().default(100),
    maxReconnects: z.number().default(10),
    reconnectDelay: z.number().default(5000),
  }),
  
  // Security Configuration
  security: z.object({
    apiKeySalt: z.string().min(32),
    jwtSecret: z.string().min(32),
    encryptionKey: z.string().min(32),
    sessionTimeout: z.number().default(3600000), // 1 hour
  }),
  
  // Monitoring Configuration
  monitoring: z.object({
    enabled: z.boolean().default(true),
    metricsInterval: z.number().default(60000), // 1 minute
    healthCheckInterval: z.number().default(30000), // 30 seconds
    alerting: z.object({
      enabled: z.boolean().default(true),
      webhookUrl: z.string().url().optional(),
      emailRecipients: z.array(z.string().email()).default([]),
    }),
  }),
  
  // Performance Configuration
  performance: z.object({
    maxMemoryMB: z.number().default(512),
    gcInterval: z.number().default(300000), // 5 minutes
    caching: z.object({
      enabled: z.boolean().default(true),
      ttl: z.number().default(300000), // 5 minutes
      maxSize: z.number().default(1000),
    }),
  }),
  
  // Logging Configuration
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['json', 'text']).default('json'),
    destination: z.enum(['console', 'file', 'both']).default('console'),
    maxFileSize: z.number().default(10485760), // 10MB
    maxFiles: z.number().default(5),
  }),
});

export type ProductionConfig = z.infer<typeof ConfigSchema>;

class ConfigurationManager {
  private config: ProductionConfig | null = null;
  private validated = false;

  getConfig(): ProductionConfig {
    if (!this.config || !this.validated) {
      this.loadAndValidateConfig();
    }
    return this.config!;
  }

  private loadAndValidateConfig(): void {
    try {
      const rawConfig = {
        nodeEnv: process.env.NODE_ENV || 'development',
        
        api: {
          enableAuth: process.env.API_ENABLE_AUTH !== 'false',
          rateLimiting: {
            enabled: process.env.RATE_LIMITING_ENABLED !== 'false',
            strict: process.env.RATE_LIMITING_STRICT === 'true',
            windowMs: parseInt(process.env.RATE_LIMITING_WINDOW_MS || '60000'),
            maxRequests: parseInt(process.env.RATE_LIMITING_MAX_REQUESTS || '100'),
          },
          cors: {
            enabled: process.env.CORS_ENABLED !== 'false',
            origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
          },
        },
        
        database: {
          url: process.env.SUPABASE_URL || '',
          serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
          connectionPool: {
            min: parseInt(process.env.DB_POOL_MIN || '2'),
            max: parseInt(process.env.DB_POOL_MAX || '20'),
            idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000'),
            connectionTimeoutMs: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000'),
          },
        },
        
        marketData: {
          binance: {
            apiKey: process.env.BINANCE_API_KEY,
            apiSecret: process.env.BINANCE_API_SECRET,
            testnet: process.env.BINANCE_TESTNET === 'true',
            wsUrl: process.env.BINANCE_WS_URL || 'wss://stream.binance.com:9443',
          },
          symbols: process.env.MARKET_DATA_SYMBOLS?.split(',') || ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
          timeframes: process.env.MARKET_DATA_TIMEFRAMES?.split(',') || ['M1', 'M5', 'M15', 'H1', 'H4'],
          batchSize: parseInt(process.env.MARKET_DATA_BATCH_SIZE || '100'),
          maxReconnects: parseInt(process.env.MARKET_DATA_MAX_RECONNECTS || '10'),
          reconnectDelay: parseInt(process.env.MARKET_DATA_RECONNECT_DELAY || '5000'),
        },
        
        security: {
          apiKeySalt: process.env.API_KEY_SALT || this.generateSecureDefault('API_KEY_SALT'),
          jwtSecret: process.env.JWT_SECRET || this.generateSecureDefault('JWT_SECRET'),
          encryptionKey: process.env.ENCRYPTION_KEY || this.generateSecureDefault('ENCRYPTION_KEY'),
          sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000'),
        },
        
        monitoring: {
          enabled: process.env.MONITORING_ENABLED !== 'false',
          metricsInterval: parseInt(process.env.METRICS_INTERVAL || '60000'),
          healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
          alerting: {
            enabled: process.env.ALERTING_ENABLED !== 'false',
            webhookUrl: process.env.ALERTING_WEBHOOK_URL,
            emailRecipients: process.env.ALERTING_EMAIL_RECIPIENTS?.split(',') || [],
          },
        },
        
        performance: {
          maxMemoryMB: parseInt(process.env.MAX_MEMORY_MB || '512'),
          gcInterval: parseInt(process.env.GC_INTERVAL || '300000'),
          caching: {
            enabled: process.env.CACHING_ENABLED !== 'false',
            ttl: parseInt(process.env.CACHE_TTL || '300000'),
            maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000'),
          },
        },
        
        logging: {
          level: (process.env.LOG_LEVEL as any) || 'info',
          format: (process.env.LOG_FORMAT as any) || 'json',
          destination: (process.env.LOG_DESTINATION as any) || 'console',
          maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '10485760'),
          maxFiles: parseInt(process.env.LOG_MAX_FILES || '5'),
        },
      };

      // Validate configuration
      this.config = ConfigSchema.parse(rawConfig);
      this.validated = true;

      // Log configuration status
      console.log('Configuration loaded and validated successfully');
      
      if (this.config.nodeEnv === 'production') {
        this.validateProductionRequirements();
      }

    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw new Error(`Invalid configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateProductionRequirements(): void {
    const config = this.config!;
    const errors: string[] = [];

    // Check required production settings
    if (!config.database.url.startsWith('https://')) {
      errors.push('Database URL must use HTTPS in production');
    }

    if (config.security.apiKeySalt.includes('default')) {
      errors.push('API_KEY_SALT must be set to a secure value in production');
    }

    if (config.security.jwtSecret.includes('default')) {
      errors.push('JWT_SECRET must be set to a secure value in production');
    }

    if (config.security.encryptionKey.includes('default')) {
      errors.push('ENCRYPTION_KEY must be set to a secure value in production');
    }

    if (!config.api.enableAuth) {
      errors.push('API authentication must be enabled in production');
    }

    if (!config.api.rateLimiting.enabled) {
      errors.push('Rate limiting must be enabled in production');
    }

    if (config.marketData.binance.testnet) {
      console.warn('WARNING: Using Binance testnet in production environment');
    }

    if (errors.length > 0) {
      throw new Error(`Production configuration errors:\n${errors.join('\n')}`);
    }
  }

  private generateSecureDefault(name: string): string {
    console.warn(`WARNING: Using default value for ${name}. Set environment variable for production.`);
    return `default-${name.toLowerCase()}-${Date.now()}`;
  }

  // Reload configuration (useful for runtime updates)
  reload(): void {
    this.config = null;
    this.validated = false;
    this.loadAndValidateConfig();
  }

  // Get specific configuration sections
  getApiConfig() {
    return this.getConfig().api;
  }

  getDatabaseConfig() {
    return this.getConfig().database;
  }

  getMarketDataConfig() {
    return this.getConfig().marketData;
  }

  getSecurityConfig() {
    return this.getConfig().security;
  }

  getMonitoringConfig() {
    return this.getConfig().monitoring;
  }

  getPerformanceConfig() {
    return this.getConfig().performance;
  }

  getLoggingConfig() {
    return this.getConfig().logging;
  }

  // Check if running in production
  isProduction(): boolean {
    return this.getConfig().nodeEnv === 'production';
  }

  isDevelopment(): boolean {
    return this.getConfig().nodeEnv === 'development';
  }

  isTest(): boolean {
    return this.getConfig().nodeEnv === 'test';
  }
}

// Singleton instance
export const config = new ConfigurationManager();

// Convenience exports
export const {
  getConfig,
  getApiConfig,
  getDatabaseConfig,
  getMarketDataConfig,
  getSecurityConfig,
  getMonitoringConfig,
  getPerformanceConfig,
  getLoggingConfig,
  isProduction,
  isDevelopment,
  isTest,
} = config;