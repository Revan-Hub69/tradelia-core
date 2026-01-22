import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth provider errors (e.g., user denied access)
  if (error) {
    console.error('OAuth provider error:', error, errorDescription);
    const errorUrl = new URL('/auth-error', origin);
    errorUrl.searchParams.set('error', error);
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError && data.user) {
      console.log('OAuth success for user:', data.user.email);
      
      // For OAuth providers (Google, etc.), we don't require email confirmation
      // The provider has already verified the email
      const isOAuthUser = data.user.app_metadata?.provider !== 'email';
      
      if (!isOAuthUser && !data.user.email_confirmed_at) {
        // Only require email confirmation for email/password signups
        console.log('Email signup requires confirmation');
        const errorUrl = new URL('/auth-error', origin);
        errorUrl.searchParams.set('error', 'email_not_confirmed');
        errorUrl.searchParams.set('error_description', 'Please check your email and click the confirmation link before signing in.');
        return NextResponse.redirect(errorUrl);
      }

      // Successful authentication - redirect to sync page
      console.log('Redirecting to sync page');
      return NextResponse.redirect(`${origin}/auth/sync?redirect=${encodeURIComponent(next)}`);
    }

    // Handle specific Supabase auth errors
    if (exchangeError) {
      console.error('Supabase exchange error:', exchangeError);
      const errorUrl = new URL('/auth-error', origin);
      
      // Map common Supabase errors to user-friendly messages
      if (exchangeError.message.includes('email not confirmed')) {
        errorUrl.searchParams.set('error', 'email_not_confirmed');
        errorUrl.searchParams.set('error_description', 'Please check your email and click the confirmation link.');
      } else if (exchangeError.message.includes('invalid_grant')) {
        errorUrl.searchParams.set('error', 'expired_link');
        errorUrl.searchParams.set('error_description', 'The authentication link has expired. Please try signing in again.');
      } else if (exchangeError.message.includes('rate limit')) {
        errorUrl.searchParams.set('error', 'rate_limit');
        errorUrl.searchParams.set('error_description', 'Too many attempts. Please wait a moment before trying again.');
      } else {
        errorUrl.searchParams.set('error', 'auth_failed');
        errorUrl.searchParams.set('error_description', exchangeError.message);
      }
      
      return NextResponse.redirect(errorUrl);
    }
  }

  // No code parameter - invalid callback
  console.error('Invalid callback - no code parameter');
  const errorUrl = new URL('/auth-error', origin);
  errorUrl.searchParams.set('error', 'invalid_callback');
  errorUrl.searchParams.set('error_description', 'Invalid authentication callback. Please try signing in again.');
  return NextResponse.redirect(errorUrl);
}
