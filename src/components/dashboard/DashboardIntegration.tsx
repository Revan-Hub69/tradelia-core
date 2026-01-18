'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardHeader } from './DashboardHeader';
import { LearningPathsSection } from './LearningPathsSection';
import { ProgressTracker } from './ProgressTracker';
import { GamificationPanel } from './GamificationPanel';
import { SettingsPanel } from './SettingsPanel';
import { PremiumDashboard } from './PremiumDashboard';
import { PremiumBenefitsDisplay } from './PremiumBenefitsDisplay';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';

import { useXPSystem } from '@/hooks/useXPSystem';
import { useProgressUpdates } from '@/hooks/useProgressUpdates';
import { useLessonProgressSync } from '@/hooks/useLessonProgressSync';
import { useSubscriptionDegradation } from '@/hooks/useSubscriptionDegradation';
import { useNetworkErrorHandling } from '@/hooks/useNetworkErrorHandling';
import { useDynamicPathLoading } from '@/hooks/useDynamicPathLoading';

import type { DashboardState, UserSettings } from './types';

/**
 * DashboardIntegration - Complete dashboard integration component
 * 
 * Features:
 * - Full dashboard flow integration
 * - Error boundary protection
 * - Performance optimization
 * - Design system consistency
 * - Mobile and desktop support
 */
export const DashboardIntegration: React.FC = () => {
  // State management
  const [activeSection, setActiveSection] = useState<'overview' | 'paths' | 'progress' | 'settings'>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    user: {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@tradelia.com',
      subscription: 'free',
      avatar: undefined,
    },
    progress: {
      overallProgress: 65,
      pathProgress: {
        'crypto-basics': {
          pathId: 'crypto-basics',
          completionRate: 65,
          currentModule: 1,
          timeSpent: 1800,
          lastAccessed: new Date(),
        },
      },
      currentStreak: 5,
      longestStreak: 12,
      totalXP: 2450,
      level: 3,
      nextRecommendedLesson: 'lesson-2',
    },
    learningPaths: [
      {
        id: 'crypto-basics',
        title: 'Fondamenti di Criptovalute',
        description: 'Impara le basi delle criptovalute e della blockchain',
        difficulty: 'beginner',
        isPremium: false,
        prerequisites: [],
        modules: [
          {
            id: 'module-1',
            title: 'Introduzione',
            lessons: [
              {
                id: 'lesson-1',
                title: 'Cos\'è una Criptovaluta?',
                type: 'interactive',
                duration: 15,
                xpReward: 50,
                isCompleted: true,
                isUnlocked: true,
              },
            ],
            isLocked: false,
            completionRate: 100,
            estimatedTime: 15,
          },
        ],
        estimatedDuration: 120,
        completionRate: 65,
        isLocked: false,
      },
    ],
    gamification: {
      badges: [
        {
          id: 'first-lesson',
          name: 'Prima Lezione',
          description: 'Completa la tua prima lezione',
          icon: '🎓',
          unlockedAt: new Date(),
          rarity: 'common',
        },
      ],
      achievements: [
        {
          id: 'streak-7',
          title: 'Streak di 7 giorni',
          description: 'Studia per 7 giorni consecutivi',
          icon: '🔥',
          progress: 5,
          maxProgress: 7,
          isUnlocked: false,
        },
      ],
      streakHistory: [],
      xpHistory: [],
    },
    settings: {
      preferences: {
        language: 'it',
        theme: 'system',
        difficulty: 'adaptive',
        autoPlay: true,
      },
      notifications: {
        email: true,
        push: false,
        dailyReminder: true,
        streakReminder: true,
      },
      privacy: {
        profileVisible: false,
        progressVisible: true,
        leaderboardVisible: true,
      },
    },
    ui: {
      isLoading: false,
      error: undefined,
      activeSection: 'overview',
      isMobile: false,
    },
  });

  // Hooks integration
  const subscriptionState = useSubscriptionDegradation({
    tier: dashboardState.user.subscription,
    status: 'active',
  });
  const networkHandling = useNetworkErrorHandling();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setDashboardState(prev => ({
        ...prev,
        ui: {
          ...prev.ui,
          isMobile: window.innerWidth < 768,
        },
      }));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handlers
  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
  };

  const handleSettingsChange = (settings: UserSettings) => {
    setDashboardState(prev => ({
      ...prev,
      settings,
    }));
  };

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleLessonStart = (lessonId: string) => {
    // In real app, navigate to lesson
  };

  const handleUpgrade = () => {
    // In real app, open upgrade flow
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <DashboardHeader
              user={dashboardState.user}
              currentStreak={dashboardState.progress.currentStreak}
              totalXP={dashboardState.progress.totalXP}
              onSettingsClick={handleSettingsOpen}
            />
            
            {dashboardState.user.subscription === 'premium' ? (
              <PremiumDashboard
                userProgress={dashboardState.progress}
                learningPaths={dashboardState.learningPaths}
              />
            ) : (
              <PremiumBenefitsDisplay
                userTier={dashboardState.user.subscription}
                onUpgrade={handleUpgrade}
              />
            )}
            
            <GamificationPanel
              streak={dashboardState.progress.currentStreak}
              initialXP={dashboardState.progress.totalXP}
              badges={dashboardState.gamification.badges}
              achievements={dashboardState.gamification.achievements}
              onXPChange={() => {}}
            />
          </div>
        );

      case 'paths':
        return (
          <LearningPathsSection
            paths={dashboardState.learningPaths}
            userSubscription={dashboardState.user.subscription}
            onPathClick={handleLessonStart}
            onUpgradeClick={handleUpgrade}
          />
        );

      case 'progress':
        return (
          <ProgressTracker
            userId={dashboardState.user.id}
            onLessonClick={handleLessonStart}
          />
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Impostazioni</h2>
            <p className="text-muted-foreground">
              Gestisci le tue preferenze e impostazioni account.
            </p>
            <button
              onClick={handleSettingsOpen}
              className="rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-sm hover:bg-white/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Apri Pannello Impostazioni
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardErrorBoundary>
      <DashboardLayout
        dashboardState={dashboardState}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {/* Network status indicator */}
        {networkHandling.hasNetworkError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {networkHandling.getNetworkStatusMessage()}
            </p>
          </div>
        )}

        {/* Subscription warnings */}
        {subscriptionState.degradationWarnings.map((warning, index) => (
          <div
            key={index}
            className={`mb-4 rounded-lg border p-3 ${
              warning.type === 'error'
                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                : warning.type === 'warning'
                ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
                : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{warning.title}</p>
                <p className="text-sm opacity-80">{warning.message}</p>
              </div>
              {warning.action && (
                <button
                  onClick={handleUpgrade}
                  className="rounded bg-white/50 px-3 py-1 text-sm font-medium hover:bg-white/70 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {warning.action}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Main content */}
        {renderSectionContent()}

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={handleSettingsClose}
          settings={dashboardState.settings}
          onSettingsChange={handleSettingsChange}
          onSaveSettings={async (settings) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Settings saved:', settings);
          }}
        />
      </DashboardLayout>
    </DashboardErrorBoundary>
  );
};