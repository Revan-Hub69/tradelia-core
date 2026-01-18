import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

import type { LearningPath } from './types';
import { 
  isPremiumRequired, 
  canAccessPath, 
  shouldShowUpgradePrompt,
  UpgradePrompt 
} from './PremiumAccessControl';

// Generators for property-based testing
const learningPathGenerator = (): fc.Arbitrary<LearningPath> => {
  return fc.record({
    id: fc.string({ minLength: 1 }),
    title: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
    isPremium: fc.boolean(),
    prerequisites: fc.array(fc.string()),
    modules: fc.array(fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      lessons: fc.array(fc.record({
        id: fc.string({ minLength: 1 }),
        title: fc.string({ minLength: 1 }),
        type: fc.constantFrom('interactive', 'video', 'quiz', 'practice'),
        duration: fc.integer({ min: 1, max: 120 }),
        xpReward: fc.integer({ min: 0, max: 100 }),
        isCompleted: fc.boolean(),
        isUnlocked: fc.boolean()
      })),
      isLocked: fc.boolean(),
      completionRate: fc.integer({ min: 0, max: 100 }),
      estimatedTime: fc.integer({ min: 1, max: 300 })
    })),
    estimatedDuration: fc.integer({ min: 1, max: 1000 }),
    completionRate: fc.integer({ min: 0, max: 100 }),
    isLocked: fc.boolean()
  });
};

const fondamentiPathGenerator = (): fc.Arbitrary<LearningPath> => {
  return fc.record({
    id: fc.constant('fondamenti'),
    title: fc.oneof(
      fc.constant('Fondamenti'),
      fc.constant('Fondamenti Crypto'),
      fc.constant('Crypto Fondamenti'),
      fc.string().filter(s => s.toLowerCase().includes('fondamenti'))
    ),
    description: fc.string({ minLength: 1 }),
    difficulty: fc.constantFrom('beginner', 'intermediate', 'advanced'),
    isPremium: fc.boolean(), // Can be true or false, but should still be accessible
    prerequisites: fc.array(fc.string()),
    modules: fc.array(fc.record({
      id: fc.string({ minLength: 1 }),
      title: fc.string({ minLength: 1 }),
      lessons: fc.array(fc.record({
        id: fc.string({ minLength: 1 }),
        title: fc.string({ minLength: 1 }),
        type: fc.constantFrom('interactive', 'video', 'quiz', 'practice'),
        duration: fc.integer({ min: 1, max: 120 }),
        xpReward: fc.integer({ min: 0, max: 100 }),
        isCompleted: fc.boolean(),
        isUnlocked: fc.boolean()
      })),
      isLocked: fc.boolean(),
      completionRate: fc.integer({ min: 0, max: 100 }),
      estimatedTime: fc.integer({ min: 1, max: 300 })
    })),
    estimatedDuration: fc.integer({ min: 1, max: 1000 }),
    completionRate: fc.integer({ min: 0, max: 100 }),
    isLocked: fc.boolean()
  });
};

const subscriptionGenerator = (): fc.Arbitrary<'free' | 'premium'> => {
  return fc.constantFrom('free', 'premium');
};

