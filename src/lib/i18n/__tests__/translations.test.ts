import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const MESSAGES_DIR = join(__dirname, '../../../../messages');

/**
 * Flatten nested JSON object into dot-notation keys
 */
function flattenKeys(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}

/**
 * Validate ICU message format syntax
 */
function validateICUFormat(message: string): string | null {
  // Check for unmatched braces
  const openBraces = (message.match(/\{/g) || []).length;
  const closeBraces = (message.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    return `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`;
  }

  // Check for valid placeholder syntax
  const placeholderRegex = /\{([^}]*)\}/g;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = placeholderRegex.exec(message)) !== null) {
    const content = match[1]?.trim() ?? '';

    // Empty placeholder
    if (!content) {
      return `Empty placeholder: ${match[0]}`;
    }

    // Check for valid ICU format
    const parts = content.split(',').map(p => p.trim());

    if (parts.length > 3) {
      return `Invalid placeholder format: ${match[0]}`;
    }

    // If type is specified, validate it
    if (parts.length >= 2) {
      const type = parts[1];
      const validTypes = ['number', 'date', 'time', 'plural', 'selectordinal', 'select'];

      if (type && !validTypes.includes(type)) {
        return `Invalid placeholder type "${type}" in: ${match[0]}`;
      }
    }
  }

  return null;
}

