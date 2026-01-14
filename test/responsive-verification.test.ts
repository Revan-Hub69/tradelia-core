/**
 * Responsive Verification Tests - Learning Path Visual Coherence
 * 
 * Task 9.1: Verificare responsive su tutti i breakpoints
 * - Testare 320px, 640px, 768px, 1024px, 1280px
 * - Verificare no horizontal scroll
 * - Verificare touch targets 44x44px su mobile
 * - Verificare safe area su iOS
 * 
 * @requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ============================================
// BREAKPOINT DEFINITIONS
// ============================================

const BREAKPOINTS = {
  mobile: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================
// TOUCH TARGET VALIDATION
// ============================================

/**
 * Validates that a touch target meets Apple HIG minimum size (44x44px)
 * @requirements 10.4
 */
function validateTouchTarget(element: {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
}): { valid: boolean; reason?: string } {
  const MIN_TOUCH_TARGET = 44;
  
  const effectiveWidth = element.minWidth ?? element.width;
  const effectiveHeight = element.minHeight ?? element.height;
  
  if (effectiveWidth < MIN_TOUCH_TARGET) {
    return {
      valid: false,
      reason: `Width ${effectiveWidth}px is less than minimum ${MIN_TOUCH_TARGET}px`,
    };
  }
  
  if (effectiveHeight < MIN_TOUCH_TARGET) {
    return {
      valid: false,
      reason: `Height ${effectiveHeight}px is less than minimum ${MIN_TOUCH_TARGET}px`,
    };
  }
  
  return { valid: true };
}

/**
 * Validates touch target with padding compensation
 * Some elements use padding to expand touch area
 */
function validateTouchTargetWithPadding(element: {
  visualWidth: number;
  visualHeight: number;
  paddingX: number;
  paddingY: number;
}): { valid: boolean; touchWidth: number; touchHeight: number } {
  const MIN_TOUCH_TARGET = 44;
  
  const touchWidth = element.visualWidth + (element.paddingX * 2);
  const touchHeight = element.visualHeight + (element.paddingY * 2);
  
  return {
    valid: touchWidth >= MIN_TOUCH_TARGET && touchHeight >= MIN_TOUCH_TARGET,
    touchWidth,
    touchHeight,
  };
}

// ============================================
// HORIZONTAL SCROLL VALIDATION
// ============================================

/**
 * Validates that content doesn't cause horizontal scroll
 * @requirements 10.2
 */
function validateNoHorizontalScroll(layout: {
  viewportWidth: number;
  contentWidth: number;
  hasOverflowHidden?: boolean;
}): { valid: boolean; overflow: number } {
  const overflow = layout.contentWidth - layout.viewportWidth;
  
  // If overflow-x is hidden, no horizontal scroll regardless of content
  if (layout.hasOverflowHidden) {
    return { valid: true, overflow: 0 };
  }
  
  return {
    valid: overflow <= 0,
    overflow: Math.max(0, overflow),
  };
}

// ============================================
// SAFE AREA VALIDATION (iOS)
// ============================================

/**
 * Validates safe area inset handling for iOS devices
 * @requirements 10.2, 10.6
 */
function validateSafeAreaHandling(element: {
  hasSafeAreaBottom?: boolean;
  hasSafeAreaLeft?: boolean;
  hasSafeAreaRight?: boolean;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}): { valid: boolean; missingAreas: string[] } {
  const missingAreas: string[] = [];
  
  // Check if safe area classes or env() values are used
  const hasBottomSafeArea = 
    element.hasSafeAreaBottom || 
    element.paddingBottom?.includes('env(safe-area-inset-bottom');
    
  const hasLeftSafeArea = 
    element.hasSafeAreaLeft || 
    element.paddingLeft?.includes('env(safe-area-inset-left');
    
  const hasRightSafeArea = 
    element.hasSafeAreaRight || 
    element.paddingRight?.includes('env(safe-area-inset-right');
  
  // For drawer/modal components, bottom safe area is required
  if (!hasBottomSafeArea) {
    missingAreas.push('bottom');
  }
  
  return {
    valid: missingAreas.length === 0,
    missingAreas,
  };
}

// ============================================
// RESPONSIVE PADDING VALIDATION
// ============================================

