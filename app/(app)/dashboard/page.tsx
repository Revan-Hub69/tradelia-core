/**
 * Dashboard Redirect - Tradelia 2026
 * 
 * Redirect dinamico alla dashboard localizzata (supporta IT/EN)
 */

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function DashboardRedirect({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') qs.set(key, value);
    else if (Array.isArray(value)) value.forEach(v => qs.append(key, v));
  }

  // Detect locale from Accept-Language header or default to 'it'
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const locale = acceptLanguage.toLowerCase().includes('en') ? 'en' : 'it';

  const suffix = qs.toString();
  redirect(suffix ? `/${locale}/dashboard?${suffix}` : `/${locale}/dashboard`);
}
