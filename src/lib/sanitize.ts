/**
 * CONTENT SANITIZATION - XSS Protection
 * Best Practice 2026: Sanitize all user-generated content
 * 
 * NOTE: Uses dynamic import to avoid SSR issues with DOMPurify
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Used for user-generated content like descriptions, pros/cons
 */
export function sanitizeHTML(dirty: string): string {
  // Server-side: escape HTML entities
  if (typeof window === 'undefined') {
    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Client-side: use DOMPurify
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const DOMPurify = require('isomorphic-dompurify');
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    });
  } catch {
    // Fallback: escape HTML entities
    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

/**
 * Sanitize plain text (strip all HTML)
 * Used for titles, names, labels
 */
export function sanitizeText(dirty: string): string {
  // Server-side and client-side: strip all HTML
  return dirty
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
}
