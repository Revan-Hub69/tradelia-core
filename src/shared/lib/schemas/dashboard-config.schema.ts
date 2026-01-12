/**
 * Dashboard Configuration Validation Schemas
 * 
 * Server-side validation schemas for dashboard configuration data.
 * Requirements: 1.3, 1.4 - Zod validation before any database operations
 * 
 * @module schemas/dashboard-config
 */

import { z } from 'zod'

/**
 * Theme preference schema
 */
export const themeSchema = z.enum(['light', 'dark', 'system'])

/**
 * Density preference schema
 */
export const densitySchema = z.enum(['compact', 'comfortable'])

/**
 * Locale preference schema
 */
export const localeSchema = z.enum(['it', 'en'])

/**
 * Journey type schema
 */
export const journeyTypeSchema = z.enum([
  'emergency',
  'longterm',
  'passive',
  'speculation',
])

/**
 * Widget position schema
 */
export const widgetPositionSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  visible: z.boolean(),
})

/**
 * Dashboard layout configuration schema
 */
export const dashboardLayoutSchema = z.object({
  widgets: z.array(widgetPositionSchema).max(50),
  sidebarCollapsed: z.boolean().default(false),
  density: densitySchema.default('comfortable'),
})

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  theme: themeSchema.default('system'),
  locale: localeSchema.default('it'),
  density: densitySchema.default('comfortable'),
  reducedMotion: z.boolean().default(false),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    inApp: z.boolean().default(true),
  }).default({ email: true, push: false, inApp: true }),
})

/**
 * Session continuity state schema
 * Used for persisting UI state between sessions
 */
export const sessionContinuitySchema = z.object({
  lastJourney: journeyTypeSchema.nullable().default(null),
  lastSection: z.string().max(100).nullable().default(null),
  lastDrawerTab: z.string().max(50).nullable().default(null),
  density: densitySchema.default('comfortable'),
  version: z.number().int().positive().default(1),
})

/**
 * Dashboard configuration schema (complete)
 */
export const dashboardConfigSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  layout: dashboardLayoutSchema.optional(),
  preferences: userPreferencesSchema.optional(),
  session_state: sessionContinuitySchema.optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

/**
 * Dashboard configuration update schema
 */
export const updateDashboardConfigSchema = z.object({
  layout: dashboardLayoutSchema.optional(),
  preferences: userPreferencesSchema.partial().optional(),
  session_state: sessionContinuitySchema.partial().optional(),
})

/**
 * Command palette command schema
 */
export const commandSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1).max(100),
  shortcut: z.string().max(20).optional(),
  section: z.enum(['navigation', 'actions', 'settings']),
  keywords: z.array(z.string().max(50)).max(10),
})

/**
 * Recent commands schema
 */
export const recentCommandsSchema = z.array(z.string().max(50)).max(10)

// Type exports
export type Theme = z.infer<typeof themeSchema>
export type Density = z.infer<typeof densitySchema>
export type Locale = z.infer<typeof localeSchema>
export type JourneyType = z.infer<typeof journeyTypeSchema>
export type WidgetPosition = z.infer<typeof widgetPositionSchema>
export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type SessionContinuity = z.infer<typeof sessionContinuitySchema>
export type DashboardConfig = z.infer<typeof dashboardConfigSchema>
export type UpdateDashboardConfig = z.infer<typeof updateDashboardConfigSchema>
export type Command = z.infer<typeof commandSchema>
