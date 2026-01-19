import { z } from 'zod';
import { ApiError } from './errorHandler';

// Lesson completion validation schema
export const lessonCompletionSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  pathId: z.string().default('base'),
  xpEarned: z.number().min(0).max(1000, 'XP must be between 0 and 1000'),
  approachesUsed: z.array(z.string()).optional(),
  quizScore: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0).optional(),
  badges: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
  })).optional(),
});

// User profile validation schema
export const userProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
});

// Progress validation schema
export const userProgressSchema = z.object({
  initialXP: z.number().min(0).max(10000).optional(),
});

// Generic validation helper
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new ApiError(`Validation failed: ${messages.join(', ')}`, 400, 'VALIDATION_ERROR');
    }
    throw error;
  }
};

// Rate limiting validation
export const rateLimitSchema = z.object({
  action: z.enum(['lesson-complete', 'profile-update', 'badge-award']),
  identifier: z.string(),
});

// Common ID validation
export const idSchema = z.string().uuid('Invalid ID format');
export const lessonIdSchema = z.string().regex(/^lesson-\d+$/, 'Invalid lesson ID format');