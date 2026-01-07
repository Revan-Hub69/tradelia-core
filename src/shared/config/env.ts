/**
 * Environment Configuration - Tradelia 2026
 * 
 * Configurazione delle variabili d'ambiente con validazione
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  
  return value || defaultValue!;
}

function getBooleanEnvVar(name: string, defaultValue = false): boolean {
  const value = process.env[name];
  
  if (!value) return defaultValue;
  
  return value.toLowerCase() === 'true';
}

export const ENV_CONFIG = {
  // App configuration
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // Supabase configuration
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
  NEXT_PUBLIC_ENABLE_SERVICE_WORKER: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_SERVICE_WORKER', true),
  
  // Development flags
  NEXT_PUBLIC_DEBUG_MODE: getBooleanEnvVar('NEXT_PUBLIC_DEBUG_MODE', false),
  ANALYZE: getBooleanEnvVar('ANALYZE', false),
  
  // Performance monitoring
  NEXT_PUBLIC_LIGHTHOUSE_CI: getBooleanEnvVar('NEXT_PUBLIC_LIGHTHOUSE_CI', false),
  
  // Security
  NEXT_PUBLIC_CSP_REPORT_URI: getEnvVar('NEXT_PUBLIC_CSP_REPORT_URI', '/api/security/csp-report'),
} as const;

// Type-safe environment configuration
export type EnvConfig = typeof ENV_CONFIG;

// Validation
export function validateEnvironment(): void {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment configuration validated');
}