/**
 * Settings Migration Tests
 *
 * @module lib/settings/__tests__/migration
 * @version 1.0.0
 * @since 2026-01-21
 */

import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '@/types/settings';

import { getDefaultSettings, migrateSettings } from '../migration';

describe('migrateSettings', () => {
  // ============================================================================
  // Null/Undefined Handling
  // ============================================================================

  it('should return defaults for null', () => {
    const result = migrateSettings(null);
    
    expect(result.version).toBe(1);
    expect(result.appearance).toBeDefined();
    expect(result.preferences).toBeDefined();
    expect(result.notifications).toBeDefined();
    expect(result.privacy).toBeDefined();
  });

  it('should return defaults for undefined', () => {
    const result = migrateSettings(undefined);
    
    expect(result.version).toBe(1);
    expect(result).toMatchObject({
      version: 1,
      appearance: expect.any(Object),
      preferences: expect.any(Object),
      notifications: expect.any(Object),
      privacy: expect.any(Object),
    });
  });

  it('should return defaults for non-object', () => {
    expect(migrateSettings('string').version).toBe(1);
    expect(migrateSettings(123).version).toBe(1);
    expect(migrateSettings(true).version).toBe(1);
  });

  // ============================================================================
  // Legacy → V1 Migration
  // ============================================================================

  it('should migrate legacy settings with darkMode=true', () => {
    const legacy = {
      darkMode: true,
      language: 'it',
      difficulty: 'beginner',
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.version).toBe(1);
    expect(result.appearance.theme).toBe('dark');
    expect(result.preferences.language).toBe('it');
    expect(result.preferences.difficulty).toBe('beginner');
  });

  it('should migrate legacy settings with darkMode=false', () => {
    const legacy = {
      darkMode: false,
      language: 'en',
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.version).toBe(1);
    expect(result.appearance.theme).toBe('light');
    expect(result.preferences.language).toBe('en');
  });

  it('should migrate legacy settings without darkMode', () => {
    const legacy = {
      language: 'it',
      autoPlay: false,
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.version).toBe(1);
    expect(result.appearance.theme).toBe('system'); // Default
    expect(result.preferences.language).toBe('it');
    expect(result.preferences.autoPlay).toBe(false);
  });

  it('should preserve all legacy notification settings', () => {
    const legacy = {
      email: false,
      push: true,
      dailyReminder: true,
      streakReminder: false,
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.notifications.email).toBe(false);
    expect(result.notifications.push).toBe(true);
    expect(result.notifications.dailyReminder).toBe(true);
    expect(result.notifications.streakReminder).toBe(false);
  });

  it('should preserve all legacy privacy settings', () => {
    const legacy = {
      profileVisible: false,
      progressVisible: true,
      leaderboardVisible: false,
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.privacy.profileVisible).toBe(false);
    expect(result.privacy.progressVisible).toBe(true);
    expect(result.privacy.leaderboardVisible).toBe(false);
  });

  it('should fill missing fields with defaults', () => {
    const legacy = {
      language: 'it',
      // Missing: all other fields
    };
    
    const result = migrateSettings(legacy);
    
    expect(result.version).toBe(1);
    expect(result.appearance.fontSize).toBe(1);
    expect(result.appearance.density).toBe('comfortable');
    expect(result.appearance.contrast).toBe('normal');
    expect(result.appearance.motion).toBe('full');
    expect(result.preferences.difficulty).toBe('adaptive');
    expect(result.preferences.autoPlay).toBe(true);
  });

  it('should handle empty legacy object', () => {
    const legacy = {};
    
    const result = migrateSettings(legacy);
    
    expect(result.version).toBe(1);
    expect(result.appearance.theme).toBe('system');
    expect(result.preferences.language).toBe('it'); // Default
  });

  // ============================================================================
  // V1 → V1 (No-op)
  // ============================================================================

  it('should return V1 settings unchanged', () => {
    const v1 = {
      version: 1,
      updatedAt: '2026-01-21T10:00:00Z',
      appearance: {
        theme: 'dark' as const,
        fontSize: 1.125 as const,
        density: 'compact' as const,
        contrast: 'high' as const,
        motion: 'reduced' as const,
      },
      preferences: {
        language: 'en',
        difficulty: 'advanced' as const,
        autoPlay: false,
      },
      notifications: {
        email: false,
        push: true,
        dailyReminder: true,
        streakReminder: false,
      },
      privacy: {
        profileVisible: false,
        progressVisible: true,
        leaderboardVisible: false,
      },
    };
    
    const result = migrateSettings(v1);
    
    expect(result).toEqual(v1);
  });

  it('should return defaults for invalid V1 structure (missing appearance)', () => {
    const invalid = {
      version: 1,
      updatedAt: '2026-01-21T10:00:00Z',
      // Missing: appearance
      preferences: {},
      notifications: {},
      privacy: {},
    };
    
    const result = migrateSettings(invalid);
    
    expect(result.version).toBe(1);
    expect(result.appearance).toBeDefined();
  });

  it('should return defaults for invalid V1 structure (wrong types)', () => {
    const invalid = {
      version: 1,
      updatedAt: '2026-01-21T10:00:00Z',
      appearance: 'not an object', // Wrong type
      preferences: {},
      notifications: {},
      privacy: {},
    };
    
    const result = migrateSettings(invalid);
    
    expect(result.version).toBe(1);
    expect(typeof result.appearance).toBe('object');
  });

  // ============================================================================
  // Future Versions
  // ============================================================================

  it('should return defaults for unsupported version', () => {
    const future = {
      version: 2,
      // ... future fields
    };
    
    const result = migrateSettings(future);
    
    expect(result.version).toBe(1);
    expect(result).toMatchObject({
      version: 1,
      appearance: expect.any(Object),
    });
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  it('should handle circular references gracefully', () => {
    const circular: any = { language: 'it' };
    circular.self = circular;
    
    const result = migrateSettings(circular);
    
    expect(result.version).toBe(1);
  });

  it('should handle objects with getters that throw', () => {
    const throwing = {
      get language() {
        throw new Error('Getter error');
      },
    };
    
    const result = migrateSettings(throwing);
    
    expect(result.version).toBe(1);
  });

  // ============================================================================
  // Timestamp Handling
  // ============================================================================

  it('should set current timestamp for migrated settings', () => {
    const legacy = { language: 'it' };
    const before = new Date().toISOString();
    
    const result = migrateSettings(legacy);
    
    const after = new Date().toISOString();
    
    expect(result.updatedAt).toBeDefined();
    expect(result.updatedAt >= before).toBe(true);
    expect(result.updatedAt <= after).toBe(true);
  });

  it('should preserve timestamp for V1 settings', () => {
    const v1 = {
      version: 1,
      updatedAt: '2026-01-01T00:00:00Z',
      appearance: { theme: 'dark' as const, fontSize: 1 as const, density: 'comfortable' as const, contrast: 'normal' as const, motion: 'full' as const },
      preferences: { language: 'it', difficulty: 'adaptive' as const, autoPlay: true },
      notifications: { email: true, push: true, dailyReminder: false, streakReminder: true },
      privacy: { profileVisible: true, progressVisible: true, leaderboardVisible: true },
    };
    
    const result = migrateSettings(v1);
    
    expect(result.updatedAt).toBe('2026-01-01T00:00:00Z');
  });
});

describe('getDefaultSettings', () => {
  it('should return default settings with current timestamp', () => {
    const before = new Date().toISOString();
    const result = getDefaultSettings();
    const after = new Date().toISOString();
    
    expect(result.version).toBe(1);
    expect(result.updatedAt >= before).toBe(true);
    expect(result.updatedAt <= after).toBe(true);
  });

  it('should return a fresh copy each time', () => {
    const first = getDefaultSettings();
    const second = getDefaultSettings();
    
    expect(first).not.toBe(second); // Different objects
    expect(first).toEqual(second); // Same values
  });

  it('should match DEFAULT_SETTINGS structure', () => {
    const result = getDefaultSettings();
    
    expect(result.version).toBe(DEFAULT_SETTINGS.version);
    expect(result.appearance.theme).toBe(DEFAULT_SETTINGS.appearance.theme);
    expect(result.preferences.language).toBe(DEFAULT_SETTINGS.preferences.language);
  });
});
