/**
 * CONTENT SANITIZATION - XSS Protection
 * Best Practice 2026: Sanitize all user-generated content
 *
 * NOTE: Uses HTML entity escaping for SSR compatibility
 * React's JSX already provides XSS protection, this is defense-in-depth
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Used for user-generated content like descriptions, pros/cons
 *
 * NOTE: Always uses HTML entity escaping for SSR compatibility
 * React already provides XSS protection, this is defense-in-depth
 */
export function sanitizeHTML(dirty: string): string {
  // Use simple HTML entity escaping (works on both server and client)
  // React's JSX already provides XSS protection, this is an additional layer
  return dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
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
