/**
 * Shared Library Types - Tradelia 2026
 */

export interface FormatterOptions {
  locale?: string;
  currency?: string;
  precision?: number;
}

export interface PerformanceMetrics {
  duration: number;
  timestamp: number;
  operation: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}