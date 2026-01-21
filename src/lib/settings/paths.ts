/**
 * Settings Path Utilities
 *
 * Utility functions for accessing and setting nested values in settings objects
 * using dot-notation paths with compile-time type safety.
 *
 * @module lib/settings/paths
 * @version 1.0.0
 * @since 2026-01-21
 *
 * Task: P1.T2B
 * Design: .kiro/specs/dashboard-accessibility-personalization/design.md
 */

import type { SettingsPath, SettingsPathValue } from '@/types/settingsPaths';

// ============================================================================
// Nested Value Access
// ============================================================================

/**
 * Get a nested value from an object using dot-notation path
 *
 * @example
 * ```typescript
 * const settings = { appearance: { theme: 'dark' } };
 * const theme = getNestedValue(settings, 'appearance.theme');
 * // Result: 'dark'
 * ```
 */
export function getNestedValue<T extends SettingsPath>(
  obj: Record<string, any>,
  path: T,
): SettingsPathValue<T> | undefined {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current as SettingsPathValue<T> | undefined;
}

/**
 * Set a nested value in an object using dot-notation path
 *
 * Creates a new object with the updated value (immutable).
 *
 * @example
 * ```typescript
 * const settings = { appearance: { theme: 'light' } };
 * const updated = setNestedValue(settings, 'appearance.theme', 'dark');
 * // Result: { appearance: { theme: 'dark' } }
 * ```
 */
export function setNestedValue<T extends SettingsPath>(
  obj: Record<string, any>,
  path: T,
  value: SettingsPathValue<T>,
): Record<string, any> {
  const keys = path.split('.');
  const result = { ...obj };
  let current: any = result;

  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] as string;

    // Create nested object if it doesn't exist
    if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    } else {
      // Clone the nested object to maintain immutability
      current[key] = { ...current[key] };
    }

    current = current[key];
  }

  // Set the final value
  const lastKey = keys[keys.length - 1] as string;
  current[lastKey] = value;

  return result;
}

/**
 * Check if a nested path exists in an object
 *
 * @example
 * ```typescript
 * const settings = { appearance: { theme: 'dark' } };
 * hasNestedPath(settings, 'appearance.theme'); // true
 * hasNestedPath(settings, 'appearance.invalid'); // false
 * ```
 */
export function hasNestedPath(
  obj: Record<string, any>,
  path: SettingsPath,
): boolean {
  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}

/**
 * Delete a nested value from an object using dot-notation path
 *
 * Creates a new object with the value removed (immutable).
 *
 * @example
 * ```typescript
 * const settings = { appearance: { theme: 'dark', fontSize: 1 } };
 * const updated = deleteNestedValue(settings, 'appearance.fontSize');
 * // Result: { appearance: { theme: 'dark' } }
 * ```
 */
export function deleteNestedValue(
  obj: Record<string, any>,
  path: SettingsPath,
): Record<string, any> {
  const keys = path.split('.');
  const result = { ...obj };
  let current: any = result;
  const parents: any[] = [result];

  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] as string;

    if (current[key] === null || current[key] === undefined) {
      return result; // Path doesn't exist, return unchanged
    }

    // Clone the nested object to maintain immutability
    current[key] = { ...current[key] };
    current = current[key];
    parents.push(current);
  }

  // Delete the final key
  const lastKey = keys[keys.length - 1] as string;
  delete current[lastKey];

  return result;
}
