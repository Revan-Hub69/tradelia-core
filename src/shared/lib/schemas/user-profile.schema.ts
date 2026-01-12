/**
 * User Profile Validation Schemas
 * 
 * Server-side validation schemas for user profile data.
 * Requirements: 1.3, 1.4 - Zod validation before any database operations
 * 
 * @module schemas/user-profile
 */

import { z } from 'zod'

/**
 * Nickname validation schema
 * - 3-20 characters
 * - Alphanumeric + underscore only
 */
export const nicknameSchema = z.string()
  .min(3, 'Nickname must be at least 3 characters')
  .max(20, 'Nickname cannot exceed 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore allowed')

/**
 * Country code validation schema
 * - ISO 3166-1 alpha-2 format (2 uppercase letters)
 */
export const countryCodeSchema = z.string()
  .length(2, 'Country code must be 2 characters')
  .regex(/^[A-Z]{2}$/, 'Invalid country code format')

/**
 * Email validation schema
 */
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long')

/**
 * User profile creation schema
 * Used when creating a new user profile
 */
export const createUserProfileSchema = z.object({
  nickname: nicknameSchema,
  country: countryCodeSchema,
  email: emailSchema,
})

/**
 * User profile update schema
 * All fields optional for partial updates
 */
export const updateUserProfileSchema = z.object({
  nickname: nicknameSchema.optional(),
  country: countryCodeSchema.optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
  display_name: z.string().max(100, 'Display name too long').optional().nullable(),
})

/**
 * Complete user profile schema (for database responses)
 */
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  nickname: nicknameSchema.nullable(),
  country: countryCodeSchema.nullable(),
  avatar_url: z.string().url().nullable().optional(),
  display_name: z.string().max(100).nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

// Type exports
export type CreateUserProfile = z.infer<typeof createUserProfileSchema>
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
