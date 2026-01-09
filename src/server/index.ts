/**
 * Server Layer - Tradelia 2026
 * 
 * Logica server-side che gestisce API, database e servizi esterni.
 * Non deve importare codice client-side o traduzioni.
 */

// API handlers
// export { authHandler } from './api/auth/handler';
// export { cardsHandler } from './api/cards/handler';
// export { userHandler } from './api/user/handler';

// Database services
// export { DatabaseService } from './database/DatabaseService';
// export { CacheService } from './cache/CacheService';

// External services
// export { SupabaseService } from './external/supabase/SupabaseService';
// export { EmailService } from './external/email/EmailService';

// Type exports
export type { ApiHandler, ApiResponse, ApiError } from './api/types';
export type { DatabaseConfig, QueryResult, DatabaseConnection } from './database/types';
export type { CacheConfig, CacheEntry, CacheService } from './cache/types';
export type { ExternalServiceConfig, ServiceResponse, EmailConfig } from './external/types';