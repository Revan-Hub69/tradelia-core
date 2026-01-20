/**
 * Command Palette Type Safety Property Tests
 *
 * Tests for Property 2: Command palette type consistency
 * Validates: Requirements 1.1
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import type { IconName } from '@/components/icons';
import {
  getVisibleNavigationItems,
  type NavigationItem,
  type NavigationItemId,
} from '@/data/navigation.config';

// Mock useTranslations for testing
const mockTranslations = {
  nav_home: 'Home',
  nav_learn: 'Learn',
  nav_tools: 'Tools',
  nav_community: 'Community',
  nav_profile: 'Profile',
  nav_home_desc: 'Go to dashboard home',
  nav_learn_desc: 'Access learning materials',
  nav_tools_desc: 'Trading tools and utilities',
  nav_community_desc: 'Connect with community',
  nav_profile_desc: 'Manage your profile',
  toggle_theme: 'Toggle Theme',
  toggle_theme_desc: 'Switch between light and dark mode',
  enable_focus_mode: 'Enable Focus Mode',
  focus_mode_desc: 'Reduce distractions while learning',
  command_category_navigation: 'Navigation',
  command_category_actions: 'Actions',
  command_category_settings: 'Settings',
};

// Command type from CommandPalette component
type Command = {
  id: string;
  label: string;
  description?: string;
  icon: IconName;
  action: () => void;
  category: 'navigation' | 'actions' | 'settings';
  keywords: string[];
};

// Generator for navigation item IDs
const navigationItemIdGenerator = (): fc.Arbitrary<NavigationItemId> => {
  return fc.constantFrom('home', 'learn', 'tools', 'community', 'profile');
};

// Generator for mock translation function
const mockTranslationGenerator = () => {
  return fc.constant((key: string, options?: { defaultValue?: string }) => {
    const mockKey = key.replace('Dashboard.', '') as keyof typeof mockTranslations;
    return mockTranslations[mockKey] || options?.defaultValue || key;
  });
};

// Function to simulate command generation from navigation items (extracted from CommandPalette)
const generateNavigationCommands = (
  navigationItems: NavigationItem[],
  t: (key: string, options?: { defaultValue?: string }) => string,
): Command[] => {
  return navigationItems.map((item, index) => ({
    id: `nav-${item.id}`,
    label: t(item.labelKey.replace('Dashboard.', '')),
    description: t(`nav_${item.id}_desc`, { defaultValue: '' }),
    icon: item.iconName as IconName,
    action: () => {}, // Mock action
    category: 'navigation' as const,
    keywords: [
      t(item.labelKey.replace('Dashboard.', '')).toLowerCase(),
      item.id,
      `alt+${index + 1}`,
    ],
  }));
};

describe('Command Palette Type Safety Property Tests', () => {
  describe('Property 2: Command palette type consistency', () => {
    it('should maintain consistent command structure when generating from navigation items', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          mockTranslationGenerator(),
          (t) => {
            // Property: All navigation items should generate consistent command structures

            const navigationItems = getVisibleNavigationItems();
            const commands = generateNavigationCommands(navigationItems, t);

            for (const command of commands) {
              // All commands should have required properties
              expect(command).toHaveProperty('id');
              expect(command).toHaveProperty('label');
              expect(command).toHaveProperty('icon');
              expect(command).toHaveProperty('action');
              expect(command).toHaveProperty('category');
              expect(command).toHaveProperty('keywords');

              // Type consistency checks
              expect(typeof command.id).toBe('string');
              expect(typeof command.label).toBe('string');
              expect(typeof command.icon).toBe('string');
              expect(typeof command.action).toBe('function');
              expect(typeof command.category).toBe('string');
              expect(Array.isArray(command.keywords)).toBe(true);

              // Navigation commands should follow specific patterns
              if (command.category === 'navigation') {
                // ID should follow nav-{itemId} pattern
                expect(command.id).toMatch(/^nav-/);

                // Icon should end with 'Icon'
                expect(command.icon).toMatch(/Icon$/);

                // Keywords should include the item ID
                const itemId = command.id.replace('nav-', '');

                expect(command.keywords).toContain(itemId);

                // Keywords should include alt+number shortcut
                expect(command.keywords.some(k => k.startsWith('alt+'))).toBe(true);

                // Label should be non-empty
                expect(command.label.length).toBeGreaterThan(0);
              }
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should ensure command ID uniqueness across all command types', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          mockTranslationGenerator(),
          (t) => {
            // Property: All command IDs should be unique within the palette

            const navigationItems = getVisibleNavigationItems();
            const navigationCommands = generateNavigationCommands(navigationItems, t);

            // Add action commands (simulating the ones from CommandPalette)
            const actionCommands: Command[] = [
              {
                id: 'theme-toggle',
                label: t('toggle_theme'),
                description: t('toggle_theme_desc'),
                icon: 'SettingsIcon' as IconName,
                action: () => {},
                category: 'settings',
                keywords: ['theme', 'dark', 'light', 'appearance'],
              },
              {
                id: 'focus-mode',
                label: t('enable_focus_mode'),
                description: t('focus_mode_desc'),
                icon: 'HomeIcon' as IconName,
                action: () => {},
                category: 'actions',
                keywords: ['focus', 'concentration', 'distraction'],
              },
            ];

            const allCommands = [...navigationCommands, ...actionCommands];
            const commandIds = allCommands.map(cmd => cmd.id);

            // All IDs should be unique
            const uniqueIds = new Set(commandIds);

            expect(uniqueIds.size).toBe(commandIds.length);

            // No empty IDs
            expect(commandIds.every(id => id.length > 0)).toBe(true);

            // IDs should follow consistent patterns
            for (const command of allCommands) {
              if (command.category === 'navigation') {
                expect(command.id).toMatch(/^nav-/);
              } else {
                expect(command.id).not.toMatch(/^nav-/);
              }
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain consistent i18n key transformation for command labels', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          navigationItemIdGenerator(),
          mockTranslationGenerator(),
          (itemId, t) => {
            // Property: i18n key transformation should be consistent and type-safe

            const navigationItems = getVisibleNavigationItems();
            const targetItem = navigationItems.find(item => item.id === itemId);

            if (targetItem) {
              const commands = generateNavigationCommands([targetItem], t);
              const command = commands[0];

              // The command should exist
              expect(command).toBeDefined();

              // Label should be derived from the correct i18n key
              const expectedLabelKey = targetItem.labelKey.replace('Dashboard.', '');
              const expectedLabel = t(expectedLabelKey);

              expect(command!.label).toBe(expectedLabel);

              // Description should follow the pattern nav_{id}_desc
              const expectedDescKey = `nav_${targetItem.id}_desc`;
              const expectedDesc = t(expectedDescKey, { defaultValue: '' });

              expect(command!.description).toBe(expectedDesc);

              // Icon should match the navigation item's icon
              expect(command!.icon).toBe(targetItem.iconName);

              // Category should be navigation for nav items
              expect(command!.category).toBe('navigation');
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should ensure command keywords are properly formatted and consistent', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          mockTranslationGenerator(),
          (t) => {
            // Property: Command keywords should follow consistent formatting rules

            const navigationItems = getVisibleNavigationItems();
            const commands = generateNavigationCommands(navigationItems, t);

            for (const command of commands) {
              // Keywords should be an array
              expect(Array.isArray(command.keywords)).toBe(true);

              // Should have at least one keyword
              expect(command.keywords.length).toBeGreaterThan(0);

              // All keywords should be strings
              expect(command.keywords.every(k => typeof k === 'string')).toBe(true);

              // Navigation commands should include specific keyword patterns
              if (command.category === 'navigation') {
                const itemId = command.id.replace('nav-', '');

                // Should include the item ID
                expect(command.keywords).toContain(itemId);

                // Should include the label in lowercase
                expect(command.keywords).toContain(command.label.toLowerCase());

                // Should include an alt+number shortcut
                expect(command.keywords.some(k => k.match(/^alt\+\d+$/))).toBe(true);

                // Alt shortcut should be valid (alt+1 through alt+5 for navigation items)
                const altShortcut = command.keywords.find(k => k.startsWith('alt+'));
                if (altShortcut) {
                  const shortcutNumber = Number.parseInt(altShortcut.replace('alt+', ''), 10);

                  expect(shortcutNumber).toBeGreaterThanOrEqual(1);
                  expect(shortcutNumber).toBeLessThanOrEqual(navigationItems.length);
                }
              }
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should maintain type safety for IconName usage in commands', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          mockTranslationGenerator(),
          (t) => {
            // Property: All command icons should be valid IconName types

            const navigationItems = getVisibleNavigationItems();
            const commands = generateNavigationCommands(navigationItems, t);

            // Valid icon names (based on the navigation config and common patterns)
            const validIconNames = [
              'HomeIcon',
              'LearnIcon',
              'ToolsIcon',
              'CommunityIcon',
              'ProfileIcon',
              'SettingsIcon',
            ];

            for (const command of commands) {
              // Icon should be a string
              expect(typeof command.icon).toBe('string');

              // Icon should end with 'Icon' (IconName convention)
              expect(command.icon).toMatch(/Icon$/);

              // For navigation commands, icon should match known navigation icons
              if (command.category === 'navigation') {
                expect(validIconNames).toContain(command.icon);
              }

              // Icon should not be empty
              expect(command.icon.length).toBeGreaterThan(0);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should ensure command categories are properly typed and consistent', () => {
      // Feature: enterprise-complete-roadmap-2026, Property 2: Command palette type consistency
      fc.assert(
        fc.property(
          mockTranslationGenerator(),
          (t) => {
            // Property: Command categories should be properly typed and follow consistent rules

            const navigationItems = getVisibleNavigationItems();
            const commands = generateNavigationCommands(navigationItems, t);

            const validCategories = ['navigation', 'actions', 'settings'];

            for (const command of commands) {
              // Category should be one of the valid types
              expect(validCategories).toContain(command.category);

              // Navigation items should always have 'navigation' category
              if (command.id.startsWith('nav-')) {
                expect(command.category).toBe('navigation');
              }

              // Category should be a string
              expect(typeof command.category).toBe('string');

              // Category should not be empty
              expect(command.category.length).toBeGreaterThan(0);
            }
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