describe('Translation Validation', () => {
  const locales = ['en', 'it'];
  const namespaces = ['dashboard-settings'];

  describe('File Structure', () => {
    it('should have all required locale directories', () => {
      for (const locale of locales) {
        const localeDir = join(MESSAGES_DIR, locale);

        expect(() => readFileSync(join(localeDir, 'dashboard-settings.json'), 'utf-8')).not.toThrow();
      }
    });

    it('should have valid JSON in all translation files', () => {
      for (const locale of locales) {
        for (const namespace of namespaces) {
          const filePath = join(MESSAGES_DIR, locale, `${namespace}.json`);
          const content = readFileSync(filePath, 'utf-8');

          expect(() => JSON.parse(content)).not.toThrow();
        }
      }
    });
  });

  describe('Translation Keys', () => {
    it('should have all keys in both locales', () => {
      for (const namespace of namespaces) {
        const enPath = join(MESSAGES_DIR, 'en', `${namespace}.json`);
        const itPath = join(MESSAGES_DIR, 'it', `${namespace}.json`);

        const enContent = JSON.parse(readFileSync(enPath, 'utf-8'));
        const itContent = JSON.parse(readFileSync(itPath, 'utf-8'));

        const enKeys = Object.keys(flattenKeys(enContent)).sort();
        const itKeys = Object.keys(flattenKeys(itContent)).sort();

        expect(itKeys).toEqual(enKeys);
      }
    });

    it('should have consistent structure across locales', () => {
      for (const namespace of namespaces) {
        const enPath = join(MESSAGES_DIR, 'en', `${namespace}.json`);
        const itPath = join(MESSAGES_DIR, 'it', `${namespace}.json`);

        const enContent = JSON.parse(readFileSync(enPath, 'utf-8'));
        const itContent = JSON.parse(readFileSync(itPath, 'utf-8'));

        const enStructure = JSON.stringify(Object.keys(enContent).sort());
        const itStructure = JSON.stringify(Object.keys(itContent).sort());

        expect(itStructure).toEqual(enStructure);
      }
    });
  });

  describe('ICU Format Validation', () => {
    it('should have valid ICU syntax in all messages', () => {
      for (const locale of locales) {
        for (const namespace of namespaces) {
          const filePath = join(MESSAGES_DIR, locale, `${namespace}.json`);
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          const messages = flattenKeys(content);

          for (const [key, message] of Object.entries(messages)) {
            const error = validateICUFormat(message);

            expect(error, `${locale}/${namespace}: ${key} - ${error}`).toBeNull();
          }
        }
      }
    });

    it('should detect unmatched braces', () => {
      expect(validateICUFormat('Hello {name')).toContain('Unmatched braces');
      expect(validateICUFormat('Hello name}')).toContain('Unmatched braces');
    });

    it('should detect empty placeholders', () => {
      const result = validateICUFormat('Hello {}');

      expect(result).not.toBeNull();
      expect(result).toContain('Empty placeholder');
    });

    it('should detect invalid placeholder types', () => {
      expect(validateICUFormat('Hello {name, invalid}')).toContain('Invalid placeholder type');
    });

    it('should accept valid placeholders', () => {
      expect(validateICUFormat('Hello {name}')).toBeNull();
      expect(validateICUFormat('Count: {count, number}')).toBeNull();
      expect(validateICUFormat('Date: {date, date, short}')).toBeNull();
      expect(validateICUFormat('{count, plural, one {# item} other {# items}}')).toBeNull();
    });
  });

  describe('Translation Content', () => {
    it('should have non-empty values', () => {
      for (const locale of locales) {
        for (const namespace of namespaces) {
          const filePath = join(MESSAGES_DIR, locale, `${namespace}.json`);
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          const messages = flattenKeys(content);

          for (const [key, message] of Object.entries(messages)) {
            expect(message.trim(), `${locale}/${namespace}: ${key} is empty`).not.toBe('');
          }
        }
      }
    });

    it('should have consistent placeholder usage across locales', () => {
      for (const namespace of namespaces) {
        const enPath = join(MESSAGES_DIR, 'en', `${namespace}.json`);
        const itPath = join(MESSAGES_DIR, 'it', `${namespace}.json`);

        const enContent = JSON.parse(readFileSync(enPath, 'utf-8'));
        const itContent = JSON.parse(readFileSync(itPath, 'utf-8'));

        const enMessages = flattenKeys(enContent);
        const itMessages = flattenKeys(itContent);

        for (const key of Object.keys(enMessages)) {
          const enMessage = enMessages[key];
          const itMessage = itMessages[key];

          if (!enMessage || !itMessage) {
            continue;
          }

          const enPlaceholders = (enMessage.match(/\{([^}]+)\}/g) || []).sort();
          const itPlaceholders = (itMessage.match(/\{([^}]+)\}/g) || []).sort();

          expect(itPlaceholders, `${namespace}: ${key} has inconsistent placeholders`).toEqual(enPlaceholders);
        }
      }
    });
  });

  describe('Namespace Coverage', () => {
    it('should have dashboard-settings namespace', () => {
      const enPath = join(MESSAGES_DIR, 'en', 'dashboard-settings.json');
      const itPath = join(MESSAGES_DIR, 'it', 'dashboard-settings.json');

      expect(() => readFileSync(enPath, 'utf-8')).not.toThrow();
      expect(() => readFileSync(itPath, 'utf-8')).not.toThrow();
    });

    it('should have all required sections in dashboard-settings', () => {
      const requiredSections = ['appearance', 'preferences', 'notifications', 'privacy', 'policy', 'saveStatus', 'actions', 'quickActions', 'keyboard', 'coachmarks'];

      for (const locale of locales) {
        const filePath = join(MESSAGES_DIR, locale, 'dashboard-settings.json');
        const content = JSON.parse(readFileSync(filePath, 'utf-8'));

        for (const section of requiredSections) {
          expect(content, `${locale}/dashboard-settings missing section: ${section}`).toHaveProperty(section);
        }
      }
    });

    it('should have all appearance settings', () => {
      const requiredSettings = ['theme', 'fontSize', 'density', 'contrast', 'motion'];

      for (const locale of locales) {
        const filePath = join(MESSAGES_DIR, locale, 'dashboard-settings.json');
        const content = JSON.parse(readFileSync(filePath, 'utf-8'));

        for (const setting of requiredSettings) {
          expect(content.appearance, `${locale}/dashboard-settings.appearance missing: ${setting}`).toHaveProperty(setting);
        }
      }
    });
  });
});
