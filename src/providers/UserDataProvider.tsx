'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { createClient } from '@/libs/supabase/client';

import { type UserData, UserDataContext, type UserDataContextType } from './userDataContext';

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
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utente',
  };
};

const UserDataProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { data: userData, isLoading, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
    staleTime: 0, // Always fetch fresh data (no caching issues when switching users)
    gcTime: 0, // Don't cache old user data
  });

  const contextValue = useMemo<UserDataContextType>(() => ({
    userData: userData || null,
    isLoading,
    error: error as Error | null,
    refetch,
    refreshUserData: refetch, // Alias for backward compatibility
  }), [userData, isLoading, error, refetch]);

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
