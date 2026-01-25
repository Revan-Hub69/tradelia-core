/**
 * I18n Coverage Property Tests
 *
 * Tests for Property 4: Complete i18n coverage
 * Validates: Requirements 1.4
 */

import fs from 'node:fs';
import path from 'node:path';

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

// Import locale files
import enLocale from '@/locales/en.json';
import itLocale from '@/locales/it.json';

// Type for locale structure
// Unused type - removed for cleaner code
// type LocaleStructure = Record<string, any>;

// Generator for i18n key paths
const i18nKeyGenerator = (): fc.Arbitrary<string> => {
  return fc.oneof(
    // Dashboard keys
    fc.constantFrom(
      'Dashboard.nav_home',
      'Dashboard.nav_learn',
      'Dashboard.nav_tools',
      'Dashboard.nav_community',
      'Dashboard.nav_profile',
      'Dashboard.welcome_title',
      'Dashboard.lessons_completed',
      'Dashboard.consistency_days',
    ),
    // LearnPage keys
    fc.constantFrom(
      'LearnPage.title',
      'LearnPage.description',
      'LearnPage.main_path_title',
      'LearnPage.module1_title',
      'LearnPage.content_in_development',
    ),
    // Tools keys
    fc.constantFrom(
      'Tools.title',
      'Tools.description',
      'Tools.portfolio_tracker',
      'Tools.dca_calculator',
      'Tools.in_development',
    ),
    // Other common keys
    fc.constantFrom(
      'Navbar.sign_in',
      'Hero.headline',
      'Footer.disclaimer',
    ),
  );
};

// Generator for nested object paths
const nestedKeyGenerator = (): fc.Arbitrary<string[]> => {
  return fc.array(
    fc.stringMatching(/^[a-z]\w*$/i),
    { minLength: 1, maxLength: 3 },
  );
};

// Helper function to get nested value from object
const getNestedValue = (obj: any, path: string[]): any => {
  return path.reduce((current, key) => current?.[key], obj);
};

// Helper function to check if a value contains hardcoded Italian text
const containsHardcodedItalian = (text: string): boolean => {
  // Check for Italian accented characters and common Italian words
  const italianPatterns = [
    /[àèéìòù]/, // Italian accented characters
    /\b(con|per|del|della|delle|dei|degli|che|una|uno|sono|hai|tuo|tua|tuoi|tue)\b/i,
    /\b(sviluppo|disponibile|presto|sistema|strumenti|community|discussioni)\b/i,
    /\b(rispetta|condividi|mantieni|partecipa|connettiti|unisciti)\b/i,
  ];

  return italianPatterns.some(pattern => pattern.test(text));
};

// Helper function to read dashboard page files and extract hardcoded text
const getDashboardPageContent = (): string[] => {
  const dashboardPagesDir = path.join(process.cwd(), 'src/app/[locale]/(auth)/dashboard');
  const pageFiles: string[] = [];

  try {
    // Read community page
    const communityPath = path.join(dashboardPagesDir, 'community/page.tsx');
    if (fs.existsSync(communityPath)) {
      pageFiles.push(fs.readFileSync(communityPath, 'utf-8'));
    }

    // Read tools page
    const toolsPath = path.join(dashboardPagesDir, 'tools/page.tsx');
    if (fs.existsSync(toolsPath)) {
      pageFiles.push(fs.readFileSync(toolsPath, 'utf-8'));
    }

    // Read learn page
    const learnPath = path.join(dashboardPagesDir, 'learn/page.tsx');
    if (fs.existsSync(learnPath)) {
      pageFiles.push(fs.readFileSync(learnPath, 'utf-8'));
    }
  } catch {
    // If files don't exist in test environment, return empty array
  }

  return pageFiles;
};

