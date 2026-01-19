import { useEffect, useState } from 'react';

import { createClient } from '@/libs/supabase/client';

type UserProgress = {
  currentPath: string;
  pathName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Usa i dati REALI dell'utente autenticato
          setUserData({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utente',
            progress: {
              currentPath: 'fondamenti',
              pathName: 'Fondamenti Crypto',
              completedLessons: 0, // Per ora fisso, poi collegheremo alle lezioni vere
              totalLessons: 12,
              progressPercentage: 0,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, isLoading };
};