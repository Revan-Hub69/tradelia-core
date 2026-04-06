/**
 * ERROR BOUNDARY - Challenge Library
 * Best Practice 2026: Modern functional error boundary
 */

'use client';

import React, { useState, useEffect } from 'react';

import { EmptyState } from './EmptyState';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo?: React.ErrorInfo) => void;
};

type ErrorState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * Modern Error Boundary using React 18+ patterns
 */
export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
  });

  // Handle uncaught errors in child components
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Challenge Library Error:', error.error);
      setErrorState({ hasError: true, error: error.error });
      onError?.(error.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Challenge Library Unhandled Rejection:', event.reason);
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      setErrorState({ hasError: true, error });
      onError?.(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  // Reset error state when children change
  useEffect(() => {
    if (errorState.hasError) {
      setErrorState({ hasError: false, error: null });
    }
  }, [children]);

  if (errorState.hasError) {
    // Use custom fallback or default EmptyState
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <EmptyState type="error" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * HOC to wrap components with error boundary (modern functional approach)
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
