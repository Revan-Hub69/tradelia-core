'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';
import { Link } from '@/libs/i18nNavigation';
import { Logo } from '@/templates/Logo';

/**
 * Auth Error Page - 2026 Best Practices
 *
 * Features:
 * - Clear error messaging
 * - Recovery options
 * - Premium design
 * - Accessibility compliant
 */
const AuthErrorContent = () => {
  const t = useTranslations('AuthError') as any;
  const searchParams = useSearchParams();

  const errorParam = searchParams.get('error');
  const description = searchParams.get('description');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-950/30" />

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Logo size="md" href="/" />
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <Card className="relative overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80 sm:bg-white/70 sm:backdrop-blur-xl">
              <div className="relative">
                <CardHeader className="space-y-2 pb-6 text-center">
                  <SlideReveal>
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <svg className="size-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                      {t('title')}
                    </CardTitle>
                  </SlideReveal>

                  <FadeIn delay={200}>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {description || t('description')}
                      {errorParam && (
                        <span className="mt-2 block text-xs text-slate-500">
                          Error:
                          {' '}
                          {errorParam}
                        </span>
                      )}
                    </CardDescription>
                  </FadeIn>
                </CardHeader>

                <CardContent className="space-y-4 pb-8">
                  <FadeIn delay={300}>
                    <Button asChild className="w-full">
                      <Link href="/auth">{t('try_again')}</Link>
                    </Button>
                  </FadeIn>

                  <FadeIn delay={400}>
                    <Button asChild variant="ghost" className="w-full">
                      <Link href="/">{t('back_home')}</Link>
                    </Button>
                  </FadeIn>
                </CardContent>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

const AuthErrorPage = () => {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )}
    >
      <AuthErrorContent />
    </Suspense>
  );
};

export default AuthErrorPage;