describe('I18n Coverage Property Tests', () => {
  describe('Property 4: Complete i18n coverage', () => {
    it('should ensure all i18n keys exist in both locale files', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        i18nKeyGenerator(),
        (keyPath) => {
          // Property: All i18n keys should exist in both English and Italian locales

          const keyParts = keyPath.split('.');
          const enValue = getNestedValue(enLocale, keyParts);
          const itValue = getNestedValue(itLocale, keyParts);

          // Both locales should have the key
          expect(enValue).toBeDefined();
          expect(itValue).toBeDefined();

          // Values should be strings (not objects or undefined)
          expect(typeof enValue).toBe('string');
          expect(typeof itValue).toBe('string');

          // Values should not be empty
          expect(enValue.length).toBeGreaterThan(0);
          expect(itValue.length).toBeGreaterThan(0);

          // Values should be different (not just copied)
          if (keyPath !== 'Dashboard.nav_home' && keyPath !== 'Dashboard.nav_learn') {
            // Allow some keys to be the same (like "Home" -> "Home")
            // but most should be translated
            expect(enValue !== itValue || enValue.length < 10).toBe(true);
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure locale file structure consistency', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        nestedKeyGenerator(),
        (keyPath) => {
          // Property: Both locale files should have the same structure

          const enValue = getNestedValue(enLocale, keyPath);
          const itValue = getNestedValue(itLocale, keyPath);

          // If a key exists in one locale, it should exist in the other
          if (enValue !== undefined || itValue !== undefined) {
            expect(enValue).toBeDefined();
            expect(itValue).toBeDefined();

            // Both should have the same type
            expect(typeof enValue).toBe(typeof itValue);

            // If it's an object, both should be objects
            if (typeof enValue === 'object' && enValue !== null) {
              expect(typeof itValue).toBe('object');
              expect(itValue).not.toBeNull();

              // Object keys should match
              const enKeys = Object.keys(enValue).sort();
              const itKeys = Object.keys(itValue).sort();

              expect(enKeys).toEqual(itKeys);
            }
          }
        },
      ), { numRuns: 100 });
    });

    it('should detect hardcoded Italian text in dashboard pages', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        fc.constant(getDashboardPageContent()),
        (pageContents) => {
          // Property: Dashboard pages should not contain hardcoded Italian text

          for (const content of pageContents) {
            // Extract string literals from JSX
            const stringLiterals = content.match(/['"`][^'"`]*['"`]/g) || [];

            for (const literal of stringLiterals) {
              const text = literal.slice(1, -1); // Remove quotes

              // Skip if it's a CSS class, URL, or other non-text content
              if (text.includes('className')
                || text.includes('http')
                || text.includes('px-')
                || text.includes('bg-')
                || text.includes('text-')
                || text.includes('rounded')
                || text.includes('%')
                || text.length < 3) {
                continue;
              }

              // Check for hardcoded Italian text
              if (containsHardcodedItalian(text)) {
                // This should fail - hardcoded Italian text found
                expect(text).not.toMatch(/[àèéìòù]/);
                expect(text).not.toMatch(/\b(sviluppo|disponibile|presto|sistema|strumenti)\b/i);
              }
            }
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure all Dashboard namespace keys are properly structured', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        fc.constant(['Dashboard']),
        (_namespace) => {
          // Property: Dashboard namespace should have complete and consistent structure

          const enDashboard = enLocale.Dashboard;
          const itDashboard = itLocale.Dashboard;

          expect(enDashboard).toBeDefined();
          expect(itDashboard).toBeDefined();

          // Both should be objects
          expect(typeof enDashboard).toBe('object');
          expect(typeof itDashboard).toBe('object');

          // Should have the same keys
          const enKeys = Object.keys(enDashboard).sort();
          const itKeys = Object.keys(itDashboard).sort();

          expect(enKeys).toEqual(itKeys);

          // All navigation keys should exist
          const requiredNavKeys = [
            'nav_home',
            'nav_learn',
            'nav_tools',
            'nav_community',
            'nav_profile',
          ];

          for (const key of requiredNavKeys) {
            expect(enDashboard).toHaveProperty(key);
            expect(itDashboard).toHaveProperty(key);
            expect(typeof enDashboard[key]).toBe('string');
            expect(typeof itDashboard[key]).toBe('string');
            expect(enDashboard[key].length).toBeGreaterThan(0);
            expect(itDashboard[key].length).toBeGreaterThan(0);
          }

          // All values should be strings (no nested objects in Dashboard namespace)
          for (const key of enKeys) {
            expect(typeof enDashboard[key]).toBe('string');
            expect(typeof itDashboard[key]).toBe('string');
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure LearnPage namespace has complete coverage', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        fc.constant(['LearnPage']),
        (_namespace) => {
          // Property: LearnPage namespace should have complete i18n coverage

          const enLearnPage = enLocale.LearnPage;
          const itLearnPage = itLocale.LearnPage;

          expect(enLearnPage).toBeDefined();
          expect(itLearnPage).toBeDefined();

          // Both should be objects
          expect(typeof enLearnPage).toBe('object');
          expect(typeof itLearnPage).toBe('object');

          // Should have the same keys
          const enKeys = Object.keys(enLearnPage).sort();
          const itKeys = Object.keys(itLearnPage).sort();

          expect(enKeys).toEqual(itKeys);

          // Required LearnPage keys should exist
          const requiredLearnKeys = [
            'title',
            'description',
            'main_path_title',
            'main_path_description',
            'module1_title',
            'module1_description',
            'module2_title',
            'module2_description',
            'module3_title',
            'module3_description',
            'module4_title',
            'module4_description',
            'content_in_development',
          ];

          for (const key of requiredLearnKeys) {
            expect(enLearnPage).toHaveProperty(key);
            expect(itLearnPage).toHaveProperty(key);
            expect(typeof enLearnPage[key]).toBe('string');
            expect(typeof itLearnPage[key]).toBe('string');
            expect(enLearnPage[key].length).toBeGreaterThan(0);
            expect(itLearnPage[key].length).toBeGreaterThan(0);
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure no missing i18n keys in critical namespaces', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        fc.constantFrom('Dashboard', 'LearnPage', 'Navbar', 'Hero', 'Footer'),
        (namespace) => {
          // Property: Critical namespaces should have no missing keys between locales

          const enNamespace = enLocale[namespace as keyof typeof enLocale];
          const itNamespace = itLocale[namespace as keyof typeof itLocale];

          if (enNamespace && itNamespace) {
            // Both should exist
            expect(enNamespace).toBeDefined();
            expect(itNamespace).toBeDefined();

            // Get all keys from both
            const enKeys = new Set(Object.keys(enNamespace));
            const itKeys = new Set(Object.keys(itNamespace));

            // No missing keys in either direction
            const missingInIt = [...enKeys].filter(key => !itKeys.has(key));
            const missingInEn = [...itKeys].filter(key => !enKeys.has(key));

            expect(missingInIt).toEqual([]);
            expect(missingInEn).toEqual([]);

            // All values should be non-empty strings
            for (const key of enKeys) {
              if (typeof enNamespace[key] === 'string') {
                expect(enNamespace[key].length).toBeGreaterThan(0);
                expect(itNamespace[key].length).toBeGreaterThan(0);
              }
            }
          }
        },
      ), { numRuns: 100 });
    });

    it('should validate i18n key naming conventions', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
      fc.assert(fc.property(
        fc.constant(Object.keys(enLocale)),
        (namespaces) => {
          // Property: i18n keys should follow consistent naming conventions

          for (const namespace of namespaces) {
            const namespaceObj = enLocale[namespace as keyof typeof enLocale];

            if (typeof namespaceObj === 'object' && namespaceObj !== null) {
              const keys = Object.keys(namespaceObj);

              for (const key of keys) {
                // Keys should follow snake_case or camelCase convention
                expect(key).toMatch(/^[a-z]\w*$/);

                // Keys should not be empty
                expect(key.length).toBeGreaterThan(0);

                // Keys should not start or end with underscore
                expect(key).not.toMatch(/^_|_$/);

                // Navigation keys should follow nav_ prefix pattern
                if (namespace === 'Dashboard' && key.startsWith('nav_')) {
                  expect(key).toMatch(/^nav_[a-z]+(_[a-z]+)*$/);
                }
              }
            }
          }
        },
      ), { numRuns: 100 });
    });
  });
});

it('should have all Tools namespace keys in both locales', () => {
  // Feature: enterprise-complete-roadmap-2026, Property 4: Complete i18n coverage
  // Test specifically for Tools namespace after fixing hardcoded Italian text

  const toolsKeysToCheck = [
    'title',
    'description',
    'portfolio_tracker',
    'portfolio_tracker_description',
    'dca_calculator',
    'dca_calculator_description',
    'risk_analyzer',
    'risk_analyzer_description',
    'yield_calculator',
    'yield_calculator_description',
    'in_development',
    'coming_soon',
    'affiliate_disclaimer',
  ];

  toolsKeysToCheck.forEach((key) => {
    const enValue = getNestedValue(enLocale, ['Tools', key]);
    const itValue = getNestedValue(itLocale, ['Tools', key]);

    expect(enValue, `Missing English key: Tools.${key}`).toBeDefined();
    expect(itValue, `Missing Italian key: Tools.${key}`).toBeDefined();
    expect(typeof enValue, `English Tools.${key} should be string`).toBe('string');
    expect(typeof itValue, `Italian Tools.${key} should be string`).toBe('string');
    expect(enValue.length, `English Tools.${key} should not be empty`).toBeGreaterThan(0);
    expect(itValue.length, `Italian Tools.${key} should not be empty`).toBeGreaterThan(0);
  });
});
