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

// Command Palette (REQ 16)
export { getCoreCommands, NAVIGATION_SHORTCUTS, SINGLE_KEY_SHORTCUTS } from './core-commands';

// Help Content (REQ 23)
export { getHelpContent, journeyToHelpModule, hasHelpContent } from './help-content';
export type { HelpModuleId } from './help-content';

// Types
export type { FormatterOptions } from './types';