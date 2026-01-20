'use client';

import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { createClient } from '@/libs/supabase/client';

type UserProgress = {
  currentPath: string;
  pathName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  totalXP: number;
  level: number;
  currentStreak: number;
  badges: number;
};

type UserData = {
  id: string;
  email: string;
  name?: string;
  progress: UserProgress;
};

type UserDataContextType = {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  refreshUserData: () => void; // Alias for backward compatibility
};

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const fetchUserData = async (): Promise<UserData | null> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    // Fetch complete user data from API
    const response = await fetch('/api/user/progress');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }
    
    const completeData = await response.json();
    const { profile, progress, completions, badges } = completeData;
    
    // Calculate progress
    const totalLessons = 12; // Foundation Programme has 12 lessons
    const completedLessons = completions?.length || 0;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
    
    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Utente',
      progress: {
        currentPath: 'base',
        pathName: 'Percorso Fondamentale',
        completedLessons,
        totalLessons,
        progressPercentage,
        totalXP: progress?.total_xp || 0,
        level: progress?.level || 1,
        currentStreak: progress?.current_streak || 0,
        badges: badges?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    // Fallback to basic auth data if API fails
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utente',
      progress: {
        currentPath: 'base',
        pathName: 'Percorso Fondamentale',
        completedLessons: 0,
        totalLessons: 12,
        progressPercentage: 0,
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        badges: 0,
      },
    };
  }
};

const UserDataProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const contextValue: UserDataContextType = {
    userData: userData || null,
    isLoading,
    error: error as Error | null,
    refetch,
    refreshUserData: refetch, // Alias for backward compatibility
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserDataProviderInner>
        {children}
      </UserDataProviderInner>
    </QueryClientProvider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};