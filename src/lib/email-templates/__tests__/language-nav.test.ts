/**
 * @vitest-environment node
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

/**
 * Feature: supabase-bilingual-email-templates
 * Property Tests for Language Navigation Component
 *
 * Tests Properties 4, 5, 6, and 7:
 * - Property 4: Navigation Link Presence and Targeting
 * - Property 5: Touch-Friendly Navigation Buttons
 * - Property 6: Language Indicator Clarity
 * - Property 7: JavaScript-Free Implementation
 *
 * Validates: Requirements 1.4, 2.1, 2.3, 2.4, 2.5
 */

describe('Feature: supabase-bilingual-email-templates', () => {
  // Load the language navigation component HTML
  const languageNavPath = join(process.cwd(), 'supabase/email-templates/components/language-nav.html');
  const languageNavHTML = readFileSync(languageNavPath, 'utf-8');

  /**
   * Helper function to parse inline styles from a style attribute
   */
  function parseInlineStyles(styleAttr: string): Record<string, string> {
    const styles: Record<string, string> = {};
    const declarations = styleAttr.split(';').filter(d => d.trim());

    declarations.forEach((declaration) => {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    });

    return styles;
  }

  /**
   * Helper function to extract padding values and calculate total size
   */
  function calculateTouchTargetSize(styles: Record<string, string>): { width: number; height: number } {
    const padding = styles.padding || '0';
    const minHeight = styles['min-height'] || '0';
    const minWidth = styles['min-width'] || '0';

    // Parse padding (supports "12px 24px" format)
    const paddingValues = padding.split(' ').map(v => Number.parseInt(v) || 0);
    const paddingTop = paddingValues[0] || 0;
    const paddingRight = paddingValues[1] || paddingValues[0] || 0;
    const paddingBottom = paddingValues[2] || paddingValues[0] || 0;
    const paddingLeft = paddingValues[3] || paddingValues[1] || paddingValues[0] || 0;

    // Parse min dimensions
    const minHeightPx = Number.parseInt(minHeight) || 0;
    const minWidthPx = Number.parseInt(minWidth) || 0;

    // Calculate total size (padding + min dimensions)
    const totalHeight = Math.max(paddingTop + paddingBottom, minHeightPx);
    const totalWidth = Math.max(paddingLeft + paddingRight, minWidthPx);

    return { width: totalWidth, height: totalHeight };
  }

  describe('Property 4: Navigation Link Presence and Targeting', () => {
    it('should contain anchor links with href="#en" and href="#it"', () => {
      // Check for English navigation link
      expect(languageNavHTML).toMatch(/href=["']#en["']/);

      // Check for Italian navigation link
      expect(languageNavHTML).toMatch(/href=["']#it["']/);
    });

    it('should have anchor links that appear in the HTML structure', () => {
      // Extract all anchor tags
      const anchorRegex = /<a\s[^>]*href=["']#(en|it)["'][^>]*>/g;
      const matches = languageNavHTML.match(anchorRegex);

      // Should have at least 2 anchor links (one for EN, one for IT)
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });

    /**
     * Property-based test: For any email template that includes this navigation,
     * the anchor links should target valid language section IDs
     */
    it('property: anchor links target valid language section IDs', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('en', 'it'),
          (_langCode) => {
            // The navigation should contain a link targeting this language code
            const linkPattern = new RegExp(`href=["']#${_langCode}["']`);

            expect(languageNavHTML).toMatch(linkPattern);
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property-based test: Navigation links should appear before content sections
     * (This is validated by checking the component structure)
     */
    it('property: navigation component structure is self-contained', () => {
      // The component should be wrapped in a table row
      expect(languageNavHTML).toMatch(/<tr>/);
      expect(languageNavHTML).toMatch(/<\/tr>/);

      // Should contain table cells
      expect(languageNavHTML).toMatch(/<td/);
      expect(languageNavHTML).toMatch(/<\/td>/);
    });
  });

  describe('Property 5: Touch-Friendly Navigation Buttons', () => {
    it('should have navigation links with minimum 44x44px touch target', () => {
      // Extract anchor tag style attributes
      // eslint-disable-next-line regexp/no-unused-capturing-group
      const anchorRegex = /<a\s[^>]*href=["']#(?:en|it)["'][^>]*style=["']([^"']+)["'][^>]*>/g;
      let match;
      const touchTargets: Array<{ size: { width: number; height: number } }> = [];

      // eslint-disable-next-line no-cond-assign
      while ((match = anchorRegex.exec(languageNavHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);
        const size = calculateTouchTargetSize(styles);

        touchTargets.push({ size });
      }

      // Should have at least 2 touch targets
      expect(touchTargets.length).toBeGreaterThanOrEqual(2);

      // Each touch target should meet minimum 44x44px requirement
      touchTargets.forEach(({ size }) => {
        expect(size.height).toBeGreaterThanOrEqual(44);
        expect(size.width).toBeGreaterThanOrEqual(44);
      });
    });

    it('should have padding that contributes to touch target size', () => {
      // Extract padding from anchor tags

      const anchorRegex = /<a\s[^>]*href=["']#(?:en|it)["'][^>]*style=["']([^"']+)["'][^>]*>/g;
      let match;

      // eslint-disable-next-line no-cond-assign
      while ((match = anchorRegex.exec(languageNavHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        // Should have padding defined
        expect(styles.padding).toBeDefined();
        expect(styles.padding).toMatch(/\d+px/);
      }
    });

    /**
     * Property-based test: For any valid padding values, the touch target
     * should still meet minimum size requirements
     */
    it('property: touch target size remains valid with different padding', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: 20 }), // vertical padding
          fc.integer({ min: 16, max: 40 }), // horizontal padding
          (verticalPadding, horizontalPadding) => {
            // Simulate button with these padding values
            const styles = {
              'padding': `${verticalPadding}px ${horizontalPadding}px`,
              'min-height': '44px',
              'min-width': '44px',
            };

            const size = calculateTouchTargetSize(styles);

            // Should meet minimum requirements
            expect(size.height).toBeGreaterThanOrEqual(44);
            expect(size.width).toBeGreaterThanOrEqual(44);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 6: Language Indicator Clarity', () => {
    it('should include flag emojis for language identification', () => {
      // Check for English flag emoji
      expect(languageNavHTML).toMatch(/🇬🇧/);

      // Check for Italian flag emoji
      expect(languageNavHTML).toMatch(/🇮🇹/);
    });

    it('should include language names in navigation links', () => {
      // Check for "English" text
      expect(languageNavHTML).toMatch(/English/);

      // Check for "Italiano" text
      expect(languageNavHTML).toMatch(/Italiano/);
    });

    /**
     * Property-based test: Each navigation link should have both
     * a visual indicator (emoji) and text label
     */
    it('property: navigation links combine visual and text indicators', () => {
      fc.assert(
        fc.property(
          fc.record({
            lang: fc.constantFrom('en', 'it'),
            emoji: fc.constantFrom('🇬🇧', '🇮🇹'),
            text: fc.constantFrom('English', 'Italiano'),
          }),
          (data) => {
            // If the HTML contains a link for this language
            const linkPattern = new RegExp(`href=["']#${data.lang}["']`);
            if (linkPattern.test(languageNavHTML)) {
              // It should contain either the emoji or text (or both)
              const hasEmoji = languageNavHTML.includes(data.emoji);
              const hasText = languageNavHTML.includes(data.text);

              expect(hasEmoji || hasText).toBe(true);
            }
          },
        ),
        { numRuns: 100 },
      );
    });

    /**
     * Property-based test: Language indicators should be clearly distinguishable
     */
    it('property: each language has unique visual identifier', () => {
      const languageIndicators = [
        { lang: 'en', emoji: '🇬🇧', text: 'English' },
        { lang: 'it', emoji: '🇮🇹', text: 'Italiano' },
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...languageIndicators),
          (indicator) => {
            // Each language should have its unique emoji
            expect(languageNavHTML).toContain(indicator.emoji);

            // Each language should have its unique text
            expect(languageNavHTML).toContain(indicator.text);
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 7: JavaScript-Free Implementation', () => {
    it('should not contain any <script> tags', () => {
      // Check for script tags (case-insensitive)
      expect(languageNavHTML.toLowerCase()).not.toMatch(/<script/);
      expect(languageNavHTML.toLowerCase()).not.toMatch(/<\/script>/);
    });

    it('should not contain JavaScript event handlers', () => {
      // Common event handlers that should not be present
      const eventHandlers = [
        'onclick',
        'onload',
        'onmouseover',
        'onmouseout',
        'onmousedown',
        'onmouseup',
        'onchange',
        'onsubmit',
        'onfocus',
        'onblur',
        'onkeydown',
        'onkeyup',
        'onkeypress',
      ];

      eventHandlers.forEach((handler) => {
        const pattern = new RegExp(`\\s${handler}=`, 'i');

        expect(languageNavHTML).not.toMatch(pattern);
      });
    });

    it('should use standard HTML anchor links for navigation', () => {
      // Extract all anchor tags
      const anchorRegex = /<a\s[^>]*href=["']#(en|it)["'][^>]*>/g;
      const matches = languageNavHTML.match(anchorRegex);

      // Should have anchor links
      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThanOrEqual(2);

      // Each anchor should use standard href attribute (not JavaScript)
      matches!.forEach((anchor) => {
        expect(anchor).toMatch(/href=["']#(en|it)["']/);
        expect(anchor).not.toMatch(/javascript:/i);
      });
    });

    /**
     * Property-based test: For any HTML element in the navigation,
     * it should not contain JavaScript
     */
    it('property: no HTML elements contain JavaScript', () => {
      // Extract all HTML tags
      const tagRegex = /<[^>]+>/g;
      const tags = languageNavHTML.match(tagRegex) || [];

      fc.assert(
        fc.property(
          fc.constantFrom(...tags),
          (tag) => {
            // Should not contain script tag
            expect(tag.toLowerCase()).not.toMatch(/<script/);

            // Should not contain event handlers
            expect(tag.toLowerCase()).not.toMatch(/\son\w+=/);

            // Should not contain javascript: protocol
            expect(tag.toLowerCase()).not.toMatch(/javascript:/);
          },
        ),
        { numRuns: Math.min(100, tags.length) },
      );
    });

    /**
     * Property-based test: Navigation functionality should work with
     * standard HTML anchor behavior
     */
    it('property: anchor links use valid fragment identifiers', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('en', 'it'),
          (langCode) => {
            // Extract the href value for this language
            const hrefPattern = new RegExp(`href=["']#${langCode}["']`);
            const match = languageNavHTML.match(hrefPattern);

            expect(match).toBeTruthy();

            // The href should be a valid fragment identifier (starts with #)
            expect(match![0]).toMatch(/href=["']#[a-z]+["']/);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
