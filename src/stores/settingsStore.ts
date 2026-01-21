/**
 * Settings Store (Zustand)
 *
 * Manages settings state with optimistic updates, localStorage persistence,
 * and database sync. Provides computed selectors for precedence resolution.
 *
 * @module stores/settingsStore
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T5
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 */

import { create } from 'zustand';

import { migrateSettings } from '@/lib/settings/migration';
import { setNestedValue } from '@/lib/settings/paths';
import {
  isLocked as checkIsLocked,
  resolveSettingValue as resolveValue,
} from '@/lib/settings/precedence';
import type {
  SystemPolicy,
  SystemPreferences,
  UserSettingsV1,
} from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import type { SettingsPath } from '@/types/settingsPaths';

// ============================================================================
// Types
// ============================================================================

/**
 * Save status for UI feedback
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Settings store state
 */
export type SettingsStoreState = {
  // Core state
  settings: UserSettingsV1;
  saveStatus: SaveStatus;
  retryCount: number;
  systemPolicy?: SystemPolicy;
  systemPreferences?: SystemPreferences;

  // Actions
  loadSettings: () => Promise<void>;
  updateSetting: <T>(path: SettingsPath, value: T) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => void;
  setSystemPolicy: (policy?: SystemPolicy) => void;
  setSystemPreferences: (prefs?: SystemPreferences) => void;

  // Computed selectors
  isLocked: (key: SettingsPath) => { locked: boolean; mode?: 'enforced' | 'managed' };
  resolvedValue: <T>(key: SettingsPath) => T;
};

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'tradelia_settings_v1';

// ============================================================================
// Store
// ============================================================================

/**
 * Settings store
 *
 * Provides centralized settings management with:
 * - Optimistic updates (immediate UI feedback)
 * - localStorage persistence (offline support)
 * - Database sync (via external hook)
 * - Precedence resolution (policy > user > system > default)
 * - Lock detection (enforced/managed modes)
 *
 * @example
 * ```typescript
 * const { settings, updateSetting, resolvedValue, isLocked } = useSettingsStore();
 *
 * // Update setting (optimistic)
 * updateSetting('appearance.theme', 'dark');
 *
 * // Get resolved value (with precedence)
 * const theme = resolvedValue<string>('appearance.theme');
 *
 * // Check if locked
 * const { locked, mode } = isLocked('appearance.theme');
 * ```
 */
export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  // ============================================================================
  // Initial State
  // ============================================================================

  settings: DEFAULT_SETTINGS,
  saveStatus: 'idle',
  retryCount: 0,
  systemPolicy: undefined,
  systemPreferences: undefined,

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Load settings from localStorage and database
   *
   * Priority:
   * 1. Try localStorage (fast, offline-first)
   * 2. Fallback to database (if localStorage empty)
   * 3. Fallback to defaults (if both fail)
   *
   * @example
   * ```typescript
   * await loadSettings();
   * ```
   */
  loadSettings: async () => {
    try {
      // Try localStorage first (offline-first)
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = migrateSettings(parsed);
        set({ settings: migrated });
        return;
      }

      // TODO: Load from database (P1.T6)
      // For now, use defaults
      set({ settings: DEFAULT_SETTINGS });
    } catch (error) {
      console.error('[SettingsStore] Failed to load settings:', error);
      set({ settings: DEFAULT_SETTINGS });
    }
  },

  /**
   * Update a setting (optimistic update)
   *
   * Updates the setting immediately in memory and localStorage.
   * Database sync is handled by useSettings hook (P1.T6).
   *
   * @param path - Settings path (dot-notation)
   * @param value - New value
   *
   * @example
   * ```typescript
   * updateSetting('appearance.theme', 'dark');
   * updateSetting('appearance.fontSize', 1.125);
   * ```
   */
  updateSetting: <T>(path: SettingsPath, value: T) => {
    const { settings } = get();

    // Create new settings object with updated value
    const updated = setNestedValue(settings, path, value) as UserSettingsV1;

    // Update store
    set({ settings: updated, saveStatus: 'saving' });

    // Persist to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[SettingsStore] Failed to save to localStorage:', error);
    }
  },

  /**
   * Save settings to database
   *
   * This is called by useSettings hook after debounce.
   * Updates saveStatus for UI feedback.
   *
   * @example
   * ```typescript
   * await saveSettings();
   * ```
   */
  saveSettings: async () => {
    set({ saveStatus: 'saving' });

    try {
      // TODO: Save to database (P1.T6)
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 100));

      set({ saveStatus: 'saved', retryCount: 0 });

      // Reset to idle after 2 seconds
      setTimeout(() => {
        if (get().saveStatus === 'saved') {
          set({ saveStatus: 'idle' });
        }
      }, 2000);
    } catch (error) {
      console.error('[SettingsStore] Failed to save settings:', error);
      set({ saveStatus: 'error', retryCount: get().retryCount + 1 });
    }
  },

  /**
   * Reset settings to defaults
   *
   * Clears localStorage and resets to DEFAULT_SETTINGS.
   *
   * @example
   * ```typescript
   * resetSettings();
   * ```
   */
  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS, saveStatus: 'idle', retryCount: 0 });

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[SettingsStore] Failed to clear localStorage:', error);
    }
  },

  /**
   * Set system policy (admin-enforced settings)
   *
   * @param policy - System policy
   *
   * @example
   * ```typescript
   * setSystemPolicy({
   *   appearance: { theme: 'dark' },
   *   locks: { theme: 'enforced' },
   * });
   * ```
   */
  setSystemPolicy: (policy?: SystemPolicy) => {
    set({ systemPolicy: policy });
  },

  /**
   * Set system preferences (OS/browser preferences)
   *
   * @param prefs - System preferences
   *
   * @example
   * ```typescript
   * setSystemPreferences({
   *   colorScheme: 'dark',
   *   reducedMotion: true,
   * });
   * ```
   */
  setSystemPreferences: (prefs?: SystemPreferences) => {
    set({ systemPreferences: prefs });
  },

  // ============================================================================
  // Computed Selectors
  // ============================================================================

  /**
   * Check if a setting is locked by policy
   *
   * @param key - Settings path
   * @returns Lock status and mode
   *
   * @example
   * ```typescript
   * const { locked, mode } = isLocked('appearance.theme');
   * if (locked && mode === 'enforced') {
   *   // Show: "Enforced by policy: dark"
   * }
   * ```
   */
  isLocked: (key: SettingsPath) => {
    const { systemPolicy } = get();
    return checkIsLocked(key, systemPolicy);
  },

  /**
   * Get resolved value with precedence
   *
   * Resolution order: Policy > User > SysPref > Default
   *
   * @param key - Settings path
   * @returns Resolved value
   *
   * @example
   * ```typescript
   * const theme = resolvedValue<string>('appearance.theme');
   * const fontSize = resolvedValue<number>('appearance.fontSize');
   * ```
   */
  resolvedValue: <T>(key: SettingsPath): T => {
    const { settings, systemPolicy, systemPreferences } = get();
    return resolveValue<T>(key, settings, systemPolicy, systemPreferences);
  },
}));
