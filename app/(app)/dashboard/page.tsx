/**
 * Dashboard Redirect - Tradelia 2026
 * 
 * Questa route reindirizza alla dashboard localizzata.
 * La dashboard principale è in app/[locale]/(app)/dashboard/
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface DashboardRedirectProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardRedirect({ searchParams }: DashboardRedirectProps) {
  // Get locale from cookie or default to 'it'
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = localeCookie?.value || 'it';
  
  // Get search params
  const params = await searchParams;
  
  // Build query string if params exist
  const queryString = Object.keys(params).length > 0 
    ? '?' + new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          // Handle array values by taking the first element
          const stringValue = Array.isArray(value) ? value[0] : value;
          if (stringValue) {
            acc[key] = stringValue;
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : '';
  
  // Redirect to localized dashboard with preserved query params
  redirect(`/${locale}/dashboard${queryString}`);
}
