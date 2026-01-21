import { z } from 'zod';

/**
 * Raw shape coming from DB / Supabase
 * (tollerante: nullable / opzionale)
 */
export const UserProgressRawSchema = z.object({
  total_xp: z.number().nullable().optional(),
  level: z.number().nullable().optional(),
  current_streak: z.number().nullable().optional(),
  longest_streak: z.number().nullable().optional(),
  last_activity_date: z.string().nullable().optional(),
});

/**
 * Normalized, UI-safe shape
 * (mai null, mai undefined)
 */
export const UserProgressNormalizedSchema = z.object({
  total_xp: z.number(),
  level: z.number(),
  current_streak: z.number(),
  longest_streak: z.number(),
  last_activity_date: z.string(), // YYYY-MM-DD
});

/**
 * Complete user data raw (from API)
 */
export const CompleteUserDataRawSchema = z.object({
  profile: z.object({
    name: z.string().nullable().optional(),
  }).nullable().optional(),
  progress: UserProgressRawSchema.nullable().optional(),
  completions: z.array(z.any()).nullable().optional(),
  badges: z.array(z.any()).nullable().optional(),
});

/**
 * Complete user data normalized (for UI)
 */
export const CompleteUserDataNormalizedSchema = z.object({
  profile: z.object({
    name: z.string(),
  }),
  progress: UserProgressNormalizedSchema,
  completions: z.array(z.any()),
  badges: z.array(z.any()),
});

export type UserProgressRaw = z.infer<typeof UserProgressRawSchema>;
export type UserProgressNormalized = z.infer<typeof UserProgressNormalizedSchema>;
export type CompleteUserDataRaw = z.infer<typeof CompleteUserDataRawSchema>;
export type CompleteUserDataNormalized = z.infer<typeof CompleteUserDataNormalizedSchema>;
