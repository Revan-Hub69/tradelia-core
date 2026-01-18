'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface NetworkState {
  isOnline: boolean;
  isConnecting: boolean;
  lastError: Error | null;
  retryCount: number;
  hasNetworkError: boolean;
}

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface CachedData {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number;
  };
}

/**
 * Hook for handling network errors with cached data fallback
 * 
 * Features:
 * - Network status monitoring
 * - Automatic retry with exponential backoff
 * - Cached data fallback during network failures
 * - Offline mode support
 * - Error recovery strategies
 */
export const useNetworkErrorHandling = (options: RetryOptions = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
  } = options;

  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isConnecting: false,
    lastError: null,
    retryCount: 0,
    hasNetworkError: false,
  });

  const cacheRef = useRef<CachedData>({});
  const retryTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: true,
        hasNetworkError: false,
        retryCount: 0,
      }));
    };

    const handleOffline = () => {
      setNetworkState(prev => ({
        ...prev,
        isOnline: false,
        hasNetworkError: true,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clear pending timeouts
      retryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Cache management
  const setCache = useCallback((key: string, data: any, ttl: number = 300000) => {
    cacheRef.current[key] = {
      data,
      timestamp: Date.now(),
      ttl,
    };
  }, []);

  const getCache = useCallback((key: string) => {
    const cached = cacheRef.current[key];
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      delete cacheRef.current[key];
      return null;
    }

    return cached.data;
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      delete cacheRef.current[key];
    } else {
      cacheRef.current = {};
    }
  }, []);

  // Network request with retry and caching
  const networkRequest = useCallback(async <T>(
    requestFn: () => Promise<T>,
    cacheKey?: string,
    options: {
      useCache?: boolean;
      cacheTTL?: number;
      retryOnFailure?: boolean;
    } = {}
  ): Promise<T> => {
    const {
      useCache = true,
      cacheTTL = 300000, // 5 minutes
      retryOnFailure = true,
    } = options;

    // Try cache first if available and requested
    if (useCache && cacheKey) {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // If offline, return cached data or throw error
    if (!networkState.isOnline) {
      if (useCache && cacheKey) {
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }
      throw new Error('No network connection and no cached data available');
    }

    const executeRequest = async (attempt: number = 0): Promise<T> => {
      try {
        setNetworkState(prev => ({ ...prev, isConnecting: true }));
        
        const result = await requestFn();
        
        // Cache successful result
        if (useCache && cacheKey) {
          setCache(cacheKey, result, cacheTTL);
        }

        // Reset error state on success
        setNetworkState(prev => ({
          ...prev,
          isConnecting: false,
          hasNetworkError: false,
          lastError: null,
          retryCount: 0,
        }));

        return result;
      } catch (error) {
        const networkError = error as Error;
        
        setNetworkState(prev => ({
          ...prev,
          isConnecting: false,
          hasNetworkError: true,
          lastError: networkError,
          retryCount: attempt + 1,
        }));

        // Check if we should retry
        if (retryOnFailure && attempt < maxRetries) {
          // Calculate delay with exponential backoff
          const delay = Math.min(
            baseDelay * Math.pow(backoffFactor, attempt),
            maxDelay
          );

          return new Promise((resolve, reject) => {
            const timeout = setTimeout(async () => {
              try {
                const result = await executeRequest(attempt + 1);
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            }, delay);

            retryTimeoutsRef.current.push(timeout);
          });
        }

        // If we can't retry, try to return cached data
        if (useCache && cacheKey) {
          const cachedData = getCache(cacheKey);
          if (cachedData) {
            console.warn('Network request failed, returning cached data:', networkError);
            return cachedData;
          }
        }

        throw networkError;
      }
    };

    return executeRequest();
  }, [networkState.isOnline, getCache, setCache, maxRetries, baseDelay, maxDelay, backoffFactor]);

  // Retry failed requests
  const retryLastRequest = useCallback(() => {
    setNetworkState(prev => ({
      ...prev,
      retryCount: 0,
      hasNetworkError: false,
      lastError: null,
    }));
  }, []);

  // Get network status message
  const getNetworkStatusMessage = useCallback(() => {
    if (!networkState.isOnline) {
      return 'Nessuna connessione internet. Modalità offline attiva.';
    }
    
    if (networkState.isConnecting) {
      return 'Connessione in corso...';
    }
    
    if (networkState.hasNetworkError && networkState.lastError) {
      if (networkState.retryCount > 0) {
        return `Errore di rete (tentativo ${networkState.retryCount}/${maxRetries}). Riprovo...`;
      }
      return 'Errore di connessione. Verifica la tua connessione internet.';
    }
    
    return null;
  }, [networkState, maxRetries]);

  // Check if we can use cached data
  const hasCachedData = useCallback((key: string) => {
    return getCache(key) !== null;
  }, [getCache]);

  return {
    networkState,
    networkRequest,
    retryLastRequest,
    getNetworkStatusMessage,
    hasCachedData,
    setCache,
    getCache,
    clearCache,
    isOnline: networkState.isOnline,
    isConnecting: networkState.isConnecting,
    hasNetworkError: networkState.hasNetworkError,
    canRetry: networkState.retryCount < maxRetries,
  };
};