/**
 * Base Template Validation Tests
 *
 * Validates that the base email template meets all requirements:
 * - Table-based layout
 * - Bilingual structure with proper IDs and lang attributes
 * - Visual divider between sections
 * - All inline styles (no <style> tags)
 * - No modern CSS features
 * - Minimum 14px font size
 * - Semantic HTML
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('Base Email Template Validation', () => {
  const templatePath = join(process.cwd(), 'supabase/email-templates/base-template.html');
  const templateHtml = readFileSync(templatePath, 'utf-8');

  describe('Requirement 1.1, 1.5, 7.2: Bilingual Structure', () => {
    it('should contain English section with id="en" and lang="en"', () => {
      expect(templateHtml).toContain('id="en"');
      expect(templateHtml).toContain('lang="en"');
    });

    it('should contain Italian section with id="it" and lang="it"', () => {
      expect(templateHtml).toContain('id="it"');
      expect(templateHtml).toContain('lang="it"');
    });
  });

  describe('Requirement 1.2: Visible Content', () => {
    it('should not hide content with display:none', () => {
      expect(templateHtml).not.toContain('display:none');
      expect(templateHtml).not.toContain('display: none');
    });

    it('should not hide content with visibility:hidden', () => {
      expect(templateHtml).not.toContain('visibility:hidden');
      expect(templateHtml).not.toContain('visibility: hidden');
    });

    it('should not hide content with opacity:0', () => {
      expect(templateHtml).not.toContain('opacity:0');
      expect(templateHtml).not.toContain('opacity: 0');
    });
  });

  describe('Requirement 1.3: Visual Divider', () => {
    it('should contain a visual divider between sections', () => {
      expect(templateHtml).toContain('border-top: 2px solid #e5e7eb');
    });
  });

  describe('Requirement 1.4, 2.1: Navigation Links', () => {
    it('should contain anchor link to English section', () => {
      expect(templateHtml).toContain('href="#en"');
    });

    it('should contain anchor link to Italian section', () => {
      expect(templateHtml).toContain('href="#it"');
    });
  });

  describe('Requirement 5.4: Table-Based Layout', () => {
    it('should use table elements for layout', () => {
      expect(templateHtml).toContain('<table');
      expect(templateHtml).toContain('role="presentation"');
    });

    it('should have main content table with 600px max width', () => {
      expect(templateHtml).toContain('width="600"');
      expect(templateHtml).toContain('max-width: 600px');
    });
  });

  describe('Requirement 5.5: Inline Styles Only', () => {
    it('should not contain <style> tags', () => {
      expect(templateHtml).not.toContain('<style');
    });

    it('should not contain <link> tags for external CSS', () => {
      expect(templateHtml).not.toContain('<link rel="stylesheet"');
    });

    it('should have inline styles on elements', () => {
      expect(templateHtml).toContain('style="');
    });
  });

  describe('Requirement 5.7: No Modern CSS Features', () => {
    it('should not use flexbox', () => {
      expect(templateHtml).not.toContain('display:flex');
      expect(templateHtml).not.toContain('display: flex');
    });

    it('should not use grid', () => {
      expect(templateHtml).not.toContain('display:grid');
      expect(templateHtml).not.toContain('display: grid');
    });

    it('should not use backdrop-filter', () => {
      expect(templateHtml).not.toContain('backdrop-filter');
    });
  });

  describe('Requirement 6.1: Responsive Layout', () => {
    it('should use width: 100% for mobile responsiveness', () => {
      expect(templateHtml).toContain('width: 100%');
    });
  });

  describe('Requirement 6.2: Minimum Text Size', () => {
    it('should not have font sizes smaller than 14px', () => {
      // Extract all font-size values
      const fontSizeRegex = /font-size:\s*(\d+)px/g;
      const matches = [...templateHtml.matchAll(fontSizeRegex)];

      matches.forEach((match) => {
        const size = Number.parseInt(match[1] ?? '14', 10);

        expect(size).toBeGreaterThanOrEqual(14);
      });
    });
  });

  describe('Requirement 7.1: Semantic HTML', () => {
    it('should use semantic heading tags', () => {
      expect(templateHtml).toContain('<h1');
      expect(templateHtml).toContain('<h2');
    });

    it('should use paragraph tags', () => {
      expect(templateHtml).toContain('<p');
    });
  });

  describe('Requirement 4.5: System Font Stack', () => {
    it('should use system font stack', () => {
      expect(templateHtml).toContain('-apple-system');
      expect(templateHtml).toContain('BlinkMacSystemFont');
      expect(templateHtml).toContain('Segoe UI');
      expect(templateHtml).toContain('Roboto');
    });
  });

  describe('Supabase Template Variables', () => {
    it('should contain Supabase template variables', () => {
      expect(templateHtml).toContain('{{.ConfirmationURL}}');
      expect(templateHtml).toContain('{{.SiteURL}}');
    });

    it('should contain bilingual content variables', () => {
      expect(templateHtml).toContain('{{.Greeting_EN}}');
      expect(templateHtml).toContain('{{.Greeting_IT}}');
      expect(templateHtml).toContain('{{.MainContent_EN}}');
      expect(templateHtml).toContain('{{.MainContent_IT}}');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on logo SVG', () => {
      expect(templateHtml).toContain('aria-label="Tradelia Logo"');
    });

    it('should have role="img" on logo SVG', () => {
      expect(templateHtml).toContain('role="img"');
    });
  });

  describe('Brand Colors', () => {
    it('should use Tradelia primary blue', () => {
      expect(templateHtml).toContain('#1D4ED8');
    });

    it('should use Tradelia accent green', () => {
      expect(templateHtml).toContain('#059669');
    });

    it('should use purple gradient', () => {
      expect(templateHtml).toContain('#667eea');
      expect(templateHtml).toContain('#764ba2');
    });
  });
});
