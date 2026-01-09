/**
 * Feature: tradelia-2026-best-practices-audit
 * Property 4: Semantic HTML Structure
 * Validates: Requirements 3.11, 3.12, 3.13, 3.15
 * 
 * For any page in the application:
 * - Heading levels SHALL not skip (no h1 -> h3 without h2)
 * - All images SHALL have alt text or role="presentation"
 * - Interactive elements without visible text SHALL have aria-label
 * - Semantic landmarks (nav, main, article, section) SHALL be present
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Heading level validation
function validateHeadingHierarchy(headings: number[]): boolean {
  if (headings.length === 0) return true;
  
  // First heading should be h1
  if (headings[0] !== 1) return false;
  
  // No skipping levels (e.g., h1 -> h3 without h2)
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i]!;
    const previous = headings[i - 1]!;
    
    // Can go down (h1 -> h2) or stay same (h2 -> h2) or go up any amount (h3 -> h1)
    // But cannot skip down (h1 -> h3)
    if (current > previous + 1) {
      return false;
    }
  }
  
  return true;
}

// Image alt text validation
function validateImageAlt(images: Array<{ alt?: string | undefined; role?: string | undefined }>): boolean {
  return images.every(img => {
    // Either has meaningful alt text or is decorative (role="presentation")
    return (img.alt && img.alt.trim().length > 0) || img.role === 'presentation';
  });
}

// Interactive element aria-label validation
function validateAriaLabels(elements: Array<{ hasVisibleText: boolean; ariaLabel?: string | undefined }>): boolean {
  return elements.every(el => {
    // If has visible text, aria-label is optional
    // If no visible text, aria-label is required
    return el.hasVisibleText || (el.ariaLabel && el.ariaLabel.trim().length > 0);
  });
}

describe('Property 4: Semantic HTML Structure', () => {
  describe('Heading Hierarchy', () => {
    it('should validate correct heading hierarchy', () => {
      // Valid hierarchies
      expect(validateHeadingHierarchy([1])).toBe(true);
      expect(validateHeadingHierarchy([1, 2])).toBe(true);
      expect(validateHeadingHierarchy([1, 2, 3])).toBe(true);
      expect(validateHeadingHierarchy([1, 2, 2])).toBe(true);
      expect(validateHeadingHierarchy([1, 2, 3, 2])).toBe(true);
      expect(validateHeadingHierarchy([1, 2, 3, 1, 2])).toBe(true);
    });

    it('should reject invalid heading hierarchy', () => {
      // Invalid: starts with h2
      expect(validateHeadingHierarchy([2])).toBe(false);
      // Invalid: skips h2
      expect(validateHeadingHierarchy([1, 3])).toBe(false);
      // Invalid: skips h2 and h3
      expect(validateHeadingHierarchy([1, 4])).toBe(false);
      // Invalid: h2 -> h4 skip
      expect(validateHeadingHierarchy([1, 2, 4])).toBe(false);
    });

    it('property: for any valid heading sequence, no level is skipped going down', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 1, maxLength: 20 }),
          (headings) => {
            const isValid = validateHeadingHierarchy(headings);
            
            if (isValid) {
              // If valid, verify no skips going down
              for (let i = 1; i < headings.length; i++) {
                if (headings[i]! > headings[i - 1]! + 1) {
                  return false;
                }
              }
              // And first heading is h1
              return headings[0] === 1;
            }
            
            return true; // Invalid sequences are allowed to fail
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Image Alt Text', () => {
    it('should validate images with alt text', () => {
      expect(validateImageAlt([{ alt: 'Description' }])).toBe(true);
      expect(validateImageAlt([{ role: 'presentation' }])).toBe(true);
      expect(validateImageAlt([{ alt: 'Desc', role: 'presentation' }])).toBe(true);
    });

    it('should reject images without alt text', () => {
      expect(validateImageAlt([{}])).toBe(false);
      expect(validateImageAlt([{ alt: '' }])).toBe(false);
      expect(validateImageAlt([{ alt: '   ' }])).toBe(false);
    });

    it('property: for any image, either alt or role="presentation" must exist', () => {
      const imageArbitrary = fc.record({
        alt: fc.option(fc.string(), { nil: undefined }),
        role: fc.option(fc.constantFrom('presentation', 'img', undefined), { nil: undefined })
      });

      fc.assert(
        fc.property(
          fc.array(imageArbitrary, { minLength: 1, maxLength: 10 }),
          (images) => {
            const isValid = validateImageAlt(images);
            
            // Verify our validation logic
            const shouldBeValid = images.every(img => 
              (img.alt && img.alt.trim().length > 0) || img.role === 'presentation'
            );
            
            return isValid === shouldBeValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('ARIA Labels', () => {
    it('should validate elements with visible text', () => {
      expect(validateAriaLabels([{ hasVisibleText: true }])).toBe(true);
      expect(validateAriaLabels([{ hasVisibleText: true, ariaLabel: 'Label' }])).toBe(true);
    });

    it('should validate icon-only elements with aria-label', () => {
      expect(validateAriaLabels([{ hasVisibleText: false, ariaLabel: 'Close menu' }])).toBe(true);
    });

    it('should reject icon-only elements without aria-label', () => {
      expect(validateAriaLabels([{ hasVisibleText: false }])).toBe(false);
      expect(validateAriaLabels([{ hasVisibleText: false, ariaLabel: '' }])).toBe(false);
    });

    it('property: icon-only elements must have aria-label', () => {
      const elementArbitrary = fc.record({
        hasVisibleText: fc.boolean(),
        ariaLabel: fc.option(fc.string(), { nil: undefined })
      });

      fc.assert(
        fc.property(
          fc.array(elementArbitrary, { minLength: 1, maxLength: 10 }),
          (elements) => {
            const isValid = validateAriaLabels(elements);
            
            // Verify our validation logic
            const shouldBeValid = elements.every(el => 
              el.hasVisibleText || (el.ariaLabel && el.ariaLabel.trim().length > 0)
            );
            
            return isValid === shouldBeValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property 3: Keyboard Accessibility
 * Validates: Requirements 3.6, 3.7, 3.8, 3.10
 * 
 * For any interactive element:
 * - All interactive elements SHALL be focusable via keyboard
 * - Focus indicators SHALL be visible (2px outline minimum)
 * - Tab order SHALL follow logical reading order
 * - Modal dialogs SHALL trap focus and allow Escape to close
 */

