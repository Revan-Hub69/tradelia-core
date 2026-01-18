'use client';

import React, { useEffect, useState } from 'react';

import {
  DashboardHeader,
  DashboardLayout,
  GamificationPanel,
  LearningPathsSection,
  MobileNavigation,
  ProgressTracker,
  SettingsPanel,
} from '@/components/dashboard';
import type { DashboardState, GamificationData, LearningPath, ProgressData, UserSettings } from '@/components/dashboard/types';
import { TitleBar } from '@/features/dashboard/TitleBar';

const DashboardIndexPage = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'paths' | 'progress' | 'settings'>('overview');

  // Mock data - will be replaced with real data fetching
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'Utente Demo',
      subscription: 'free',
    },
    learningPaths: [
      {
        id: 'fondamenti',
        title: 'Fondamenti Crypto',
        description: 'Impara le basi delle criptovalute e della blockchain',
        difficulty: 'beginner',
        isPremium: false,
        prerequisites: [],
        modules: [],
        estimatedDuration: 180,
        completionRate: 25,
        isLocked: false,
      },
      {
        id: 'investitore',
        title: 'Investitore Crypto',
        description: 'Strategie di investimento e gestione del portafoglio',
        difficulty: 'intermediate',
        isPremium: true,
        prerequisites: ['fondamenti'],
        modules: [],
        estimatedDuration: 240,
        completionRate: 0,
        isLocked: true,
      },
      {
        id: 'trader',
        title: 'Trader Avanzato',
        description: 'Trading avanzato e analisi tecnica',
        difficulty: 'advanced',
        isPremium: true,
        prerequisites: ['fondamenti', 'investitore'],
        modules: [],
        estimatedDuration: 300,
        completionRate: 0,
        isLocked: true,
      },
      {
        id: 'web3',
        title: 'Web3 Developer',
        description: 'Sviluppo di applicazioni decentralizzate',
        difficulty: 'advanced',
        isPremium: true,
        prerequisites: ['fondamenti'],
        modules: [],
        estimatedDuration: 360,
        completionRate: 0,
        isLocked: true,
      },
    ] as LearningPath[],
    progress: {
      overallProgress: 12.5,
      pathProgress: {
        fondamenti: {
          pathId: 'fondamenti',
          completionRate: 25,
          currentModule: 1,
          timeSpent: 45,
          lastAccessed: new Date(),
        },
      },
      currentStreak: 3,
      longestStreak: 7,
      totalXP: 150,
      level: 2,
      nextRecommendedLesson: 'crypto-basics-2',
    } as ProgressData,
    gamification: {
      badges: [
        {
          id: 'first-lesson',
          name: 'Primo Passo',
          description: 'Hai completato la tua prima lezione!',
          icon: '🎯',
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
          progress: 3,
          maxProgress: 7,
          isUnlocked: false,
        },
      ],
      streakHistory: [],
      xpHistory: [],
    } as GamificationData,
    settings: {
      notifications: {
        email: true,
        push: true,
        dailyReminder: true,
        streakReminder: true,
      },
      preferences: {
        language: 'it',
        theme: 'system',
        difficulty: 'adaptive',
        autoPlay: true,
      },
      privacy: {
        profileVisible: true,
        progressVisible: true,
        leaderboardVisible: true,
      },
    } as UserSettings,
    ui: {
      isLoading: false,
      activeSection: 'overview',
      isMobile: false,
    },
  });

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDashboardState(prev => ({
        ...prev,
        ui: { ...prev.ui, isMobile: mobile },
      }));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePathClick = (pathId: string) => {
    // eslint-disable-next-line no-console
    console.log('Navigate to path:', pathId);
    // Will implement navigation to lesson system
  };

  const handleUpgradeClick = () => {
    // eslint-disable-next-line no-console
    console.log('Navigate to upgrade page');
    // Will implement navigation to subscription upgrade
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setDashboardState(prev => ({
      ...prev,
      settings: newSettings,
    }));
    // Auto-save settings - will implement API call
  };

  const handleSectionChange = (section: 'overview' | 'paths' | 'progress' | 'settings') => {
    setActiveSection(section);
    if (section === 'settings') {
      setSettingsOpen(true);
    }
  };

  return (
    <DashboardLayout dashboardState={dashboardState}>
      {/* Enhanced Dashboard Header */}
      <DashboardHeader
        user={dashboardState.user}
        currentStreak={dashboardState.progress.currentStreak}
        totalXP={dashboardState.progress.totalXP}
        onSettingsClick={() => setSettingsOpen(true)}
        showGamification
      />

      {/* Main Dashboard Content */}
      <div className="space-y-8">
        {/* Welcome Section */}
        <TitleBar
          title={`Benvenuto, ${dashboardState.user.name || 'Utente'}!`}
          description="Continua il tuo percorso di apprendimento crypto"
        />

        {/* Desktop Layout */}
        {!isMobile && (
          <>
            <LearningPathsSection
              paths={dashboardState.learningPaths}
              userSubscription={dashboardState.user.subscription}
              onPathClick={handlePathClick}
              onUpgradeClick={handleUpgradeClick}
            />

            <div className="grid gap-8 lg:grid-cols-2">
              <ProgressTracker
                userId={dashboardState.user.id}
                onLessonClick={(lessonId) => console.log('Navigate to lesson:', lessonId)}
              />

              <GamificationPanel
                initialXP={dashboardState.progress.totalXP}
                onXPChange={(xp, level) => console.log('XP changed:', xp, level)}
              />
                showLeaderboard={false}
              />
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <ProgressTracker
                  pathProgress={Object.values(dashboardState.progress.pathProgress)}
                  overallProgress={dashboardState.progress.overallProgress}
                  nextRecommendedLesson={{
                    id: 'crypto-basics-2',
                    title: 'Blockchain e Decentralizzazione',
                    type: 'interactive',
                    duration: 15,
                    xpReward: 50,
                    isCompleted: false,
                    isUnlocked: true,
                  }}
                />
              </div>
            )}

            {activeSection === 'paths' && (
              <LearningPathsSection
                paths={dashboardState.learningPaths}
                userSubscription={dashboardState.user.subscription}
                onPathClick={handlePathClick}
                onUpgradeClick={handleUpgradeClick}
              />
            )}

            {activeSection === 'progress' && (
              <GamificationPanel
                streak={dashboardState.progress.currentStreak}
                xp={dashboardState.progress.totalXP}
                level={dashboardState.progress.level}
                badges={dashboardState.gamification.badges}
                achievements={dashboardState.gamification.achievements}
                showLeaderboard={false}
              />
            )}

            <MobileNavigation
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={dashboardState.settings}
        onSettingsChange={handleSettingsChange}
      />
    </DashboardLayout>
  );
};

export default DashboardIndexPage;
