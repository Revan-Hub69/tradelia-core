'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
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

          // Detect user's preferred locale (default to Italian)
          const userLocale = navigator.language.startsWith('en') ? 'en' : 'it';
          
          // Clean URL and redirect to localized dashboard
          window.history.replaceState({}, document.title, '/auth/callback');
          router.push(`/${userLocale}/dashboard`);
        }
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 max-w-md mx-auto px-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <h1 className="text-xl font-semibold text-foreground">Completamento autenticazione...</h1>
        <p className="text-sm text-muted-foreground">
          Attendere mentre viene completato il processo di accesso.
        </p>
      </div>
    </div>
  );
}