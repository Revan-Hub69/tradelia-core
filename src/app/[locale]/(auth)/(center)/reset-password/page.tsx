'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';
import { useAuthRateLimit } from '@/hooks/useRateLimit';
import { Link, useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';
import { Logo } from '@/templates/Logo';

/**
 * Password Reset Page - 2026 Best Practices
 *
 * Features:
 * - Secure token validation
 * - Strong password requirements
 * - Rate limiting protection
 * - Premium glassmorphism design
 * - Accessibility compliant
 * - Mobile-first responsive
 */
const ResetPasswordContent = () => {
  const t = useTranslations('Auth') as any;
  const router = useRouter();
  const searchParams = useSearchParams();
  const authRateLimit = useAuthRateLimit();

  // Enhanced schemas
  const resetSchema = z.object({
    password: z.string()
      .min(8, t('error_password_length'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, t('error_password_strength_full')),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: t('error_password_mismatch'),
    path: ['confirmPassword'],
  });

  type ResetForm = z.infer<typeof resetSchema>;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setIsValidToken(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      setIsValidToken(!error);
    };

    validateToken();
  }, [searchParams]);

  const handleResetSubmit = async (data: ResetForm) => {
    // Check rate limit
    const rateCheck = authRateLimit.checkLimit();
    if (!rateCheck.allowed) {
      setError(`${t('error_rate_limit')} ${authRateLimit.getTimeUntilReset()}`);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      authRateLimit.recordAttempt();
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);

    // Redirect to dashboard after success
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-950/30" />

        <div className="relative flex min-h-screen flex-col">
          <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
            <Logo size="md" href="/" />
          </header>

          <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg className="size-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                  {t('reset_invalid_title')}
                </CardTitle>
                <CardDescription>
                  {t('reset_invalid_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/auth">{t('back_to_login')}</Link>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-950/30" />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-600/15 blur-2xl" />
        <div className="absolute -bottom-40 -left-40 size-80 animate-pulse rounded-full bg-gradient-to-tr from-emerald-400/15 to-blue-500/15 blur-2xl delay-1000" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Logo size="md" href="/" />

          <div className="hidden items-center gap-3 text-xs text-slate-600 dark:text-slate-400 sm:flex">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-500" />
              <span>{t('trust_secure')}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <Card className="relative overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80 sm:bg-white/70 sm:backdrop-blur-xl">
              {/* Border Glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-transparent to-emerald-500/20 p-px">
                <div className="size-full rounded-lg bg-white/90 dark:bg-slate-900/90" />
              </div>

              <div className="relative">
                <CardHeader className="space-y-2 pb-6 text-center">
                  <SlideReveal>
                    <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {success ? t('reset_success_title') : t('reset_password_title')}
                    </CardTitle>
                  </SlideReveal>

                  <FadeIn delay={200}>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {success ? t('reset_success_description') : t('reset_password_description')}
                    </CardDescription>
                  </FadeIn>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  {success ? (
                    <FadeIn delay={300}>
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <svg className="size-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {t('redirecting_dashboard')}
                        </p>
                      </div>
                    </FadeIn>
                  ) : (
                    <FadeIn delay={300}>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleResetSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {t('new_password_label')}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder={t('new_password_placeholder')}
                                      autoComplete="new-password"
                                      className="h-12 border-slate-200 bg-white/50 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-400"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                    >
                                      {showPassword
                                        ? (
                                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                          )
                                        : (
                                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                          )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />

                                {/* Password Strength Indicator */}
                                <PasswordStrength
                                  password={field.value || ''}
                                  className="mt-3"
                                />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {t('confirm_password_label')}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showConfirmPassword ? 'text' : 'password'}
                                      placeholder={t('confirm_password_placeholder')}
                                      autoComplete="new-password"
                                      className="h-12 border-slate-200 bg-white/50 pr-12 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-400"
                                      {...field}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                    >
                                      {showConfirmPassword
                                        ? (
                                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                          )
                                        : (
                                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                          )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50"
                          >
                            {loading
                              ? (
                                  <div className="flex items-center gap-2">
                                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    {t('loading_reset')}
                                  </div>
                                )
                              : (
                                  t('reset_password_button')
                                )}
                          </Button>
                        </form>
                      </Form>
                    </FadeIn>
                  )}

                  {/* Error Message */}
                  {error && (
                    <FadeIn>
                      <div className="rounded-lg border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-center gap-3">
                          <svg className="size-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Back to Login */}
                  {!success && (
                    <FadeIn delay={400}>
                      <Button asChild variant="ghost" className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                        <Link href="/auth">
                          ←
                          {t('back_to_login')}
                        </Link>
                      </Button>
                    </FadeIn>
                  )}
                </CardContent>
              </div>
            </Card>

            {/* Security Info */}
            <FadeIn delay={500}>
              <div className="mt-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{t('trust_password_encrypted')}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )}
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
