/**
 * Settings Precedence Resolver
 *
 * Implements the settings precedence hierarchy:
 * System Policy > User Override > System Preference > Default
 *
 * Supports two policy lock modes:
 * - enforced: Policy forces a specific value (user cannot change)
 * - managed: Policy prevents changes but respects user's current choice
 *
 * @module lib/settings/precedence
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T4
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 * Research: docs/SETTINGS_PRECEDENCE_BEST_PRACTICES_2026.md
 */

import type {
  PolicyLockMode,
  SystemPolicy,
  SystemPreferences,
  UserSettingsV1,
} from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';
import type { SettingsPath } from '@/types/settingsPaths';

import { getNestedValue, hasNestedPath } from './paths';

// ============================================================================
// Precedence Resolution
// ============================================================================

/**
 * Resolve setting value following precedence hierarchy
 *
 * Resolution order (first match wins):
 * 1. System Policy (if exists and not undefined)
 * 2. User Override (if exists and not undefined)
 * 3. System Preference (if exists and not undefined)
 * 4. Default Value (always exists)
 *
 * @param key - Settings path (dot-notation)
 * @param settings - User settings
 * @param systemPolicy - Optional system policy (admin-enforced)
 * @param systemPreferences - Optional OS/browser preferences
 * @returns Resolved value
 *
 * @example
 * ```typescript
 * // Policy forces dark theme
 * const theme = resolveSettingValue(
 *   'appearance.theme',
 *   { appearance: { theme: 'light' } }, // User wants light
 *   { appearance: { theme: 'dark' } },   // Policy forces dark
 * );
 * // Result: 'dark' (policy wins)
 * ```
 */
export function resolveSettingValue<T>(
  key: SettingsPath,
  settings: UserSettingsV1,
  systemPolicy?: SystemPolicy,
  systemPreferences?: SystemPreferences,
): T {
  // Layer 1: System Policy (highest priority)
  if (systemPolicy && hasNestedPath(systemPolicy, key)) {
    const value = getNestedValue(systemPolicy, key);
    if (value !== undefined) {
      return value as T;
    }
  }

  // Layer 2: User Override
  if (hasNestedPath(settings, key)) {
    const value = getNestedValue(settings, key);
    if (value !== undefined) {
      return value as T;
    }
  }

  // Layer 3: System Preference (OS/browser)
  const sysPref = getSystemPreference(key, systemPreferences);
  if (sysPref !== undefined) {
    return sysPref as T;
  }

  // Layer 4: Default (lowest priority, always exists)
  return getDefaultValue(key) as T;
}

// ============================================================================
// Policy Lock Detection
// ============================================================================

/**
 * Check if a setting is locked by policy
 *
 * Returns lock status and mode:
 * - enforced: Policy forces a specific value
 * - managed: Policy prevents changes but respects current value
 *
 * @param key - Settings path (dot-notation)
 * @param systemPolicy - Optional system policy
 * @returns Lock status and mode
 *
 * @example
 * ```typescript
 * const { locked, mode } = isLocked('appearance.theme', policy);
 * if (locked && mode === 'enforced') {
 *   // Show: "Enforced by policy: dark"
 * } else if (locked && mode === 'managed') {
 *   // Show: "Managed by policy"
 * }
 * ```
 */
export function isLocked(
  key: SettingsPath,
  systemPolicy?: SystemPolicy,
): { locked: boolean; mode?: PolicyLockMode } {
  if (!systemPolicy?.locks) {
    return { locked: false };
  }

  // Extract the top-level key (e.g., 'appearance.theme' → 'theme')
  const parts = key.split('.');
  const lockKey = parts[parts.length - 1] as keyof typeof systemPolicy.locks;

  const lockMode = systemPolicy.locks[lockKey];
  if (!lockMode) {
    return { locked: false };
  }

  return { locked: true, mode: lockMode };
}

// ============================================================================
// System Preferences Mapping
// ============================================================================

/**
 * Map OS/browser preferences to settings values
 *
 * Supported preferences:
 * - prefers-color-scheme → appearance.theme
 * - prefers-contrast → appearance.contrast
 * - prefers-reduced-motion → appearance.motion
 *
 * @param key - Settings path
 * @param prefs - System preferences
 * @returns Mapped value or undefined
 *
 * @example
 * ```typescript
 * const prefs = { colorScheme: 'dark', reducedMotion: true };
 * getSystemPreference('appearance.theme', prefs); // 'dark'
 * getSystemPreference('appearance.motion', prefs); // 'reduced'
 * ```
 */
export function getSystemPreference(
  key: SettingsPath,
  prefs?: SystemPreferences,
): unknown {
  if (!prefs) {
    return undefined;
  }

  switch (key) {
    case 'appearance.theme':
      // Map OS color scheme to theme
      return prefs.colorScheme; // 'light' | 'dark'

    case 'appearance.contrast':
      // Map OS contrast preference
      if (prefs.contrast === 'more') {
        return 'high';
      }
      if (prefs.contrast === 'less') {
        return 'normal';
      }
      return undefined; // Use default

    case 'appearance.motion':
      // Map OS motion preference
      if (prefs.reducedMotion) {
        return 'reduced';
      }
      return undefined; // Use default

    default:
      return undefined;
  }
}

// ============================================================================
// Default Values
// ============================================================================

/**
 * Get default value for a settings path
 *
 * Uses DEFAULT_SETTINGS as single source of truth.
 *
 * @param key - Settings path
 * @returns Default value
 *
 * @example
 * ```typescript
 * getDefaultValue('appearance.theme'); // 'system'
 * getDefaultValue('appearance.fontSize'); // 1
 * ```
 */
export function getDefaultValue(key: SettingsPath): unknown {
  return getNestedValue(DEFAULT_SETTINGS, key);
}
