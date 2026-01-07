// lib/auth/safe-redirect.ts - Prevent open redirect attacks

const ALLOWED_PATHS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/auth/verify-email',
  '/it/dashboard',
  '/en/dashboard',
];

/**
 * Validates redirect URL to prevent open redirect attacks
 * Only allows relative paths or allowlisted URLs
 */
export function safeRedirect(url: string | null, fallback = '/'): string {
  if (!url) return fallback;
  
  // Must start with / (relative path)
  if (!url.startsWith('/')) return fallback;
  
  // Block protocol-relative URLs
  if (url.startsWith('//')) return fallback;
  
  // Block encoded tricks
  if (url.includes('%')) {
    try {
      const decoded = decodeURIComponent(url);
      if (decoded.startsWith('//') || decoded.includes(':')) return fallback;
    } catch {
      return fallback;
    }
  }
  
  // Block javascript: and other protocols
  if (url.toLowerCase().includes('javascript:')) return fallback;
  if (url.toLowerCase().includes('data:')) return fallback;
  
  // Check against allowlist (optional, for stricter security)
  const pathPart = url.split('?')[0] || '';
  if (!ALLOWED_PATHS.some(allowed => pathPart.startsWith(allowed))) {
    return fallback;
  }
  
  return url;
}
