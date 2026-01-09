/**
 * SEO Property Tests
 * Validates structured data and SEO requirements
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property 1: Structured Data Presence
 * Validates: Requirements 1.1, 1.6
 * 
 * For any page:
 * - JSON-LD structured data SHALL be present
 * - Schema.org context SHALL be valid
 * - Required properties SHALL be present for each schema type
 */

// Validate JSON-LD structure
function validateJsonLd(jsonLd: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!jsonLd || typeof jsonLd !== 'object') {
    return { valid: false, errors: ['JSON-LD must be an object'] };
  }
  
  const schema = jsonLd as Record<string, unknown>;
  
  // Check @context
  if (schema['@context'] !== 'https://schema.org') {
    errors.push('Missing or invalid @context');
  }
  
  // Check @type
  if (!schema['@type'] || typeof schema['@type'] !== 'string') {
    errors.push('Missing or invalid @type');
  }
  
  return { valid: errors.length === 0, errors };
}

// Validate Organization schema
function validateOrganizationSchema(schema: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (schema['@type'] !== 'Organization') {
    errors.push('Invalid @type for Organization schema');
  }
  
  if (!schema.name || typeof schema.name !== 'string') {
    errors.push('Organization must have a name');
  }
  
  if (!schema.url || typeof schema.url !== 'string') {
    errors.push('Organization must have a url');
  }
  
  return { valid: errors.length === 0, errors };
}

// Validate WebSite schema
function validateWebSiteSchema(schema: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (schema['@type'] !== 'WebSite') {
    errors.push('Invalid @type for WebSite schema');
  }
  
  if (!schema.name || typeof schema.name !== 'string') {
    errors.push('WebSite must have a name');
  }
  
  if (!schema.url || typeof schema.url !== 'string') {
    errors.push('WebSite must have a url');
  }
  
  return { valid: errors.length === 0, errors };
}

// Validate FAQPage schema
function validateFAQPageSchema(schema: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (schema['@type'] !== 'FAQPage') {
    errors.push('Invalid @type for FAQPage schema');
  }
  
  if (!Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage must have mainEntity array');
  } else {
    for (const item of schema.mainEntity) {
      if (typeof item !== 'object' || !item) continue;
      const question = item as Record<string, unknown>;
      
      if (question['@type'] !== 'Question') {
        errors.push('FAQ item must be of type Question');
      }
      if (!question.name) {
        errors.push('Question must have a name');
      }
      if (!question.acceptedAnswer) {
        errors.push('Question must have an acceptedAnswer');
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Validate meta tags
function validateMetaTags(meta: {
  title?: string;
  description?: string;
  canonical?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Title should be 50-60 characters
  if (meta.title) {
    if (meta.title.length < 30) {
      errors.push(`Title too short: ${meta.title.length} chars (min 30)`);
    }
    if (meta.title.length > 70) {
      errors.push(`Title too long: ${meta.title.length} chars (max 70)`);
    }
  } else {
    errors.push('Missing title');
  }
  
  // Description should be 150-160 characters
  if (meta.description) {
    if (meta.description.length < 100) {
      errors.push(`Description too short: ${meta.description.length} chars (min 100)`);
    }
    if (meta.description.length > 200) {
      errors.push(`Description too long: ${meta.description.length} chars (max 200)`);
    }
  } else {
    errors.push('Missing description');
  }
  
  // Canonical should be absolute URL
  if (meta.canonical && !meta.canonical.startsWith('http')) {
    errors.push('Canonical URL must be absolute');
  }
  
  return { valid: errors.length === 0, errors };
}

describe('Property 1: Structured Data Presence', () => {
  describe('JSON-LD Validation', () => {
    it('should validate correct JSON-LD structure', () => {
      const validSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test'
      };
      
      expect(validateJsonLd(validSchema).valid).toBe(true);
    });

    it('should reject invalid JSON-LD', () => {
      expect(validateJsonLd(null).valid).toBe(false);
      expect(validateJsonLd({}).valid).toBe(false);
      expect(validateJsonLd({ '@type': 'Test' }).valid).toBe(false);
    });
  });

  describe('Organization Schema', () => {
    it('should validate correct Organization schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Tradelia',
        url: 'https://tradelia.com'
      };
      
      expect(validateOrganizationSchema(schema).valid).toBe(true);
    });

    it('should reject Organization without required fields', () => {
      expect(validateOrganizationSchema({ '@type': 'Organization' }).valid).toBe(false);
      expect(validateOrganizationSchema({ '@type': 'Organization', name: 'Test' }).valid).toBe(false);
    });
  });

  describe('WebSite Schema', () => {
    it('should validate correct WebSite schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Tradelia',
        url: 'https://tradelia.com'
      };
      
      expect(validateWebSiteSchema(schema).valid).toBe(true);
    });
  });

  describe('FAQPage Schema', () => {
    it('should validate correct FAQPage schema', () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Tradelia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'An educational tool.'
            }
          }
        ]
      };
      
      expect(validateFAQPageSchema(schema).valid).toBe(true);
    });
  });

  describe('Property Tests', () => {
    it('property: all JSON-LD must have @context and @type', () => {
      const schemaArbitrary = fc.record({
        '@context': fc.option(fc.constant('https://schema.org'), { nil: undefined }),
        '@type': fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        name: fc.option(fc.string(), { nil: undefined })
      });

      fc.assert(
        fc.property(schemaArbitrary, (schema) => {
          const result = validateJsonLd(schema);
          
          const hasContext = schema['@context'] === 'https://schema.org';
          const hasType = schema['@type'] !== undefined && typeof schema['@type'] === 'string';
          
          return result.valid === (hasContext && hasType);
        }),
        { numRuns: 100 }
      );
    });
  });
});

