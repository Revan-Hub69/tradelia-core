/**
 * Email Template System
 *
 * Modular email templates for contact form and support system.
 * Follows 2025 best practices: minimalist, mobile-first, accessible.
 */

export * from './base-layout';
export { contactConfirmationTemplate } from './contact-confirmation';
export { contactFollowupTemplate } from './contact-followup';
export { contactNotificationTemplate } from './contact-notification';
export * from './types';

/**
 * Generate unique ticket ID
 *
 * Format: TKT-2026-XXXXXX
 * Where XXXXXX is a 6-digit random number
 *
 * Example: TKT-2026-123456
 */
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `TKT-${year}-${random}`;
}

/**
 * Detect user locale from Accept-Language header
 *
 * Returns 'it' for Italian, 'en' for English (default)
 */
export function detectLocale(acceptLanguage: string | null): 'it' | 'en' {
  if (!acceptLanguage) {
 return 'en';
}

  const lang = acceptLanguage.toLowerCase();
  if (lang.startsWith('it')) {
 return 'it';
}

  return 'en';
}
