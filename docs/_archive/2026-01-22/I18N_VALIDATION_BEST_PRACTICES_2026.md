# i18n Translation Validation - Best Practices 2026

**Research Date:** 2026-01-21  
**Task:** P1.T7 - i18n Build-Time Validation  
**Sources:** next-intl 4.0, lingual.dev, i18next docs, i18n-check

---

## Executive Summary

This document outlines industry best practices for implementing build-time translation validation in Next.js applications using next-intl. Key patterns include type-safe translations, fallback strategies, automated validation scripts, and CI/CD integration.

---

## 1. Translation Fallback Strategy

### Fallback Chain Pattern

**Recommended Order:**
```
IT (user locale) → EN (fallback locale) → Key (development indicator)
```

**Implementation:**
```typescript
// next-intl configuration
export default getRequestConfig(async ({ locale }) => {
  return {
    messages: await getMessages(locale),
    onError: (error) => {
      if (error.code === 'MISSING_MESSAGE') {
        // Log in development, silent in production
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Missing translation: ${error.key}`);
        }
      }
    },
    getMessageFallback: ({ namespace, key, error }) => {
      // Try fallback locale first
      const fallbackMessages = await getMessages('en');
      if (fallbackMessages[key]) {
        return fallbackMessages[key];
      }
      
      // Return key in development, empty in production
      return process.env.NODE_ENV === 'development' 
        ? `[${key}]` 
        : '';
    },
  };
});
```

### Best Practices

1. **Silent in Production** - Don't expose missing keys to users
2. **Visible in Development** - Show `[key]` to alert developers
3. **Fallback to English** - Most universal fallback language
4. **Log Missing Keys** - Track what needs translation

---

## 2. Type-Safe Translations (next-intl 4.0)

### Type Augmentation

**Centralized Type Registration:**
```typescript
// types/i18n.d.ts
import 'next-intl';

type Messages = typeof import('../messages/en/dashboard-settings.json');

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
    Locales: 'it' | 'en';
  }
}
```

**Benefits:**
- ✅ Autocomplete for translation keys
- ✅ Compile-time error on missing keys
- ✅ Refactoring safety (rename detection)
- ✅ No global scope pollution

### Strictly-Typed ICU Arguments

**Opt-in Feature (TypeScript limitation):**
```typescript
// Enable in tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "next-intl/plugin"
      }
    ]
  }
}
```

**Usage:**
```typescript
// messages/en.json
{
  "greeting": "Hello {name}, today is {date, date, medium}"
}

// Component
const t = useTranslations();

// ✅ Type-safe: autocomplete for 'name' and 'date'
t('greeting', { name: 'John', date: new Date() });

// ❌ TypeScript error: missing 'date' argument
t('greeting', { name: 'John' });
```

---

## 3. Build-Time Validation

### Validation Script Pattern

**Core Checks:**
1. **Missing Keys** - Keys in source code but not in locale files
2. **Unused Keys** - Keys in locale files but not used in code
3. **Untranslated Keys** - Keys missing in target locales
4. **Invalid Format** - Malformed ICU syntax or JSON

**Implementation Strategy:**
```typescript
// scripts/validate-translations.ts

interface ValidationResult {
  missingKeys: string[];
  unusedKeys: string[];
  untranslatedKeys: Record<string, string[]>;
  invalidFormat: Array<{ key: string; error: string }>;
}

async function validateTranslations(): Promise<ValidationResult> {
  // 1. Load all locale files
  const sourceMessages = await loadMessages('en');
  const targetMessages = await loadMessages('it');
  
  // 2. Extract keys from source code
  const usedKeys = await extractKeysFromSource();
  
  // 3. Compare and validate
  const result = {
    missingKeys: findMissingKeys(usedKeys, sourceMessages),
    unusedKeys: findUnusedKeys(sourceMessages, usedKeys),
    untranslatedKeys: findUntranslatedKeys(sourceMessages, targetMessages),
    invalidFormat: validateICUFormat(sourceMessages),
  };
  
  return result;
}
```

### Tools Comparison

| Tool | Pros | Cons | Use Case |
|------|------|------|----------|
| **i18n-check** | CLI-ready, CI-friendly, multi-framework | External dependency | Production apps |
| **Custom Script** | Full control, no deps | More maintenance | Simple projects |
| **TypeScript Plugin** | IDE integration, real-time | Compile-time only | Development |

---

## 4. CI/CD Integration

### GitHub Actions Example

```yaml
name: i18n Validation

on:
  pull_request:
    paths:
      - 'messages/**'
      - 'src/**'

jobs:
  validate-translations:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate translations
        run: npm run i18n:validate
      
      - name: Check for missing keys
        run: |
          if [ -f .i18n-errors.json ]; then
            echo "❌ Translation errors found"
            cat .i18n-errors.json
            exit 1
          fi
```

### Build Integration (next.config.mjs)

```javascript
// next.config.mjs
import { validateTranslations } from './scripts/validate-translations.js';

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Run validation during production build
      const errors = await validateTranslations();
      
      if (errors.missingKeys.length > 0) {
        throw new Error(
          `Missing translation keys: ${errors.missingKeys.join(', ')}`
        );
      }
    }
    
    return config;
  },
};

