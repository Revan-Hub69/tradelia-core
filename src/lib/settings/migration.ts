/**
 * Settings Schema Migration
 *
 * Handles migration from legacy settings to UserSettingsV1 with graceful
 * fallback on failure. Implements lazy migration pattern (upgrade on read).
 *
 * @module lib/settings/migration
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T3
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 * Research: docs/SCHEMA_MIGRATION_BEST_PRACTICES_2026.md
 */

import { DEFAULT_SETTINGS, type UserSettingsV1 } from '@/types/settings';

// ============================================================================
// Migration Function
// ============================================================================

/**
 * Migrate settings to UserSettingsV1
 *
 * Handles migration from:
 * - Legacy (unversioned) settings → V1
 * - V1 settings → V1 (no-op)
 * - Invalid/corrupted data → Default settings
 *
 * **Strategy:** Lazy migration (upgrade on read, not on deploy)
 *
 * **Error Handling:** Graceful fallback to defaults on any error
 *
 * @example
 * ```typescript
 * // Legacy settings (no version)
 * const legacy = { darkMode: true, language: 'it' };
 * const v1 = migrateSettings(legacy);
 * // Result: { version: 1, appearance: { theme: 'dark' }, ... }
 *
 * // Already V1
 * const current = { version: 1, appearance: { ... }, ... };
 * const v1 = migrateSettings(current);
 * // Result: Same object (no migration needed)
 *
 * // Invalid data
 * const invalid = null;
 * const v1 = migrateSettings(invalid);
 * // Result: DEFAULT_SETTINGS
 * ```
 */
export function migrateSettings(raw: any): UserSettingsV1 {
  try {
    // Handle null/undefined
    if (raw === null || raw === undefined) {
      // Code Quality P0: Removed console.warn for production
      return getDefaultSettings();
    }

    // Handle non-object
    if (typeof raw !== 'object') {
      // Code Quality P0: Removed console.warn for production
      return getDefaultSettings();
    }

    // Detect version
    const version = raw.version;

    // No version = legacy (pre-V1)
    if (!version) {
      // Code Quality P0: Removed console.info for production
      return migrateLegacyToV1(raw);
    }

    // Already V1
    if (version === 1) {
      // Validate structure
      if (!isValidV1Structure(raw)) {
        // Code Quality P0: Removed console.warn for production
        return getDefaultSettings();
      }
      return raw as UserSettingsV1;
    }

    // Future versions (V2, V3, etc.)
    // Code Quality P0: Removed console.warn for production
    return getDefaultSettings();
  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    return getDefaultSettings();
  }
}

// ============================================================================
// Legacy → V1 Migration
// ============================================================================

/**
 * Migrate legacy (unversioned) settings to V1
 *
 * Maps old field names to new schema while preserving data.
 */
function migrateLegacyToV1(legacy: any): UserSettingsV1 {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),

    // Appearance (NEW in V1)
    appearance: {
      // Map old 'darkMode' boolean to new 'theme' enum
      theme: legacy.darkMode === true
        ? 'dark'
        : legacy.darkMode === false
          ? 'light'
          : legacy.theme || 'system',

      // New fields get defaults
      fontSize: legacy.fontSize || 1,
      density: legacy.density || 'comfortable',
      contrast: legacy.contrast || 'normal',
      motion: legacy.motion || 'full',
    },

    // Preferences (preserve existing)
    preferences: {
      language: legacy.language || DEFAULT_SETTINGS.preferences.language,
      difficulty: legacy.difficulty || DEFAULT_SETTINGS.preferences.difficulty,
      autoPlay: legacy.autoPlay ?? DEFAULT_SETTINGS.preferences.autoPlay,
    },

    // Notifications (preserve existing)
    notifications: {
      email: legacy.email ?? DEFAULT_SETTINGS.notifications.email,
      push: legacy.push ?? DEFAULT_SETTINGS.notifications.push,
      dailyReminder: legacy.dailyReminder ?? DEFAULT_SETTINGS.notifications.dailyReminder,
      streakReminder: legacy.streakReminder ?? DEFAULT_SETTINGS.notifications.streakReminder,
    },

    // Privacy (preserve existing)
    privacy: {
      profileVisible: legacy.profileVisible ?? DEFAULT_SETTINGS.privacy.profileVisible,
      progressVisible: legacy.progressVisible ?? DEFAULT_SETTINGS.privacy.progressVisible,
      leaderboardVisible: legacy.leaderboardVisible ?? DEFAULT_SETTINGS.privacy.leaderboardVisible,
    },
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate V1 structure (basic checks)
 *
 * Ensures all required top-level fields exist.
 */
function isValidV1Structure(obj: any): boolean {
  return (
    obj.version === 1
    && typeof obj.updatedAt === 'string'
    && typeof obj.appearance === 'object'
    && typeof obj.preferences === 'object'
    && typeof obj.notifications === 'object'
    && typeof obj.privacy === 'object'
  );
}

// ============================================================================
// Default Settings
// ============================================================================

/**
 * Get default settings (fallback)
 *
 * Returns a fresh copy of DEFAULT_SETTINGS with current timestamp.
 */
export function getDefaultSettings(): UserSettingsV1 {
  return {
    ...DEFAULT_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
}