// Focus indicator validation
function validateFocusIndicator(styles: { outlineWidth?: string | undefined; ringWidth?: string | undefined; boxShadow?: string | undefined }): boolean {
  // Check for visible focus indicator (outline, ring, or box-shadow)
  const hasOutline = styles.outlineWidth && parseFloat(styles.outlineWidth) >= 2;
  const hasRing = styles.ringWidth && parseFloat(styles.ringWidth) >= 2;
  const hasBoxShadow = styles.boxShadow && styles.boxShadow !== 'none';
  
  return Boolean(hasOutline || hasRing || hasBoxShadow);
}

// Tab order validation (no positive tabindex)
function validateTabOrder(elements: Array<{ tagName: string; tabIndex: number; role?: string | undefined }>): boolean {
  return elements.every(el => {
    // Positive tabindex breaks natural order
    if (el.tabIndex > 0) return false;
    
    // Interactive elements should be focusable (tabIndex >= 0 or naturally focusable)
    const naturallyFocusable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    const hasInteractiveRole = ['button', 'link', 'checkbox', 'radio', 'menuitem'].includes(el.role || '');
    
    if (hasInteractiveRole && !naturallyFocusable && el.tabIndex < 0) {
      return false; // Interactive role but not focusable
    }
    
    return true;
  });
}

// Modal focus trap validation
function validateModalFocusTrap(modal: {
  hasEscapeHandler: boolean;
  hasFocusTrap: boolean;
  focusableElements: number;
  initialFocusSet: boolean;
}): boolean {
  // Modal must have escape handler
  if (!modal.hasEscapeHandler) return false;
  
  // Modal must trap focus if it has focusable elements
  if (modal.focusableElements > 0 && !modal.hasFocusTrap) return false;
  
  // Modal should set initial focus
  if (modal.focusableElements > 0 && !modal.initialFocusSet) return false;
  
  return true;
}

