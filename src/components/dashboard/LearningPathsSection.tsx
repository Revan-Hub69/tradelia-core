'use client';

import React, { useState } from 'react';

import { LearningPathCard } from './LearningPathCard';
import { canAccessPath, PremiumBanner, shouldShowUpgradePrompt, UpgradePrompt } from './PremiumAccessControl';
import type { LearningPath } from './types';

type LearningPathsSectionProps = {
  paths: LearningPath[];
  userSubscription: 'free' | 'premium';
  onPathClick: (pathId: string) => void;
  onUpgradeClick: () => void;
  className?: string;
};

/**
 * LearningPathsSection - Display and manage learning paths
 *
 * Features:
 * - 4 main paths: Fondamenti, Investitore, Trader, Web3
 * - Premium access control
 * - Progress indicators
 * - Glassmorphism card styling
 */
export const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({
  paths,
  userSubscription,
  onPathClick,
  onUpgradeClick,
  className = '',
}) => {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<LearningPath | null>(null);

  const handlePathClick = (pathId: string) => {
    const path = paths.find(p => p.id === pathId);
    if (!path) {
      return;
    }

    // Check if user can access this path
    if (canAccessPath(path, userSubscription)) {
      onPathClick(pathId);
    } else if (shouldShowUpgradePrompt(path, userSubscription)) {
      setShowUpgradePrompt(path);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradePrompt(null);
    onUpgradeClick();
  };
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Percorsi di Apprendimento</h2>
        <div className="text-sm text-muted-foreground">
          {paths.filter(p => p.completionRate > 0).length}
          {' '}
          di
          {' '}
          {paths.length}
          {' '}
          iniziati
        </div>
      </div>

      {/* Premium Banner for free users */}
      <PremiumBanner
        userSubscription={userSubscription}
        onUpgradeClick={onUpgradeClick}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paths.map((path) => {
          const isAccessible = canAccessPath(path, userSubscription);
          const isLocked = !isAccessible;

          return (
            <LearningPathCard
              key={path.id}
              path={path}
              progress={path.completionRate}
              isLocked={isLocked}
              isPremium={path.isPremium}
              onPathClick={handlePathClick}
            />
          );
        })}
      </div>

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <UpgradePrompt
              path={showUpgradePrompt}
              onUpgradeClick={handleUpgradeClick}
              onClose={() => setShowUpgradePrompt(null)}
            />
          </div>
        </div>
      )}
    </section>
  );
};
