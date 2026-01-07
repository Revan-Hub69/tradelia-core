/**
 * Monitoring & Metrics System - Tradelia Dashboard
 * Implements error budgets, SLIs, and performance monitoring
 */

import { logger } from './logger';

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
  unit?: 'count' | 'duration' | 'percentage' | 'bytes';
}

export interface ErrorBudget {
  name: string;
  target: number; // Target reliability (e.g., 99.9%)
  window: number; // Time window in milliseconds
  current: number; // Current reliability
  remaining: number; // Remaining error budget (0-1)
  status: 'healthy' | 'warning' | 'critical';
}

export interface SLI {
  name: string;
  description: string;
  target: number;
  current: number;
  measurements: Array<{
    timestamp: number;
    value: number;
    success: boolean;
  }>;
}

class MonitoringSystem {
  private metrics: Map<string, Metric[]> = new Map();
  private errorBudgets: Map<string, ErrorBudget> = new Map();
  private slis: Map<string, SLI> = new Map();
  private static instance: MonitoringSystem;
  
  constructor() {
    this.initializeErrorBudgets();
    this.initializeSLIs();
    
    // Cleanup old metrics every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }
  
  private initializeErrorBudgets(): void {
    // API Availability - 99.9% uptime (43.2 minutes downtime per month)
    this.errorBudgets.set('api_availability', {
      name: 'API Availability',
      target: 99.9,
      window: 30 * 24 * 60 * 60 * 1000, // 30 days
      current: 100,
      remaining: 1,
      status: 'healthy'
    });
    
    // Page Load Performance - 95% of pages load under 2s
    this.errorBudgets.set('page_performance', {
      name: 'Page Load Performance',
      target: 95,
      window: 24 * 60 * 60 * 1000, // 24 hours
      current: 100,
      remaining: 1,
      status: 'healthy'
    });
    
    // Data Freshness - 99% of freshness-critical data served fresh
    this.errorBudgets.set('data_freshness', {
      name: 'Data Freshness',
      target: 99,
      window: 60 * 60 * 1000, // 1 hour
      current: 100,
      remaining: 1,
      status: 'healthy'
    });
  }
  
  private initializeSLIs(): void {
    this.slis.set('api_success_rate', {
      name: 'API Success Rate',
      description: 'Percentage of API requests that return 2xx status codes',
      target: 99.9,
      current: 100,
      measurements: []
    });
    
    this.slis.set('page_load_time', {
      name: 'Page Load Time',
      description: 'Time from navigation start to page fully loaded',
      target: 2000, // 2 seconds
      current: 0,
      measurements: []
    });
    
    this.slis.set('data_freshness_compliance', {
      name: 'Data Freshness Compliance',
      description: 'Percentage of freshness-critical data served within TTL',
      target: 99,
      current: 100,
      measurements: []
    });
  }
  
  recordMetric(name: string, value: number, labels?: Record<string, string>, unit?: Metric['unit']): void {
    const metric: Metric = {
      name,
      value,
      timestamp: Date.now()
    };
    
    if (labels) {
      metric.labels = labels;
    }
    
    if (unit) {
      metric.unit = unit;
    }
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(metric);
    
    // Log significant metrics
    if (this.isSignificantMetric(name, value)) {
      logger.info(`Metric recorded: ${name}`, { value, labels, unit });
    }
    
    // Update related SLIs and error budgets
    this.updateSLIs(name, value);
    this.updateErrorBudgets();
  }
  
  private isSignificantMetric(name: string, value: number): boolean {
    // Log errors, slow operations, and important business metrics
    return name.includes('error') || 
           name.includes('slow') || 
           (name.includes('duration') && value > 1000) ||
           name.includes('user_action');
  }
  
  private updateSLIs(metricName: string, value: number): void {
    const now = Date.now();
    
    // Update API success rate
    if (metricName === 'api_request') {
      const sli = this.slis.get('api_success_rate')!;
      const success = value >= 200 && value < 300;
      
      sli.measurements.push({
        timestamp: now,
        value,
        success
      });
      
      // Calculate current success rate (last 100 measurements)
      const recentMeasurements = sli.measurements.slice(-100);
      const successCount = recentMeasurements.filter(m => m.success).length;
      sli.current = (successCount / recentMeasurements.length) * 100;
    }
    
    // Update page load time
    if (metricName === 'page_load_duration') {
      const sli = this.slis.get('page_load_time')!;
      const success = value <= sli.target;
      
      sli.measurements.push({
        timestamp: now,
        value,
        success
      });
      
      // Calculate current average (last 50 measurements)
      const recentMeasurements = sli.measurements.slice(-50);
      sli.current = recentMeasurements.reduce((sum, m) => sum + m.value, 0) / recentMeasurements.length;
    }
    
    // Update data freshness compliance
    if (metricName === 'data_freshness_violation') {
      const sli = this.slis.get('data_freshness_compliance')!;
      
      sli.measurements.push({
        timestamp: now,
        value: 0, // Violation
        success: false
      });
      
      // Calculate compliance rate (last 100 measurements)
      const recentMeasurements = sli.measurements.slice(-100);
      const complianceCount = recentMeasurements.filter(m => m.success).length;
      sli.current = (complianceCount / recentMeasurements.length) * 100;
    }
  }
  
  private updateErrorBudgets(): void {
    const now = Date.now();
    
    for (const [name, budget] of this.errorBudgets.entries()) {
      let sliName = '';
      
      switch (name) {
        case 'api_availability':
          sliName = 'api_success_rate';
          break;
        case 'page_performance':
          sliName = 'page_load_time';
          break;
        case 'data_freshness':
          sliName = 'data_freshness_compliance';
          break;
      }
      
      const sli = this.slis.get(sliName);
      if (!sli) continue;
      
      // Filter measurements within the budget window
      const windowStart = now - budget.window;
      const windowMeasurements = sli.measurements.filter(m => m.timestamp >= windowStart);
      
      if (windowMeasurements.length === 0) continue;
      
      // Calculate current reliability
      if (name === 'page_performance') {
        // For performance, calculate percentage under target
        const underTarget = windowMeasurements.filter(m => m.success).length;
        budget.current = (underTarget / windowMeasurements.length) * 100;
      } else {
        // For availability and freshness, use SLI current value
        budget.current = sli.current;
      }
      
      // Calculate remaining error budget
      const errorRate = 100 - budget.current;
      const allowedErrorRate = 100 - budget.target;
      budget.remaining = Math.max(0, (allowedErrorRate - errorRate) / allowedErrorRate);
      
      // Update status
      if (budget.remaining > 0.5) {
        budget.status = 'healthy';
      } else if (budget.remaining > 0.1) {
        budget.status = 'warning';
      } else {
        budget.status = 'critical';
      }
      
      // Log budget status changes
      if (budget.status !== 'healthy') {
        logger.warn(`Error budget ${name} status: ${budget.status}`, {
          current: budget.current,
          target: budget.target,
          remaining: budget.remaining
        });
      }
    }
  }
  
  getMetrics(name?: string, since?: number): Metric[] {
    if (name) {
      const metrics = this.metrics.get(name) || [];
      return since ? metrics.filter(m => m.timestamp >= since) : metrics;
    }
    
    // Return all metrics
    const allMetrics: Metric[] = [];
    for (const metrics of this.metrics.values()) {
      allMetrics.push(...metrics);
    }
    
    return since ? allMetrics.filter(m => m.timestamp >= since) : allMetrics;
  }
  
  getErrorBudgets(): ErrorBudget[] {
    return Array.from(this.errorBudgets.values());
  }
  
  getSLIs(): SLI[] {
    return Array.from(this.slis.values());
  }
  
  getHealthStatus(): 'healthy' | 'warning' | 'critical' {
    const budgets = this.getErrorBudgets();
    
    if (budgets.some(b => b.status === 'critical')) {
      return 'critical';
    }
    
    if (budgets.some(b => b.status === 'warning')) {
      return 'warning';
    }
    
    return 'healthy';
  }
  
  private cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Clean up old metrics (keep last hour)
    for (const [name, metrics] of this.metrics.entries()) {
      const recentMetrics = metrics.filter(m => m.timestamp >= oneHourAgo);
      this.metrics.set(name, recentMetrics);
    }
    
    // Clean up old SLI measurements
    for (const sli of this.slis.values()) {
      sli.measurements = sli.measurements.filter(m => m.timestamp >= oneHourAgo);
    }
    
    logger.debug('Monitoring data cleanup completed');
  }
}