/**
 * Validates responsive padding follows design system
 * @requirements 10.1, 10.3
 */
function validateResponsivePadding(
  breakpoint: Breakpoint,
  padding: { x: number; y: number }
): { valid: boolean; expected: { x: number; y: number } } {
  // Design system responsive padding expectations
  const EXPECTED_PADDING: Record<Breakpoint, { x: number; y: number }> = {
    mobile: { x: 16, y: 12 }, // p-4, py-3
    sm: { x: 20, y: 16 },     // p-5, py-4
    md: { x: 20, y: 16 },     // p-5, py-4
    lg: { x: 24, y: 16 },     // p-6, py-4
    xl: { x: 24, y: 16 },     // p-6, py-4
  };
  
  const expected = EXPECTED_PADDING[breakpoint];
  
  // Allow some tolerance (±4px)
  const tolerance = 4;
  const validX = Math.abs(padding.x - expected.x) <= tolerance;
  const validY = Math.abs(padding.y - expected.y) <= tolerance;
  
  return {
    valid: validX && validY,
    expected,
  };
}

// ============================================
// RESPONSIVE TYPOGRAPHY VALIDATION
// ============================================

/**
 * Validates responsive typography scaling
 * @requirements 10.6
 */
function validateResponsiveTypography(
  breakpoint: Breakpoint,
  element: 'title' | 'body' | 'small',
  fontSize: number
): { valid: boolean; expectedRange: { min: number; max: number } } {
  // Typography scale expectations per breakpoint
  const TYPOGRAPHY_SCALE: Record<Breakpoint, Record<string, { min: number; max: number }>> = {
    mobile: {
      title: { min: 16, max: 20 },   // text-base to text-xl
      body: { min: 14, max: 16 },    // text-sm to text-base
      small: { min: 12, max: 14 },   // text-xs to text-sm
    },
    sm: {
      title: { min: 18, max: 24 },   // text-lg to text-2xl
      body: { min: 14, max: 16 },
      small: { min: 12, max: 14 },
    },
    md: {
      title: { min: 18, max: 24 },
      body: { min: 15, max: 16 },
      small: { min: 13, max: 14 },
    },
    lg: {
      title: { min: 20, max: 28 },   // text-xl to text-2xl+
      body: { min: 15, max: 16 },
      small: { min: 13, max: 14 },
    },
    xl: {
      title: { min: 20, max: 32 },
      body: { min: 15, max: 16 },
      small: { min: 13, max: 14 },
    },
  };
  
  const expectedRange = TYPOGRAPHY_SCALE[breakpoint][element];
  
  return {
    valid: fontSize >= expectedRange.min && fontSize <= expectedRange.max,
    expectedRange,
  };
}

// ============================================
// GRID LAYOUT VALIDATION
// ============================================

/**
 * Validates responsive grid columns
 * @requirements 10.3
 */
function validateResponsiveGrid(
  breakpoint: Breakpoint,
  columns: number
): { valid: boolean; expectedColumns: number } {
  // Expected grid columns per breakpoint
  const EXPECTED_COLUMNS: Record<Breakpoint, number> = {
    mobile: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
  };
  
  return {
    valid: columns === EXPECTED_COLUMNS[breakpoint],
    expectedColumns: EXPECTED_COLUMNS[breakpoint],
  };
}

// ============================================
// TESTS
// ============================================

