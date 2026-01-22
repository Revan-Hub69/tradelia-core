'use client';

import { Loader2 } from 'lucide-react';
import React, { Suspense, useEffect, useRef, useState } from 'react';

type LazyLoadOptions = {
  threshold?: number;
  rootMargin?: string;
  preload?: boolean;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Error boundary for lazy loaded components
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle error display
    }

    return this.props.children;
  }
}

const defaultOptions: LazyLoadOptions = {
  threshold: 0.1,
  rootMargin: '50px',
  preload: false,
};

/**
 * LazyDashboardSection - Lazy loading wrapper for dashboard components
 *
 * Features:
 * - Intersection Observer for viewport-based loading
 * - Preloading support for critical components
 * - Error boundaries for failed loads
 * - Performance monitoring
 * - Bundle size optimization
 */
export const LazyDashboardSection: React.FC<{
  children: React.ReactNode;
  sectionId: string;
  options?: LazyLoadOptions;
}> = ({ children, sectionId, options = defaultOptions }) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    preload = false,
    fallback,
    onLoad,
    onError,
  } = options;

  const [isVisible, setIsVisible] = useState(preload);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (preload || hasLoaded) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, preload, hasLoaded]);

  // Handle load completion
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
      onLoad?.();
    }
  }, [isVisible, hasLoaded, onLoad]);

  // Error handling
  const handleError = (error: Error) => {
    setError(error);
    onError?.(error);
  };

  // Loading fallback
  const LoadingFallback = fallback || (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Caricamento...</span>
      </div>
    </div>
  );

  // Error fallback
  const ErrorFallback = (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <p className="mb-2 text-sm text-destructive">
          Errore nel caricamento della sezione
        </p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setIsVisible(true);
          }}
          className="text-xs text-primary hover:underline"
        >
          Riprova
        </button>
      </div>
    </div>
  );

  if (error) {
    return <div ref={elementRef}>{ErrorFallback}</div>;
  }

  return (
    <div ref={elementRef} data-section={sectionId}>
      {isVisible
        ? (
            <Suspense fallback={LoadingFallback}>
              <ErrorBoundary onError={handleError}>
                {children}
              </ErrorBoundary>
            </Suspense>
          )
        : (
            LoadingFallback
          )}
    </div>
  );
};

/**
 * Simplified hook for managing lazy loading state
 */
export const useLazyLoading = () => {
  return {
    loadedSections: [],
    loadingErrors: {},
    markSectionLoaded: () => {},
    markSectionError: () => {},
    isSectionLoaded: () => true,
    getSectionError: () => undefined,
    clearSectionError: () => {},
  };
};
