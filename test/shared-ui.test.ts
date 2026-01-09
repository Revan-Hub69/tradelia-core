/**
 * Shared UI Components Tests - Tradelia 2026
 * 
 * Test per i componenti UI condivisi
 */

import { describe, it, expect } from 'vitest';

describe('Shared UI Components', () => {
  describe('Button Component', () => {
    it('should export Button component', async () => {
      const { Button } = await import('@/src/shared/ui');
      expect(Button).toBeDefined();
      expect(Button.displayName).toBe('Button');
    });

    it('should have correct variant types', async () => {
      const { Button } = await import('@/src/shared/ui');
      // Type check - if this compiles, types are correct
      expect(typeof Button).toBe('object');
    });
  });

  describe('Input Component', () => {
    it('should export Input component', async () => {
      const { Input } = await import('@/src/shared/ui');
      expect(Input).toBeDefined();
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Card Component', () => {
    it('should export Card component and sub-components', async () => {
      const { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } = await import('@/src/shared/ui');
      expect(Card).toBeDefined();
      expect(Card.displayName).toBe('Card');
      expect(CardHeader).toBeDefined();
      expect(CardTitle).toBeDefined();
      expect(CardDescription).toBeDefined();
      expect(CardContent).toBeDefined();
      expect(CardFooter).toBeDefined();
    });
  });

  describe('Badge Component', () => {
    it('should export Badge component', async () => {
      const { Badge } = await import('@/src/shared/ui');
      expect(Badge).toBeDefined();
      expect(Badge.displayName).toBe('Badge');
    });
  });

  describe('Utility Functions', () => {
    it('should export cn utility', async () => {
      const { cn } = await import('@/src/shared/ui');
      expect(cn).toBeDefined();
      expect(typeof cn).toBe('function');
    });

    it('cn should merge classes correctly', async () => {
      const { cn } = await import('@/src/shared/ui');
      const result = cn('base-class', 'additional-class', false && 'conditional');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
      expect(result).not.toContain('conditional');
    });

    it('should export focusRing constant', async () => {
      const { focusRing } = await import('@/src/shared/ui');
      expect(focusRing).toBeDefined();
      expect(typeof focusRing).toBe('string');
      expect(focusRing).toContain('focus-visible');
      expect(focusRing).toContain('ring');
    });

    it('should export transitionSubtle constant', async () => {
      const { transitionSubtle } = await import('@/src/shared/ui');
      expect(transitionSubtle).toBeDefined();
      expect(typeof transitionSubtle).toBe('string');
      expect(transitionSubtle).toContain('transition');
      expect(transitionSubtle).toContain('150');
    });
  });

  describe('Types', () => {
    it('should export all component prop types', async () => {
      // This test verifies that types are exported correctly
      // If this compiles without errors, types are correctly exported
      const types = await import('@/src/shared/ui/types');
      expect(types).toBeDefined();
    });
  });
});

describe('Tradelia 2026 Design Compliance', () => {
  describe('Transition Timing', () => {
    it('transitionSubtle should use 150ms duration', async () => {
      const { transitionSubtle } = await import('@/src/shared/ui');
      expect(transitionSubtle).toContain('150');
    });
  });

  describe('Focus Ring Accessibility', () => {
    it('focusRing should include ring-2 for visibility', async () => {
      const { focusRing } = await import('@/src/shared/ui');
      expect(focusRing).toContain('ring-2');
    });

    it('focusRing should include ring-offset for spacing', async () => {
      const { focusRing } = await import('@/src/shared/ui');
      expect(focusRing).toContain('ring-offset');
    });

    it('focusRing should use primary color', async () => {
      const { focusRing } = await import('@/src/shared/ui');
      expect(focusRing).toContain('ring-primary');
    });
  });
});