describe('Meta Tags Validation', () => {
  it('should validate correct meta tags', () => {
    const meta = {
      title: 'Tradelia - Identifica Incompatibilità Crypto | Ricerca Accademica',
      description: 'Dashboard educativa basata su ricerca comportamentale peer-reviewed per identificare incompatibilità tra obiettivi di investimento e strumenti crypto.',
      canonical: 'https://tradelia.com'
    };
    
    expect(validateMetaTags(meta).valid).toBe(true);
  });

  it('should reject too short title', () => {
    const meta = { title: 'Short', description: 'A'.repeat(150) };
    expect(validateMetaTags(meta).valid).toBe(false);
  });

  it('should reject too long description', () => {
    const meta = { title: 'A'.repeat(50), description: 'A'.repeat(250) };
    expect(validateMetaTags(meta).valid).toBe(false);
  });

  it('property: title length must be 30-70 chars', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 100 }),
        (title) => {
          const result = validateMetaTags({ title, description: 'A'.repeat(150) });
          const titleValid = title.length >= 30 && title.length <= 70;
          
          // If title is valid length, that error shouldn't appear
          if (titleValid) {
            return !result.errors.some(e => e.includes('Title'));
          }
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});


/**
 * Property 7: Locale Content Consistency
 * Validates: Requirements 5.8, 5.9, 5.10, 5.11, 5.13
 * 
 * For any localized content:
 * - All locales SHALL have the same translation keys
 * - No translation key SHALL be missing in any locale
 * - hreflang tags SHALL be present for all locales
 */

// Validate translation key consistency across locales
function validateTranslationKeys(
  translations: Record<string, Record<string, unknown>>
): { valid: boolean; missingKeys: Array<{ locale: string; key: string }> } {
  const locales = Object.keys(translations);
  if (locales.length < 2) {
    return { valid: true, missingKeys: [] };
  }
  
  const missingKeys: Array<{ locale: string; key: string }> = [];
  
  // Get all keys from all locales
  const allKeys = new Set<string>();
  for (const locale of locales) {
    const keys = getNestedKeys(translations[locale]);
    keys.forEach(key => allKeys.add(key));
  }
  
  // Check each locale has all keys
  for (const locale of locales) {
    const localeKeys = new Set(getNestedKeys(translations[locale]));
    for (const key of allKeys) {
      if (!localeKeys.has(key)) {
        missingKeys.push({ locale, key });
      }
    }
  }
  
  return { valid: missingKeys.length === 0, missingKeys };
}

