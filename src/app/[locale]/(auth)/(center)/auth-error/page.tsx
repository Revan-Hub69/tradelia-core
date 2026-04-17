'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/scroll-animations';
import { Link } from '@/lib/i18nNavigation';
import { Logo } from '@/templates/Logo';

/**
 * Auth Error Page - Handles authentication errors with user-friendly messages
 *
 * Features:
 * - Email confirmation errors
 * - OAuth provider errors
 * - Rate limiting errors
 * - Network/connection errors
 * - Clear recovery actions
 */

function AuthErrorContent() {
  const t = useTranslations('Auth') as any;
  const searchParams = useSearchParams();

  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const provider = searchParams.get('provider');

  // Determine error type and appropriate message
  const getErrorInfo = () => {
    if (error === 'access_denied') {
      return {
        title: t('error_access_denied_title'),
        description: t('error_access_denied_description'),
        icon: 'block',
        color: 'orange',
        actions: [
          { label: t('try_again'), href: '/auth', primary: true },
          { label: t('contact_support'), href: '/support', primary: false },
        ],
      };
    }

    if (error === 'email_not_confirmed') {
      return {
        title: t('error_email_not_confirmed_title'),
        description: t('error_email_not_confirmed_description'),
        icon: 'mail',
        color: 'blue',
        actions: [
          { label: t('resend_confirmation'), href: '/auth?resend=true', primary: true },
          { label: t('try_different_email'), href: '/auth', primary: false },
        ],
      };
    }

    if (error === 'provider_error' || errorDescription?.includes('provider')) {
      return {
        title: t('error_provider_title', { provider: provider || 'OAuth' }),
        description: t('error_provider_description'),
        icon: 'warning',
        color: 'red',
        actions: [
          { label: t('try_again'), href: '/auth', primary: true },
          { label: t('try_email_signup'), href: '/auth', primary: false },
        ],
      };
    }

    if (error === 'rate_limit') {
      return {
        title: t('error_rate_limit_title'),
        description: t('error_rate_limit_description'),
        icon: 'clock',
        color: 'yellow',
        actions: [
          { label: t('wait_and_retry'), href: '/auth', primary: true },
        ],
      };
    }

    if (error === 'expired_link') {
      return {
        title: t('error_expired_link_title'),
        description: t('error_expired_link_description'),
        icon: 'clock',
        color: 'orange',
        actions: [
          { label: t('try_again'), href: '/auth', primary: true },
        ],
      };
    }

    if (error === 'auth_failed') {
      return {
        title: t('error_auth_failed_title'),
        description: t('error_auth_failed_description'),
        icon: 'warning',
        color: 'red',
        actions: [
          { label: t('try_again'), href: '/auth', primary: true },
          { label: t('contact_support'), href: '/support', primary: false },
        ],
      };
    }

    if (error === 'invalid_callback') {
      return {
        title: t('error_invalid_callback_title'),
        description: t('error_invalid_callback_description'),
        icon: 'warning',
        color: 'red',
        actions: [
          { label: t('try_again'), href: '/auth', primary: true },
        ],
      };
    }

    // Generic error
    return {
      title: t('error_generic_title'),
      description: errorDescription || t('error_generic_description'),
      icon: 'alert',
      color: 'red',
      actions: [
        { label: t('try_again'), href: '/auth', primary: true },
        { label: t('contact_support'), href: '/support', primary: false },
      ],
    };
  };

  const errorInfo = getErrorInfo();

  const getIcon = (iconType: string, color: string) => {
    const colorClasses = {
      red: 'text-red-500',
      orange: 'text-orange-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
    };

    const iconClass = colorClasses[color as keyof typeof colorClasses] || 'text-red-500';

    switch (iconType) {
      case 'block':
        return (
          <svg className={`size-8 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      case 'mail':
        return (
          <svg className={`size-8 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`size-8 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className={`size-8 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={`size-8 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-100/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-red-950/30" />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 animate-pulse rounded-full bg-gradient-to-br from-red-400/15 to-orange-600/15 blur-2xl" />
        <div className="absolute -bottom-40 -left-40 size-80 animate-pulse rounded-full bg-gradient-to-tr from-orange-400/15 to-red-500/15 blur-2xl delay-1000" />
      </div>

      {/* Main Container */}
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Logo size="md" href="/" />
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <Card className="relative overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80 sm:bg-white/70 sm:backdrop-blur-xl">
              {/* Border Glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 via-transparent to-orange-500/20 p-px">
                <div className="size-full rounded-lg bg-white/90 dark:bg-slate-900/90" />
              </div>

              <div className="relative">
                <CardHeader className="space-y-4 pb-6 text-center">
                  <FadeIn>
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      {getIcon(errorInfo.icon, errorInfo.color)}
                    </div>
                  </FadeIn>

                  <FadeIn delay={200}>
                    <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {errorInfo.title}
                    </CardTitle>
                  </FadeIn>

                  <FadeIn delay={300}>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {errorInfo.description}
                    </CardDescription>
                  </FadeIn>
                </CardHeader>

                <CardContent className="space-y-4 pb-8">
                  {/* Error Details (if available) */}
                  {errorDescription && (
                    <FadeIn delay={400}>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>
                            {t('error_details')}
                            :
                          </strong>
                          {' '}
                          {errorDescription}
                        </p>
                      </div>
                    </FadeIn>
                  )}

                  {/* Action Buttons */}
                  <FadeIn delay={500}>
                    <div className="space-y-3">
                      {errorInfo.actions.map(action => (
                        <Button
                          key={action.label}
                          asChild
                          variant={action.primary ? 'default' : 'outline'}
                          size="lg"
                          className={`w-full ${
                            action.primary
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25'
                              : 'border-slate-200 bg-white/50 text-slate-700 transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Link href={action.href}>
                            {action.label}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </FadeIn>

                  {/* Help Text */}
                  <FadeIn delay={600}>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('error_help_text')}
                        {' '}
                        <Link
                          href="/support"
                          className="underline transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {t('contact_support')}
                        </Link>
                      </p>
                    </div>
                  </FadeIn>
                </CardContent>
              </div>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center sm:p-6">
          <FadeIn delay={700}>
            <Link
              href="/"
              className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              ←
              {' '}
              {t('back_home')}
            </Link>
          </FadeIn>
        </footer>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      </div>
    )}
    >
      <AuthErrorContent />
    </Suspense>
  );
}
