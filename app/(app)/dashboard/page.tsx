/**
 * Dashboard Redirect - Tradelia 2026
 * 
 * Redirect semplice alla dashboard localizzata italiana
 */

import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  // Redirect semplice alla dashboard italiana
  redirect('/it/dashboard');
}
