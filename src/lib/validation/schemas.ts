/**
 * Comprehensive Validation Schemas (2026)
 *
 * Based on tier-1 research:
 * - Zod official documentation
 * - OWASP input validation best practices
 * - XSS prevention patterns
 * - Next.js API security
 */

import { z } from 'zod';

// ============================================================================
// SANITIZATION HELPERS
// ============================================================================

/**
 * Remove HTML tags and dangerous characters
 */
const sanitizeString = (str: string): string => {
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove dangerous characters
    .trim();
};

/**
 * Validate no path traversal attempts
 */
const noPathTraversal = (str: string): boolean => {
  const dangerous = ['../', '..\\', '%2e%2e/', '%2e%2e\\'];
  return !dangerous.some(pattern =>
    str.toLowerCase().includes(pattern.toLowerCase()),
  );
};

/**
 * Validate no null bytes
 */
const noNullBytes = (str: string): boolean => {
  return !str.includes('\0');
};

/**
 * Validate no SQL keywords (basic protection)
 */
const noSQLKeywords = (str: string): boolean => {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION',
    'ALTER', 'CREATE', 'TRUNCATE', '--', ';--', '/*', '*/',
  ];
  const upperValue = str.toUpperCase();
  return !sqlKeywords.some(keyword => upperValue.includes(keyword));
};

// ============================================================================
// BASE SCHEMAS (Reusable)
// ============================================================================

/**
 * Safe string: no HTML, no path traversal, no null bytes
 */
export const safeStringSchema = z.string()
  .transform(sanitizeString)
  .refine(noPathTraversal, 'Invalid characters detected')
  .refine(noNullBytes, 'Invalid characters detected')
  .refine(noSQLKeywords, 'Invalid characters detected');

/**
 * Email validation (RFC 5322 compliant)
 */
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .toLowerCase()
  .transform(sanitizeString);

/**
 * Username validation (alphanumeric + underscore)
 */
export const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^\w+$/, 'Username can only contain letters, numbers, and underscores')
  .transform(sanitizeString)
  .refine(noPathTraversal, 'Invalid characters detected')
  .refine(noNullBytes, 'Invalid characters detected');

/**
 * Password validation (strong password requirements)
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Z0-9]/i, 'Password must contain at least one special character');

/**
 * URL validation (only http/https)
 */
export const urlSchema = z.string()
  .url('Invalid URL format')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    'Only HTTP and HTTPS URLs are allowed',
  );

/**
 * UUID validation
 */
export const uuidSchema = z.string()
  .uuid('Invalid UUID format');

/**
 * Positive integer validation
 */
export const positiveIntSchema = z.number()
  .int('Must be an integer')
  .positive('Must be positive');

/**
 * Bounded number validation
 */
export const boundedNumberSchema = (min: number, max: number) =>
  z.number()
    .min(min, `Must be at least ${min}`)
    .max(max, `Must be at most ${max}`);

/**
 * Safe filename validation
 */
export const filenameSchema = z.string()
  .max(255, 'Filename too long')
  .regex(/^[\w.-]+$/, 'Invalid filename format')
  .refine(name => !name.startsWith('.'), 'Filename cannot start with dot')
  .refine(name => !name.includes('..'), 'Filename cannot contain double dots')
  .transform(sanitizeString)
  .refine(noPathTraversal, 'Invalid characters detected')
  .refine(noNullBytes, 'Invalid characters detected');

/**
 * Phone number validation (E.164 format)
 */
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * Search query validation
 */
export const searchQuerySchema = z.string()
  .min(1, 'Search query cannot be empty')
  .max(200, 'Search query too long')
  .transform(sanitizeString)
  .refine(noPathTraversal, 'Invalid characters detected')
  .refine(noNullBytes, 'Invalid characters detected')
  .refine(noSQLKeywords, 'Invalid characters detected');

// ============================================================================
// USER SCHEMAS
// ============================================================================

/**
 * User profile creation/update
 */
export const userProfileSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeString)
    .optional(),
  avatar: urlSchema.optional(),
  bio: z.string()
    .max(500, 'Bio too long')
    .transform(sanitizeString)
    .optional(),
});

/**
 * User registration
 */
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeString),
});

/**
 * User login
 */
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Password reset request
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset confirmation
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Pagination parameters
 */
export const paginationSchema = z.object({
  page: positiveIntSchema.max(10000, 'Page number too large').default(1),
  limit: positiveIntSchema.max(100, 'Limit too large').default(20),
  sortBy: z.string().max(50, 'Sort field too long').transform(sanitizeString).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// ============================================================================
// SEARCH SCHEMAS
// ============================================================================

/**
 * Search parameters
 */
export const searchSchema = z.object({
  query: searchQuerySchema,
  filters: z.record(safeStringSchema).optional(),
  page: positiveIntSchema.default(1),
  limit: positiveIntSchema.max(100, 'Limit too large').default(20),
});

// ============================================================================
// RATE LIMITING SCHEMAS
// ============================================================================

/**
 * Rate limit action validation
 */
export const rateLimitSchema = z.object({
  action: z.enum(['profile-update', 'badge-award', 'auth', 'api']),
  identifier: safeStringSchema,
});

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Search = z.infer<typeof searchSchema>;
