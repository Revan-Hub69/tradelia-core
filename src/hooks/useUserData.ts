import { useEffect, useState } from 'react';

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

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch complete user data from API
        const response = await fetch('/api/user/progress');
        const completeData = await response.json();
        
        const { profile, progress, completions, badges } = completeData;
        
        // Calculate progress
        const totalLessons = 12; // Foundation Programme has 12 lessons
        const completedLessons = completions?.length || 0;
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        setUserData({
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
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback to basic auth data if API fails
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserData({
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
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshUserData = async () => {
    setIsLoading(true);
    await fetchUserData();
  };

  return { userData, isLoading, refreshUserData };
};