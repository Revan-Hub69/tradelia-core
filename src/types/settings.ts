/**
 * User Settings Schema V1
 *
 * This module defines the complete user settings schema with versioning,
 * appearance customization, and enterprise policy support.
 *
 * @module types/settings
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 * Research: docs/P1T2_SCHEMA_RESEARCH_2026.md
 */

// ============================================================================
// Core Settings Schema
// ============================================================================

/**
 * User settings schema version 1
 *
 * This is the complete settings object that includes:
 * - Schema versioning for migration support
 * - Server-authoritative timestamps
 * - Offline sync support (dirty flag)
 * - Appearance customization (NEW in V1)
 * - Existing preferences, notifications, privacy
 *
 * @example
 * ```typescript
 * const settings: UserSettingsV1 = {
 *   version: 1,
 *   updatedAt: '2026-01-21T10:00:00Z',
 *   appearance: {
 *     theme: 'dark',
 *     fontSize: 1,
 *     density: 'comfortable',
 *     contrast: 'normal',
 *     motion: 'full',
 *   },
 *   preferences: {
 *     language: 'it',
 *     difficulty: 'adaptive',
 *     autoPlay: true,
 *   },
 *   notifications: {
 *     email: true,
 *     push: true,
 *     dailyReminder: false,
 *     streakReminder: true,
 *   },
 *   privacy: {
 *     profileVisible: true,
 *     progressVisible: true,
 *     leaderboardVisible: true,
 *   },
 * };
 * ```
 */
export type UserSettingsV1 = {
  /**
   * Schema version for migration support
   * @readonly
   */
  readonly version: 1;

  /**
   * Server-authoritative timestamp (ISO 8601)
   *
   * This timestamp is ALWAYS set by the server after a successful save.
   * Never generate this client-side.
   *
   * @readonly
   * @example '2026-01-21T10:00:00.000Z'
   */
  readonly updatedAt: string;

  /**
   * Indicates unsaved local changes (offline mode)
   *
   * When true, settings have been modified locally but not yet synced to server.
   * This flag is stored in localStorage only (not in database).
   *
   * @optional
   */
  dirty?: boolean;

  /**
   * Pending timestamp for offline changes
   *
   * Timestamp when the last local change was made while offline.
   * Used to track when changes need to be synced.
   * Stored in localStorage only (not in database).
   *
   * @optional
   * @example '2026-01-21T10:05:00.000Z'
   */
  pendingUpdatedAt?: string;

  /**
   * Appearance settings (NEW in V1)
   *
   * Controls visual customization: theme, font size, density, contrast, motion.
   */
  appearance: AppearanceSettings;

  /**
   * User preferences
   *
   * Language, experience level, and auto-open settings.
   */
  preferences: PreferencesSettings;

  /**
   * Notification settings
   *
   * Email, push, reminders.
   */
  notifications: NotificationsSettings;

  /**
   * Privacy settings
   *
   * Profile visibility, performance sharing, leaderboard participation.
   */
  privacy: PrivacySettings;
};

// ============================================================================
// Appearance Settings (NEW in V1)
// ============================================================================

/**
 * Appearance settings for visual customization
 *
 * NEW in V1: Comprehensive appearance controls for accessibility and personalization.
 */
