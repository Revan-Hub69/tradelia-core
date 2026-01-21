import { redirect } from 'next/navigation';

/**
 * Root 404 Fallback
 * 
 * Catches 404s that don't match [locale] routes
 * (e.g., OAuth errors, malformed URLs)
 * 
 * Redirects to localized 404 page.
 */
export default function RootNotFound() {
  // Redirect to Italian (default locale) 404
  redirect('/');
}
