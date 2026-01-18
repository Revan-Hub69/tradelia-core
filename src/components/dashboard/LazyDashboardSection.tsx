'use client';

import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  preload?: boolean;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

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
}> = ({ children, sectionId, options = {} }) => {
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
    if (preload || hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
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
        <p className="text-sm text-destructive mb-2">
          Errore nel caricamento della sezione
        </p>
        <button
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
      {isVisible ? (
        <Suspense fallback={LoadingFallback}>
          <ErrorBoundary onError={handleError}>
            {children}
          </ErrorBoundary>
        </Suspense>
      ) : (
        LoadingFallback
      )}
    </div>
  );
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

/**
 * Factory for creating lazy-loaded dashboard components
 */
export const createLazyDashboardComponent = <T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyLoadOptions = {}
) => {
  const LazyComponent = lazy(importFn);

  return React.forwardRef<HTMLDivElement, T & { sectionId: string }>((props, ref) => {
    const { sectionId, ...componentProps } = props;

    return (
      <div ref={ref}>
        <LazyDashboardSection sectionId={sectionId} options={options}>
          <LazyComponent {...(componentProps as T)} />
        </LazyDashboardSection>
      </div>
    );
  });
};

/**
 * Prebuilt lazy components for common dashboard sections
 */

// Lazy Settings Panel
export const LazySettingsPanel = createLazyDashboardComponent(
  () => import('./SettingsPanel').then(module => ({ default: module.SettingsPanel })),
  { preload: false }
);

// Lazy Premium Dashboard
export const LazyPremiumDashboard = createLazyDashboardComponent(
  () => import('./PremiumDashboard').then(module => ({ default: module.PremiumDashboard })),
  { preload: false }
);

// Lazy Gamification Panel
export const LazyGamificationPanel = createLazyDashboardComponent(
  () => import('./GamificationPanel').then(module => ({ default: module.GamificationPanel })),
  { preload: true } // Preload for better UX
);

/**
 * Hook for managing lazy loading state
 */
export const useLazyLoading = () => {
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());
  const [loadingErrors, setLoadingErrors] = useState<Map<string, Error>>(new Map());

  const markSectionLoaded = (sectionId: string) => {
    setLoadedSections(prev => new Set(prev).add(sectionId));
  };

  const markSectionError = (sectionId: string, error: Error) => {
    setLoadingErrors(prev => new Map(prev).set(sectionId, error));
  };

  const isSectionLoaded = (sectionId: string) => {
    return loadedSections.has(sectionId);
  };

  const getSectionError = (sectionId: string) => {
    return loadingErrors.get(sectionId);
  };

  const clearSectionError = (sectionId: string) => {
    setLoadingErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(sectionId);
      return newMap;
    });
  };

  return {
    loadedSections: Array.from(loadedSections),
    loadingErrors: Object.fromEntries(loadingErrors),
    markSectionLoaded,
    markSectionError,
    isSectionLoaded,
    getSectionError,
    clearSectionError,
  };
};