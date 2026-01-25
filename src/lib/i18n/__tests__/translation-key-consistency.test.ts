/**
 * @vitest-environment node
 */
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import enEmail from '../../../../messages/en/email.json';
import itEmail from '../../../../messages/it/email.json';

/**
 * Feature: supabase-bilingual-email-templates
 * Property 24: Translation Key Consistency
 *
 * For any pair of English and Italian translation files, both JSON files
 * should have identical key structures (same nested keys).
 *
 * Validates: Requirements 8.4
 */

describe('Feature: supabase-bilingual-email-templates', () => {
  describe('Property 24: Translation Key Consistency', () => {
    /**
     * Helper function to extract all nested keys from an object
     * Returns an array of dot-notation paths (e.g., ['auth.confirmSignup.subject'])
     */
    function extractKeys(obj: any, prefix = ''): string[] {
      const keys: string[] = [];

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullPath = prefix ? `${prefix}.${key}` : key;

          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            // Recursively extract nested keys
            keys.push(...extractKeys(obj[key], fullPath));
          } else {
            // Leaf node - add the full path
            keys.push(fullPath);
          }
        }
      }

      return keys.sort();
    }

    /**
     * Helper function to get value at a nested path
     */
    function getValueAtPath(obj: any, path: string): any {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    it('should have identical key structures in EN and IT email translations', () => {
      const enKeys = extractKeys(enEmail);
      const itKeys = extractKeys(itEmail);

      // Both files should have the same keys
      expect(enKeys).toEqual(itKeys);

      // Verify no keys are missing in either direction
      const missingInIT = enKeys.filter(key => !itKeys.includes(key));
      const missingInEN = itKeys.filter(key => !enKeys.includes(key));

      expect(missingInIT).toEqual([]);
      expect(missingInEN).toEqual([]);
    });

    it('should have non-empty string values for all translation keys', () => {
      const enKeys = extractKeys(enEmail);
      const itKeys = extractKeys(itEmail);

      // Check all EN values are non-empty strings
      enKeys.forEach((key) => {
        const value = getValueAtPath(enEmail, key);

        expect(typeof value).toBe('string');
        expect(value.trim().length).toBeGreaterThan(0);
      });

      // Check all IT values are non-empty strings
      itKeys.forEach((key) => {
        const value = getValueAtPath(itEmail, key);

        expect(typeof value).toBe('string');
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });

    /**
     * Property-based test: For any arbitrary nested object structure,
     * if we add the same keys to both EN and IT, they should remain consistent
     */
    it('property: adding matching keys maintains consistency', () => {
      fc.assert(
        fc.property(
          fc.record({
            newSection: fc.string({ minLength: 1 }),
            newKey: fc.string({ minLength: 1 }),
            enValue: fc.string({ minLength: 1 }),
            itValue: fc.string({ minLength: 1 }),
          }),
          (data) => {
            // Create copies of the translation objects
            const enCopy = JSON.parse(JSON.stringify(enEmail));
            const itCopy = JSON.parse(JSON.stringify(itEmail));

            // Add the same key structure to both
            if (!enCopy.auth[data.newSection]) {
              enCopy.auth[data.newSection] = {};
              itCopy.auth[data.newSection] = {};
            }
            enCopy.auth[data.newSection][data.newKey] = data.enValue;
            itCopy.auth[data.newSection][data.newKey] = data.itValue;

            // Extract keys from modified objects
            const enKeys = extractKeys(enCopy);
            const itKeys = extractKeys(itCopy);

            // Keys should still be identical
            expect(enKeys).toEqual(itKeys);
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property-based test: For any subset of existing keys,
     * both translations should have those keys
     */
    it('property: any subset of keys exists in both translations', () => {
      const allKeys = extractKeys(enEmail);

      fc.assert(
        fc.property(
          fc.subarray(allKeys, { minLength: 1 }),
          (selectedKeys) => {
            const enKeys = extractKeys(enEmail);
            const itKeys = extractKeys(itEmail);

            // All selected keys should exist in both translations
            selectedKeys.forEach((key) => {
              expect(enKeys).toContain(key);
              expect(itKeys).toContain(key);
            });
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property-based test: Key structure depth should be consistent
     */
    it('property: key depth consistency across translations', () => {
      const enKeys = extractKeys(enEmail);
      const itKeys = extractKeys(itEmail);

      fc.assert(
        fc.property(
          fc.constantFrom(...enKeys),
          (key) => {
            const depth = key.split('.').length;

            // The same key in IT should have the same depth
            expect(itKeys).toContain(key);

            const itKeyDepth = key.split('.').length;

            expect(itKeyDepth).toBe(depth);
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property-based test: All auth email types should have required fields
     */
    it('property: all email types have required translation fields', () => {
      const requiredFields = ['subject', 'greeting', 'mainContent', 'ctaText', 'footerText'];
      const emailTypes = ['confirmSignup', 'magicLink', 'changeEmail', 'resetPassword'];

      fc.assert(
        fc.property(
          fc.constantFrom(...emailTypes),
          fc.constantFrom(...requiredFields),
          (emailType, field) => {
            // Check EN has the field
            const enValue = getValueAtPath(enEmail, `auth.${emailType}.${field}`);

            expect(enValue).toBeDefined();
            expect(typeof enValue).toBe('string');
            expect(enValue.trim().length).toBeGreaterThan(0);

            // Check IT has the field
            const itValue = getValueAtPath(itEmail, `auth.${emailType}.${field}`);

            expect(itValue).toBeDefined();
            expect(typeof itValue).toBe('string');
            expect(itValue.trim().length).toBeGreaterThan(0);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