export default nextConfig;
```

---

## 5. File Organization Patterns

### Pattern 1: Single File Per Locale

```
messages/
├── en.json          # All English translations
└── it.json          # All Italian translations
```

**Pros:** Simple, easy to manage  
**Cons:** Large files, merge conflicts

### Pattern 2: Namespace-Based (Recommended)

```
messages/
├── en/
│   ├── common.json
│   ├── dashboard-settings.json
│   └── errors.json
└── it/
    ├── common.json
    ├── dashboard-settings.json
    └── errors.json
```

**Pros:** Modular, parallel translation, smaller files  
**Cons:** More files to manage

### Pattern 3: Feature-Based

```
messages/
├── en/
│   ├── auth/
│   │   ├── login.json
│   │   └── signup.json
│   └── dashboard/
│       ├── settings.json
│       └── profile.json
└── it/
    └── (same structure)
```

**Pros:** Co-located with features  
**Cons:** Deep nesting, harder to validate

---

## 6. Validation Rules

### Critical Rules (Fail Build)

1. **Missing Source Keys** - Key used in code but not in `en.json`
2. **Invalid ICU Syntax** - Malformed placeholders or formatters
3. **Type Mismatch** - Different argument types between locales

### Warning Rules (Log Only)

1. **Unused Keys** - Key in locale file but not used in code
2. **Missing Translations** - Key in `en.json` but not in `it.json`
3. **Inconsistent Plurals** - Different plural forms between locales

### Example Validation

```typescript
// ❌ FAIL: Missing source key
t('dashboard.newFeature'); // Not in en.json

// ❌ FAIL: Invalid ICU syntax
"greeting": "Hello {name" // Missing closing brace

// ⚠️ WARN: Unused key
// en.json has "old.feature" but never used in code

// ⚠️ WARN: Missing translation
// en.json has "new.feature" but it.json doesn't
```

---

## 7. Development Workflow

### Pre-Commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run i18n:validate || {
  echo "❌ Translation validation failed"
  echo "Run 'npm run i18n:validate' to see errors"
  exit 1
}
```

### VS Code Extension

**Recommended:** `next-intl-hlpr`

**Features:**
- Highlights missing translations
- Shows missing languages on hover
- Supports nested keys
- Real-time validation

---

## 8. Error Handling Strategies

### Development Mode

```typescript
// Show detailed errors
onError: (error) => {
  console.error('Translation Error:', {
    code: error.code,
    key: error.key,
    namespace: error.namespace,
    locale: error.locale,
  });
}
```

### Production Mode

```typescript
// Silent fallback
onError: (error) => {
  // Log to monitoring service (Sentry, etc.)
  if (error.code === 'MISSING_MESSAGE') {
    logToMonitoring('missing_translation', {
      key: error.key,
      locale: error.locale,
    });
  }
}
```

---

## 9. Testing Strategy

### Unit Tests

```typescript
describe('Translation Validation', () => {
  it('should have all keys in both locales', () => {
    const enKeys = Object.keys(enMessages);
    const itKeys = Object.keys(itMessages);
    
    expect(enKeys).toEqual(itKeys);
  });
  
  it('should have valid ICU syntax', () => {
    Object.entries(enMessages).forEach(([key, value]) => {
      expect(() => parseICU(value)).not.toThrow();
    });
  });
});
```

### Integration Tests

```typescript
it('should fallback to English when Italian is missing', () => {
  const { getByText } = render(
    <IntlProvider locale="it" messages={{}}>
      <Component />
    </IntlProvider>
  );
  
  // Should show English fallback
  expect(getByText('Hello')).toBeInTheDocument();
});
```

---

## 10. Performance Considerations

### Lazy Loading

```typescript
// Load only needed namespace
const messages = await import(`../messages/${locale}/dashboard-settings.json`);
```

### Build-Time Optimization

```typescript
// Flatten nested keys at build time
const flattenedMessages = flattenMessages(messages);

// Before: { "user": { "greeting": "Hello" } }
// After: { "user.greeting": "Hello" }
```

### Caching

```typescript
// Cache parsed messages
const messageCache = new Map();

function getMessages(locale: string) {
  if (!messageCache.has(locale)) {
    messageCache.set(locale, loadMessages(locale));
  }
  return messageCache.get(locale);
}
```

---

## 11. Implementation Checklist

### Setup
- ✅ Install next-intl
- ✅ Create message files (en, it)
- ✅ Configure type augmentation
- ✅ Set up fallback chain

### Validation
- ✅ Create validation script
- ✅ Add npm script (`i18n:validate`)
- ✅ Integrate with build process
- ✅ Add pre-commit hook

### CI/CD
- ✅ Add GitHub Actions workflow
- ✅ Fail build on missing keys
- ✅ Generate validation report
- ✅ Notify on translation issues

### Monitoring
- ✅ Log missing keys in production
- ✅ Track fallback usage
- ✅ Alert on validation failures
- ✅ Dashboard for translation coverage

---

## References

1. **next-intl 4.0** - Type-safe translations and modern API
2. **i18n-check** - Automated validation tool for Next.js
3. **lingual.dev** - Quality assurance for i18n
4. **i18next** - Fallback and configuration patterns

---

**Content was rephrased for compliance with licensing restrictions**