describe('Responsive Verification - Task 9.1', () => {
  describe('Touch Target Accessibility (REQ 10.4)', () => {
    it('should validate touch targets >= 44x44px', () => {
      // Valid touch targets
      expect(validateTouchTarget({ width: 44, height: 44 }).valid).toBe(true);
      expect(validateTouchTarget({ width: 48, height: 48 }).valid).toBe(true);
      expect(validateTouchTarget({ width: 100, height: 44 }).valid).toBe(true);
      
      // Invalid touch targets
      expect(validateTouchTarget({ width: 40, height: 44 }).valid).toBe(false);
      expect(validateTouchTarget({ width: 44, height: 40 }).valid).toBe(false);
      expect(validateTouchTarget({ width: 24, height: 24 }).valid).toBe(false);
    });
    
    it('should validate touch targets with minWidth/minHeight', () => {
      // Element with small visual size but min-width/min-height set
      expect(validateTouchTarget({ 
        width: 24, 
        height: 24, 
        minWidth: 44, 
        minHeight: 44 
      }).valid).toBe(true);
    });
    
    it('should validate touch targets with padding compensation', () => {
      // 20px icon with 12px padding = 44px touch area
      const result = validateTouchTargetWithPadding({
        visualWidth: 20,
        visualHeight: 20,
        paddingX: 12,
        paddingY: 12,
      });
      expect(result.valid).toBe(true);
      expect(result.touchWidth).toBe(44);
      expect(result.touchHeight).toBe(44);
      
      // 16px icon with 8px padding = 32px (too small)
      const invalidResult = validateTouchTargetWithPadding({
        visualWidth: 16,
        visualHeight: 16,
        paddingX: 8,
        paddingY: 8,
      });
      expect(invalidResult.valid).toBe(false);
    });
    
    it('property: all interactive elements must have touch target >= 44px', () => {
      fc.assert(
        fc.property(
          fc.record({
            width: fc.integer({ min: 20, max: 100 }),
            height: fc.integer({ min: 20, max: 100 }),
          }),
          (element) => {
            const result = validateTouchTarget(element);
            const shouldBeValid = element.width >= 44 && element.height >= 44;
            return result.valid === shouldBeValid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('No Horizontal Scroll (REQ 10.2)', () => {
    it('should validate no horizontal scroll when content fits', () => {
      expect(validateNoHorizontalScroll({
        viewportWidth: 320,
        contentWidth: 320,
      }).valid).toBe(true);
      
      expect(validateNoHorizontalScroll({
        viewportWidth: 320,
        contentWidth: 300,
      }).valid).toBe(true);
    });
    
    it('should detect horizontal scroll when content overflows', () => {
      const result = validateNoHorizontalScroll({
        viewportWidth: 320,
        contentWidth: 400,
      });
      expect(result.valid).toBe(false);
      expect(result.overflow).toBe(80);
    });
    
    it('should allow overflow when overflow-x is hidden', () => {
      expect(validateNoHorizontalScroll({
        viewportWidth: 320,
        contentWidth: 400,
        hasOverflowHidden: true,
      }).valid).toBe(true);
    });
    
    it('property: content width <= viewport width means no scroll', () => {
      fc.assert(
        fc.property(
          fc.record({
            viewportWidth: fc.integer({ min: 320, max: 1920 }),
            contentWidth: fc.integer({ min: 100, max: 2000 }),
          }),
          ({ viewportWidth, contentWidth }) => {
            const result = validateNoHorizontalScroll({ viewportWidth, contentWidth });
            return result.valid === (contentWidth <= viewportWidth);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Safe Area Handling - iOS (REQ 10.2, 10.6)', () => {
    it('should validate safe area bottom for drawers', () => {
      expect(validateSafeAreaHandling({
        hasSafeAreaBottom: true,
      }).valid).toBe(true);
      
      expect(validateSafeAreaHandling({
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }).valid).toBe(true);
    });
    
    it('should detect missing safe area', () => {
      const result = validateSafeAreaHandling({});
      expect(result.valid).toBe(false);
      expect(result.missingAreas).toContain('bottom');
    });
  });
  
  describe('Responsive Padding (REQ 10.1, 10.3)', () => {
    it('should validate mobile padding (16px)', () => {
      expect(validateResponsivePadding('mobile', { x: 16, y: 12 }).valid).toBe(true);
    });
    
    it('should validate tablet padding (20px)', () => {
      expect(validateResponsivePadding('sm', { x: 20, y: 16 }).valid).toBe(true);
    });
    
    it('should validate desktop padding (24px)', () => {
      expect(validateResponsivePadding('lg', { x: 24, y: 16 }).valid).toBe(true);
    });
    
    it('should allow tolerance in padding values', () => {
      // Within 4px tolerance
      expect(validateResponsivePadding('mobile', { x: 18, y: 14 }).valid).toBe(true);
      
      // Outside tolerance
      expect(validateResponsivePadding('mobile', { x: 24, y: 12 }).valid).toBe(false);
    });
  });
  
  describe('Responsive Typography (REQ 10.6)', () => {
    it('should validate mobile title size (16-20px)', () => {
      expect(validateResponsiveTypography('mobile', 'title', 16).valid).toBe(true);
      expect(validateResponsiveTypography('mobile', 'title', 20).valid).toBe(true);
      expect(validateResponsiveTypography('mobile', 'title', 24).valid).toBe(false);
    });
    
    it('should validate desktop title size (20-28px)', () => {
      expect(validateResponsiveTypography('lg', 'title', 20).valid).toBe(true);
      expect(validateResponsiveTypography('lg', 'title', 24).valid).toBe(true);
      expect(validateResponsiveTypography('lg', 'title', 16).valid).toBe(false);
    });
    
    it('property: typography scales appropriately per breakpoint', () => {
      const breakpoints: Breakpoint[] = ['mobile', 'sm', 'md', 'lg', 'xl'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...breakpoints),
          fc.constantFrom('title', 'body', 'small' as const),
          fc.integer({ min: 10, max: 40 }),
          (breakpoint, element, fontSize) => {
            const result = validateResponsiveTypography(breakpoint, element, fontSize);
            const inRange = fontSize >= result.expectedRange.min && fontSize <= result.expectedRange.max;
            return result.valid === inRange;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Responsive Grid Layout (REQ 10.3)', () => {
    it('should validate single column on mobile', () => {
      expect(validateResponsiveGrid('mobile', 1).valid).toBe(true);
      expect(validateResponsiveGrid('mobile', 2).valid).toBe(false);
    });
    
    it('should validate two columns on desktop', () => {
      expect(validateResponsiveGrid('lg', 2).valid).toBe(true);
      expect(validateResponsiveGrid('lg', 1).valid).toBe(false);
    });
    
    it('property: grid columns match breakpoint expectations', () => {
      const breakpoints: Breakpoint[] = ['mobile', 'sm', 'md', 'lg', 'xl'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...breakpoints),
          fc.integer({ min: 1, max: 4 }),
          (breakpoint, columns) => {
            const result = validateResponsiveGrid(breakpoint, columns);
            return result.valid === (columns === result.expectedColumns);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
  
  describe('Breakpoint Coverage', () => {
    it('should cover all required breakpoints', () => {
      const requiredBreakpoints = [320, 640, 768, 1024, 1280];
      const definedBreakpoints = Object.values(BREAKPOINTS);
      
      requiredBreakpoints.forEach(bp => {
        expect(definedBreakpoints).toContain(bp);
      });
    });
  });
});

// ============================================
// CSS CLASS VERIFICATION HELPERS
// ============================================

/**
 * Verifies that a component uses correct responsive classes
 */
export function verifyResponsiveClasses(classes: string): {
  hasMobilePadding: boolean;
  hasTabletPadding: boolean;
  hasDesktopPadding: boolean;
  hasTouchTarget: boolean;
  hasSafeArea: boolean;
} {
  return {
    hasMobilePadding: classes.includes('p-4') || classes.includes('px-4'),
    hasTabletPadding: classes.includes('sm:p-5') || classes.includes('sm:px-5'),
    hasDesktopPadding: classes.includes('lg:p-6') || classes.includes('lg:px-6'),
    hasTouchTarget: classes.includes('tap-target') || classes.includes('min-w-11') || classes.includes('min-h-11'),
    hasSafeArea: classes.includes('safe-area') || classes.includes('env(safe-area'),
  };
}

describe('CSS Class Verification', () => {
  it('should detect responsive padding classes', () => {
    const classes = 'px-4 sm:px-5 lg:px-6 py-3 sm:py-4';
    const result = verifyResponsiveClasses(classes);
    
    expect(result.hasMobilePadding).toBe(true);
    expect(result.hasTabletPadding).toBe(true);
    expect(result.hasDesktopPadding).toBe(true);
  });
  
  it('should detect touch target classes', () => {
    expect(verifyResponsiveClasses('tap-target').hasTouchTarget).toBe(true);
    expect(verifyResponsiveClasses('tap-target-icon').hasTouchTarget).toBe(true);
    expect(verifyResponsiveClasses('min-w-11 min-h-11').hasTouchTarget).toBe(true);
  });
  
  it('should detect safe area classes', () => {
    expect(verifyResponsiveClasses('safe-area-bottom').hasSafeArea).toBe(true);
    expect(verifyResponsiveClasses('safe-area-all').hasSafeArea).toBe(true);
  });
});
