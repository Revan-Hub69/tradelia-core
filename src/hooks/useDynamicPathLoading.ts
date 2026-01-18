'use client';

/**
 * Simplified hook for dynamic path loading - avoiding build complexity
 */
export const useDynamicPathLoading = () => {
  return {
    loadingState: {
      isLoading: false,
      error: null,
      loadedPaths: [],
      pathCache: new Map(),
      lessonCache: new Map(),
    },
    loadPathMetadata: async () => ({}),
    loadLessonContent: async () => ({}),
    loadMultiplePaths: async () => [],
    discoverAvailablePaths: async () => [],
    prefetchPaths: async () => {},
    getCachedPath: () => null,
    getCachedLesson: () => null,
    clearCache: () => {},
    validatePathCompatibility: async () => true,
    isLoading: false,
    error: null,
    loadedPaths: [],
  };
};