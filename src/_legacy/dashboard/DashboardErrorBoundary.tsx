'use client';

/// <reference path="../types/browser.d.ts" />

import { AlertTriangle, Bug, Home, RefreshCw } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import React, { Component } from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
};

/**
 * DashboardErrorBoundary - Error boundary for graceful failure handling
 *
 * Features:
 * - Graceful error handling with fallback UI
 * - Retry functionality with exponential backoff
 * - Error reporting and logging
 * - User-friendly error messages
 * - Glassmorphism design consistency
 */
export class DashboardErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);

    // Report error to external service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to analytics/monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;

    if (retryCount >= maxRetries) {
      return;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = 2 ** retryCount * 1000;

    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, retryCount } = this.state;
      const maxRetries = 3;
      const canRetry = retryCount < maxRetries;

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-lg border border-white/20 bg-white/40 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            {/* Error Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-semibold">Oops! Qualcosa è andato storto</h2>
              <p className="text-sm text-muted-foreground">
                Si è verificato un errore inaspettato. Non preoccuparti, i tuoi progressi sono al sicuro.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-950">
                <div className="mb-2 flex items-center gap-2">
                  <Bug className="size-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Dettagli Errore (Dev)
                  </span>
                </div>
                <pre className="overflow-x-auto text-xs text-red-700 dark:text-red-300">
                  {error.toString()}
                </pre>
              </div>
            )}

            {/* Retry Information */}
            {retryCount > 0 && (
              <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Tentativo
                  {' '}
                  {retryCount}
                  {' '}
                  di
                  {' '}
                  {maxRetries}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="mr-2 size-4" />
                  Riprova
                </Button>
              )}

              <Button
                onClick={this.handleReload}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="mr-2 size-4" />
                Ricarica Pagina
              </Button>

              <Button
                onClick={this.handleGoHome}
                className="w-full"
                variant="ghost"
              >
                <Home className="mr-2 size-4" />
                Torna alla Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Se il problema persiste, contatta il supporto tecnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components
 */
export const useDashboardErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Dashboard error:', error, errorInfo);

    // Report to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }, []);

  return { handleError };
};
