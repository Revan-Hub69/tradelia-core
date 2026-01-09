/**
 * Server External Services Types - Tradelia 2026
 */

export interface ExternalServiceConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retries: number;
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'ses';
  from: string;
  replyTo?: string;
  templates: Record<string, string>;
}