/**
 * Dashboard Redirect - Tradelia 2026
 * 
 * Redirect semplice alla dashboard localizzata italiana
 */

import { redirect } from 'next/navigation';

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

  const suffix = qs.toString();
  redirect(suffix ? `/it/dashboard?${suffix}` : '/it/dashboard');
}
