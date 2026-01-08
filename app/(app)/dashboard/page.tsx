/**
 * Dashboard Redirect - Tradelia 2026
 * 
 * Questa route reindirizza alla dashboard localizzata.
 * La dashboard principale è in app/[locale]/(app)/dashboard/
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardRedirect() {
  // Get locale from cookie or default to 'it'
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = localeCookie?.value || 'it';
  
  // Redirect to localized dashboard
  redirect(`/${locale}/dashboard`);
}
