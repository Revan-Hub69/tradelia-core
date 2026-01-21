import { notFound } from 'next/navigation';

/**
 * Catch-all route for dashboard
 *
 * Catches any /dashboard/* routes that don't match existing pages
 * and triggers the not-found.tsx page.
 */
export default function DashboardCatchAll() {
  notFound();
}
