/**
 * Shared Library Functions - Tradelia 2026
 * 
 * Funzioni di utilità condivise che non dipendono da layer superiori
 */

// Utility functions
export { formatBytes, formatDate, formatCurrency } from './formatters';
export { debounce, throttle } from './performance';

// Validation (Zod-based)
export {
  // Messages
  validationMessages,
  getMessages,
  // Schemas
  emailSchema,
  passwordSchema,
  strongPasswordSchema,
  nameSchema,
  // Form schemas
  loginSchema,
  registerSchema,
  resetRequestSchema,
  resetPasswordSchema,
  // Helpers
  validateForm,
  validateField,
  // Hook
  useFormValidation
} from './validation';
export type { ValidationResult, Locale, Messages } from './validation';

// Constants
export { TRADELIA_CONSTANTS } from './constants';

// Types
export type { FormatterOptions } from './types';