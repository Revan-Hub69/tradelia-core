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

import type { DashboardState, UserProgress, LearningPath, UserSettings } from './types';

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
      tier: 'free',
      avatar: null,
    },
    progress: {
      totalXP: 2450,
      level: 3,
      currentStreak: 5,
      longestStreak: 12,
      completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
      lastActivity: new Date().toISOString(),
      totalStudyTime: 1800, // 30 hours in minutes
      weeklyGoal: 300, // 5 hours
    },
    learningPaths: [
      {
        id: 'crypto-basics',
        title: 'Fondamenti di Criptovalute',
        description: 'Impara le basi delle criptovalute e della blockchain',
        difficulty: 'beginner',
        estimatedTime: 120,
        progress: 65,
        isLocked: false,
        isPremium: false,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Cos\'è una Criptovaluta?',
            description: 'Introduzione alle criptovalute',
            type: 'theory',
            difficulty: 'beginner',
            estimatedTime: 15,
            progress: 100,
          },
          {
            id: 'lesson-2',
            title: 'Come Funziona la Blockchain',
            description: 'Tecnologia blockchain spiegata',
            type: 'interactive',
            difficulty: 'beginner',
            estimatedTime: 20,
            progress: 75,
          },
        ],
      },
      {
        id: 'advanced-trading',
        title: 'Trading Avanzato',
        description: 'Strategie di trading professionali',
        difficulty: 'advanced',
        estimatedTime: 300,
        progress: 0,
        isLocked: true,
        isPremium: true,
        lessons: [],
      },
    ],
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
      isMobile: false,
      isLoading: false,
      error: null,
    },
  });

  // Hooks integration
  const xpSystem = useXPSystem(dashboardState.progress.totalXP);
  const progressUpdates = useProgressUpdates(dashboardState.progress);
  const subscriptionState = useSubscriptionDegradation({
    tier: dashboardState.user.tier,
    status: 'active',
  });
  const networkHandling = useNetworkErrorHandling();
  const dynamicPaths = useDynamicPathLoading();

  // Progress sync
  const lessonSync = useLessonProgressSync(dashboardState.progress, {
    onProgressUpdate: (progress) => {
      setDashboardState(prev => ({
        ...prev,
        progress: { ...prev.progress, ...progress },
      }));
    },
    onXPGained: (xp, source) => {
      console.log(`XP gained: ${xp} from ${source}`);
    },
    onStreakUpdate: (streak) => {
      console.log(`Streak updated: ${streak}`);
    },
  });

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
    console.log(`Starting lesson: ${lessonId}`);
    // In real app, navigate to lesson
  };

  const handleUpgrade = () => {
    console.log('Upgrade to premium');
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
              progress={dashboardState.progress}
              onSettingsClick={handleSettingsOpen}
            />
            
            {dashboardState.user.tier === 'premium' ? (
              <PremiumDashboard
                userProgress={dashboardState.progress}
                learningPaths={dashboardState.learningPaths}
              />
            ) : (
              <PremiumBenefitsDisplay
                userTier={dashboardState.user.tier}
                onUpgrade={handleUpgrade}
              />
            )}
            
            <GamificationPanel
              userProgress={dashboardState.progress}
              onXPUpdate={(xp) => console.log('XP updated:', xp)}
            />
          </div>
        );

      case 'paths':
        return (
          <LearningPathsSection
            learningPaths={dashboardState.learningPaths}
            userTier={dashboardState.user.tier}
            onLessonStart={handleLessonStart}
            onUpgrade={handleUpgrade}
          />
        );

      case 'progress':
        return (
          <ProgressTracker
            userProgress={dashboardState.progress}
            learningPaths={dashboardState.learningPaths}
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