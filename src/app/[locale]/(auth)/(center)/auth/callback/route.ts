import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

/**
 * Auth Callback Handler - 2026 Best Practices
 * 
 * Handles:
 * - Email confirmation
 * - Password reset
 * - OAuth callbacks
 * - Profile creation for new users
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if this is a new user and create profile if needed
      if (data.user && !data.user.user_metadata?.profile_created) {
        try {
          // Create profile for new OAuth users
          const { error: profileError } = await supabase
            .from('profile')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              fullname: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
              username: data.user.email?.split('@')[0] || '',
              avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
              is_email_verified: true,
              verified_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (!profileError) {
            // Update user metadata to mark profile as created
            await supabase.auth.updateUser({
              data: { profile_created: true }
            });
          }
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't fail the auth flow, just log the error
        }
      }

      // Handle different callback types
      switch (type) {
        case 'recovery':
          // Password reset - redirect to reset password page
          return NextResponse.redirect(`${origin}/reset-password`);
        case 'signup':
          // Email confirmation - redirect to dashboard
          return NextResponse.redirect(`${origin}${next}`);
        case 'email_change':
          // Email change confirmation
          return NextResponse.redirect(`${origin}/profile?email_changed=true`);
        default:
          // Default OAuth or login
          return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?error=callback_failed`);
}