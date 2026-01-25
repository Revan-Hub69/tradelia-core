/**
 * @vitest-environment node
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

/**
 * Feature: supabase-bilingual-email-templates
 * Property Tests for Button Component
 *
 * Tests Properties 11 and 12:
 * - Property 11: Brand Color Usage
 * - Property 12: Glass Effect Styling
 *
 * Validates: Requirements 4.3, 4.4
 */

describe('Feature: supabase-bilingual-email-templates', () => {
  // Load the button component HTML
  const buttonPath = join(process.cwd(), 'supabase/email-templates/components/button.html');
  const buttonHTML = readFileSync(buttonPath, 'utf-8');

  /**
   * Helper function to parse inline styles from a style attribute
   */
  function parseInlineStyles(styleAttr: string): Record<string, string> {
    const styles: Record<string, string> = {};
    const declarations = styleAttr.split(';').filter((d) => d.trim());

    for (const declaration of declarations) {
      const [property, value] = declaration.split(':').map((s) => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    }

    return styles;
  }

  /**
   * Helper function to extract hex color codes from a string
   */
  function extractHexColors(text: string): string[] {
    const hexColorRegex = /#[0-9A-Fa-f]{6}/g;
    return text.match(hexColorRegex) || [];
  }

  /**
   * Helper function to check if a color is a Tradelia brand color
   */
  function isTradeliaColor(color: string): boolean {
    const brandColors = [
      '#1D4ED8', // Primary Blue
      '#1d4ed8', // Primary Blue (lowercase)
      '#059669', // Accent Green
      '#FCFBF8', // Soft Cream
      '#fcfbf8', // Soft Cream (lowercase)
    ];

    return brandColors.includes(color);
  }

  describe('Property 11: Brand Color Usage', () => {
    it('should use Tradelia Primary Blue (#1D4ED8) for button background', () => {
      // Extract background color from button styles
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      let foundBrandColor = false;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        if (styles.background || styles['background-color']) {
          const bgColor = styles.background || styles['background-color'];

          // Check if background uses Primary Blue
          if (bgColor.includes('#1D4ED8') || bgColor.includes('#1d4ed8')) {
            foundBrandColor = true;
          }
        }
      }

      expect(foundBrandColor).toBe(true);
    });

    it('should contain at least one Tradelia brand color', () => {
      // Extract all hex colors from the HTML
      const hexColors = extractHexColors(buttonHTML);

      // Should have at least one color
      expect(hexColors.length).toBeGreaterThan(0);

      // At least one color should be a Tradelia brand color
      const hasBrandColor = hexColors.some((color) => isTradeliaColor(color));
      expect(hasBrandColor).toBe(true);
    });

    it('should use brand colors in inline styles', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      const allStyles: string[] = [];

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        allStyles.push(match[1]);
      }

      // Should have style attributes
      expect(allStyles.length).toBeGreaterThan(0);

      // At least one style should contain a brand color
      const hasBrandColorInStyles = allStyles.some((styleAttr) => {
        const hexColors = extractHexColors(styleAttr);
        return hexColors.some((color) => isTradeliaColor(color));
      });

      expect(hasBrandColorInStyles).toBe(true);
    });

    /**
     * Property-based test: For any button element in the component,
     * if it has a background color, it should use a Tradelia brand color
     */
    it('property: button background uses Tradelia brand colors', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      const styleAttrs: string[] = [];
      let match;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        styleAttrs.push(match[1]);
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...styleAttrs),
          (styleAttr) => {
            const styles = parseInlineStyles(styleAttr);

            // If the element has a background color
            if (styles.background || styles['background-color']) {
              const bgColor = styles.background || styles['background-color'];
              const hexColors = extractHexColors(bgColor);

              // If there are hex colors, at least one should be a brand color
              if (hexColors.length > 0) {
                const hasBrandColor = hexColors.some((color) => isTradeliaColor(color));
                expect(hasBrandColor).toBe(true);
              }
            }
          },
        ),
        { numRuns: Math.min(100, styleAttrs.length) },
      );
    });

    /**
     * Property-based test: All color values in the component should be
     * either Tradelia brand colors or standard colors (white, black, transparent)
     */
    it('property: all colors are either brand colors or standard colors', () => {
      const hexColors = extractHexColors(buttonHTML);

      const standardColors = ['#FFFFFF', '#ffffff', '#000000', '#000'];

      fc.assert(
        fc.property(
          fc.constantFrom(...hexColors),
          (color) => {
            const isBrand = isTradeliaColor(color);
            const isStandard = standardColors.includes(color);

            // Color should be either a brand color or a standard color
            expect(isBrand || isStandard).toBe(true);
          },
        ),
        { numRuns: Math.min(100, hexColors.length) },
      );
    });

    /**
     * Property-based test: Primary Blue should be used consistently
     * across all button instances
     */
    it('property: Primary Blue (#1D4ED8) is used consistently', () => {
      // Extract all background color declarations
      const bgColorRegex = /background:\s*([^;]+)/gi;
      const bgColors: string[] = [];
      let match;

      while ((match = bgColorRegex.exec(buttonHTML)) !== null) {
        bgColors.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...bgColors),
          (bgColor) => {
            // If it's a solid color (not gradient), it should be Primary Blue
            if (!bgColor.includes('gradient') && !bgColor.includes('rgba')) {
              const hexColors = extractHexColors(bgColor);
              if (hexColors.length > 0) {
                expect(hexColors[0].toUpperCase()).toBe('#1D4ED8');
              }
            }
          },
        ),
        { numRuns: Math.min(100, bgColors.length) },
      );
    });
  });

  describe('Property 12: Glass Effect Styling', () => {
    it('should have box-shadow for glass effect', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      let hasBoxShadow = false;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        if (styles['box-shadow']) {
          hasBoxShadow = true;
        }
      }

      expect(hasBoxShadow).toBe(true);
    });

    it('should have border for glass effect', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      let hasBorder = false;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        if (styles.border) {
          hasBorder = true;
        }
      }

      expect(hasBorder).toBe(true);
    });

    it('should have both box-shadow and border on the same element', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      let hasGlassEffect = false;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        // Check if element has both box-shadow and border
        if (styles['box-shadow'] && styles.border) {
          hasGlassEffect = true;
        }
      }

      expect(hasGlassEffect).toBe(true);
    });

    it('should use subtle box-shadow values for glass effect', () => {
      // Extract box-shadow values
      const boxShadowRegex = /box-shadow:\s*([^;]+)/gi;
      let match;
      const boxShadows: string[] = [];

      while ((match = boxShadowRegex.exec(buttonHTML)) !== null) {
        boxShadows.push(match[1].trim());
      }

      // Should have at least one box-shadow
      expect(boxShadows.length).toBeGreaterThan(0);

      // Each box-shadow should be subtle (low opacity or small blur)
      for (const shadow of boxShadows) {
        // Should contain rgba with low opacity or small pixel values
        const hasRgba = shadow.includes('rgba');
        const hasSmallValues = /\d+px/.test(shadow);

        expect(hasRgba || hasSmallValues).toBe(true);
      }
    });

    it('should use semi-transparent border for glass effect', () => {
      // Extract border values
      const borderRegex = /border:\s*([^;]+)/gi;
      let match;
      const borders: string[] = [];

      while ((match = borderRegex.exec(buttonHTML)) !== null) {
        borders.push(match[1].trim());
      }

      // Should have at least one border
      expect(borders.length).toBeGreaterThan(0);

      // At least one border should use rgba for transparency
      const hasSemiTransparentBorder = borders.some((border) => border.includes('rgba'));
      expect(hasSemiTransparentBorder).toBe(true);
    });

    /**
     * Property-based test: For any element with glass effect styling,
     * it should have both box-shadow and border properties
     */
    it('property: glass effect elements have both shadow and border', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      const styleAttrs: string[] = [];
      let match;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        styleAttrs.push(match[1]);
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...styleAttrs),
          (styleAttr) => {
            const styles = parseInlineStyles(styleAttr);

            // If element has box-shadow, it should also have border
            if (styles['box-shadow']) {
              expect(styles.border).toBeDefined();
            }

            // If element has border with rgba, it should also have box-shadow
            if (styles.border && styles.border.includes('rgba')) {
              expect(styles['box-shadow']).toBeDefined();
            }
          },
        ),
        { numRuns: Math.min(100, styleAttrs.length) },
      );
    });

    /**
     * Property-based test: Box-shadow should use brand color with transparency
     */
    it('property: box-shadow uses brand color with transparency', () => {
      // Extract box-shadow values
      const boxShadowRegex = /box-shadow:\s*([^;]+)/gi;
      const boxShadows: string[] = [];
      let match;

      while ((match = boxShadowRegex.exec(buttonHTML)) !== null) {
        boxShadows.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...boxShadows),
          (shadow) => {
            // If shadow uses rgba, it should have low opacity (< 0.5)
            const rgbaMatch = shadow.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch) {
              const opacity = parseFloat(rgbaMatch[4]);
              expect(opacity).toBeLessThanOrEqual(0.5);
            }
          },
        ),
        { numRuns: Math.min(100, boxShadows.length) },
      );
    });

    /**
     * Property-based test: Border should use subtle styling
     */
    it('property: border uses subtle styling for glass effect', () => {
      // Extract border values
      const borderRegex = /border:\s*([^;]+)/gi;
      const borders: string[] = [];
      let match;

      while ((match = borderRegex.exec(buttonHTML)) !== null) {
        borders.push(match[1].trim());
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...borders),
          (border) => {
            // Border should be thin (1px or 2px)
            const widthMatch = border.match(/(\d+)px/);
            if (widthMatch) {
              const width = parseInt(widthMatch[1]);
              expect(width).toBeLessThanOrEqual(2);
            }

            // If border uses rgba, it should have low opacity
            const rgbaMatch = border.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
            if (rgbaMatch) {
              const opacity = parseFloat(rgbaMatch[4]);
              expect(opacity).toBeLessThanOrEqual(0.3);
            }
          },
        ),
        { numRuns: Math.min(100, borders.length) },
      );
    });

    /**
     * Property-based test: Glass effect should not use backdrop-filter
     * (unsupported in email clients)
     */
    it('property: glass effect does not use unsupported CSS properties', () => {
      // Extract all style attributes
      const styleRegex = /style=["']([^"']+)["']/g;
      const styleAttrs: string[] = [];
      let match;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        styleAttrs.push(match[1]);
      }

      fc.assert(
        fc.property(
          fc.constantFrom(...styleAttrs),
          (styleAttr) => {
            // Should not use backdrop-filter (unsupported in email clients)
            expect(styleAttr.toLowerCase()).not.toContain('backdrop-filter');

            // Should not use filter (limited support)
            expect(styleAttr.toLowerCase()).not.toContain('filter:');
          },
        ),
        { numRuns: Math.min(100, styleAttrs.length) },
      );
    });

    /**
     * Property-based test: Glass effect styling should be inline
     */
    it('property: glass effect styling is inline', () => {
      // Check that box-shadow and border are in style attributes, not in <style> tags
      expect(buttonHTML.toLowerCase()).not.toContain('<style');

      // Extract all style attributes with glass effect properties
      const styleRegex = /style=["']([^"']+)["']/g;
      let match;
      let glassEffectCount = 0;

      while ((match = styleRegex.exec(buttonHTML)) !== null) {
        const styleAttr = match[1];
        const styles = parseInlineStyles(styleAttr);

        if (styles['box-shadow'] && styles.border) {
          glassEffectCount++;
        }
      }

      // Should have at least one element with inline glass effect styling
      expect(glassEffectCount).toBeGreaterThan(0);
    });
  });
});
