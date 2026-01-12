/**
 * Validation Schemas Index
 * 
 * Central export for all Zod validation schemas.
 * Requirements: 1.3, 1.4 - Server-side validation with Zod
 * 
 * @module schemas
 */

// User Profile Schemas
export {
  nicknameSchema,
  countryCodeSchema,
  emailSchema as userEmailSchema,
  createUserProfileSchema,
  updateUserProfileSchema,
  userProfileSchema,
  type CreateUserProfile,
  type UpdateUserProfile,
  type UserProfile,
} from './user-profile.schema'

// Auth Schemas
export {
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
  loginSchema,
  registerSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
  oauthCallbackSchema,
  tokenRefreshSchema,
  sessionSchema,
  type LoginInput,
  type RegisterInput,
  type PasswordResetRequest,
  type PasswordResetConfirm,
  type OAuthCallback,
  type TokenRefresh,
  type Session,
} from './auth.schema'

// Dashboard Config Schemas
export {
  themeSchema,
  densitySchema,
  localeSchema,
  journeyTypeSchema,
  widgetPositionSchema,
  dashboardLayoutSchema,
  userPreferencesSchema,
  sessionContinuitySchema,
  dashboardConfigSchema,
  updateDashboardConfigSchema,
  commandSchema,
  recentCommandsSchema,
  type Theme,
  type Density,
  type Locale,
  type JourneyType,
  type WidgetPosition,
  type DashboardLayout,
  type UserPreferences,
  type SessionContinuity,
  type DashboardConfig,
  type UpdateDashboardConfig,
  type Command,
} from './dashboard-config.schema'
