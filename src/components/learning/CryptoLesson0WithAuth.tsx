'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';

import { CryptoLesson0Clean } from './CryptoLesson0Clean';

/**
 * Banner di registrazione opzionale che appare dopo aver completato la lezione
 */
const OptionalRegistrationBanner = ({ onClose }: { onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
        },
      });

      if (error) {
        console.error('Error signing up with Google:', error);
      }
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-md p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-4 size-12 rounded-full bg-green-100 p-3">
              <svg className="size-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Ottimo lavoro!</h3>
            <p className="text-sm text-muted-foreground">
              Hai completato la prima lezione. Vuoi salvare i tuoi progressi?
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Salva i tuoi progressi</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Accedi a tutte le 12 lezioni gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ricevi consigli personalizzati</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? 'Creando account...' : 'Continua con Google'}
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth">Entra in Tradelia</Link>
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Continua senza registrarti
              </button>
            </div>
          </div>

          {/* Trust */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Gratis • Niente spam • Puoi cancellarti quando vuoi
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * Lezione 0 con banner di registrazione opzionale
 */
export const CryptoLesson0WithAuth: React.FC = () => {
  const [showRegistrationBanner, setShowRegistrationBanner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      // If authenticated, redirect to dashboard
      if (user) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  // Show registration banner after lesson completion (simulated)
  useEffect(() => {
    // Simulate lesson completion after 2 minutes
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setShowRegistrationBanner(true);
      }
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Don't render anything while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <CryptoLesson0Clean />
      
      {/* Optional Registration Banner */}
      {showRegistrationBanner && (
        <OptionalRegistrationBanner 
          onClose={() => setShowRegistrationBanner(false)} 
        />
      )}

      {/* Floating CTA for non-authenticated users */}
      {!isAuthenticated && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
          <Card className="border-primary/20 bg-primary/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 p-2">
                <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">Ti piace questa lezione?</h4>
                <p className="text-xs text-muted-foreground">Registrati per accedere a tutte le 12 lezioni gratuite</p>
              </div>
              <Button asChild size="sm">
                <Link href="/auth">Gratis</Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};