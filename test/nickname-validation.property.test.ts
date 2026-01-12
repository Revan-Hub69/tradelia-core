/**
 * Property-Based Tests for Nickname Validation
 * 
 * Feature: auth-flow-improvements
 * Property 3: Nickname Validation
 * Validates: Requirements 6.4
 * 
 * For any string input as nickname, if the length is less than 3 or greater 
 * than 20 characters, or contains characters other than alphanumeric and 
 * underscore, the validation should reject it.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateNickname } from '@/src/shared/lib/validation';

// Valid characters for nickname
const VALID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
const INVALID_CHARS = '!@#$%^&*()+-=[]{}|;:\'",.<>?/`~ ';

// Helper to generate string from character set
const stringFromChars = (chars: string, minLength: number, maxLength: number) =>
  fc.array(fc.constantFrom(...chars.split('')), { minLength, maxLength })
    .map(arr => arr.join(''));

describe('Nickname Validation - Property Tests', () => {
  /**
   * Property 3: Nickname Validation
   * Validates: Requirements 6.4
   */
  
  it('should reject nicknames shorter than 3 characters', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 2 }),
        (shortNickname) => {
          const result = validateNickname(shortNickname);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error).toBe('minLength');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject nicknames longer than 20 characters', () => {
    fc.assert(
      fc.property(
        stringFromChars(VALID_CHARS, 21, 50),
        (longNickname) => {
          const result = validateNickname(longNickname);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error).toBe('maxLength');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject nicknames with invalid characters', () => {
    fc.assert(
      fc.property(
        stringFromChars(VALID_CHARS, 1, 8),
        stringFromChars(INVALID_CHARS, 1, 3),
        stringFromChars(VALID_CHARS, 1, 8),
        (prefix, invalid, suffix) => {
          const nicknameWithInvalid = prefix + invalid + suffix;
          // Only test if length is valid (3-20)
          if (nicknameWithInvalid.length >= 3 && nicknameWithInvalid.length <= 20) {
            const result = validateNickname(nicknameWithInvalid);
            expect(result.success).toBe(false);
            if (!result.success) {
              expect(result.error).toBe('invalid');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid nicknames (3-20 chars, alphanumeric + underscore)', () => {
    fc.assert(
      fc.property(
        stringFromChars(VALID_CHARS, 3, 20),
        (validNickname) => {
          const result = validateNickname(validNickname);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case: exactly 3 characters (minimum valid)', () => {
    fc.assert(
      fc.property(
        stringFromChars(VALID_CHARS, 3, 3),
        (nickname) => {
          const result = validateNickname(nickname);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case: exactly 20 characters (maximum valid)', () => {
    fc.assert(
      fc.property(
        stringFromChars(VALID_CHARS, 20, 20),
        (nickname) => {
          const result = validateNickname(nickname);
          expect(result.success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