export type AppearanceSettings = {
  /**
   * Theme mode
   *
   * - 'light': Light theme
   * - 'dark': Dark theme
   * - 'system': Follow OS preference
   * - 'schedule': Automatic based on time/location
   */
  theme: 'light' | 'dark' | 'system' | 'schedule';

  /**
   * Schedule mode (only if theme='schedule')
   *
   * - 'os': Use OS-level schedule (if available)
   * - 'manual': User-defined schedule (lightStart/darkStart times)
   * - 'geo': Geolocation-based (sunrise/sunset) - requires geoConsent
   *
   * @optional
   */
  scheduleMode?: 'os' | 'manual' | 'geo';

  /**
   * Manual schedule times (only if scheduleMode='manual')
   *
   * @optional
   */
  manualSchedule?: {
    /** Light theme start time (HH:MM format, 24h) */
    lightStart: string;
    /** Dark theme start time (HH:MM format, 24h) */
    darkStart: string;
  };

  /**
   * Geolocation consent (only if scheduleMode='geo')
   *
   * Explicit user consent for geolocation access (GDPR compliance).
   *
   * @optional
   */
  geoConsent?: boolean;

  /**
   * Base font size multiplier
   *
   * - 0.875 = Small (14px)
   * - 1.000 = Medium (16px) - default
   * - 1.125 = Large (18px)
   * - 1.250 = Extra Large (20px)
   *
   * Applied via CSS custom property: --font-size-base
   */
  fontSize: 0.875 | 1 | 1.125 | 1.25;

  /**
   * UI density (spacing)
   *
   * - 'compact': Reduced spacing (more content visible)
   * - 'comfortable': Standard spacing (default)
   * - 'spacious': Increased spacing (better readability)
   *
   * Applied via CSS custom property: --spacing-unit
   */
  density: 'compact' | 'comfortable' | 'spacious';

  /**
   * Contrast mode
   *
   * - 'normal': Standard contrast
   * - 'high': Increased contrast (WCAG AAA)
   * - 'auto': Follow OS preference (prefers-contrast)
   *
   * Applied via CSS custom property: --contrast-mode
   */
  contrast: 'normal' | 'high' | 'auto';

  /**
   * Motion preference
   *
   * - 'full': All animations enabled
   * - 'reduced': Shorter durations, fewer animations
   * - 'none': No animations (static UI)
   *
   * Respects prefers-reduced-motion when set to 'auto'.
   * Applied via CSS custom property: --motion-duration
   */
  motion: 'full' | 'reduced' | 'none';
};

// ============================================================================
// Preferences Settings
// ============================================================================

/**
 * User preferences
 */
export type PreferencesSettings = {
  /**
   * Interface language (ISO 639-1 code)
   *
   * @example 'it', 'en'
   */
  language: string;

  /**
   * Experience level for challenge guidance
   *
   * - 'adaptive': AI-adjusted based on performance
   * - 'beginner': Simplified content
   * - 'intermediate': Standard content
   * - 'advanced': Advanced content
   */
  difficulty: 'adaptive' | 'beginner' | 'intermediate' | 'advanced';

  /**
   * Auto-open next challenge
   *
   * When true, automatically opens the next challenge after viewing one.
   */
  autoPlay: boolean;
};

// ============================================================================
// Notifications Settings
// ============================================================================

/**
 * Notification preferences
 */
export type NotificationsSettings = {
  /** Email notifications enabled */
  email: boolean;

  /** Push notifications enabled */
  push: boolean;

  /** Daily study reminder */
  dailyReminder: boolean;

  /** Streak reminder (when streak is at risk) */
  streakReminder: boolean;
};

// ============================================================================
// Privacy Settings
// ============================================================================

/**
 * Privacy and visibility settings
 */
export type PrivacySettings = {
  /** Profile visible to other users */
  profileVisible: boolean;

  /** Performance summary visible to other users */
  progressVisible: boolean;

  /** Participate in leaderboard */
  leaderboardVisible: boolean;
};

// ============================================================================
// System Policy (Enterprise)
// ============================================================================

/**
 * System policy (server-provided, enforced by admin)
 *
 * This is a SEPARATE object from UserSettingsV1.
 * It contains admin-enforced values and locks.
 *
 * Resolution order: SystemPolicy > UserSettings > SystemPreference > Default
 *
 * @example
 * ```typescript
 * const policy: SystemPolicy = {
 *   appearance: {
 *     theme: 'light', // Force light theme
 *   },
 *   locks: {
 *     theme: true,    // User cannot change theme
 *     mode: 'enforced', // Force specific value
 *   },
 * };
 * ```
 */
