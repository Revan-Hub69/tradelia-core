'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/libs/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Email Verification Banner - Tier 1 UX Implementation 2026
 * 
 * Best Practices Applied:
 * - Non-invasive positioning (top of dashboard)
 * - Soft confirmation UX (doesn't block access)
 * - Progressive disclosure (shows only when needed)
 * - Clear actions with immediate feedback
 * - Consistent with Tradelia design system
 * - Auto-dismiss after verification
 * - Intelligent persistence (localStorage)
 */
export const EmailVerificationBanner = () => {
  const t = useTranslations('Dashboard');
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const emailVerification = searchParams.get('emailVerification');
    const userEmail = searchParams.get('email');
    
    // Check if user has permanently dismissed the banner
    const dismissedKey = `email-verification-dismissed-${userEmail}`;
    const wasDismissed = localStorage.getItem(dismissedKey) === 'true';
    
    if (emailVerification === 'pending' && userEmail && !wasDismissed) {
      setIsVisible(true);
      setEmail(decodeURIComponent(userEmail));
      
      // Clean URL after showing banner
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('emailVerification');
      newUrl.searchParams.delete('email');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
        },
      });

      if (error) {
        console.error('❌ Resend email error:', error);
      } else {
        console.log('✅ Verification email resent successfully');
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      console.error('💥 Resend email exception:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Remember user's choice to dismiss (until they verify)
    const dismissedKey = `email-verification-dismissed-${email}`;
    localStorage.setItem(dismissedKey, 'true');
  };

  // Auto-hide banner if user verifies email in another tab
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!isVisible || !email) return;
      
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.email_confirmed_at) {
          // Email verified! Hide banner and clear localStorage
          const dismissedKey = `email-verification-dismissed-${email}`;
          localStorage.removeItem(dismissedKey);
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    // Check every 30 seconds if email was verified
    const interval = setInterval(checkEmailVerification, 30000);
    return () => clearInterval(interval);
  }, [isVisible, email]);

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 dark:border-amber-800 dark:from-amber-950/20 dark:to-yellow-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Enhanced Email Icon with Animation */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
              <div className="relative flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <svg 
                  className="size-5 text-amber-600 dark:text-amber-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  📧 {t('email_verification_title')}
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                  {t('email_verification_message', { email })}
                </p>
              </div>
              
              {/* Close button - Tier 1 positioning */}
              <button
                onClick={handleDismiss}
                className="ml-4 flex-shrink-0 rounded-md p-1.5 text-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-amber-400 dark:hover:bg-amber-900/30"
                aria-label={t('email_verification_dismiss')}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {resendSuccess && (
              <div className="mt-3 flex items-center gap-2">
                <svg className="size-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('email_verification_resent')}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-2">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                size="sm"
                className="bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600"
              >
                {isResending ? (
                  <>
                    <div className="mr-2 size-3 animate-spin rounded-full border border-white border-t-transparent" />
                    {t('email_verification_resending')}
                  </>
                ) : (
                  <>
                    <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('email_verification_resend')}
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/30 dark:hover:text-amber-200"
              >
                {t('email_verification_dismiss')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};