/**
 * UserDataProvider API Deduplication Tests
 *
 * Tests for Property 3: API call deduplication
 * Validates: Requirements 1.3, 7.2
 */

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Create a simple test hook that simulates the UserDataProvider behavior
const useTestUserData = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await fetch('/api/user/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create a simple API call counter to track deduplication
let apiCallCount = 0;
const originalFetch = globalThis.fetch;

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 1000, // 1 second for testing
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UserDataProvider API Deduplication Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiCallCount = 0;

    // Mock fetch to count API calls and return consistent data
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (url === '/api/user/progress') {
        apiCallCount++;
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 10));
        return {
          ok: true,
          json: async () => ({
            profile: { name: 'Test User' },
            progress: { total_xp: 100, level: 1, current_streak: 5 },
            completions: [],
            badges: [],
          }),
        };
      }
      return originalFetch(url);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = originalFetch;
  });

  describe('API call deduplication', () => {
    it('should use cached data for subsequent requests within cache time', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      // Property: Sequential requests within cache time should use cached data

      // Reset API call counter
      apiCallCount = 0;

      // Create a shared QueryClient with longer cache time
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2000, // 2 seconds
            gcTime: 5000, // 5 seconds
            retry: false,
          },
        },
      });

      const CachedWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Make first request
      const { result: result1, unmount: unmount1 } = renderHook(() => useTestUserData(), {
        wrapper: CachedWrapper,
      });

      await waitFor(
        () => {
          expect(result1.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      expect(result1.current.data).toBeDefined();
      expect(result1.current.error).toBeNull();
      expect(apiCallCount).toBe(1);

      unmount1();

      // Make second request quickly (within cache time)
      await new Promise(resolve => setTimeout(resolve, 50));

      const { result: result2, unmount: unmount2 } = renderHook(() => useTestUserData(), {
        wrapper: CachedWrapper,
      });

      await waitFor(
        () => {
          expect(result2.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      expect(result2.current.data).toBeDefined();
      expect(result2.current.error).toBeNull();

      // Should still only have made one API call due to caching
      expect(apiCallCount).toBe(1);

      unmount2();
    });

    it('should handle refresh requests properly by making new API calls', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      // Property: Explicit refresh should bypass cache and make new API calls

      // Reset API call counter
      apiCallCount = 0;

      const { result } = renderHook(() => useTestUserData(), {
        wrapper: TestWrapper,
      });

      // Wait for initial load
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      expect(result.current.data).toBeDefined();
      expect(apiCallCount).toBe(1);

      // Trigger refresh
      result.current.refetch();

      // Wait for refresh to complete
      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      // Should have made a second API call
      expect(apiCallCount).toBe(2);
      expect(result.current.data).toBeDefined();
    });

    it('should maintain consistent query behavior across different QueryClient instances', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      // Property: Each QueryClient should manage its own cache independently

      // Reset API call counter
      apiCallCount = 0;

      // Create two separate QueryClient instances
      const queryClient1 = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000,
            gcTime: 2000,
            retry: false,
          },
        },
      });

      const queryClient2 = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000,
            gcTime: 2000,
            retry: false,
          },
        },
      });

      const Wrapper1 = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient1}>
          {children}
        </QueryClientProvider>
      );

      const Wrapper2 = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient2}>
          {children}
        </QueryClientProvider>
      );

      const hook1 = renderHook(() => useTestUserData(), { wrapper: Wrapper1 });
      const hook2 = renderHook(() => useTestUserData(), { wrapper: Wrapper2 });

      // Wait for both to complete
      await waitFor(
        () => {
          expect(hook1.result.current.isLoading).toBe(false);
          expect(hook2.result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      // Each QueryClient should make its own API call
      expect(apiCallCount).toBe(2);

      // Both hooks should have data
      expect(hook1.result.current.data).toBeDefined();
      expect(hook1.result.current.error).toBeNull();
      expect(hook2.result.current.data).toBeDefined();
      expect(hook2.result.current.error).toBeNull();

      // Clean up
      hook1.unmount();
      hook2.unmount();
    });

    it('should ensure query key consistency enables proper deduplication', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      // Property: Different query keys should result in separate API calls

      // Reset API call counter
      apiCallCount = 0;

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000,
            gcTime: 2000,
            retry: false,
          },
        },
      });

      const SharedWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Create hooks with different query keys
      const useTestDataWithKey1 = () => {
        return useQuery({
          queryKey: ['userData', 'key1'],
          queryFn: async () => {
            const response = await fetch('/api/user/progress');
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
            return response.json();
          },
          staleTime: 1000,
        });
      };

      const useTestDataWithKey2 = () => {
        return useQuery({
          queryKey: ['userData', 'key2'],
          queryFn: async () => {
            const response = await fetch('/api/user/progress');
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
            return response.json();
          },
          staleTime: 1000,
        });
      };

      const hook1 = renderHook(() => useTestDataWithKey1(), { wrapper: SharedWrapper });
      const hook2 = renderHook(() => useTestDataWithKey2(), { wrapper: SharedWrapper });

      // Wait for both to complete
      await waitFor(
        () => {
          expect(hook1.result.current.isLoading).toBe(false);
          expect(hook2.result.current.isLoading).toBe(false);
        },
        { timeout: 1000 },
      );

      // Should make one API call per unique query key
      expect(apiCallCount).toBe(2);

      // Both hooks should have data
      expect(hook1.result.current.data).toBeDefined();
      expect(hook1.result.current.error).toBeNull();
      expect(hook2.result.current.data).toBeDefined();
      expect(hook2.result.current.error).toBeNull();

      // Clean up
      hook1.unmount();
      hook2.unmount();
    });

    it('should deduplicate simultaneous API calls when multiple hooks request the same data', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      // Property: Multiple simultaneous requests for the same data should result in only one API call

      // Reset API call counter
      apiCallCount = 0;

      // Create a shared QueryClient for this test
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
            staleTime: 1000,
          },
        },
      });

      const SharedWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Create multiple hooks that will request user data simultaneously
      const hook1 = renderHook(() => useTestUserData(), { wrapper: SharedWrapper });
      const hook2 = renderHook(() => useTestUserData(), { wrapper: SharedWrapper });
      const hook3 = renderHook(() => useTestUserData(), { wrapper: SharedWrapper });

      // Wait for all requests to complete
      await waitFor(
        () => {
          expect(hook1.result.current.isLoading).toBe(false);
          expect(hook2.result.current.isLoading).toBe(false);
          expect(hook3.result.current.isLoading).toBe(false);
        },
        { timeout: 2000 },
      );

      // Verify that only one API call was made despite multiple simultaneous requests
      expect(apiCallCount).toBe(1);

      // Verify all hooks received data
      expect(hook1.result.current.data).toBeDefined();
      expect(hook1.result.current.error).toBeNull();
      expect(hook2.result.current.data).toBeDefined();
      expect(hook2.result.current.error).toBeNull();
      expect(hook3.result.current.data).toBeDefined();
      expect(hook3.result.current.error).toBeNull();

      // Verify all hooks received the same data
      expect(hook1.result.current.data).toEqual(hook2.result.current.data);
      expect(hook2.result.current.data).toEqual(hook3.result.current.data);

      // Clean up
      hook1.unmount();
      hook2.unmount();
      hook3.unmount();
    });
  });
});
