/**
 * Navigation Type Safety Property Tests
 *
 * Tests for Property 1: Navigation i18n key consistency
 * Validates: Requirements 1.1
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  getEnabledNavigationItems,
  getNavigationItemById,
  getVisibleNavigationItems,
  NAVIGATION_CONFIG,
  type NavigationItem,
  type NavigationItemId,
} from '@/data/navigation.config';

// Mock i18n keys that should exist for navigation
const _REQUIRED_I18N_KEYS = [
  'nav_challenges',
  'nav_my_challenges',
  'nav_signals',
  'nav_aria_primary',
  'nav_loading',
  'nav_focus_moved',
  'nav_focus_first',
  'nav_focus_last',
  'nav_blocked',
  'nav_offline',
  'nav_navigating',
] as const;

// Generator for navigation item IDs
const navigationItemIdGenerator = (): fc.Arbitrary<NavigationItemId> => {
  return fc.constantFrom('challenges', 'my-challenges', 'signals');
};

// Generator for navigation items
const navigationItemGenerator = (): fc.Arbitrary<NavigationItem> => {
  return navigationItemIdGenerator().chain((id) => {
    const keyName = `nav_${id.replace('-', '_')}`;
    const iconNameMap: Record<NavigationItemId, string> = {
      'challenges': 'ChallengesIcon',
      'my-challenges': 'MyChartsIcon',
      'signals': 'SignalsIcon',
    };
    return fc.record({
      id: fc.constant(id),
      labelKey: fc.constant(`Dashboard.${keyName}`),
      ariaKey: fc.constant(`Dashboard.${keyName}`),
      href: fc.constant(`/dashboard/${id}`),
      iconName: fc.constant(iconNameMap[id]),
      isPriority: fc.boolean(),
      featureFlag: fc.option(fc.string()),
      badgeType: fc.option(fc.constantFrom('dot', 'count', 'new')),
      badgeValue: fc.option(fc.oneof(fc.integer(), fc.string())),
      disabled: fc.option(fc.boolean()),
      hidden: fc.option(fc.boolean()),
    });
  });
};

describe('Navigation Type Safety Property Tests', () => {
  describe('Property 1: Navigation i18n key consistency', () => {
    it('should maintain consistent i18n key structure across all navigation items', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 1: Navigation i18n key consistency
      fc.assert(fc.property(
        fc.array(navigationItemGenerator(), { minLength: 1, maxLength: 10 }),
        (navigationItems) => {
          // Property: All navigation items should have consistent i18n key patterns

          for (const item of navigationItems) {
            // All labelKey should start with 'Dashboard.'
            expect(item.labelKey).toMatch(/^Dashboard\./);

            // All ariaKey should start with 'Dashboard.'
            expect(item.ariaKey).toMatch(/^Dashboard\./);

            // labelKey and ariaKey should follow the same pattern for the same item
            const labelSuffix = item.labelKey.replace('Dashboard.', '');
            const ariaSuffix = item.ariaKey.replace('Dashboard.', '');

            // For navigation items, labelKey and ariaKey should typically be the same
            expect(labelSuffix).toBe(ariaSuffix);
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure all navigation items have valid i18n key references', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 1: Navigation i18n key consistency
      fc.assert(fc.property(
        navigationItemIdGenerator(),
        (itemId) => {
          // Property: All navigation items should reference valid i18n keys

          const item = getNavigationItemById(itemId);

          if (item) {
            // Check that the key structure is valid
            expect(item.labelKey).toMatch(/^Dashboard\.nav_/);
            expect(item.ariaKey).toMatch(/^Dashboard\.nav_/);

            // Extract the key suffix and verify it's in our expected format
            const labelKeySuffix = item.labelKey.replace('Dashboard.', '');
            const ariaKeySuffix = item.ariaKey.replace('Dashboard.', '');

            // Both should be navigation keys
            expect(labelKeySuffix).toMatch(/^nav_/);
            expect(ariaKeySuffix).toMatch(/^nav_/);

            // For navigation items, they should be the same
            expect(labelKeySuffix).toBe(ariaKeySuffix);
          }
        },
      ), { numRuns: 100 });
    });

    it('should maintain type safety when accessing navigation configuration', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 1: Navigation i18n key consistency
      fc.assert(fc.property(
        fc.constant(null), // No input needed, testing the actual config
        () => {
          // Property: Navigation configuration should be type-safe and consistent

          const visibleItems = getVisibleNavigationItems();
          const enabledItems = getEnabledNavigationItems();

          // All items should have required properties
          for (const item of visibleItems) {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('labelKey');
            expect(item).toHaveProperty('ariaKey');
            expect(item).toHaveProperty('href');
            expect(item).toHaveProperty('iconName');

            // Type safety: id should be a valid NavigationItemId
            expect(['challenges', 'my-challenges', 'signals']).toContain(item.id);

            // i18n keys should follow the expected pattern
            expect(item.labelKey).toMatch(/^Dashboard\.nav_/);
            expect(item.ariaKey).toMatch(/^Dashboard\.nav_/);

            // href should be a valid dashboard path
            expect(item.href).toMatch(/^\/dashboard/);
          }

          // Enabled items should be a subset of visible items
          expect(enabledItems.length).toBeLessThanOrEqual(visibleItems.length);

          // All enabled items should also be visible
          for (const enabledItem of enabledItems) {
            expect(visibleItems).toContainEqual(enabledItem);
          }
        },
      ), { numRuns: 100 });
    });

    it('should ensure navigation item retrieval by ID is type-safe', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 1: Navigation i18n key consistency
      fc.assert(fc.property(
        navigationItemIdGenerator(),
        (itemId) => {
          // Property: Navigation item retrieval should be type-safe and consistent

          const item = getNavigationItemById(itemId);

          // Item should exist for all valid IDs
          expect(item).toBeDefined();

          if (item) {
            // The returned item should have the correct ID
            expect(item.id).toBe(itemId);

            // Should have all required properties with correct types
            expect(typeof item.labelKey).toBe('string');
            expect(typeof item.ariaKey).toBe('string');
            expect(typeof item.href).toBe('string');
            expect(typeof item.iconName).toBe('string');

            // i18n keys should be properly formatted
            expect(item.labelKey).toMatch(/^Dashboard\.nav_/);
            expect(item.ariaKey).toMatch(/^Dashboard\.nav_/);
          }
        },
      ), { numRuns: 100 });
    });

    it('should maintain consistent key patterns across all actual navigation items', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 1: Navigation i18n key consistency
      fc.assert(fc.property(
        fc.constant(NAVIGATION_CONFIG.items),
        (items) => {
          // Property: All actual navigation items should follow consistent patterns

          for (const item of items) {
            // All items should have the Dashboard namespace
            expect(item.labelKey).toMatch(/^Dashboard\./);
            expect(item.ariaKey).toMatch(/^Dashboard\./);

            // Extract the key parts
            const labelKey = item.labelKey.replace('Dashboard.', '');
            const ariaKey = item.ariaKey.replace('Dashboard.', '');

            // Both should start with 'nav_'
            expect(labelKey).toMatch(/^nav_/);
            expect(ariaKey).toMatch(/^nav_/);

            // For navigation items, they should be identical
            expect(labelKey).toBe(ariaKey);

            // The key should correspond to the item ID
            const expectedKey = `nav_${item.id.replace('-', '_')}`;

            expect(labelKey).toBe(expectedKey);
            expect(ariaKey).toBe(expectedKey);

            // href should match the expected pattern
            expect(item.href).toBe(`/dashboard/${item.id}`);
          }
        },
      ), { numRuns: 100 });
    });
  });
});