export type SystemPolicy = {
  /** Enforced appearance settings (partial) */
  appearance?: Partial<AppearanceSettings>;

  /** Enforced preferences (partial) */
  preferences?: Partial<PreferencesSettings>;

  /** Enforced notifications (partial) */
  notifications?: Partial<NotificationsSettings>;

  /** Enforced privacy settings (partial) */
  privacy?: Partial<PrivacySettings>;

  /**
   * Policy locks
   *
   * Defines which settings are locked and how.
   */
  locks: PolicyLocks;
};

/**
 * Policy lock configuration
 *
 * Each lock can have a mode:
 * - 'enforced': Policy forces a specific value (user cannot change)
 * - 'managed': Policy prevents changes but respects user's current choice
 */
export type PolicyLocks = {
  theme?: PolicyLockMode;
  fontSize?: PolicyLockMode;
  density?: PolicyLockMode;
  contrast?: PolicyLockMode;
  motion?: PolicyLockMode;
  language?: PolicyLockMode;
  difficulty?: PolicyLockMode;
  autoPlay?: PolicyLockMode;
  email?: PolicyLockMode;
  push?: PolicyLockMode;
  dailyReminder?: PolicyLockMode;
  streakReminder?: PolicyLockMode;
  profileVisible?: PolicyLockMode;
  progressVisible?: PolicyLockMode;
  leaderboardVisible?: PolicyLockMode;
};

/**
 * Policy lock mode
 *
 * - 'enforced': Forces a specific value (common in regulated industries)
 * - 'managed': Prevents changes but respects current value (common in enterprise)
 */
export type PolicyLockMode = 'enforced' | 'managed';

// ============================================================================
// System Preferences (OS/Browser)
// ============================================================================

/**
 * System preferences from OS/browser
 *
 * These are detected at runtime from browser APIs:
 * - prefers-color-scheme
 * - prefers-contrast
 * - prefers-reduced-motion
 */
export type SystemPreferences = {
  /** OS color scheme preference */
  colorScheme?: 'light' | 'dark';

  /** OS contrast preference */
  contrast?: 'no-preference' | 'more' | 'less';

  /** OS motion preference */
  reducedMotion?: boolean;
};

// ============================================================================
// Default Settings
// ============================================================================

/**
 * Default settings (fallback)
 *
 * Used when:
 * - No settings exist (new user)
 * - Migration fails
 * - Settings are corrupted
 */
export const DEFAULT_SETTINGS: UserSettingsV1 = {
  version: 1,
  updatedAt: new Date().toISOString(),
  appearance: {
    theme: 'system',
    fontSize: 1, // 16px (medium)
    density: 'comfortable',
    contrast: 'normal',
    motion: 'full',
  },
  preferences: {
    language: 'it', // Default to Italian
    difficulty: 'adaptive',
    autoPlay: true,
  },
  notifications: {
    email: true,
    push: true,
    dailyReminder: false,
    streakReminder: true,
  },
  privacy: {
    profileVisible: true,
    progressVisible: true,
    leaderboardVisible: true,
  },
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard: Check if object is UserSettingsV1
 */
export function isUserSettingsV1(obj: unknown): obj is UserSettingsV1 {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const settings = obj as Partial<UserSettingsV1>;

  return (
    settings.version === 1
    && typeof settings.updatedAt === 'string'
    && typeof settings.appearance === 'object'
    && typeof settings.preferences === 'object'
    && typeof settings.notifications === 'object'
    && typeof settings.privacy === 'object'
  );
}

/**
 * Type guard: Check if policy lock is enforced
 */
export function isEnforcedLock(mode: PolicyLockMode | undefined): boolean {
  return mode === 'enforced';
}

/**
 * Type guard: Check if policy lock is managed
 */
export function isManagedLock(mode: PolicyLockMode | undefined): boolean {
  return mode === 'managed';
}
