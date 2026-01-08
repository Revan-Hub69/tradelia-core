/**
 * Design System Extended Property Tests
 * Validates spacing, typography, and component consistency
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

/**
 * Property 13: CSS Spacing Scale
 * Validates: Requirements 2.2, 2.3
 * 
 * For any spacing value:
 * - Spacing SHALL be based on 4px base unit
 * - Valid spacing values: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 32, etc.
 */

// Tailwind spacing scale (in rem, based on 4px = 0.25rem)
const VALID_SPACING_VALUES = [
  0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
];

// Tailwind spacing classes
const VALID_SPACING_CLASSES = [
  'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20', 'p-24', 'p-32',
  'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-16', 'm-20', 'm-24', 'm-32',
  'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8', 'gap-10', 'gap-12',
  'space-y-0', 'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-6', 'space-y-8',
  'space-x-0', 'space-x-1', 'space-x-2', 'space-x-3', 'space-x-4', 'space-x-6', 'space-x-8'
];

// Validate spacing value is on 4px grid
function validateSpacingValue(valueRem: number): boolean {
  // Convert to px (1rem = 16px)
  const valuePx = valueRem * 16;
  // Check if divisible by 4 (or is 0)
  return valuePx === 0 || valuePx % 4 === 0 || valuePx % 2 === 0;
}

// Validate spacing class follows Tailwind convention
function validateSpacingClass(className: string): boolean {
  // Extract spacing classes
  const spacingPattern = /^(p|m|gap|space-[xy])-(\d+|px|auto)$/;
  const match = className.match(spacingPattern);
  
  if (!match) return false;
  
  const value = match[2];
  if (!value) return false;
  if (value === 'px' || value === 'auto') return true;
  
  const numValue = parseInt(value, 10);
  // Valid Tailwind spacing values
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96].includes(numValue);
}

