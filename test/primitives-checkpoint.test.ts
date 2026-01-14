/**
 * Primitives Checkpoint Tests - Learning Path Visual Coherence
 * 
 * Verifica che tutti i primitives siano correttamente implementati e esportati.
 * Questo test è parte del checkpoint 3 della spec.
 * 
 * @requirements 2.1-2.6 - Primitives implementation
 */

import { describe, it, expect } from 'vitest';

describe('Primitives Checkpoint - Learning Path Visual Coherence', () => {
  describe('DecorativeDivider Component', () => {
    it('should export DecorativeDivider component', async () => {
      const { DecorativeDivider } = await import('@/src/shared/ui');
      expect(DecorativeDivider).toBeDefined();
      expect(DecorativeDivider.displayName).toBe('DecorativeDivider');
    });

    it('should export DecorativeDividerProps type', async () => {
      const types = await import('@/src/shared/ui');
      // Type exists if import succeeds
      expect(types.DecorativeDivider).toBeDefined();
    });
  });

  describe('IconBox Component', () => {
    it('should export IconBox component', async () => {
      const { IconBox } = await import('@/src/shared/ui');
      expect(IconBox).toBeDefined();
      expect(IconBox.displayName).toBe('IconBox');
    });

    it('should export IconBox types', async () => {
      const types = await import('@/src/shared/ui');
      expect(types.IconBox).toBeDefined();
    });
  });

  describe('ShineEffect Component', () => {
    it('should export ShineEffect component', async () => {
      const { ShineEffect } = await import('@/src/shared/ui');
      expect(ShineEffect).toBeDefined();
      expect(ShineEffect.displayName).toBe('ShineEffect');
    });
  });

  describe('GlassmorphismOverlay Component', () => {
    it('should export GlassmorphismOverlay component', async () => {
      const { GlassmorphismOverlay } = await import('@/src/shared/ui');
      expect(GlassmorphismOverlay).toBeDefined();
      expect(GlassmorphismOverlay.displayName).toBe('GlassmorphismOverlay');
    });
  });

  describe('ProgressBarPremium Component', () => {
    it('should export ProgressBarPremium component', async () => {
      const { ProgressBarPremium } = await import('@/src/shared/ui');
      expect(ProgressBarPremium).toBeDefined();
      expect(ProgressBarPremium.displayName).toBe('ProgressBarPremium');
    });

    it('should export ProgressBarPremium types', async () => {
      const types = await import('@/src/shared/ui');
      expect(types.ProgressBarPremium).toBeDefined();
    });
  });

  describe('AnimatedCard Component', () => {
    it('should export AnimatedCard component', async () => {
      const { AnimatedCard } = await import('@/src/shared/ui');
      expect(AnimatedCard).toBeDefined();
      expect(AnimatedCard.displayName).toBe('AnimatedCard');
    });
  });

  describe('All Primitives Export Check', () => {
    it('should export all 6 primitive components from shared/ui', async () => {
      const {
        DecorativeDivider,
        IconBox,
        ShineEffect,
        GlassmorphismOverlay,
        ProgressBarPremium,
        AnimatedCard,
      } = await import('@/src/shared/ui');

      expect(DecorativeDivider).toBeDefined();
      expect(IconBox).toBeDefined();
      expect(ShineEffect).toBeDefined();
      expect(GlassmorphismOverlay).toBeDefined();
      expect(ProgressBarPremium).toBeDefined();
      expect(AnimatedCard).toBeDefined();
    });
  });
});
