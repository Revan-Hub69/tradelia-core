/**
 * Settings Precedence Resolver - Test Suite
 *
 * Tests all precedence combinations and policy lock modes.
 *
 * @module lib/settings/__tests__/precedence
 * @version 1.0.0
 * @since 2026-01-21
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '@/types/settings';
import type {
  SystemPolicy,
  SystemPreferences,
  UserSettingsV1,
} from '@/types/settings';
import {
  getDefaultValue,
  getSystemPreference,
  isLocked,
  resolveSettingValue,
} from '../precedence';

// ============================================================================
// Test Fixtures
// ============================================================================

const mockUserSettings: UserSettingsV1 = {
  version: 1,
  updatedAt: '2026-01-21T10:00:00Z',
  appearance: {
    theme: 'light',
    fontSize: 1,
    density: 'comfortable',
    contrast: 'normal',
    motion: 'full',
  },
  preferences: {
    language: 'it',
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
};

const mockSystemPolicy: SystemPolicy = {
  appearance: {
    theme: 'dark',
    fontSize: 1.125,
  },
  locks: {
    theme: 'enforced',
    fontSize: 'managed',
  },
};

const mockSystemPreferences: SystemPreferences = {
  colorScheme: 'dark',
  contrast: 'more',
  reducedMotion: true,
};

// ============================================================================
// resolveSettingValue Tests
// ============================================================================

describe('resolveSettingValue', () => {
  describe('Precedence Hierarchy', () => {
    it('should prioritize system policy over user settings', () => {
      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,  // User wants 'light'
        mockSystemPolicy,  // Policy forces 'dark'
      );

      expect(result).toBe('dark'); // Policy wins
    });

    it('should prioritize user settings over system preferences', () => {
      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,       // User wants 'light'
        undefined,              // No policy
        mockSystemPreferences,  // OS prefers 'dark'
      );

      expect(result).toBe('light'); // User wins
    });

    it('should prioritize system preferences over defaults', () => {
      const settingsWithoutTheme: UserSettingsV1 = {
        ...mockUserSettings,
        appearance: {
          ...mockUserSettings.appearance,
          theme: undefined as any, // No user choice
        },
      };

      const result = resolveSettingValue(
        'appearance.theme',
        settingsWithoutTheme,
        undefined,              // No policy
        mockSystemPreferences,  // OS prefers 'dark'
      );

      expect(result).toBe('dark'); // System preference wins
    });

    it('should use default when no other source exists', () => {
      const settingsWithoutTheme: UserSettingsV1 = {
        ...mockUserSettings,
        appearance: {
          ...mockUserSettings.appearance,
          theme: undefined as any,
        },
      };

      const result = resolveSettingValue(
        'appearance.theme',
        settingsWithoutTheme,
        undefined, // No policy
        undefined, // No system preferences
      );

      expect(result).toBe('system'); // Default wins
    });
  });

  describe('All Four Layers', () => {
    it('should resolve with all layers present (policy wins)', () => {
      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,       // Layer 2: 'light'
        mockSystemPolicy,       // Layer 1: 'dark'
        mockSystemPreferences,  // Layer 3: 'dark'
      );

      expect(result).toBe('dark'); // Layer 1 (policy) wins
    });

    it('should skip policy if value is undefined', () => {
      const policyWithUndefined: SystemPolicy = {
        appearance: {
          theme: undefined,
        },
        locks: {},
      };

      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,       // Layer 2: 'light'
        policyWithUndefined,    // Layer 1: undefined (skip)
        mockSystemPreferences,  // Layer 3: 'dark'
      );

      expect(result).toBe('light'); // Layer 2 (user) wins
    });

    it('should skip user settings if value is undefined', () => {
      const settingsWithUndefined: UserSettingsV1 = {
        ...mockUserSettings,
        appearance: {
          ...mockUserSettings.appearance,
          theme: undefined as any,
        },
      };

      const result = resolveSettingValue(
        'appearance.theme',
        settingsWithUndefined,  // Layer 2: undefined (skip)
        undefined,              // Layer 1: none
        mockSystemPreferences,  // Layer 3: 'dark'
      );

      expect(result).toBe('dark'); // Layer 3 (system pref) wins
    });
  });

  describe('Nested Paths', () => {
    it('should resolve nested appearance settings', () => {
      const result = resolveSettingValue(
        'appearance.fontSize',
        mockUserSettings,
        mockSystemPolicy,
      );

      expect(result).toBe(1.125); // Policy value
    });

    it('should resolve nested preferences settings', () => {
      const result = resolveSettingValue(
        'preferences.language',
        mockUserSettings,
      );

      expect(result).toBe('it'); // User value
    });

    it('should resolve nested notifications settings', () => {
      const result = resolveSettingValue(
        'notifications.email',
        mockUserSettings,
      );

      expect(result).toBe(true); // User value
    });

    it('should resolve nested privacy settings', () => {
      const result = resolveSettingValue(
        'privacy.profileVisible',
        mockUserSettings,
      );

      expect(result).toBe(true); // User value
    });
  });

  describe('Edge Cases', () => {
    it('should handle null policy', () => {
      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,
        undefined,
      );

      expect(result).toBe('light'); // User value
    });

    it('should handle null system preferences', () => {
      const result = resolveSettingValue(
        'appearance.theme',
        mockUserSettings,
        undefined,
        undefined,
      );

      expect(result).toBe('light'); // User value
    });

    it('should handle boolean false values correctly', () => {
      const result = resolveSettingValue(
        'notifications.dailyReminder',
        mockUserSettings,
      );

      expect(result).toBe(false); // User value (not skipped)
    });

    it('should handle numeric zero values correctly', () => {
      const settingsWithZero: UserSettingsV1 = {
        ...mockUserSettings,
        appearance: {
          ...mockUserSettings.appearance,
          fontSize: 0.875,
        },
      };

      const result = resolveSettingValue(
        'appearance.fontSize',
        settingsWithZero,
      );

      expect(result).toBe(0.875); // User value (not skipped)
    });
  });
});

// ============================================================================
// isLocked Tests
// ============================================================================

describe('isLocked', () => {
  describe('Lock Detection', () => {
    it('should detect enforced lock', () => {
      const result = isLocked('appearance.theme', mockSystemPolicy);

      expect(result.locked).toBe(true);
      expect(result.mode).toBe('enforced');
    });

    it('should detect managed lock', () => {
      const result = isLocked('appearance.fontSize', mockSystemPolicy);

      expect(result.locked).toBe(true);
      expect(result.mode).toBe('managed');
    });

    it('should return unlocked when no policy', () => {
      const result = isLocked('appearance.theme', undefined);

      expect(result.locked).toBe(false);
      expect(result.mode).toBeUndefined();
    });

    it('should return unlocked when policy has no locks', () => {
      const policyWithoutLocks: SystemPolicy = {
        appearance: { theme: 'dark' },
        locks: {},
      };

      const result = isLocked('appearance.theme', policyWithoutLocks);

      expect(result.locked).toBe(false);
      expect(result.mode).toBeUndefined();
    });

    it('should return unlocked when setting is not locked', () => {
      const result = isLocked('appearance.density', mockSystemPolicy);

      expect(result.locked).toBe(false);
      expect(result.mode).toBeUndefined();
    });
  });

  describe('Lock Modes', () => {
    it('should distinguish enforced from managed', () => {
      const enforcedResult = isLocked('appearance.theme', mockSystemPolicy);
      const managedResult = isLocked('appearance.fontSize', mockSystemPolicy);

      expect(enforcedResult.mode).toBe('enforced');
      expect(managedResult.mode).toBe('managed');
      expect(enforcedResult.mode).not.toBe(managedResult.mode);
    });
  });

  describe('Nested Paths', () => {
    it('should handle nested appearance paths', () => {
      const result = isLocked('appearance.theme', mockSystemPolicy);
      expect(result.locked).toBe(true);
    });

    it('should handle nested preferences paths', () => {
      const policyWithLanguageLock: SystemPolicy = {
        preferences: { language: 'en' },
        locks: { language: 'enforced' },
      };

      const result = isLocked('preferences.language', policyWithLanguageLock);
      expect(result.locked).toBe(true);
    });

    it('should handle nested notifications paths', () => {
      const policyWithEmailLock: SystemPolicy = {
        notifications: { email: false },
        locks: { email: 'managed' },
      };

      const result = isLocked('notifications.email', policyWithEmailLock);
      expect(result.locked).toBe(true);
    });

    it('should handle nested privacy paths', () => {
      const policyWithPrivacyLock: SystemPolicy = {
        privacy: { profileVisible: false },
        locks: { profileVisible: 'enforced' },
      };

      const result = isLocked('privacy.profileVisible', policyWithPrivacyLock);
      expect(result.locked).toBe(true);
    });
  });
});

// ============================================================================
// getSystemPreference Tests
// ============================================================================

describe('getSystemPreference', () => {
  describe('Color Scheme Mapping', () => {
    it('should map light color scheme to theme', () => {
      const prefs: SystemPreferences = { colorScheme: 'light' };
      const result = getSystemPreference('appearance.theme', prefs);

      expect(result).toBe('light');
    });

    it('should map dark color scheme to theme', () => {
      const prefs: SystemPreferences = { colorScheme: 'dark' };
      const result = getSystemPreference('appearance.theme', prefs);

      expect(result).toBe('dark');
    });
  });

  describe('Contrast Mapping', () => {
    it('should map "more" contrast to "high"', () => {
      const prefs: SystemPreferences = { contrast: 'more' };
      const result = getSystemPreference('appearance.contrast', prefs);

      expect(result).toBe('high');
    });

    it('should map "less" contrast to "normal"', () => {
      const prefs: SystemPreferences = { contrast: 'less' };
      const result = getSystemPreference('appearance.contrast', prefs);

      expect(result).toBe('normal');
    });

    it('should return undefined for "no-preference" contrast', () => {
      const prefs: SystemPreferences = { contrast: 'no-preference' };
      const result = getSystemPreference('appearance.contrast', prefs);

      expect(result).toBeUndefined();
    });
  });

  describe('Motion Mapping', () => {
    it('should map reducedMotion=true to "reduced"', () => {
      const prefs: SystemPreferences = { reducedMotion: true };
      const result = getSystemPreference('appearance.motion', prefs);

      expect(result).toBe('reduced');
    });

    it('should return undefined for reducedMotion=false', () => {
      const prefs: SystemPreferences = { reducedMotion: false };
      const result = getSystemPreference('appearance.motion', prefs);

      expect(result).toBeUndefined();
    });
  });

  describe('Unmapped Settings', () => {
    it('should return undefined for unmapped settings', () => {
      const prefs: SystemPreferences = { colorScheme: 'dark' };

      expect(getSystemPreference('appearance.fontSize', prefs)).toBeUndefined();
      expect(getSystemPreference('appearance.density', prefs)).toBeUndefined();
      expect(getSystemPreference('preferences.language', prefs)).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined preferences', () => {
      const result = getSystemPreference('appearance.theme', undefined);
      expect(result).toBeUndefined();
    });

    it('should handle empty preferences', () => {
      const prefs: SystemPreferences = {};
      const result = getSystemPreference('appearance.theme', prefs);
      expect(result).toBeUndefined();
    });
  });
});

// ============================================================================
// getDefaultValue Tests
// ============================================================================

describe('getDefaultValue', () => {
  describe('Appearance Defaults', () => {
    it('should return default theme', () => {
      const result = getDefaultValue('appearance.theme');

      expect(result).toBe('system');
    });

    it('should return default fontSize', () => {
      const result = getDefaultValue('appearance.fontSize');

      expect(result).toBe(1);
    });

    it('should return default density', () => {
      const result = getDefaultValue('appearance.density');

      expect(result).toBe('comfortable');
    });

    it('should return default contrast', () => {
      const result = getDefaultValue('appearance.contrast');

      expect(result).toBe('normal');
    });

    it('should return default motion', () => {
      const result = getDefaultValue('appearance.motion');

      expect(result).toBe('full');
    });
  });

  describe('Preferences Defaults', () => {
    it('should return default language', () => {
      const result = getDefaultValue('preferences.language');

      expect(result).toBe('it');
    });

    it('should return default difficulty', () => {
      const result = getDefaultValue('preferences.difficulty');

      expect(result).toBe('adaptive');
    });

    it('should return default autoPlay', () => {
      const result = getDefaultValue('preferences.autoPlay');

      expect(result).toBe(true);
    });
  });

  describe('Notifications Defaults', () => {
    it('should return default email', () => {
      const result = getDefaultValue('notifications.email');

      expect(result).toBe(true);
    });

    it('should return default push', () => {
      const result = getDefaultValue('notifications.push');

      expect(result).toBe(true);
    });

    it('should return default dailyReminder', () => {
      const result = getDefaultValue('notifications.dailyReminder');

      expect(result).toBe(false);
    });

    it('should return default streakReminder', () => {
      const result = getDefaultValue('notifications.streakReminder');

      expect(result).toBe(true);
    });
  });

  describe('Privacy Defaults', () => {
    it('should return default profileVisible', () => {
      const result = getDefaultValue('privacy.profileVisible');

      expect(result).toBe(true);
    });

    it('should return default progressVisible', () => {
      const result = getDefaultValue('privacy.progressVisible');

      expect(result).toBe(true);
    });

    it('should return default leaderboardVisible', () => {
      const result = getDefaultValue('privacy.leaderboardVisible');

      expect(result).toBe(true);
    });
  });

  describe('Consistency with DEFAULT_SETTINGS', () => {
    it('should match DEFAULT_SETTINGS values', () => {
      expect(getDefaultValue('appearance.theme')).toBe(DEFAULT_SETTINGS.appearance.theme);

      expect(getDefaultValue('appearance.fontSize')).toBe(DEFAULT_SETTINGS.appearance.fontSize);

      expect(getDefaultValue('preferences.language')).toBe(DEFAULT_SETTINGS.preferences.language);

      expect(getDefaultValue('notifications.email')).toBe(DEFAULT_SETTINGS.notifications.email);

      expect(getDefaultValue('privacy.profileVisible')).toBe(DEFAULT_SETTINGS.privacy.profileVisible);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration: Precedence + Locks', () => {
  it('should resolve enforced lock with policy value', () => {
    const { locked, mode } = isLocked('appearance.theme', mockSystemPolicy);
    const value = resolveSettingValue(
      'appearance.theme',
      mockUserSettings,
      mockSystemPolicy,
    );

    expect(locked).toBe(true);
    expect(mode).toBe('enforced');
    expect(value).toBe('dark'); // Policy forces 'dark'
  });

  it('should resolve managed lock with user value', () => {
    const { locked, mode } = isLocked('appearance.fontSize', mockSystemPolicy);
    const value = resolveSettingValue(
      'appearance.fontSize',
      mockUserSettings,
      mockSystemPolicy,
    );

    expect(locked).toBe(true);
    expect(mode).toBe('managed');
    expect(value).toBe(1.125); // Policy value (but user choice preserved in UI)
  });

  it('should resolve unlocked setting with user value', () => {
    const { locked } = isLocked('appearance.density', mockSystemPolicy);
    const value = resolveSettingValue(
      'appearance.density',
      mockUserSettings,
      mockSystemPolicy,
    );

    expect(locked).toBe(false);
    expect(value).toBe('comfortable'); // User value
  });
});

