/**
 * useSettings Hook - Test Suite
 *
 * Tests debouncing, retry logic, offline support, and cleanup.
 *
 * @module hooks/__tests__/useSettings
 * @version 1.0.0
 * @since 2026-01-21
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSettingsStore } from '@/stores/settingsStore';

import { useSettings } from '../useSettings';

// ============================================================================
// Test Setup
// ============================================================================

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock saveSettings in store
const mockSaveSettings = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  localStorageMock.clear();

  // Reset store
  useSettingsStore.setState({
    settings: useSettingsStore.getState().settings,
    saveStatus: 'idle',
    retryCount: 0,
    systemPolicy: undefined,
    systemPreferences: undefined,
  });

  // Mock saveSettings
  useSettingsStore.setState({
    saveSettings: mockSaveSettings,
  });

  mockSaveSettings.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================================================
// Tests
// ============================================================================

describe('useSettings', () => {
  // ==========================================================================
  // Initialization
  // ==========================================================================

  describe('Initialization', () => {
    it('should load settings on mount', () => {
      const loadSettingsSpy = vi.spyOn(useSettingsStore.getState(), 'loadSettings');

      renderHook(() => useSettings());

      expect(loadSettingsSpy).toHaveBeenCalledTimes(1);
    });

    it('should return initial state', () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current.saveStatus).toBe('idle');
      expect(result.current.retryCount).toBe(0);
      expect(typeof result.current.updateSetting).toBe('function');
      expect(typeof result.current.syncNow).toBe('function');
      expect(typeof result.current.resetSettings).toBe('function');
    });
  });

  // ==========================================================================
  // Update Setting
  // ==========================================================================

  describe('updateSetting', () => {
    it('should update setting immediately', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      const settings = useSettingsStore.getState().settings;

      expect(settings.appearance.theme).toBe('dark');
    });

    it('should debounce database sync', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useSettings());

      // Multiple rapid updates
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
        result.current.updateSetting('appearance.theme', 'light');
        result.current.updateSetting('appearance.theme', 'system');
      });

      // Should not call saveSettings yet
      expect(mockSaveSettings).not.toHaveBeenCalled();

      // Fast-forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Wait a tick for promise to resolve
      await act(async () => {
        await Promise.resolve();
      });

      // Should call saveSettings once
      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  // ==========================================================================
  // Sync Now
  // ==========================================================================

  describe('syncNow', () => {
    it('should sync immediately without debounce', async () => {
      const { result } = renderHook(() => useSettings());

      await act(async () => {
        await result.current.syncNow();
      });

      expect(mockSaveSettings).toHaveBeenCalledTimes(1);
    });

    it('should cancel pending debounced sync', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useSettings());

      // Start debounced sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Sync immediately (should cancel debounce)
      await act(async () => {
        await result.current.syncNow();
      });

      // Fast-forward past debounce delay
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Should only call saveSettings once (from syncNow)
      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  // ==========================================================================
  // Reset Settings
  // ==========================================================================

  describe('resetSettings', () => {
    it('should reset settings to defaults', () => {
      const { result } = renderHook(() => useSettings());

      // Update setting
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Reset
      act(() => {
        result.current.resetSettings();
      });

      const settings = useSettingsStore.getState().settings;

      expect(settings.appearance.theme).toBe('system');
    });

    it('should clear pending timers', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useSettings());

      // Start debounced sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Reset (should cancel debounce)
      act(() => {
        result.current.resetSettings();
      });

      // Fast-forward past debounce delay
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      // Should not call saveSettings
      expect(mockSaveSettings).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  // ==========================================================================
  // Retry Logic
  // ==========================================================================

  describe('Retry Logic', () => {
    it('should retry on retryable error', async () => {
      vi.useFakeTimers();

      // Mock retryable error on first call, success on second
      mockSaveSettings
        .mockRejectedValueOnce({ code: 'ETIMEDOUT' })
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useSettings());

      // Trigger sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Fast-forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Wait for first attempt
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      // Fast-forward past retry delay (use 5s to cover jitter)
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Wait for retry
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockSaveSettings).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should not retry on non-retryable error', async () => {
      vi.useFakeTimers();

      // Mock non-retryable error
      mockSaveSettings.mockRejectedValueOnce({ status: 400 });

      const { result } = renderHook(() => useSettings());

      // Trigger sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Fast-forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Wait for attempt
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      // Fast-forward past retry delay
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should not retry
      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should stop retrying after max attempts', async () => {
      vi.useFakeTimers();

      // Mock persistent error
      mockSaveSettings.mockRejectedValue({ code: 'ETIMEDOUT' });

      const { result } = renderHook(() => useSettings());

      // Trigger sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Fast-forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Wait for first attempt
      await act(async () => {
        await Promise.resolve();
      });

      expect(mockSaveSettings).toHaveBeenCalledTimes(1);

      // Fast-forward through all retry attempts (max 5 attempts total)
      for (let i = 0; i < 4; i++) {
        act(() => {
          vi.advanceTimersByTime(35000); // Max delay + buffer
        });

        await act(async () => {
          await Promise.resolve();
        });
      }

      // Should stop at max attempts (5 total)
      expect(mockSaveSettings).toHaveBeenCalledTimes(5);

      vi.useRealTimers();
    });
  });

  // ==========================================================================
  // Online/Offline Detection
  // ==========================================================================

  describe('Online/Offline Detection', () => {
    it('should sync when coming back online with error state', async () => {
      renderHook(() => useSettings());

      // Set error state
      act(() => {
        useSettingsStore.setState({ saveStatus: 'error' });
      });

      // Trigger online event and wait for handler
      await act(async () => {
        window.dispatchEvent(new Event('online'));
        // Give time for async handler to execute
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Should attempt sync
      expect(mockSaveSettings).toHaveBeenCalled();
    });

    it('should not sync when online if no error', async () => {
      renderHook(() => useSettings());

      // Trigger online event (no error state)
      act(() => {
        window.dispatchEvent(new Event('online'));
      });

      // Wait a tick
      await act(async () => {
        await Promise.resolve();
      });

      // Should not sync
      expect(mockSaveSettings).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Cleanup
  // ==========================================================================

  describe('Cleanup', () => {
    it('should cleanup timers on unmount', () => {
      vi.useFakeTimers();

      const { result, unmount } = renderHook(() => useSettings());

      // Start debounced sync
      act(() => {
        result.current.updateSetting('appearance.theme', 'dark');
      });

      // Unmount
      unmount();

      // Fast-forward past debounce delay
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should not call saveSettings after unmount
      expect(mockSaveSettings).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useSettings());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    });
  });
});