describe('PremiumAccessControl Property Tests', () => {
  describe('Property 3: Free Access Guarantee', () => {
    it('should always allow access to Fondamenti path regardless of subscription status', () => {
      // Feature: dashboard-modular-learning-system, Property 3: Free Access Guarantee
      fc.assert(fc.property(
        fondamentiPathGenerator(),
        subscriptionGenerator(),
        (fondamentiPath, userSubscription) => {
          // Property: Fondamenti path should always be accessible
          const hasAccess = canAccessPath(fondamentiPath, userSubscription);
          const requiresPremium = isPremiumRequired(fondamentiPath);
          const shouldShowUpgrade = shouldShowUpgradePrompt(fondamentiPath, userSubscription);
          
          // Assertions for free access guarantee
          expect(hasAccess).toBe(true);
          expect(requiresPremium).toBe(false);
          expect(shouldShowUpgrade).toBe(false);
        }
      ), { numRuns: 20 });
    });

    it('should identify Fondamenti paths correctly by ID and title', () => {
      // Feature: dashboard-modular-learning-system, Property 3: Free Access Guarantee
      fc.assert(fc.property(
        fondamentiPathGenerator(),
        (fondamentiPath) => {
          // Property: Fondamenti identification should work for both ID and title patterns
          const requiresPremium = isPremiumRequired(fondamentiPath);
          
          expect(requiresPremium).toBe(false);
        }
      ), { numRuns: 20 });
    });
  });

  describe('Property 4: Premium Access Control', () => {
    it('should show upgrade prompts for free users accessing premium paths', () => {
      // Feature: dashboard-modular-learning-system, Property 4: Premium Access Control
      fc.assert(fc.property(
        learningPathGenerator().filter(path => 
          path.isPremium && 
          path.id !== 'fondamenti' && 
          !path.title.toLowerCase().includes('fondamenti')
        ),
        (premiumPath) => {
          // Property: Free users should see upgrade prompts for premium paths
          const freeUserAccess = canAccessPath(premiumPath, 'free');
          const premiumUserAccess = canAccessPath(premiumPath, 'premium');
          const freeUserUpgradePrompt = shouldShowUpgradePrompt(premiumPath, 'free');
          const premiumUserUpgradePrompt = shouldShowUpgradePrompt(premiumPath, 'premium');
          
          // Free users should not have access and should see upgrade prompt
          expect(freeUserAccess).toBe(false);
          expect(freeUserUpgradePrompt).toBe(true);
          
          // Premium users should have access and not see upgrade prompt
          expect(premiumUserAccess).toBe(true);
          expect(premiumUserUpgradePrompt).toBe(false);
        }
      ), { numRuns: 20 });
    });

    it('should allow access to non-premium paths for all users', () => {
      // Feature: dashboard-modular-learning-system, Property 4: Premium Access Control
      fc.assert(fc.property(
        learningPathGenerator().filter(path => !path.isPremium),
        subscriptionGenerator(),
        (nonPremiumPath, userSubscription) => {
          // Property: Non-premium paths should be accessible to all users
          const hasAccess = canAccessPath(nonPremiumPath, userSubscription);
          const requiresPremium = isPremiumRequired(nonPremiumPath);
          const shouldShowUpgrade = shouldShowUpgradePrompt(nonPremiumPath, userSubscription);
          
          expect(hasAccess).toBe(true);
          expect(requiresPremium).toBe(false);
          expect(shouldShowUpgrade).toBe(false);
        }
      ), { numRuns: 20 });
    });

    it('should grant premium users access to all paths', () => {
      // Feature: dashboard-modular-learning-system, Property 4: Premium Access Control
      fc.assert(fc.property(
        learningPathGenerator(),
        (path) => {
          // Property: Premium users should have access to all paths
          const hasAccess = canAccessPath(path, 'premium');
          const shouldShowUpgrade = shouldShowUpgradePrompt(path, 'premium');
          
          expect(hasAccess).toBe(true);
          expect(shouldShowUpgrade).toBe(false);
        }
      ), { numRuns: 20 });
    });
  });

  describe('UpgradePrompt Component Integration', () => {
    it('should render upgrade prompt with path information', () => {
      const mockPath: LearningPath = {
        id: 'advanced-trading',
        title: 'Advanced Trading Strategies',
        description: 'Learn advanced crypto trading techniques',
        difficulty: 'advanced',
        isPremium: true,
        prerequisites: ['basic-trading'],
        modules: [],
        estimatedDuration: 120,
        completionRate: 0,
        isLocked: false
      };

      const mockOnUpgrade = () => {};
      
      render(
        <UpgradePrompt 
          path={mockPath} 
          onUpgradeClick={mockOnUpgrade}
        />
      );

      // Verify upgrade prompt displays path information
      expect(screen.getByText('Accesso Premium Richiesto')).toBeInTheDocument();
      expect(screen.getByText(mockPath.title)).toBeInTheDocument();
      expect(screen.getByText('Aggiorna a Premium')).toBeInTheDocument();
    });
  });
});