// Singleton instance
export const monitoring = MonitoringSystem.getInstance();

// Convenience functions for common monitoring patterns
export const recordApiRequest = (method: string, url: string, statusCode: number, duration: number) => {
  monitoring.recordMetric('api_request', statusCode, { method, url }, 'count');
  monitoring.recordMetric('api_duration', duration, { method, url }, 'duration');
  
  if (statusCode >= 400) {
    monitoring.recordMetric('api_error', 1, { method, url, status: statusCode.toString() }, 'count');
  }
};

export const recordPageLoad = (page: string, duration: number) => {
  monitoring.recordMetric('page_load_duration', duration, { page }, 'duration');
  
  if (duration > 3000) {
    monitoring.recordMetric('slow_page_load', 1, { page }, 'count');
  }
};

export const recordUserAction = (action: string, userId?: string) => {
  const labels: Record<string, string> = { action };
  if (userId) {
    labels.userId = userId;
  }
  monitoring.recordMetric('user_action', 1, labels, 'count');
};

export const recordDataFreshnessViolation = (category: string, age: number) => {
  monitoring.recordMetric('data_freshness_violation', age, { category }, 'duration');
};

export const recordError = (component: string, errorType: string) => {
  monitoring.recordMetric('error', 1, { component, type: errorType }, 'count');
};

// Performance measurement utility
export const measurePerformance = <T>(
  operation: string, 
  fn: () => T | Promise<T>,
  labels?: Record<string, string>
): T | Promise<T> => {
  const startTime = Date.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(
        (value) => {
          monitoring.recordMetric('operation_duration', Date.now() - startTime, 
            { operation, status: 'success', ...labels }, 'duration');
          return value;
        },
        (error) => {
          monitoring.recordMetric('operation_duration', Date.now() - startTime, 
            { operation, status: 'error', ...labels }, 'duration');
          monitoring.recordMetric('operation_error', 1, 
            { operation, ...labels }, 'count');
          throw error;
        }
      );
    } else {
      monitoring.recordMetric('operation_duration', Date.now() - startTime, 
        { operation, status: 'success', ...labels }, 'duration');
      return result;
    }
  } catch (error) {
    monitoring.recordMetric('operation_duration', Date.now() - startTime, 
      { operation, status: 'error', ...labels }, 'duration');
    monitoring.recordMetric('operation_error', 1, 
      { operation, ...labels }, 'count');
    throw error;
  }
};