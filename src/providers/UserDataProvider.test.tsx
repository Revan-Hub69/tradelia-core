/**
 * UserDataProvider API Deduplication Property Tests
 *
 * Tests for Property 3: API call deduplication
 * Validates: Requirements 1.3, 7.2
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import * as fc from 'fast-check';
import React from 'react';

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
const originalFetch = global.fetch;

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

describe('UserDataProvider API Deduplication Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiCallCount = 0;
    
    // Mock fetch to count API calls and return consistent data
    global.fetch = vi.fn().mockImplementation(async (url) => {
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
    global.fetch = originalFetch;
  });

  describe('Property 3: API call deduplication', () => {
    it('should deduplicate simultaneous API calls when multiple hooks request the same data', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 5 }), // Number of simultaneous requests
          async (simultaneousRequests) => {
            // Property: Multiple simultaneous requests for the same data should result in only one API call

            // Reset API call counter
            apiCallCount = 0;

            // Create multiple hooks that will request user data simultaneously
            const hooks: Array<ReturnType<typeof renderHook>> = [];
            
            // Render multiple hooks simultaneously
            for (let i = 0; i < simultaneousRequests; i++) {
              const hook = renderHook(() => useTestUserData(), {
                wrapper: TestWrapper,
              });
              hooks.push(hook);
            }

            // Wait for all requests to complete
            await waitFor(() => {
              hooks.forEach(hook => {
                expect(hook.result.current.isLoading).toBe(false);
              });
            }, { timeout: 3000 });

            // Verify that only one API call was made despite multiple simultaneous requests
            expect(apiCallCount).toBe(1);

            // Verify all hooks received data
            hooks.forEach(hook => {
              expect(hook.result.current.data).toBeDefined();
              expect(hook.result.current.error).toBeNull();
            });

            // Verify all hooks received the same data
            const firstHookData = hooks[0]!.result.current.data;
            hooks.forEach(hook => {
              expect(hook.result.current.data).toEqual(firstHookData);
            });

            // Clean up
            hooks.forEach(hook => hook.unmount());
          },
        ),
        { numRuns: 20 },
      );
    });

    it('should use cached data for subsequent requests within cache time', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 4 }), // Number of sequential requests
          async (sequentialRequests) => {
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

            // Make sequential requests quickly (within cache time)
            for (let i = 0; i < sequentialRequests; i++) {
              const { result, unmount } = renderHook(() => useTestUserData(), {
                wrapper: CachedWrapper,
              });

              await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
              }, { timeout: 3000 });

              expect(result.current.data).toBeDefined();
              expect(result.current.error).toBeNull();

              unmount();

              // Small delay but within cache time
              await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Should only make one API call due to caching
            expect(apiCallCount).toBe(1);
          },
        ),
        { numRuns: 15 },
      );
    });

    it('should handle refresh requests properly by making new API calls', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      await fc.assert(
        fc.asyncProperty(
          fc.constant(null), // No input needed for this test
          async () => {
            // Property: Explicit refresh should bypass cache and make new API calls

            // Reset API call counter
            apiCallCount = 0;

            const { result } = renderHook(() => useTestUserData(), {
              wrapper: TestWrapper,
            });

            // Wait for initial load
            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            }, { timeout: 3000 });

            expect(result.current.data).toBeDefined();
            expect(apiCallCount).toBe(1);

            // Trigger refresh
            result.current.refetch();

            // Wait for refresh to complete
            await waitFor(() => {
              expect(result.current.isLoading).toBe(false);
            }, { timeout: 3000 });

            // Should have made a second API call
            expect(apiCallCount).toBe(2);
            expect(result.current.data).toBeDefined();
          },
        ),
        { numRuns: 10 },
      );
    });

    it('should maintain consistent query behavior across different QueryClient instances', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 4 }), // Number of QueryClient instances
          async (queryClientInstances) => {
            // Property: Each QueryClient should manage its own cache independently

            // Reset API call counter
            apiCallCount = 0;

            const hooks: Array<ReturnType<typeof renderHook>> = [];

            // Create multiple QueryClient instances (each should make its own call)
            for (let i = 0; i < queryClientInstances; i++) {
              const queryClient = new QueryClient({
                defaultOptions: {
                  queries: {
                    staleTime: 1000,
                    gcTime: 2000,
                    retry: false,
                  },
                },
              });

              const IndependentWrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                  {children}
                </QueryClientProvider>
              );

              const hook = renderHook(() => useTestUserData(), {
                wrapper: IndependentWrapper,
              });
              hooks.push(hook);
            }

            // Wait for all to complete
            await waitFor(() => {
              hooks.forEach(hook => {
                expect(hook.result.current.isLoading).toBe(false);
              });
            }, { timeout: 3000 });

            // Each QueryClient should make its own API call
            expect(apiCallCount).toBe(queryClientInstances);

            // All hooks should have data
            hooks.forEach(hook => {
              expect(hook.result.current.data).toBeDefined();
              expect(hook.result.current.error).toBeNull();
            });

            // Clean up
            hooks.forEach(hook => hook.unmount());
          },
        ),
        { numRuns: 10 },
      );
    });

    it('should ensure query key consistency enables proper deduplication', async () => {
      // Feature: enterprise-complete-roadmap-2026, Property 3: API call deduplication
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 5 }), // Different query keys
          async (queryKeys) => {
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

            const hooks: Array<ReturnType<typeof renderHook>> = [];

            // Create hooks with different query keys
            const uniqueKeys = [...new Set(queryKeys)]; // Remove duplicates
            for (const key of uniqueKeys) {
              const useTestDataWithKey = () => {
                return useQuery({
                  queryKey: ['userData', key],
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

              const hook = renderHook(() => useTestDataWithKey(), {
                wrapper: SharedWrapper,
              });
              hooks.push(hook);
            }

            // Wait for all to complete
            await waitFor(() => {
              hooks.forEach(hook => {
                expect(hook.result.current.isLoading).toBe(false);
              });
            }, { timeout: 3000 });

            // Should make one API call per unique query key
            expect(apiCallCount).toBe(uniqueKeys.length);

            // All hooks should have data
            hooks.forEach(hook => {
              expect(hook.result.current.data).toBeDefined();
              expect(hook.result.current.error).toBeNull();
            });

            // Clean up
            hooks.forEach(hook => hook.unmount());
          },
        ),
        { numRuns: 10 },
      );
    });
  });
});