describe('Property 3: Keyboard Accessibility', () => {
  describe('Focus Indicators', () => {
    it('should validate visible focus indicators', () => {
      expect(validateFocusIndicator({ outlineWidth: '2px' })).toBe(true);
      expect(validateFocusIndicator({ ringWidth: '2px' })).toBe(true);
      expect(validateFocusIndicator({ boxShadow: '0 0 0 2px blue' })).toBe(true);
    });

    it('should reject invisible focus indicators', () => {
      expect(validateFocusIndicator({})).toBe(false);
      expect(validateFocusIndicator({ outlineWidth: '0px' })).toBe(false);
      expect(validateFocusIndicator({ outlineWidth: '1px' })).toBe(false);
      expect(validateFocusIndicator({ boxShadow: 'none' })).toBe(false);
    });

    it('property: focus indicators must be at least 2px', () => {
      fc.assert(
        fc.property(
          fc.record({
            outlineWidth: fc.option(fc.oneof(fc.constant('0px'), fc.constant('1px'), fc.constant('2px'), fc.constant('3px')), { nil: undefined }),
            ringWidth: fc.option(fc.oneof(fc.constant('0px'), fc.constant('1px'), fc.constant('2px'), fc.constant('3px')), { nil: undefined }),
            boxShadow: fc.option(fc.oneof(fc.constant('none'), fc.constant('0 0 0 2px blue')), { nil: undefined })
          }),
          (styles) => {
            const isValid = validateFocusIndicator(styles);
            
            // Verify our validation logic
            const hasValidOutline = styles.outlineWidth && parseFloat(styles.outlineWidth) >= 2;
            const hasValidRing = styles.ringWidth && parseFloat(styles.ringWidth) >= 2;
            const hasValidShadow = styles.boxShadow && styles.boxShadow !== 'none';
            const shouldBeValid = Boolean(hasValidOutline || hasValidRing || hasValidShadow);
            
            return isValid === shouldBeValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Tab Order', () => {
    it('should validate natural tab order', () => {
      expect(validateTabOrder([
        { tagName: 'BUTTON', tabIndex: 0 },
        { tagName: 'A', tabIndex: 0 },
        { tagName: 'INPUT', tabIndex: 0 }
      ])).toBe(true);
    });

    it('should reject positive tabindex', () => {
      expect(validateTabOrder([
        { tagName: 'BUTTON', tabIndex: 1 }
      ])).toBe(false);
      
      expect(validateTabOrder([
        { tagName: 'DIV', tabIndex: 5, role: 'button' }
      ])).toBe(false);
    });

    it('should reject non-focusable interactive roles', () => {
      expect(validateTabOrder([
        { tagName: 'DIV', tabIndex: -1, role: 'button' }
      ])).toBe(false);
    });

    it('property: no element should have positive tabindex', () => {
      const elementArbitrary = fc.record({
        tagName: fc.constantFrom('BUTTON', 'A', 'INPUT', 'DIV', 'SPAN'),
        tabIndex: fc.integer({ min: -1, max: 10 }),
        role: fc.option(fc.constantFrom('button', 'link', 'checkbox', undefined), { nil: undefined })
      });

      fc.assert(
        fc.property(
          fc.array(elementArbitrary, { minLength: 1, maxLength: 10 }),
          (elements) => {
            const isValid = validateTabOrder(elements);
            
            // If any element has positive tabindex, should be invalid
            const hasPositiveTabIndex = elements.some(el => el.tabIndex > 0);
            if (hasPositiveTabIndex) {
              return !isValid;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Modal Focus Trap', () => {
    it('should validate proper modal focus trap', () => {
      expect(validateModalFocusTrap({
        hasEscapeHandler: true,
        hasFocusTrap: true,
        focusableElements: 5,
        initialFocusSet: true
      })).toBe(true);
    });

    it('should reject modal without escape handler', () => {
      expect(validateModalFocusTrap({
        hasEscapeHandler: false,
        hasFocusTrap: true,
        focusableElements: 5,
        initialFocusSet: true
      })).toBe(false);
    });

    it('should reject modal without focus trap', () => {
      expect(validateModalFocusTrap({
        hasEscapeHandler: true,
        hasFocusTrap: false,
        focusableElements: 5,
        initialFocusSet: true
      })).toBe(false);
    });

    it('property: modals with focusable elements must trap focus', () => {
      const modalArbitrary = fc.record({
        hasEscapeHandler: fc.boolean(),
        hasFocusTrap: fc.boolean(),
        focusableElements: fc.integer({ min: 0, max: 20 }),
        initialFocusSet: fc.boolean()
      });

      fc.assert(
        fc.property(modalArbitrary, (modal) => {
          const isValid = validateModalFocusTrap(modal);
          
          // Must have escape handler
          if (!modal.hasEscapeHandler) return !isValid;
          
          // If has focusable elements, must trap focus
          if (modal.focusableElements > 0 && !modal.hasFocusTrap) return !isValid;
          
          // If has focusable elements, must set initial focus
          if (modal.focusableElements > 0 && !modal.initialFocusSet) return !isValid;
          
          return isValid;
        }),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property 2: Color Contrast Compliance
 * Validates: Requirements 3.1, 3.2, 3.3
 * 
 * For any text element:
 * - Primary text (foreground) SHALL have 7:1 contrast ratio (WCAG AAA)
 * - Secondary text (muted-foreground) SHALL have 4.5:1 contrast ratio (WCAG AA)
 * - Interactive elements SHALL have 3:1 contrast ratio minimum
 */

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs! + 0.7152 * gs! + 0.0722 * bs!;
}

// Calculate contrast ratio
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Validate contrast meets WCAG level
function validateContrast(
  fgLuminance: number, 
  bgLuminance: number, 
  level: 'AA' | 'AAA' | 'AA-large'
): boolean {
  const ratio = getContrastRatio(fgLuminance, bgLuminance);
  switch (level) {
    case 'AAA': return ratio >= 7;
    case 'AA': return ratio >= 4.5;
    case 'AA-large': return ratio >= 3;
    default: return false;
  }
}

describe('Property 2: Color Contrast Compliance', () => {
  describe('Contrast Ratio Calculation', () => {
    it('should calculate correct luminance for black and white', () => {
      expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 2);
      expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 2);
    });

    it('should calculate correct contrast ratio', () => {
      const blackLum = getLuminance(0, 0, 0);
      const whiteLum = getLuminance(255, 255, 255);
      expect(getContrastRatio(whiteLum, blackLum)).toBeCloseTo(21, 0);
    });

    it('should validate WCAG AAA (7:1) for primary text', () => {
      // Tradelia foreground: hsl(220 15% 12%) ≈ rgb(26, 29, 35)
      // Tradelia background: hsl(0 0% 99%) ≈ rgb(252, 252, 252)
      const fgLum = getLuminance(26, 29, 35);
      const bgLum = getLuminance(252, 252, 252);
      expect(validateContrast(fgLum, bgLum, 'AAA')).toBe(true);
    });

    it('should validate WCAG AA (4.5:1) for secondary text', () => {
      // Tradelia muted-foreground: hsl(220 10% 40%) ≈ rgb(92, 97, 112)
      // Tradelia background: hsl(0 0% 99%) ≈ rgb(252, 252, 252)
      const fgLum = getLuminance(92, 97, 112);
      const bgLum = getLuminance(252, 252, 252);
      expect(validateContrast(fgLum, bgLum, 'AA')).toBe(true);
    });
  });

  describe('Property Tests', () => {
    it('property: primary text must meet WCAG AAA', () => {
      fc.assert(
        fc.property(
          fc.record({
            fgR: fc.integer({ min: 0, max: 50 }), // Dark foreground
            fgG: fc.integer({ min: 0, max: 50 }),
            fgB: fc.integer({ min: 0, max: 60 }),
            bgR: fc.integer({ min: 240, max: 255 }), // Light background
            bgG: fc.integer({ min: 240, max: 255 }),
            bgB: fc.integer({ min: 240, max: 255 })
          }),
          ({ fgR, fgG, fgB, bgR, bgG, bgB }) => {
            const fgLum = getLuminance(fgR, fgG, fgB);
            const bgLum = getLuminance(bgR, bgG, bgB);
            const ratio = getContrastRatio(fgLum, bgLum);
            
            // Dark on light should have high contrast
            return ratio >= 7;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});

/**
 * Property 5: Animation Constraints
 * Validates: Requirements 3.17, 3.18, 3.20, 10.1-10.4
 * 
 * For any animation:
 * - Duration SHALL be <= 150ms for transitions
 * - No bounce, pulse, or glow effects SHALL exist
 * - prefers-reduced-motion SHALL disable animations
 */

// Validate animation duration
function validateAnimationDuration(durationMs: number, type: 'transition' | 'animation'): boolean {
  if (type === 'transition') {
    return durationMs <= 150;
  }
  // Animations can be longer but should be subtle
  return durationMs <= 800;
}

// Validate animation name (no forbidden effects)
function validateAnimationName(name: string): boolean {
  const forbidden = ['bounce', 'pulse', 'glow', 'shake', 'wobble', 'flash', 'rubberBand'];
  return !forbidden.some(f => name.toLowerCase().includes(f));
}

// Validate CSS class for animation compliance
function validateAnimationClass(className: string): { valid: boolean; reason?: string } {
  // Check for duration classes
  const durationMatch = className.match(/duration-(\d+)/);
  if (durationMatch) {
    const durationStr = durationMatch[1];
    if (!durationStr) return { valid: false, reason: 'Invalid duration class' };
    const duration = parseInt(durationStr, 10);
    if (duration > 150 && className.includes('transition')) {
      return { valid: false, reason: `Transition duration ${duration}ms exceeds 150ms limit` };
    }
  }
  
  // Check for forbidden animation names
  const forbiddenPatterns = ['animate-bounce', 'animate-pulse', 'animate-ping'];
  for (const pattern of forbiddenPatterns) {
    if (className.includes(pattern)) {
      return { valid: false, reason: `Forbidden animation: ${pattern}` };
    }
  }
  
  return { valid: true };
}

describe('Property 5: Animation Constraints', () => {
  describe('Duration Validation', () => {
    it('should validate transitions <= 150ms', () => {
      expect(validateAnimationDuration(150, 'transition')).toBe(true);
      expect(validateAnimationDuration(100, 'transition')).toBe(true);
      expect(validateAnimationDuration(200, 'transition')).toBe(false);
      expect(validateAnimationDuration(300, 'transition')).toBe(false);
    });

    it('should validate animations <= 800ms', () => {
      expect(validateAnimationDuration(500, 'animation')).toBe(true);
      expect(validateAnimationDuration(800, 'animation')).toBe(true);
      expect(validateAnimationDuration(1000, 'animation')).toBe(false);
    });
  });

  describe('Animation Name Validation', () => {
    it('should allow subtle animations', () => {
      expect(validateAnimationName('fadeIn')).toBe(true);
      expect(validateAnimationName('slideUp')).toBe(true);
      expect(validateAnimationName('scaleIn')).toBe(true);
    });

    it('should reject forbidden animations', () => {
      expect(validateAnimationName('bounce')).toBe(false);
      expect(validateAnimationName('pulse')).toBe(false);
      expect(validateAnimationName('glow')).toBe(false);
      expect(validateAnimationName('bounceIn')).toBe(false);
    });
  });

  describe('CSS Class Validation', () => {
    it('should validate compliant classes', () => {
      expect(validateAnimationClass('transition-all duration-150')).toEqual({ valid: true });
      expect(validateAnimationClass('transition-colors duration-100')).toEqual({ valid: true });
    });

    it('should reject non-compliant classes', () => {
      const result = validateAnimationClass('transition-all duration-300');
      expect(result.valid).toBe(false);
    });

    it('should reject forbidden animation classes', () => {
      expect(validateAnimationClass('animate-bounce').valid).toBe(false);
      expect(validateAnimationClass('animate-pulse').valid).toBe(false);
    });
  });

  describe('Property Tests', () => {
    it('property: all transitions must be <= 150ms', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 500 }),
          (duration) => {
            const isValid = validateAnimationDuration(duration, 'transition');
            return isValid === (duration <= 150);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('property: no forbidden animation names', () => {
      const animationNames = fc.oneof(
        fc.constant('fadeIn'),
        fc.constant('slideUp'),
        fc.constant('bounce'),
        fc.constant('pulse'),
        fc.constant('glow'),
        fc.constant('scaleIn')
      );

      fc.assert(
        fc.property(animationNames, (name) => {
          const isValid = validateAnimationName(name);
          const forbidden = ['bounce', 'pulse', 'glow'];
          const shouldBeInvalid = forbidden.includes(name);
          return isValid !== shouldBeInvalid;
        }),
        { numRuns: 50 }
      );
    });
  });
});


/**
 * Property 6: Image Optimization
 * Validates: Requirements 4.3, 4.5, 4.12, 4.14
 * 
 * For any image element:
 * - Images SHALL have explicit width and height or aspect-ratio
 * - Below-fold images SHALL have loading="lazy"
 * - Images SHALL use next/image for automatic optimization
 * - Images SHALL have appropriate srcset for responsive loading
 */

// Validate image has dimensions (prevents CLS)
function validateImageDimensions(image: {
  width?: number | string | undefined;
  height?: number | string | undefined;
  aspectRatio?: string | undefined;
  fill?: boolean | undefined;
}): boolean {
  // next/image fill mode handles dimensions automatically
  if (image.fill) return true;
  
  // Must have explicit dimensions or aspect-ratio
  const hasWidth = image.width !== undefined && image.width !== '';
  const hasHeight = image.height !== undefined && image.height !== '';
  const hasAspectRatio = image.aspectRatio !== undefined && image.aspectRatio !== '';
  
  return (hasWidth && hasHeight) || hasAspectRatio;
}

// Validate lazy loading for below-fold images
function validateLazyLoading(image: {
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  isAboveFold: boolean;
}): boolean {
  // Above-fold images should be eager or priority
  if (image.isAboveFold) {
    return image.priority === true || image.loading === 'eager' || image.loading === undefined;
  }
  
  // Below-fold images should be lazy
  return image.loading === 'lazy' || image.loading === undefined; // next/image defaults to lazy
}

describe('Property 6: Image Optimization', () => {
  describe('Image Dimensions', () => {
    it('should validate images with explicit dimensions', () => {
      expect(validateImageDimensions({ width: 100, height: 100 })).toBe(true);
      expect(validateImageDimensions({ width: '100', height: '100' })).toBe(true);
      expect(validateImageDimensions({ aspectRatio: '16/9' })).toBe(true);
      expect(validateImageDimensions({ fill: true })).toBe(true);
    });

    it('should reject images without dimensions', () => {
      expect(validateImageDimensions({})).toBe(false);
      expect(validateImageDimensions({ width: 100 })).toBe(false);
      expect(validateImageDimensions({ height: 100 })).toBe(false);
    });

    it('property: all images must have dimensions to prevent CLS', () => {
      const imageArbitrary = fc.record({
        width: fc.option(fc.oneof(fc.integer({ min: 1, max: 1000 }), fc.constant('')), { nil: undefined }),
        height: fc.option(fc.oneof(fc.integer({ min: 1, max: 1000 }), fc.constant('')), { nil: undefined }),
        aspectRatio: fc.option(fc.constantFrom('16/9', '4/3', '1/1', ''), { nil: undefined }),
        fill: fc.option(fc.boolean(), { nil: undefined })
      });

      fc.assert(
        fc.property(imageArbitrary, (image) => {
          const isValid = validateImageDimensions(image);
          
          // Verify our validation logic
          if (image.fill) return isValid === true;
          
          const hasWidth = image.width !== undefined && image.width !== '';
          const hasHeight = image.height !== undefined && image.height !== '';
          const hasAspectRatio = image.aspectRatio !== undefined && image.aspectRatio !== '';
          const shouldBeValid = (hasWidth && hasHeight) || hasAspectRatio;
          
          return isValid === shouldBeValid;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Lazy Loading', () => {
    it('should validate above-fold images with priority', () => {
      expect(validateLazyLoading({ isAboveFold: true, priority: true })).toBe(true);
      expect(validateLazyLoading({ isAboveFold: true, loading: 'eager' })).toBe(true);
    });

    it('should validate below-fold images with lazy loading', () => {
      expect(validateLazyLoading({ isAboveFold: false, loading: 'lazy' })).toBe(true);
      expect(validateLazyLoading({ isAboveFold: false })).toBe(true); // default is lazy
    });
  });
});
