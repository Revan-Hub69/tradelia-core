/**
 * Settings Path Contract
 *
 * TypeScript union type for all valid settings paths to prevent typos
 * and enable compile-time validation.
 *
 * @module types/settingsPaths
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T2B
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 */

// ============================================================================
// Settings Path Type
// ============================================================================

/**
 * All valid settings paths in dot-notation
 *
 * This union type ensures compile-time safety when accessing or updating
 * settings. Any typo in a path will result in a TypeScript error.
 *
 * @example
 * ```typescript
 * // ✅ Valid paths
 * updateSetting('appearance.theme', 'dark');
 * updateSetting('preferences.language', 'it');
 *
 * // ❌ TypeScript error - invalid path
 * updateSetting('appearance.theem', 'dark');
 * updateSetting('invalid.path', 'value');
 * ```
 */
export type SettingsPath =
  // Appearance settings
  | 'appearance.theme'
  | 'appearance.scheduleMode'
  | 'appearance.manualSchedule'
  | 'appearance.manualSchedule.lightStart'
  | 'appearance.manualSchedule.darkStart'
  | 'appearance.geoConsent'
  | 'appearance.fontSize'
  | 'appearance.density'
  | 'appearance.contrast'
  | 'appearance.motion'
  // Preferences settings
  | 'preferences.language'
  | 'preferences.difficulty'
  | 'preferences.autoPlay'
  // Notifications settings
  | 'notifications.email'
  | 'notifications.push'
  | 'notifications.dailyReminder'
  | 'notifications.streakReminder'
  // Privacy settings
  | 'privacy.profileVisible'
  | 'privacy.progressVisible'
  | 'privacy.leaderboardVisible';

/**
 * Extract the value type for a given settings path
 *
 * This utility type extracts the correct TypeScript type for a given path,
 * enabling type-safe value access and updates.
 *
 * @example
 * ```typescript
 * type ThemeValue = SettingsPathValue<'appearance.theme'>;
 * // Result: 'light' | 'dark' | 'system' | 'schedule'
 *
 * type FontSizeValue = SettingsPathValue<'appearance.fontSize'>;
 * // Result: 0.875 | 1 | 1.125 | 1.25
 * ```
 */
export type SettingsPathValue<T extends SettingsPath> =
  T extends 'appearance.theme' ? 'light' | 'dark' | 'system' | 'schedule'
    : T extends 'appearance.scheduleMode' ? 'os' | 'manual' | 'geo'
      : T extends 'appearance.manualSchedule.lightStart' ? string
        : T extends 'appearance.manualSchedule.darkStart' ? string
          : T extends 'appearance.geoConsent' ? boolean
            : T extends 'appearance.fontSize' ? 0.875 | 1 | 1.125 | 1.25
              : T extends 'appearance.density' ? 'compact' | 'comfortable' | 'spacious'
                : T extends 'appearance.contrast' ? 'normal' | 'high' | 'auto'
                  : T extends 'appearance.motion' ? 'full' | 'reduced' | 'none'
                    : T extends 'preferences.language' ? string
                      : T extends 'preferences.difficulty' ? 'adaptive' | 'beginner' | 'intermediate' | 'advanced'
                        : T extends 'preferences.autoPlay' ? boolean
                          : T extends 'notifications.email' ? boolean
                            : T extends 'notifications.push' ? boolean
                              : T extends 'notifications.dailyReminder' ? boolean
                                : T extends 'notifications.streakReminder' ? boolean
                                  : T extends 'privacy.profileVisible' ? boolean
                                    : T extends 'privacy.progressVisible' ? boolean
                                      : T extends 'privacy.leaderboardVisible' ? boolean
                                        : never;
