/**
 * useSettings Hook
 *
 * React hook for managing user settings with:
 * - Immediate localStorage persistence
 * - Debounced database sync (500ms)
 * - Exponential backoff retry (3s, 10s, 30s + jitter, max 5 attempts)
 * - Offline support (dirty flag + localStorage)
 * - Conflict resolution (server-authoritative timestamp)
 *
 * @module hooks/useSettings
 * @version 1.0.0
 * @since 2026-01-21
 */

import { useEffect, useMemo, useRef } from 'react';

import { useSettingsStore } from '@/stores/settingsStore';
import type { SettingsPath } from '@/types/settingsPaths';

// ============================================================================
// Types
// ============================================================================

type UseSettingsReturn = {
  /**
   * Update a setting value
   *
   * Updates immediately in memory and localStorage.
   * Database sync happens automatically after 500ms debounce.
   */
  updateSetting: (path: SettingsPath, value: any) => void;

  /**
   * Force immediate database sync
   *
   * Bypasses debounce and syncs immediately.
   * Useful for critical settings or before navigation.
   */
  syncNow: () => Promise<void>;

  /**
   * Reset all settings to defaults
   */
  resetSettings: () => void;

  /**
   * Current save status
   */
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';

  /**
   * Number of retry attempts
   */
  retryCount: number;
};

// ============================================================================
// Constants
// ============================================================================

const DEBOUNCE_DELAY = 500; // ms
const INITIAL_RETRY_DELAY = 3000; // 3s
const MAX_RETRY_DELAY = 30000; // 30s
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_FACTOR = 2;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate retry delay with exponential backoff and full jitter
 *
 * @param attempt - Current attempt number (1-indexed)
 * @returns Delay in milliseconds
 */
function calculateRetryDelay(attempt: number): number {
  const exponentialDelay = Math.min(
    INITIAL_RETRY_DELAY * RETRY_FACTOR ** (attempt - 1),
    MAX_RETRY_DELAY,
  );

  // Full jitter: random between 0 and exponentialDelay
  return Math.random() * exponentialDelay;
}

/**
 * Check if an error is retryable
 *
 * @param error - Error object
 * @returns True if error should trigger retry
 */
function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
    return true;
  }

  // HTTP status codes
  if (error.status === 408 || error.status === 429 || error.status === 503) {
    return true;
  }

  // Supabase-specific errors
  if (error.message?.includes('timeout') || error.message?.includes('network')) {
    return true;
  }

  return false;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useSettings Hook
 *
 * Manages user settings with localStorage persistence and database sync.
 *
 * @example
 * ```typescript
 * function SettingsPanel() {
 *   const { updateSetting, saveStatus } = useSettings();
 *
 *   return (
 *     <div>
 *       <button onClick={() => updateSetting('appearance.theme', 'dark')}>
 *         Dark Mode
 *       </button>
 *       {saveStatus === 'saving' && <Spinner />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSettings(): UseSettingsReturn {
  const store = useSettingsStore();
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const retryTimerRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // ============================================================================
  // Load Settings on Mount
  // ============================================================================

  useEffect(() => {
    store.loadSettings();

    return () => {
      isMountedRef.current = false;
    };
  }, [store]); // ✅ Correct: store is the only dependency

  // ============================================================================
  // Debounced Database Sync
  // ============================================================================

  const syncToDatabase = useMemo(() => {
    return async () => {
      if (!isMountedRef.current) {
        return;
      }

      try {
        await store.saveSettings();
      } catch (error) {
        // Sync failed, will retry with exponential backoff

        // Retry with exponential backoff if error is retryable
        if (isRetryableError(error) && store.retryCount < MAX_RETRY_ATTEMPTS) {
          const delay = calculateRetryDelay(store.retryCount + 1);

          retryTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              syncToDatabase();
            }
          }, delay);
        } else {
          // Max retries reached or non-retryable error
          // TODO: Show user notification (P2 - UI components)
          // toast.error('Failed to save settings. Changes are saved locally.');
        }
      }
    };
  }, [store]);

  // ============================================================================
  // Update Setting (with debounce)
  // ============================================================================

  const updateSetting = useMemo(() => {
    return (path: SettingsPath, value: any) => {
      // Update store immediately (optimistic update + localStorage)
      store.updateSetting(path, value);

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Schedule database sync after debounce delay
      debounceTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          syncToDatabase();
        }
      }, DEBOUNCE_DELAY);
    };
  }, [store, syncToDatabase]);

  // ============================================================================
  // Force Immediate Sync
  // ============================================================================

  const syncNow = useMemo(() => {
    return async () => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Sync immediately
      await syncToDatabase();
    };
  }, [syncToDatabase]);

  // ============================================================================
  // Reset Settings
  // ============================================================================

  const resetSettings = useMemo(() => {
    return () => {
      store.resetSettings();

      // Clear timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [store]);

  // ============================================================================
  // Cleanup on Unmount
  // ============================================================================

  useEffect(() => {
    return () => {
      // Clear all timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  // ============================================================================
  // Online/Offline Detection
  // ============================================================================

  useEffect(() => {
    function handleOnline() {
      // Back online, sync pending changes
      // Sync immediately when back online
      if (store.saveStatus === 'error') {
        syncToDatabase();
      }
    }

    function handleOffline() {
      // Offline mode - changes will sync when connection is restored
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [store.saveStatus, syncToDatabase]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    updateSetting,
    syncNow,
    resetSettings,
    saveStatus: store.saveStatus,
    retryCount: store.retryCount,
  };
}
