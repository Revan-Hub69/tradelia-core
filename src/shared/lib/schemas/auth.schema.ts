/**
 * Authentication Validation Schemas
 * 
 * Server-side validation schemas for authentication flows.
 * Requirements: 1.3, 1.4 - Zod validation before any auth operations
 * 
 * @module schemas/auth
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email too long')

/**
 * Password validation schema (basic)
 * - Minimum 8 characters
 * - Maximum 100 characters
 */
export const passwordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password cannot exceed 100 characters')

/**
 * Strong password validation schema
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const strongPasswordSchema = z.string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password cannot exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

/**
 * Login request schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Registration request schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nickname: z.string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(20, 'Nickname cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore allowed'),
  country: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Invalid country code format'),
})

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

/**
 * OAuth callback schema
 */
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
})

/**
 * Token refresh schema
 */
export const tokenRefreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
})

/**
 * Session validation schema
 */
export const sessionSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_at: z.number().int().positive(),
  expires_in: z.number().int().positive(),
  token_type: z.literal('bearer'),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    role: z.string().optional(),
  }),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetConfirm = z.infer<typeof passwordResetConfirmSchema>
export type OAuthCallback = z.infer<typeof oauthCallbackSchema>
export type TokenRefresh = z.infer<typeof tokenRefreshSchema>
export type Session = z.infer<typeof sessionSchema>
