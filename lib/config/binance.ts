// Binance API Configuration
// Centralized configuration for all Binance API interactions

export interface BinanceConfig {
  baseUrl: string;
  timeout: number;
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  userAgent: string;
  retries: number;
}

// Default configuration for production
export const DEFAULT_BINANCE_CONFIG: BinanceConfig = {
  baseUrl: process.env.BINANCE_API_URL || "https://api.binance.com",
  timeout: parseInt(process.env.BINANCE_TIMEOUT || "10000"), // 10s
  rateLimit: {
    requests: parseInt(process.env.BINANCE_RATE_LIMIT_REQUESTS || "8"), // 8 RPS conservative
    windowMs: parseInt(process.env.BINANCE_RATE_LIMIT_WINDOW || "1000"), // 1s window
  },
  userAgent: process.env.BINANCE_USER_AGENT || "Tradelia/1.0",
  retries: parseInt(process.env.BINANCE_RETRIES || "3"),
};

// Testnet configuration (for development/testing)
export const TESTNET_BINANCE_CONFIG: BinanceConfig = {
  baseUrl: process.env.BINANCE_TESTNET_URL || "https://testnet.binance.vision",
  timeout: 15000, // Testnet can be slower
  rateLimit: {
    requests: 5, // More conservative for testnet
    windowMs: 1000,
  },
  userAgent: "Tradelia-Testnet/1.0",
  retries: 2,
};

// Get configuration based on environment
export function getBinanceConfig(): BinanceConfig {
  const env = process.env.NODE_ENV || 'production';
  const useTestnet = process.env.BINANCE_USE_TESTNET === 'true';
  
  if (env === 'development' && useTestnet) {
    console.log('🧪 Using Binance Testnet configuration');
    return TESTNET_BINANCE_CONFIG;
  }
  
  if (env === 'test') {
    // For unit tests, use mock or testnet
    return {
      ...DEFAULT_BINANCE_CONFIG,
      baseUrl: process.env.BINANCE_MOCK_URL || DEFAULT_BINANCE_CONFIG.baseUrl,
      timeout: 5000, // Faster timeout for tests
    };
  }
  
  return DEFAULT_BINANCE_CONFIG;
}

// Validate configuration
export function validateBinanceConfig(config: BinanceConfig): string[] {
  const issues: string[] = [];
  
  if (!config.baseUrl) {
    issues.push('Missing baseUrl');
  }
  
  if (!config.baseUrl.startsWith('https://')) {
    issues.push('baseUrl must use HTTPS');
  }
  
  if (config.timeout < 1000) {
    issues.push('timeout too low (minimum 1000ms)');
  }
  
  if (config.timeout > 60000) {
    issues.push('timeout too high (maximum 60000ms)');
  }
  
  if (config.rateLimit.requests < 1) {
    issues.push('rateLimit.requests too low (minimum 1)');
  }
  
  if (config.rateLimit.requests > 20) {
    issues.push('rateLimit.requests too high (maximum 20 for safety)');
  }
  
  if (config.rateLimit.windowMs < 100) {
    issues.push('rateLimit.windowMs too low (minimum 100ms)');
  }
  
  return issues;
}

// Environment variables documentation
export const BINANCE_ENV_VARS = {
  BINANCE_API_URL: {
    description: 'Binance API base URL',
    default: 'https://api.binance.com',
    example: 'https://api.binance.com',
  },
  BINANCE_TESTNET_URL: {
    description: 'Binance Testnet API base URL',
    default: 'https://testnet.binance.vision',
    example: 'https://testnet.binance.vision',
  },
  BINANCE_USE_TESTNET: {
    description: 'Use Binance Testnet in development',
    default: 'false',
    example: 'true',
  },
  BINANCE_TIMEOUT: {
    description: 'API request timeout in milliseconds',
    default: '10000',
    example: '15000',
  },
  BINANCE_RATE_LIMIT_REQUESTS: {
    description: 'Maximum requests per window',
    default: '8',
    example: '5',
  },
  BINANCE_RATE_LIMIT_WINDOW: {
    description: 'Rate limit window in milliseconds',
    default: '1000',
    example: '2000',
  },
  BINANCE_USER_AGENT: {
    description: 'User agent for API requests',
    default: 'Tradelia/1.0',
    example: 'MyApp/2.0',
  },
  BINANCE_RETRIES: {
    description: 'Number of retries for failed requests',
    default: '3',
    example: '5',
  },
  BINANCE_MOCK_URL: {
    description: 'Mock API URL for testing',
    default: '',
    example: 'http://localhost:3001/mock-binance',
  },
};

// Health check for configuration
export async function checkBinanceConfigHealth(): Promise<{
  valid: boolean;
  issues: string[];
  config: BinanceConfig;
}> {
  const config = getBinanceConfig();
  const issues = validateBinanceConfig(config);
  
  return {
    valid: issues.length === 0,
    issues,
    config,
  };
}