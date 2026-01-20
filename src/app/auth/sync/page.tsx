'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { useLessonCompletion } from '@/hooks/useLessonCompletion';

function AuthSyncContent() {
  const [, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'success' | 'error'>('syncing');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { syncPendingCompletions } = useLessonCompletion();

  useEffect(() => {
    const syncData = async () => {
      try {
        setSyncStatus('syncing');

        // Sync any pending lesson completions
        await syncPendingCompletions();

        // Create user profile and progress if they don't exist
        const profileResponse = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Basic profile data - will be enhanced during onboarding
          }),
        });

        if (profileResponse.ok) {
          // Create initial progress record
          await fetch('/api/user/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              initialXP: 0, // Will be updated by lesson completions
            }),
          });
        }

        setSyncStatus('success');

        // Redirect after successful sync
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      } catch (error) {
        console.error('Error syncing user data:', error);
        setSyncStatus('error');

        // Still redirect on error, but to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    syncData();
  }, [searchParams, router, syncPendingCompletions]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Loading Animation */}
        <div className="mx-auto size-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

        {/* Status Messages */}
        {syncStatus === 'syncing' && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Sincronizzazione in corso...</h2>
            <p className="text-muted-foreground">
              Stiamo configurando il tuo account e sincronizzando i tuoi progressi.
            </p>
          </div>
        )}

        {syncStatus === 'success' && (
          <div className="space-y-2">
            <div className="mx-auto size-16 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
              <svg className="size-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              Sincronizzazione completata!
            </h2>
            <p className="text-muted-foreground">
              Il tuo account è pronto. Ti stiamo reindirizzando...
            </p>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="space-y-2">
            <div className="mx-auto size-16 rounded-full bg-orange-100 p-4 dark:bg-orange-900/30">
              <svg className="size-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400">
              Sincronizzazione parziale
            </h2>
            <p className="text-muted-foreground">
              Alcuni dati potrebbero non essere stati sincronizzati. Puoi continuare normalmente.
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-1000"
              style={{
                width: syncStatus === 'syncing' ? '60%' : '100%',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {syncStatus === 'syncing' && 'Configurazione account...'}
            {syncStatus === 'success' && 'Completato!'}
            {syncStatus === 'error' && 'Reindirizzamento...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthSyncPage() {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto size-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    )}
    >
      <AuthSyncContent />
    </Suspense>
  );
}
