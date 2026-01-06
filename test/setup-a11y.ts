/**
 * Accessibility Testing Setup
 * Configures jest-axe for accessibility testing
 */

import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend Vitest expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure axe with WCAG 2.2 AA rules
export const axe = configureAxe({
  rules: {
    // WCAG 2.2 Level AA rules
    'color-contrast': { enabled: true },
    'link-name': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'label': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    // Disable rules that may conflict with React patterns
    'nested-interactive': { enabled: false },
  },
});

// Helper to run axe on rendered component
export async function checkA11y(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
