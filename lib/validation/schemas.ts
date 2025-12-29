// Input validation schemas for API routes
// Using Zod for runtime type checking and validation

import { z } from 'zod'

// Fear & Greed Index validation
export const FearGreedRequestSchema = z.object({
  value: z.number()
    .min(0, 'Value must be between 0 and 100')
    .max(100, 'Value must be between 0 and 100')
    .int('Value must be an integer'),
  classification: z.enum(['extreme_fear', 'fear', 'neutral', 'greed', 'extreme_greed']),
  context: z.union([
    z.string(),
    z.object({
      timestamp: z.string().optional(),
      source: z.string().optional()
    })
  ]).optional()
})

export type FearGreedRequest = z.infer<typeof FearGreedRequestSchema>

// Generic indicator validation
export const IndicatorRequestSchema = z.object({
  indicator_type: z.string().min(1, 'Indicator type is required'),
  value: z.number(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

export type IndicatorRequest = z.infer<typeof IndicatorRequestSchema>

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  timestamp: z.string().optional()
})

export type ApiResponse = z.infer<typeof ApiResponseSchema>

// Rate limiting configuration
export const RATE_LIMITS = {
  AI_EXPLANATIONS: {
    requests: 10,
    window: 60 * 1000 // 1 minute
  },
  INDICATOR_FETCH: {
    requests: 30,
    window: 60 * 1000 // 1 minute
  }
} as const