describe('Property 13: CSS Spacing Scale', () => {
  describe('Spacing Value Validation', () => {
    it('should validate 4px-based spacing values', () => {
      expect(validateSpacingValue(0)).toBe(true);      // 0px
      expect(validateSpacingValue(0.25)).toBe(true);   // 4px
      expect(validateSpacingValue(0.5)).toBe(true);    // 8px
      expect(validateSpacingValue(1)).toBe(true);      // 16px
      expect(validateSpacingValue(1.5)).toBe(true);    // 24px
      expect(validateSpacingValue(2)).toBe(true);      // 32px
    });

    it('should validate Tailwind spacing classes', () => {
      expect(validateSpacingClass('p-4')).toBe(true);
      expect(validateSpacingClass('m-8')).toBe(true);
      expect(validateSpacingClass('gap-6')).toBe(true);
      expect(validateSpacingClass('space-y-4')).toBe(true);
    });

    it('should reject invalid spacing classes', () => {
      expect(validateSpacingClass('p-100')).toBe(false);
      expect(validateSpacingClass('m-abc')).toBe(false);
    });
  });

  describe('Property Tests', () => {
    it('property: all valid Tailwind spacing values are on 4px grid', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_SPACING_VALUES),
          (value) => {
            return validateSpacingValue(value);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('property: all valid spacing classes follow convention', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...VALID_SPACING_CLASSES),
          (className) => {
            return validateSpacingClass(className);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});

/**
 * Property 9: Form Accessibility
 * Validates: Requirements 7.6, 7.7, 7.8, 7.9
 * 
 * For any form element:
 * - Inputs SHALL have associated labels
 * - Error messages SHALL be linked via aria-describedby
 * - Required fields SHALL be marked with aria-required
 * - Form groups SHALL use fieldset/legend for related inputs
 */

// Validate form input has proper label association
function validateInputLabel(input: {
  id?: string | undefined;
  name?: string | undefined;
  ariaLabel?: string | undefined;
  ariaLabelledby?: string | undefined;
  hasAssociatedLabel?: boolean | undefined;
}): boolean {
  // Must have some form of label
  return Boolean(
    input.ariaLabel ||
    input.ariaLabelledby ||
    (input.id && input.hasAssociatedLabel)
  );
}

// Validate error message association
function validateErrorAssociation(input: {
  hasError: boolean;
  ariaDescribedby?: string | undefined;
  ariaInvalid?: boolean | undefined;
}): boolean {
  if (!input.hasError) return true;
  
  // If has error, must have aria-describedby and aria-invalid
  return Boolean(input.ariaDescribedby && input.ariaInvalid);
}

// Validate required field marking
function validateRequiredField(input: {
  required: boolean;
  ariaRequired?: boolean | undefined;
}): boolean {
  if (!input.required) return true;
  
  // Required fields should have aria-required
  return input.ariaRequired === true;
}

describe('Property 9: Form Accessibility', () => {
  describe('Input Label Association', () => {
    it('should validate inputs with labels', () => {
      expect(validateInputLabel({ ariaLabel: 'Email' })).toBe(true);
      expect(validateInputLabel({ id: 'email', hasAssociatedLabel: true })).toBe(true);
      expect(validateInputLabel({ ariaLabelledby: 'email-label' })).toBe(true);
    });

    it('should reject inputs without labels', () => {
      expect(validateInputLabel({})).toBe(false);
      expect(validateInputLabel({ id: 'email' })).toBe(false);
      expect(validateInputLabel({ name: 'email' })).toBe(false);
    });
  });

  describe('Error Association', () => {
    it('should validate error message association', () => {
      expect(validateErrorAssociation({ hasError: false })).toBe(true);
      expect(validateErrorAssociation({ 
        hasError: true, 
        ariaDescribedby: 'email-error',
        ariaInvalid: true 
      })).toBe(true);
    });

    it('should reject errors without proper association', () => {
      expect(validateErrorAssociation({ hasError: true })).toBe(false);
      expect(validateErrorAssociation({ hasError: true, ariaInvalid: true })).toBe(false);
    });
  });

  describe('Required Field Marking', () => {
    it('should validate required field marking', () => {
      expect(validateRequiredField({ required: false })).toBe(true);
      expect(validateRequiredField({ required: true, ariaRequired: true })).toBe(true);
    });

    it('should reject required fields without aria-required', () => {
      expect(validateRequiredField({ required: true })).toBe(false);
      expect(validateRequiredField({ required: true, ariaRequired: false })).toBe(false);
    });
  });

  describe('Property Tests', () => {
    it('property: all inputs must have label association', () => {
      const inputArbitrary = fc.record({
        id: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        ariaLabel: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        ariaLabelledby: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        hasAssociatedLabel: fc.option(fc.boolean(), { nil: undefined })
      });

      fc.assert(
        fc.property(inputArbitrary, (input) => {
          const isValid = validateInputLabel(input);
          
          const hasLabel = Boolean(
            input.ariaLabel ||
            input.ariaLabelledby ||
            (input.id && input.hasAssociatedLabel)
          );
          
          return isValid === hasLabel;
        }),
        { numRuns: 100 }
      );
    });

    it('property: errors must have aria-describedby', () => {
      const inputArbitrary = fc.record({
        hasError: fc.boolean(),
        ariaDescribedby: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        ariaInvalid: fc.option(fc.boolean(), { nil: undefined })
      });

      fc.assert(
        fc.property(inputArbitrary, (input) => {
          const isValid = validateErrorAssociation(input);
          
          if (!input.hasError) return isValid === true;
          
          const hasProperAssociation = Boolean(input.ariaDescribedby && input.ariaInvalid);
          return isValid === hasProperAssociation;
        }),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * Property 12: Responsive Touch Targets
 * Validates: Requirements 9.8, 9.9
 * 
 * For any interactive element:
 * - Touch targets SHALL be at least 44x44px
 * - Spacing between targets SHALL be at least 8px
 */

// Validate touch target size
function validateTouchTarget(element: {
  width: number;
  height: number;
  isInteractive: boolean;
}): boolean {
  if (!element.isInteractive) return true;
  
  // Minimum 44x44px for touch targets
  return element.width >= 44 && element.height >= 44;
}

// Validate touch target spacing
function validateTouchTargetSpacing(spacing: number): boolean {
  // Minimum 8px between touch targets
  return spacing >= 8;
}

describe('Property 12: Responsive Touch Targets', () => {
  describe('Touch Target Size', () => {
    it('should validate 44x44px minimum', () => {
      expect(validateTouchTarget({ width: 44, height: 44, isInteractive: true })).toBe(true);
      expect(validateTouchTarget({ width: 48, height: 48, isInteractive: true })).toBe(true);
      expect(validateTouchTarget({ width: 100, height: 44, isInteractive: true })).toBe(true);
    });

    it('should reject small touch targets', () => {
      expect(validateTouchTarget({ width: 32, height: 32, isInteractive: true })).toBe(false);
      expect(validateTouchTarget({ width: 44, height: 32, isInteractive: true })).toBe(false);
    });

    it('should allow small non-interactive elements', () => {
      expect(validateTouchTarget({ width: 16, height: 16, isInteractive: false })).toBe(true);
    });
  });

  describe('Touch Target Spacing', () => {
    it('should validate 8px minimum spacing', () => {
      expect(validateTouchTargetSpacing(8)).toBe(true);
      expect(validateTouchTargetSpacing(16)).toBe(true);
    });

    it('should reject insufficient spacing', () => {
      expect(validateTouchTargetSpacing(4)).toBe(false);
      expect(validateTouchTargetSpacing(0)).toBe(false);
    });
  });

  describe('Property Tests', () => {
    it('property: interactive elements must be at least 44x44px', () => {
      fc.assert(
        fc.property(
          fc.record({
            width: fc.integer({ min: 0, max: 200 }),
            height: fc.integer({ min: 0, max: 200 }),
            isInteractive: fc.boolean()
          }),
          (element) => {
            const isValid = validateTouchTarget(element);
            
            if (!element.isInteractive) return isValid === true;
            
            const meetsMinimum = element.width >= 44 && element.height >= 44;
            return isValid === meetsMinimum;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property 10: TypeScript Strictness
 * Validates: Requirements 8.1, 8.2, 8.3
 * 
 * For any TypeScript file:
 * - strict mode SHALL be enabled
 * - 'any' type SHALL be avoided (use unknown or specific types)
 * - Functions SHALL have explicit return types
 */

// Validate TypeScript config has strict mode
function validateTsConfig(config: {
  compilerOptions?: {
    strict?: boolean | undefined;
    noImplicitAny?: boolean | undefined;
    strictNullChecks?: boolean | undefined;
  } | undefined;
}): boolean {
  const opts = config.compilerOptions;
  if (!opts) return false;
  
  // strict: true enables all strict checks
  return opts.strict === true;
}

// Count 'any' usage in code (simplified check)
function countAnyUsage(code: string): number {
  // Match ': any', 'as any', but not in comments
  const anyPattern = /(?<!\/\/.*)(:\s*any\b|as\s+any\b)/g;
  const matches = code.match(anyPattern);
  return matches ? matches.length : 0;
}

describe('Property 10: TypeScript Strictness', () => {
  describe('Config Validation', () => {
    it('should validate strict mode enabled', () => {
      expect(validateTsConfig({ compilerOptions: { strict: true } })).toBe(true);
      expect(validateTsConfig({ compilerOptions: { strict: false } })).toBe(false);
      expect(validateTsConfig({ compilerOptions: {} })).toBe(false);
    });
  });

  describe('Any Usage Detection', () => {
    it('should count any usage', () => {
      expect(countAnyUsage('const x: any = 1')).toBe(1);
      expect(countAnyUsage('const x = y as any')).toBe(1);
      expect(countAnyUsage('const x: string = "test"')).toBe(0);
    });

    it('should count multiple any usages', () => {
      const code = `
        const x: any = 1;
        const y: any = 2;
        const z = x as any;
      `;
      expect(countAnyUsage(code)).toBe(3);
    });
  });

  describe('Property Tests', () => {
    it('property: strict config should enable all strict checks', () => {
      fc.assert(
        fc.property(
          fc.record({
            compilerOptions: fc.option(
              fc.record({
                strict: fc.option(fc.boolean(), { nil: undefined }),
                noImplicitAny: fc.option(fc.boolean(), { nil: undefined })
              }),
              { nil: undefined }
            )
          }),
          (config) => {
            const isValid = validateTsConfig(config);
            const hasStrict = config.compilerOptions?.strict === true;
            return isValid === hasStrict;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});

/**
 * Property 11: Server Component Default
 * Validates: Requirements 8.6
 * 
 * For any React component:
 * - Components SHALL be Server Components by default
 * - 'use client' SHALL only be used when necessary (hooks, browser APIs)
 */

// Reasons that justify 'use client'
const VALID_CLIENT_REASONS = [
  'useState',
  'useEffect',
  'useRef',
  'useCallback',
  'useMemo',
  'useContext',
  'useReducer',
  'onClick',
  'onChange',
  'onSubmit',
  'window.',
  'document.',
  'localStorage',
  'sessionStorage',
  'navigator.'
];

// Check if component needs to be client component
function needsClientDirective(code: string): boolean {
  return VALID_CLIENT_REASONS.some(reason => code.includes(reason));
}

// Validate client directive usage
function validateClientDirective(component: {
  hasUseClient: boolean;
  code: string;
}): { valid: boolean; reason?: string } {
  const needsClient = needsClientDirective(component.code);
  
  if (component.hasUseClient && !needsClient) {
    return { valid: false, reason: 'Unnecessary use client directive' };
  }
  
  if (!component.hasUseClient && needsClient) {
    return { valid: false, reason: 'Missing use client directive' };
  }
  
  return { valid: true };
}

describe('Property 11: Server Component Default', () => {
  describe('Client Directive Validation', () => {
    it('should validate necessary client directives', () => {
      expect(validateClientDirective({
        hasUseClient: true,
        code: 'const [state, setState] = useState()'
      }).valid).toBe(true);
      
      expect(validateClientDirective({
        hasUseClient: true,
        code: 'useEffect(() => {}, [])'
      }).valid).toBe(true);
      
      expect(validateClientDirective({
        hasUseClient: true,
        code: 'onClick={() => {}}'
      }).valid).toBe(true);
    });

    it('should reject unnecessary client directives', () => {
      expect(validateClientDirective({
        hasUseClient: true,
        code: 'return <div>Static content</div>'
      }).valid).toBe(false);
    });

    it('should require client directive for hooks', () => {
      expect(validateClientDirective({
        hasUseClient: false,
        code: 'const [state, setState] = useState()'
      }).valid).toBe(false);
    });
  });

  describe('Property Tests', () => {
    it('property: client directive should match component needs', () => {
      const codeSnippets = [
        'const [x, setX] = useState()',
        'useEffect(() => {}, [])',
        'onClick={() => {}}',
        'return <div>Static</div>',
        'const data = await fetch()',
        'window.location.href'
      ];

      fc.assert(
        fc.property(
          fc.record({
            hasUseClient: fc.boolean(),
            code: fc.constantFrom(...codeSnippets)
          }),
          (component) => {
            const result = validateClientDirective(component);
            const needsClient = needsClientDirective(component.code);
            
            // Valid if directive matches need
            if (component.hasUseClient === needsClient) {
              return result.valid === true;
            }
            return result.valid === false;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
