/**
 * Settings Path Utilities Tests
 *
 * @module lib/settings/__tests__/paths
 * @version 1.0.0
 * @since 2026-01-21
 */

import { describe, expect, it } from 'vitest';

import {
  deleteNestedValue,
  getNestedValue,
  hasNestedPath,
  setNestedValue,
} from '../paths';

describe('getNestedValue', () => {
  it('should get a top-level value', () => {
    const obj = { appearance: { theme: 'dark' } };
    const result = getNestedValue(obj, 'appearance.theme');
    expect(result).toBe('dark');
  });

  it('should get a deeply nested value', () => {
    const obj = {
      appearance: {
        manualSchedule: {
          lightStart: '08:00',
          darkStart: '20:00',
        },
      },
    };
    const result = getNestedValue(obj, 'appearance.manualSchedule.lightStart');
    expect(result).toBe('08:00');
  });

  it('should return undefined for non-existent path', () => {
    const obj = { appearance: { theme: 'dark' } };
    const result = getNestedValue(obj, 'appearance.fontSize' as any);
    expect(result).toBeUndefined();
  });

  it('should return undefined for null intermediate value', () => {
    const obj = { appearance: null };
    const result = getNestedValue(obj, 'appearance.theme' as any);
    expect(result).toBeUndefined();
  });

  it('should handle boolean values', () => {
    const obj = { privacy: { profileVisible: true } };
    const result = getNestedValue(obj, 'privacy.profileVisible');
    expect(result).toBe(true);
  });

  it('should handle number values', () => {
    const obj = { appearance: { fontSize: 1.125 } };
    const result = getNestedValue(obj, 'appearance.fontSize');
    expect(result).toBe(1.125);
  });
});

describe('setNestedValue', () => {
  it('should set a top-level value', () => {
    const obj = { appearance: { theme: 'light' } };
    const result = setNestedValue(obj, 'appearance.theme', 'dark');
    
    expect(result.appearance.theme).toBe('dark');
    expect(obj.appearance.theme).toBe('light'); // Original unchanged
  });

  it('should set a deeply nested value', () => {
    const obj = {
      appearance: {
        manualSchedule: {
          lightStart: '08:00',
          darkStart: '20:00',
        },
      },
    };
    const result = setNestedValue(obj, 'appearance.manualSchedule.lightStart', '09:00');
    
    expect(result.appearance.manualSchedule.lightStart).toBe('09:00');
    expect(obj.appearance.manualSchedule.lightStart).toBe('08:00'); // Original unchanged
  });

  it('should create missing intermediate objects', () => {
    const obj = {};
    const result = setNestedValue(obj, 'appearance.theme', 'dark');
    
    expect(result.appearance.theme).toBe('dark');
  });

  it('should preserve other properties', () => {
    const obj = {
      appearance: { theme: 'light', fontSize: 1 },
      preferences: { language: 'it' },
    };
    const result = setNestedValue(obj, 'appearance.theme', 'dark');
    
    expect(result.appearance.theme).toBe('dark');
    expect(result.appearance.fontSize).toBe(1);
    expect(result.preferences.language).toBe('it');
  });

  it('should handle boolean values', () => {
    const obj = { privacy: { profileVisible: false } };
    const result = setNestedValue(obj, 'privacy.profileVisible', true);
    
    expect(result.privacy.profileVisible).toBe(true);
  });

  it('should handle number values', () => {
    const obj = { appearance: { fontSize: 1 } };
    const result = setNestedValue(obj, 'appearance.fontSize', 1.125);
    
    expect(result.appearance.fontSize).toBe(1.125);
  });

  it('should maintain immutability', () => {
    const obj = { appearance: { theme: 'light' } };
    const result = setNestedValue(obj, 'appearance.theme', 'dark');
    
    expect(obj).not.toBe(result);
    expect(obj.appearance).not.toBe(result.appearance);
  });
});

describe('hasNestedPath', () => {
  it('should return true for existing path', () => {
    const obj = { appearance: { theme: 'dark' } };
    const result = hasNestedPath(obj, 'appearance.theme');
    expect(result).toBe(true);
  });

  it('should return false for non-existent path', () => {
    const obj = { appearance: { theme: 'dark' } };
    const result = hasNestedPath(obj, 'appearance.fontSize');
    expect(result).toBe(false);
  });

  it('should return false for null intermediate value', () => {
    const obj = { appearance: null };
    const result = hasNestedPath(obj, 'appearance.theme');
    expect(result).toBe(false);
  });

  it('should return false for undefined intermediate value', () => {
    const obj = { appearance: undefined };
    const result = hasNestedPath(obj, 'appearance.theme');
    expect(result).toBe(false);
  });

  it('should return true for deeply nested path', () => {
    const obj = {
      appearance: {
        manualSchedule: {
          lightStart: '08:00',
        },
      },
    };
    const result = hasNestedPath(obj, 'appearance.manualSchedule.lightStart');
    expect(result).toBe(true);
  });

  it('should handle boolean values', () => {
    const obj = { privacy: { profileVisible: false } };
    const result = hasNestedPath(obj, 'privacy.profileVisible');
    expect(result).toBe(true);
  });
});

describe('deleteNestedValue', () => {
  it('should delete a top-level value', () => {
    const obj = { appearance: { theme: 'dark', fontSize: 1 } };
    const result = deleteNestedValue(obj, 'appearance.fontSize');
    
    expect(result.appearance.fontSize).toBeUndefined();
    expect(result.appearance.theme).toBe('dark');
    expect(obj.appearance.fontSize).toBe(1); // Original unchanged
  });

  it('should delete a deeply nested value', () => {
    const obj = {
      appearance: {
        manualSchedule: {
          lightStart: '08:00',
          darkStart: '20:00',
        },
      },
    };
    const result = deleteNestedValue(obj, 'appearance.manualSchedule.lightStart');
    
    expect(result.appearance.manualSchedule.lightStart).toBeUndefined();
    expect(result.appearance.manualSchedule.darkStart).toBe('20:00');
  });

  it('should return unchanged object for non-existent path', () => {
    const obj = { appearance: { theme: 'dark' } };
    const result = deleteNestedValue(obj, 'appearance.fontSize');
    
    expect(result).toEqual(obj);
  });

  it('should maintain immutability', () => {
    const obj = { appearance: { theme: 'dark', fontSize: 1 } };
    const result = deleteNestedValue(obj, 'appearance.fontSize');
    
    expect(obj).not.toBe(result);
    expect(obj.appearance).not.toBe(result.appearance);
    expect(obj.appearance.fontSize).toBe(1);
  });

  it('should preserve other properties', () => {
    const obj = {
      appearance: { theme: 'dark', fontSize: 1 },
      preferences: { language: 'it' },
    };
    const result = deleteNestedValue(obj, 'appearance.fontSize');
    
    expect(result.appearance.theme).toBe('dark');
    expect(result.preferences.language).toBe('it');
  });
});
