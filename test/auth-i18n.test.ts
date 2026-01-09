/**
 * Auth i18n Tests
 * Tests for translation system correctness properties
 */

import { describe, it, expect } from 'vitest';
import { translations } from '../lib/translations';
import { safeRedirect } from '../lib/auth/safe-redirect';
import { mapAuthErrorToKey } from '../lib/auth/error-mapping';

// Helper to get all keys from nested object
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

describe('Property 3: Translation Key Parity', () => {
  it('should have matching auth keys in both IT and EN locales', () => {
    const itAuthKeys = getAllKeys(translations.it.auth as Record<string, unknown>);
    const enAuthKeys = getAllKeys(translations.en.auth as Record<string, unknown>);
    
    // Sort for comparison
    const sortedIt = [...itAuthKeys].sort();
    const sortedEn = [...enAuthKeys].sort();
    
    expect(sortedIt).toEqual(sortedEn);
  });

  it('should have all required auth.common keys', () => {
    const requiredKeys = [
      'backToHome',
      'loading',
      'error',
      'success',
      'or',
      'continueWithGoogle',
      'rateLimited',
      'errorGeneric',
      'emailSentIfExists',
      'aria.closeModal',
      'aria.submit',
      'aria.emailField',
      'aria.passwordField',
      'aria.backToHome'
    ];

    for (const key of requiredKeys) {
      const itValue = getNestedValue(translations.it.auth.common, key);
      const enValue = getNestedValue(translations.en.auth.common, key);
      
      expect(itValue, `IT auth.common.${key} should exist`).toBeDefined();
      expect(enValue, `EN auth.common.${key} should exist`).toBeDefined();
      expect(typeof itValue).toBe('string');
      expect(typeof enValue).toBe('string');
    }
  });

  it('should have all required auth.login keys', () => {
    const requiredKeys = [
      'title',
      'subtitle',
      'email',
      'emailPlaceholder',
      'password',
      'passwordPlaceholder',
      'submit',
      'submitting',
      'forgotPassword',
      'noAccount',
      'errors.required',
      'errors.invalid'
    ];

    for (const key of requiredKeys) {
      const itValue = getNestedValue(translations.it.auth.login, key);
      const enValue = getNestedValue(translations.en.auth.login, key);
      
      expect(itValue, `IT auth.login.${key} should exist`).toBeDefined();
      expect(enValue, `EN auth.login.${key} should exist`).toBeDefined();
    }
  });

  it('should have all required auth.register keys', () => {
    const requiredKeys = [
      'title',
      'subtitle',
      'fullName',
      'fullNamePlaceholder',
      'email',
      'emailPlaceholder',
      'password',
      'passwordPlaceholder',
      'confirmPassword',
      'confirmPasswordPlaceholder',
      'submit',
      'submitting',
      'terms',
      'errors.nameRequired',
      'errors.emailRequired',
      'errors.emailInvalid',
      'errors.passwordRequired',
      'errors.passwordMinLength',
      'errors.passwordMismatch',
      'errors.registerError'
    ];

    for (const key of requiredKeys) {
      const itValue = getNestedValue(translations.it.auth.register, key);
      const enValue = getNestedValue(translations.en.auth.register, key);
      
      expect(itValue, `IT auth.register.${key} should exist`).toBeDefined();
      expect(enValue, `EN auth.register.${key} should exist`).toBeDefined();
    }
  });
});

describe('Property 4: Translation Fallback Behavior', () => {
  it('should return key as fallback for missing translations', () => {
    // Simulate t() function behavior
    const t = (key: string, locale: 'it' | 'en' = 'it'): string => {
      const keys = key.split('.');
      let value: unknown = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // Fallback
        }
      }
      
      return typeof value === 'string' ? value : key;
    };

    // Test missing key returns key itself
    expect(t('auth.nonexistent.key')).toBe('auth.nonexistent.key');
    expect(t('completely.fake.path')).toBe('completely.fake.path');
    
    // Test existing keys return actual values
    expect(t('auth.login.title')).not.toBe('auth.login.title');
    expect(t('auth.common.backToHome')).not.toBe('auth.common.backToHome');
  });

  it('should never return undefined or empty string for missing keys', () => {
    const t = (key: string, locale: 'it' | 'en' = 'it'): string => {
      const keys = key.split('.');
      let value: unknown = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    };

    const result = t('nonexistent.key');
    expect(result).not.toBeUndefined();
    expect(result).not.toBe('');
    expect(result).toBe('nonexistent.key');
  });
});

