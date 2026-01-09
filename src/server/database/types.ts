/**
 * Server Database Types - Tradelia 2026
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolSize: number;
}

export interface QueryResult<T = unknown> {
  data: T[];
  count: number;
  error?: string;
}

export interface DatabaseConnection {
  query<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(callback: (tx: DatabaseConnection) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}