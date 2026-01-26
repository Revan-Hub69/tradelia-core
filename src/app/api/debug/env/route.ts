/**
 * Debug Endpoint - Environment Variables Check
 *
 * SECURITY: Remove this file after debugging!
 * This endpoint exposes which environment variables are set (not their values)
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    smtp: {
      host: !!process.env.SMTP_HOST,
      user: !!process.env.SMTP_USER,
      pass: !!process.env.SMTP_PASS,
    },
    support: {
      email: !!process.env.SUPPORT_EMAIL,
    },
    site: {
      url: !!process.env.NEXT_PUBLIC_SITE_URL,
    },
    database: {
      url: !!process.env.DATABASE_URL,
    },
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  };

  return NextResponse.json({
    message: 'Environment variables check',
    env: envCheck,
    allSmtpConfigured: envCheck.smtp.host && envCheck.smtp.user && envCheck.smtp.pass,
    allSupabaseConfigured: envCheck.supabase.url && envCheck.supabase.anonKey && envCheck.supabase.serviceRole,
  });
}
