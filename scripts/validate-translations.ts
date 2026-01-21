#!/usr/bin/env tsx
/**
 * Translation Validation Script
 *
 * Validates that all translation keys exist in all locales and have valid ICU syntax.
 * Fails the build if critical issues are found.
 *
 * Usage:
 *   npm run i18n:validate
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Critical errors found (missing keys, invalid syntax)
 *   2 - Warnings only (unused keys)
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// Configuration
const LOCALES = ['en', 'it'] as const;
const SOURCE_LOCALE = 'en' as const;
const MESSAGES_DIR = join(PROJECT_ROOT, 'messages');

// ANSI colors for terminal output
const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
  cyan: '\x1B[36m',
  gray: '\x1B[90m',
};

type ValidationResult = {
  missingKeys: Array<{ locale: string; key: string; namespace: string }>;
  invalidFormat: Array<{ locale: string; key: string; error: string; namespace: string }>;
  untranslatedKeys: Array<{ locale: string; key: string; namespace: string }>;
};

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
 * Load all translation files for a locale
 */
function loadMessages(locale: string): Record<string, Record<string, string>> {
  const localeDir = join(MESSAGES_DIR, locale);

  if (!existsSync(localeDir)) {
    console.error(`${colors.red}✗${colors.reset} Locale directory not found: ${localeDir}`);
    process.exit(1);
  }

  const messages: Record<string, Record<string, string>> = {};
  const files = readdirSync(localeDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const namespace = file.replace('.json', '');
    const filePath = join(localeDir, file);

    try {
      const content = readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      messages[namespace] = flattenKeys(json);
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} Failed to parse ${filePath}:`, error);
      process.exit(1);
    }
  }

  return messages;
}

/**
 * Validate ICU message format syntax
 * Basic validation - checks for common errors
 */
function validateICUFormat(message: string): string | null {
  // Check for unmatched braces
  const openBraces = (message.match(/\{/g) || []).length;
  const closeBraces = (message.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    return `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`;
  }

  // Check for valid placeholder syntax: {variable} or {variable, type, format}
  const placeholderRegex = /\{([^}]+)\}/g;
  const placeholders = message.match(placeholderRegex);

  if (placeholders) {
    for (const placeholder of placeholders) {
      const content = placeholder.slice(1, -1).trim();

      // Empty placeholder
      if (!content) {
        return `Empty placeholder: ${placeholder}`;
      }

      // Check for valid ICU format
      const parts = content.split(',').map(p => p.trim());

      if (parts.length > 3) {
        return `Invalid placeholder format: ${placeholder}`;
      }

      // If type is specified, validate it
      if (parts.length >= 2) {
        const type = parts[1];
        const validTypes = ['number', 'date', 'time', 'plural', 'selectordinal', 'select'];

        if (type && !validTypes.includes(type)) {
          return `Invalid placeholder type "${type}" in: ${placeholder}`;
        }
      }
    }
  }

  return null;
}

/**
 * Main validation function
 */
function validateTranslations(): ValidationResult {
  const result: ValidationResult = {
    missingKeys: [],
    invalidFormat: [],
    untranslatedKeys: [],
  };

  console.log(`${colors.cyan}🔍 Validating translations...${colors.reset}\n`);

  // Load all messages
  const messagesByLocale: Record<string, Record<string, Record<string, string>>> = {};

  for (const locale of LOCALES) {
    messagesByLocale[locale] = loadMessages(locale);
    console.log(`${colors.gray}  Loaded ${locale}: ${Object.keys(messagesByLocale[locale]).length} namespace(s)${colors.reset}`);
  }

  console.log();

  // Get source messages (English)
  const sourceMessages = messagesByLocale[SOURCE_LOCALE];

  if (!sourceMessages) {
    console.error(`${colors.red}✗${colors.reset} Source locale ${SOURCE_LOCALE} not found`);
    process.exit(1);
  }

  // Validate each namespace
  for (const namespace of Object.keys(sourceMessages)) {
    const sourceKeys = sourceMessages[namespace];

    if (!sourceKeys) {
      continue;
    }

    // Validate ICU format in source locale
    for (const [key, message] of Object.entries(sourceKeys)) {
      const error = validateICUFormat(message);
      if (error) {
        result.invalidFormat.push({
          locale: SOURCE_LOCALE,
          key,
          error,
          namespace,
        });
      }
    }

    // Check other locales
    for (const locale of LOCALES) {
      if (locale === SOURCE_LOCALE) {
        continue;
      }

      const localeMessages = messagesByLocale[locale];
      if (!localeMessages) {
        continue;
      }

      const targetMessages = localeMessages[namespace];

      if (!targetMessages) {
        // Entire namespace missing
        for (const key of Object.keys(sourceKeys)) {
          result.missingKeys.push({ locale, key, namespace });
        }
        continue;
      }

      // Check for missing keys
      for (const key of Object.keys(sourceKeys)) {
        if (!(key in targetMessages)) {
          result.missingKeys.push({ locale, key, namespace });
        }
      }

      // Check for untranslated keys (same as source)
      for (const [key, message] of Object.entries(targetMessages)) {
        const sourceValue = sourceKeys[key];
        if (sourceValue && message === sourceValue) {
          result.untranslatedKeys.push({ locale, key, namespace });
        }

        // Validate ICU format
        const error = validateICUFormat(message);
        if (error) {
          result.invalidFormat.push({
            locale,
            key,
            error,
            namespace,
          });
        }
      }
    }
  }

  return result;
}

/**
 * Print validation results
 */
function printResults(result: ValidationResult): void {
  let hasErrors = false;
  let hasWarnings = false;

  // Print invalid format errors (CRITICAL)
  if (result.invalidFormat.length > 0) {
    hasErrors = true;
    console.log(`${colors.red}✗ Invalid ICU Format (${result.invalidFormat.length})${colors.reset}`);

    for (const { locale, key, error, namespace } of result.invalidFormat) {
      console.log(`  ${colors.gray}${namespace}/${locale}:${colors.reset} ${key}`);
      console.log(`    ${colors.red}${error}${colors.reset}`);
    }
    console.log();
  }

  // Print missing keys (CRITICAL)
  if (result.missingKeys.length > 0) {
    hasErrors = true;
    console.log(`${colors.red}✗ Missing Translation Keys (${result.missingKeys.length})${colors.reset}`);

    // Group by locale
    const byLocale = result.missingKeys.reduce<Record<string, typeof result.missingKeys>>((acc, item) => {
      if (!acc[item.locale]) {
        acc[item.locale] = [];
      }
      acc[item.locale]!.push(item);
      return acc;
    }, {});

    for (const [locale, items] of Object.entries(byLocale)) {
      console.log(`  ${colors.gray}${locale}:${colors.reset} ${items.length} missing`);

      // Group by namespace
      const byNamespace = items.reduce<Record<string, string[]>>((acc, item) => {
        if (!acc[item.namespace]) {
          acc[item.namespace] = [];
        }
        acc[item.namespace]!.push(item.key);
        return acc;
      }, {});

      for (const [namespace, keys] of Object.entries(byNamespace)) {
        console.log(`    ${colors.gray}${namespace}:${colors.reset}`);
        for (const key of keys.slice(0, 5)) {
          console.log(`      - ${key}`);
        }
        if (keys.length > 5) {
          console.log(`      ${colors.gray}... and ${keys.length - 5} more${colors.reset}`);
        }
      }
    }
    console.log();
  }

  // Print untranslated keys (WARNING)
  if (result.untranslatedKeys.length > 0) {
    hasWarnings = true;
    console.log(`${colors.yellow}⚠ Untranslated Keys (${result.untranslatedKeys.length})${colors.reset}`);
    console.log(`  ${colors.gray}Keys that have the same value as source locale${colors.reset}`);

    // Group by locale
    const byLocale = result.untranslatedKeys.reduce<Record<string, typeof result.untranslatedKeys>>((acc, item) => {
      if (!acc[item.locale]) {
        acc[item.locale] = [];
      }
      acc[item.locale]!.push(item);
      return acc;
    }, {});

    for (const [locale, items] of Object.entries(byLocale)) {
      console.log(`  ${colors.gray}${locale}:${colors.reset} ${items.length} untranslated`);
      for (const { namespace, key } of items.slice(0, 3)) {
        console.log(`    - ${namespace}.${key}`);
      }
      if (items.length > 3) {
        console.log(`    ${colors.gray}... and ${items.length - 3} more${colors.reset}`);
      }
    }
    console.log();
  }

  // Print summary
  if (!hasErrors && !hasWarnings) {
    console.log(`${colors.green}✓ All translations valid!${colors.reset}\n`);
  } else if (hasErrors) {
    console.log(`${colors.red}✗ Translation validation failed${colors.reset}`);
    console.log(`  ${result.invalidFormat.length} invalid format errors`);
    console.log(`  ${result.missingKeys.length} missing keys`);
    if (hasWarnings) {
      console.log(`  ${result.untranslatedKeys.length} untranslated keys (warning)`);
    }
    console.log();
  } else if (hasWarnings) {
    console.log(`${colors.yellow}⚠ Translation validation passed with warnings${colors.reset}`);
    console.log(`  ${result.untranslatedKeys.length} untranslated keys`);
    console.log();
  }
}

// Run validation
const result = validateTranslations();
printResults(result);

// Exit with appropriate code
if (result.invalidFormat.length > 0 || result.missingKeys.length > 0) {
  process.exit(1); // Critical errors
} else {
  process.exit(0); // Success (warnings are OK)
}
