// Simple test to verify dashboard components work
import React from 'react';

import { DashboardLayout, DashboardHeader } from './index';
import type { DashboardState } from './types';

const testState: DashboardState = {
  user: {
    id: '1',
    email: 'test@example.com',
    subscription: 'free',
  },
  learningPaths: [],
  progress: {
    overallProgress: 0,
    pathProgress: {},
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    level: 1,
  },
  gamification: {
    badges: [],
    achievements: [],
    streakHistory: [],
    xpHistory: [],
  },
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
  },
  ui: {
    isLoading: false,
    activeSection: 'overview',
    isMobile: false,
  },
};

export const TestDashboard = () => {
  return (
    <DashboardLayout dashboardState={testState}>
      <DashboardHeader
        user={testState.user}
        currentStreak={0}
        totalXP={0}
        onSettingsClick={() => {}}
      />
      <div>Dashboard components loaded successfully!</div>
    </DashboardLayout>
  );
};