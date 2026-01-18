'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LearningPath, Lesson } from '@/components/dashboard/types';

interface PathLoadingState {
  isLoading: boolean;
  error: Error | null;
  loadedPaths: string[];
  pathCache: Map<string, LearningPath>;
  lessonCache: Map<string, Lesson>;
}

interface DynamicPathConfig {
  baseUrl?: string;
  cacheTimeout?: number;
  preloadCount?: number;
  enablePrefetch?: boolean;
}

/**
 * Hook for dynamic learning path loading and management
 * 
 * Features:
 * - Dynamic path loading without breaking changes
 * - Intelligent caching and prefetching
 * - Lazy loading for performance
 * - Scalable architecture for new paths
 * - Version compatibility handling
 */
export const useDynamicPathLoading = (config: DynamicPathConfig = {}) => {
  const {
    baseUrl = '/api/learning-paths',
    cacheTimeout = 3600000, // 1 hour
    preloadCount = 3,
    enablePrefetch = true,
  } = config;

  const [loadingState, setLoadingState] = useState<PathLoadingState>({
    isLoading: false,
    error: null,
    loadedPaths: [],
    pathCache: new Map(),
    lessonCache: new Map(),
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load path metadata
  const loadPathMetadata = useCallback(async (pathId: string): Promise<LearningPath> => {
    // Check cache first
    const cached = loadingState.pathCache.get(pathId);
    if (cached) {
      const cacheAge = Date.now() - (cached as any).cacheTimestamp;
      if (cacheAge < cacheTimeout) {
        return cached;
      }
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${baseUrl}/${pathId}/metadata`, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load path ${pathId}: ${response.statusText}`);
      }

      const pathData: LearningPath = await response.json();
      
      // Add cache timestamp
      const cachedPath = {
        ...pathData,
        cacheTimestamp: Date.now(),
      };

      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        pathCache: new Map(prev.pathCache).set(pathId, cachedPath),
        loadedPaths: [...prev.loadedPaths.filter(id => id !== pathId), pathId],
      }));

      return pathData;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return cached || {} as LearningPath; // Return cached if available
      }

      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));

      throw error;
    }
  }, [baseUrl, cacheTimeout, loadingState.pathCache]);

  // Load lesson content dynamically
  const loadLessonContent = useCallback(async (lessonId: string): Promise<Lesson> => {
    // Check cache first
    const cached = loadingState.lessonCache.get(lessonId);
    if (cached) {
      const cacheAge = Date.now() - (cached as any).cacheTimestamp;
      if (cacheAge < cacheTimeout) {
        return cached;
      }
    }

    try {
      const response = await fetch(`${baseUrl}/lessons/${lessonId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load lesson ${lessonId}: ${response.statusText}`);
      }

      const lessonData: Lesson = await response.json();
      
      // Add cache timestamp
      const cachedLesson = {
        ...lessonData,
        cacheTimestamp: Date.now(),
      };

      setLoadingState(prev => ({
        ...prev,
        lessonCache: new Map(prev.lessonCache).set(lessonId, cachedLesson),
      }));

      return lessonData;
    } catch (error) {
      console.error(`Failed to load lesson ${lessonId}:`, error);
      throw error;
    }
  }, [baseUrl, cacheTimeout, loadingState.lessonCache]);

  // Discover available paths
  const discoverAvailablePaths = useCallback(async (): Promise<string[]> => {
    try {
      const response = await fetch(`${baseUrl}/discover`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to discover paths: ${response.statusText}`);
      }

      const { paths } = await response.json();
      return paths;
    } catch (error) {
      console.error('Failed to discover available paths:', error);
      return [];
    }
  }, [baseUrl]);

  // Prefetch paths for better performance
  const prefetchPaths = useCallback(async (pathIds: string[]) => {
    if (!enablePrefetch) return;

    const pathsToLoad = pathIds
      .filter(id => !loadingState.pathCache.has(id))
      .slice(0, preloadCount);

    const prefetchPromises = pathsToLoad.map(async (pathId) => {
      try {
        await loadPathMetadata(pathId);
      } catch (error) {
        console.warn(`Failed to prefetch path ${pathId}:`, error);
      }
    });

    await Promise.allSettled(prefetchPromises);
  }, [enablePrefetch, preloadCount, loadingState.pathCache, loadPathMetadata]);

  // Load multiple paths efficiently
  const loadMultiplePaths = useCallback(async (pathIds: string[]): Promise<LearningPath[]> => {
    const loadPromises = pathIds.map(pathId => loadPathMetadata(pathId));
    const results = await Promise.allSettled(loadPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<LearningPath> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }, [loadPathMetadata]);

  // Get cached path without loading
  const getCachedPath = useCallback((pathId: string): LearningPath | null => {
    return loadingState.pathCache.get(pathId) || null;
  }, [loadingState.pathCache]);

  // Get cached lesson without loading
  const getCachedLesson = useCallback((lessonId: string): Lesson | null => {
    return loadingState.lessonCache.get(lessonId) || null;
  }, [loadingState.lessonCache]);

  // Clear cache
  const clearCache = useCallback((type?: 'paths' | 'lessons') => {
    setLoadingState(prev => ({
      ...prev,
      pathCache: type === 'lessons' ? prev.pathCache : new Map(),
      lessonCache: type === 'paths' ? prev.lessonCache : new Map(),
      loadedPaths: type === 'lessons' ? prev.loadedPaths : [],
    }));
  }, []);

  // Validate path compatibility
  const validatePathCompatibility = useCallback(async (pathId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/${pathId}/compatibility`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const { compatible } = await response.json();
      return compatible;
    } catch (error) {
      console.warn(`Failed to validate compatibility for path ${pathId}:`, error);
      return true; // Assume compatible if check fails
    }
  }, [baseUrl]);

  // Auto-discovery and prefetching on mount
  useEffect(() => {
    const initializePaths = async () => {
      try {
        const availablePaths = await discoverAvailablePaths();
        if (availablePaths.length > 0) {
          await prefetchPaths(availablePaths);
        }
      } catch (error) {
        console.error('Failed to initialize paths:', error);
      }
    };

    initializePaths();
  }, [discoverAvailablePaths, prefetchPaths]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    loadingState,
    loadPathMetadata,
    loadLessonContent,
    loadMultiplePaths,
    discoverAvailablePaths,
    prefetchPaths,
    getCachedPath,
    getCachedLesson,
    clearCache,
    validatePathCompatibility,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    loadedPaths: loadingState.loadedPaths,
  };
};