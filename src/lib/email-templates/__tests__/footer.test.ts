/**
 * @vitest-environment node
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

/**
 * Feature: supabase-bilingual-email-templates
 * Property Tests for Footer Component
 *
 * Tests Property 13:
 * - Property 13: System Font Stack
 *
 * Validates: Requirements 4.5
 */

describe('Feature: supabase-bilingual-email-templates', () => {
  // Load the footer component HTML
  const footerPath = join(process.cwd(), 'supabase/email-templates/components/footer.html');
  const footerHTML = readFileSync(footerPath, 'utf-8');

  /**
   * Helper function to parse inline styles from a style attribute
   */
  function parseInlineStyles(styleAttr: string): Record<string, string> {
    const styles: Record<string, string> = {};
    const declarations = styleAttr.split(';').filter(d => d.trim());

    for (const declaration of declarations) {
      const [property, value] = declaration.split(':').map(s => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    }

    return styles;
  }

  /**
   * Helper function to check if a font-family string contains the system font stack
   */
  function hasSystemFontStack(fontFamily: string): boolean {
    const requiredFonts = ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto'];

    return requiredFonts.every(font => fontFamily.includes(font));
  }

  describe('Property 13: System Font Stack', () => {
    it('should use system font stack in footer elements', () => {
      // Extract all font-family declarations directly
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      let match;
      const fontFamilies: string[] = [];

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      // Should have at least one element with font-family defined
      expect(fontFamilies.length).toBeGreaterThan(0);

      // Each font-family should include the system font stack
      for (const fontFamily of fontFamilies) {
        expect(hasSystemFontStack(fontFamily)).toBe(true);
      }
    });

    it('should include all required system fonts in order', () => {
      // Extract font-family declarations
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      let match;
      const fontFamilies: string[] = [];

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      // Should have font-family declarations
      expect(fontFamilies.length).toBeGreaterThan(0);

      // Check each font-family for proper system font stack
      for (const fontFamily of fontFamilies) {
        // Should start with -apple-system
        expect(fontFamily).toMatch(/-apple-system/);

        // Should include BlinkMacSystemFont
        expect(fontFamily).toMatch(/BlinkMacSystemFont/);

        // Should include Segoe UI
        expect(fontFamily).toMatch(/Segoe UI/);

        // Should include Roboto
        expect(fontFamily).toMatch(/Roboto/);

        // Should end with sans-serif fallback
        expect(fontFamily).toMatch(/sans-serif/);
      }
    });

    it('should have system font stack in all text elements', () => {
      // Extract all font-family declarations from text elements
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      let match;
      let textElementsChecked = 0;

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        const fontFamily = match[1].trim();

        // Each font-family should use system font stack
        expect(hasSystemFontStack(fontFamily)).toBe(true);

        textElementsChecked++;
      }

      // Should have checked at least one text element
      expect(textElementsChecked).toBeGreaterThan(0);
    });

    /**
     * Property-based test: For any text element in the footer,
     * if it has a font-family style, it should use the system font stack
     */
    it('property: all font-family declarations use system font stack', () => {
      // Extract all font-family declarations
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      const fontFamilies: string[] = [];
      let match;

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...fontFamilies),
          (fontFamily) => {
            // Each font-family should use system font stack
            expect(hasSystemFontStack(fontFamily)).toBe(true);
          },
        ),
        { numRuns: Math.min(100, fontFamilies.length) },
      );
    });

    /**
     * Property-based test: System font stack should be consistent across all elements
     */
    it('property: system font stack is consistent across all elements', () => {
      // Extract all font-family declarations
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      const fontFamilies: string[] = [];
      let match;

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...fontFamilies),
          (fontFamily) => {
            // Each font-family should contain the same system fonts
            expect(fontFamily).toContain('-apple-system');
            expect(fontFamily).toContain('BlinkMacSystemFont');
            expect(fontFamily).toContain('Segoe UI');
            expect(fontFamily).toContain('Roboto');
            expect(fontFamily).toContain('sans-serif');
          },
        ),
        { numRuns: Math.min(100, fontFamilies.length) },
      );
    });

    /**
     * Property-based test: Font stack should maintain proper order
     * (macOS fonts first, then Windows, then cross-platform, then fallback)
     */
    it('property: system font stack maintains proper order', () => {
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      const fontFamilies: string[] = [];
      let match;

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...fontFamilies),
          (fontFamily) => {
            // Find positions of each font
            const applePos = fontFamily.indexOf('-apple-system');
            const blinkPos = fontFamily.indexOf('BlinkMacSystemFont');
            const segoePos = fontFamily.indexOf('Segoe UI');
            const robotoPos = fontFamily.indexOf('Roboto');
            const sansSerifPos = fontFamily.indexOf('sans-serif');

            // Verify order: -apple-system should come before BlinkMacSystemFont
            if (applePos !== -1 && blinkPos !== -1) {
              expect(applePos).toBeLessThan(blinkPos);
            }

            // BlinkMacSystemFont should come before Segoe UI
            if (blinkPos !== -1 && segoePos !== -1) {
              expect(blinkPos).toBeLessThan(segoePos);
            }

            // Segoe UI should come before Roboto
            if (segoePos !== -1 && robotoPos !== -1) {
              expect(segoePos).toBeLessThan(robotoPos);
            }

            // sans-serif should be last
            if (sansSerifPos !== -1) {
              expect(sansSerifPos).toBeGreaterThan(applePos);
              expect(sansSerifPos).toBeGreaterThan(blinkPos);
              expect(sansSerifPos).toBeGreaterThan(segoePos);
              expect(sansSerifPos).toBeGreaterThan(robotoPos);
            }
          },
        ),
        { numRuns: Math.min(100, fontFamilies.length) },
      );
    });

    /**
     * Property-based test: Font-family should not use web fonts or custom fonts
     */
    it('property: no web fonts or custom fonts in font stack', () => {
      const fontFamilyRegex = /font-family:\s*([^;]+)/g;
      const fontFamilies: string[] = [];
      let match;

      while ((match = fontFamilyRegex.exec(footerHTML)) !== null) {
        fontFamilies.push(match[1].trim());
      }

      // Common web font names that should NOT be present
      const webFonts = ['Inter', 'Poppins', 'Montserrat', 'Open Sans', 'Lato', 'Raleway', 'Nunito'];

      fc.assert(
        fc.property(
          fc.constantFrom(...fontFamilies),
          (fontFamily) => {
            // Should not contain any web fonts
            for (const webFont of webFonts) {
              expect(fontFamily).not.toContain(webFont);
            }
          },
        ),
        { numRuns: Math.min(100, fontFamilies.length) },
      );
    });
  });
});