describe('Safe Redirect Security Tests', () => {
  it('should allow valid relative paths', () => {
    expect(safeRedirect('/dashboard')).toBe('/dashboard');
    expect(safeRedirect('/')).toBe('/');
    expect(safeRedirect('/it/dashboard')).toBe('/it/dashboard');
    expect(safeRedirect('/en/dashboard')).toBe('/en/dashboard');
  });

  it('should block protocol-relative URLs', () => {
    expect(safeRedirect('//evil.com')).toBe('/');
    expect(safeRedirect('//evil.com/path')).toBe('/');
  });

  it('should block javascript: URLs', () => {
    expect(safeRedirect('javascript:alert(1)')).toBe('/');
    expect(safeRedirect('JAVASCRIPT:alert(1)')).toBe('/');
    expect(safeRedirect('/path?redirect=javascript:alert(1)')).toBe('/');
  });

  it('should block data: URLs', () => {
    expect(safeRedirect('data:text/html,<script>alert(1)</script>')).toBe('/');
  });

  it('should block absolute URLs', () => {
    expect(safeRedirect('https://evil.com')).toBe('/');
    expect(safeRedirect('http://evil.com')).toBe('/');
  });

  it('should block encoded tricks', () => {
    expect(safeRedirect('%2F%2Fevil.com')).toBe('/'); // //evil.com encoded
  });

  it('should return fallback for null/undefined', () => {
    expect(safeRedirect(null)).toBe('/');
    expect(safeRedirect(null, '/dashboard')).toBe('/dashboard');
  });

  it('should allow paths that start with allowlisted prefixes', () => {
    // The allowlist uses startsWith, so paths starting with allowed prefixes pass
    expect(safeRedirect('/dashboard/settings')).toBe('/dashboard/settings');
    expect(safeRedirect('/auth/login')).toBe('/auth/login');
  });
});

describe('Error Mapping Tests', () => {
  it('should map invalid_credentials to generic login error', () => {
    const error = { code: 'invalid_credentials' };
    expect(mapAuthErrorToKey(error)).toBe('auth.login.errors.invalid');
  });

  it('should map user_not_found to generic login error (anti-enumeration)', () => {
    const error = { code: 'user_not_found' };
    expect(mapAuthErrorToKey(error)).toBe('auth.login.errors.invalid');
  });

  it('should map rate limit errors', () => {
    const error = { code: 'over_request_rate_limit' };
    expect(mapAuthErrorToKey(error)).toBe('auth.common.rateLimited');
  });

  it('should map token errors to invalid link', () => {
    expect(mapAuthErrorToKey({ code: 'invalid_token' })).toBe('auth.resetPassword.errors.invalidLink');
    expect(mapAuthErrorToKey({ code: 'expired_token' })).toBe('auth.resetPassword.errors.invalidLink');
  });

  it('should return generic error for unknown errors', () => {
    expect(mapAuthErrorToKey({})).toBe('auth.common.errorGeneric');
    expect(mapAuthErrorToKey(null)).toBe('auth.common.errorGeneric');
    expect(mapAuthErrorToKey(undefined)).toBe('auth.common.errorGeneric');
    expect(mapAuthErrorToKey('string error')).toBe('auth.common.errorGeneric');
  });
});

describe('Anti-Enumeration: Generic Error Messages', () => {
  it('should use generic messages that do not reveal user existence', () => {
    // IT locale
    expect(translations.it.auth.login.errors.invalid).not.toContain('non esiste');
    expect(translations.it.auth.login.errors.invalid).not.toContain('non trovato');
    expect(translations.it.auth.forgotPassword.successSubtitle).toContain('Se l\'indirizzo');
    
    // EN locale
    expect(translations.en.auth.login.errors.invalid).not.toContain('not found');
    expect(translations.en.auth.login.errors.invalid).not.toContain('does not exist');
    expect(translations.en.auth.forgotPassword.successSubtitle).toContain('If the address');
  });

  it('should not have emailNotFound error key in verifyEmail', () => {
    // Verify that we don't expose email enumeration in verify email errors
    const itVerifyErrors = translations.it.auth.verifyEmail.errors;
    const enVerifyErrors = translations.en.auth.verifyEmail.errors;
    
    expect(itVerifyErrors).not.toHaveProperty('emailNotFound');
    expect(enVerifyErrors).not.toHaveProperty('emailNotFound');
  });
});

// Helper function to get nested value
function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return value;
}
