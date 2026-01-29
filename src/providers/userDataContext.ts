'use client';

import { createContext } from 'react';

export type UserData = {
  id: string;
  email: string;
  name?: string;
};

export type UserDataContextType = {
  userData: UserData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  refreshUserData: () => void;
};

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);
