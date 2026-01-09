'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageSelector';
import { safeRedirect } from '@/lib/auth/safe-redirect';
import { AlertTriangleIcon } from '@/components/icons/TradeliaIcons';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Handle OAuth token from URL hash
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Create profile if not exists
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (!profile) {
              await supabase.from('user_profiles').insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                avatar_url: session.user.user_metadata?.avatar_url,
                storage_preference: 'register',
                created_at: new Date().toISOString()
              });
            }

            // Strip token from URL after consuming (security)
            window.history.replaceState({}, document.title, '/auth/callback');
            
            // Use current locale for redirect
            const dashboardPath = safeRedirect(`/${locale}/dashboard`, '/dashboard');
            router.push(dashboardPath);
          }
        }
      } catch {
        setError(t('auth.callback.errorGeneric'));
      }
    };

    handleOAuthCallback();
  }, [router, locale, t]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="p-4 rounded border  alert-error" role="alert">
            <div className="flex items-start gap-3 justify-center">
              <AlertTriangleIcon className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {t('auth.common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 max-w-md mx-auto px-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <h1 className="text-xl font-semibold text-foreground">{t('auth.callback.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.callback.subtitle')}
        </p>
      </div>
    </div>
  );
}
