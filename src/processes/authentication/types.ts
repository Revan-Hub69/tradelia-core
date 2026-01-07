/**
 * Authentication Process Types - Tradelia 2026
 */

import type { User } from '../../entities/user/types';

export interface AuthenticationFlow {
  currentStep: AuthStep;
  user?: User;
  error?: string;
  isLoading: boolean;
}

export type AuthStep = 
  | 'idle'
  | 'login'
  | 'register' 
  | 'verify-email'
  | 'reset-password'
  | 'authenticated';

export interface AuthenticationConfig {
  enableOAuth: boolean;
  enableEmailVerification: boolean;
  enablePasswordReset: boolean;
  sessionTimeout: number;
}