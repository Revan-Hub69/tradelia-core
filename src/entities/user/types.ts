/**
 * User Entity Types - Tradelia 2026
 */

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName?: string;
  avatarUrl?: string;
  locale: 'it' | 'en';
  theme: 'light' | 'dark' | 'auto';
  storagePreference: 'register' | 'guest';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  sidebarState: 'expanded' | 'compact' | 'hidden';
  dashboardLayout: 'grid' | 'list';
  dataRefreshInterval: number; // in seconds
  enableNotifications: boolean;
  enableAnalytics: boolean;
}

export interface UserSession {
  user: User;
  profile: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}