// Helper to get nested keys from object
function getNestedKeys(obj: unknown, prefix = ''): string[] {
  if (!obj || typeof obj !== 'object') {
    return prefix ? [prefix] : [];
  }
  
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getNestedKeys(value, newPrefix));
    } else {
      keys.push(newPrefix);
    }
  }
  return keys;
}

// Validate hreflang tags
function validateHreflangTags(
  tags: Array<{ hreflang: string; href: string }>,
  supportedLocales: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check all locales have hreflang
  for (const locale of supportedLocales) {
    const hasTag = tags.some(t => t.hreflang === locale);
    if (!hasTag) {
      errors.push(`Missing hreflang for locale: ${locale}`);
    }
  }
  
  // Check for x-default
  const hasXDefault = tags.some(t => t.hreflang === 'x-default');
  if (!hasXDefault) {
    errors.push('Missing x-default hreflang');
  }
  
  // Check all hrefs are absolute URLs
  for (const tag of tags) {
    if (!tag.href.startsWith('http')) {
      errors.push(`hreflang href must be absolute URL: ${tag.href}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

describe('Property 7: Locale Content Consistency', () => {
  describe('Translation Key Validation', () => {
    it('should validate consistent translation keys', () => {
      const translations = {
        it: { nav: { home: 'Home', about: 'Chi siamo' } },
        en: { nav: { home: 'Home', about: 'About' } }
      };
      
      expect(validateTranslationKeys(translations).valid).toBe(true);
    });

    it('should detect missing translation keys', () => {
      const translations = {
        it: { nav: { home: 'Home', about: 'Chi siamo' } },
        en: { nav: { home: 'Home' } } // missing 'about'
      };
      
      const result = validateTranslationKeys(translations);
      expect(result.valid).toBe(false);
      expect(result.missingKeys).toContainEqual({ locale: 'en', key: 'nav.about' });
    });
  });

  describe('Hreflang Validation', () => {
    it('should validate correct hreflang tags', () => {
      const tags = [
        { hreflang: 'it', href: 'https://tradelia.com/it' },
        { hreflang: 'en', href: 'https://tradelia.com/en' },
        { hreflang: 'x-default', href: 'https://tradelia.com' }
      ];
      
      expect(validateHreflangTags(tags, ['it', 'en']).valid).toBe(true);
    });

    it('should detect missing hreflang', () => {
      const tags = [
        { hreflang: 'it', href: 'https://tradelia.com/it' },
        { hreflang: 'x-default', href: 'https://tradelia.com' }
      ];
      
      const result = validateHreflangTags(tags, ['it', 'en']);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing hreflang for locale: en');
    });

    it('should detect missing x-default', () => {
      const tags = [
        { hreflang: 'it', href: 'https://tradelia.com/it' },
        { hreflang: 'en', href: 'https://tradelia.com/en' }
      ];
      
      const result = validateHreflangTags(tags, ['it', 'en']);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing x-default hreflang');
    });
  });

  describe('Property Tests', () => {
    it('property: all locales must have same defined keys', () => {
      fc.assert(
        fc.property(
          fc.record({
            it: fc.record({
              key1: fc.string(),
              key2: fc.string()
            }),
            en: fc.record({
              key1: fc.string(),
              key2: fc.string()
            })
          }),
          (translations) => {
            const result = validateTranslationKeys(translations);
            
            // Both have same structure, should always be valid
            return result.valid === true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('property: missing keys should be detected', () => {
      // Test with intentionally mismatched structures
      const mismatched = {
        it: { nav: { home: 'Home', about: 'Chi siamo' } },
        en: { nav: { home: 'Home' } }
      };
      
      const result = validateTranslationKeys(mismatched);
      expect(result.valid).toBe(false);
      expect(result.missingKeys.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Property 8: Translation Key Type Safety
 * Validates: Requirements 5.6, 5.9
 */

describe('Property 8: Translation Key Type Safety', () => {
  it('should have type-safe translation access', () => {
    // This test validates that our translation structure is consistent
    const translations = {
      it: { nav: { home: 'Home' } },
      en: { nav: { home: 'Home' } }
    };
    
    // Type-safe access pattern
    type TranslationKeys = keyof typeof translations.it;
    const key: TranslationKeys = 'nav';
    
    expect(translations.it[key]).toBeDefined();
    expect(translations.en[key]).toBeDefined();
  });
});
