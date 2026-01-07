/**
 * Server Cache Types - Tradelia 2026
 */

export interface CacheConfig {
  provider: 'memory' | 'redis' | 'file';
  ttl: number;
  maxSize: number;
  keyPrefix: string;
}

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  ttl: number;
  createdAt: Date;
  accessedAt: Date;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(pattern?: string): Promise<string[]>;
}