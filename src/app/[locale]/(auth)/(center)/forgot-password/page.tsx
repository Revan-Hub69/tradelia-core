'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
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
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';
import { useEmailCheckRateLimit } from '@/hooks/useRateLimit';
import { Link } from '@/lib/i18nNavigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/templates/Logo';

/**
 * Forgot Password Page - 2026 Best Practices
 *
 * Features:
 * - Secure password reset flow
 * - Rate limiting protection
 * - Premium glassmorphism design
 * - Clear user feedback
 * - Mobile-first responsive
 */
const ForgotPasswordPage = () => {
  const t = useTranslations('Auth') as any;
  const emailCheckRateLimit = useEmailCheckRateLimit();

  const emailSchema = z.object({
    email: z.string()
      .email(t('error_email_invalid'))
      .min(1, t('error_email_required')),
  });

  type EmailForm = z.infer<typeof emailSchema>;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const handleForgotSubmit = async (data: EmailForm) => {
    // Check rate limit
    const rateCheck = emailCheckRateLimit.checkLimit();
    if (!rateCheck.allowed) {
      setError(`${t('error_rate_limit')} ${emailCheckRateLimit.getTimeUntilReset()}`);
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      emailCheckRateLimit.recordAttempt();
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setEmail(data.email);
    setSuccess(true);
    setLoading(false);
  };

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
                      {success ? t('forgot_success_title') : t('forgot_password_title')}
                    </CardTitle>
                  </SlideReveal>

                  <FadeIn delay={200}>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {success
                        ? t('forgot_success_description', { email })
                        : t('forgot_password_description')}
                    </CardDescription>
                  </FadeIn>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  {success
                    ? (
                        <FadeIn delay={300}>
                          <div className="text-center">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                              <svg className="size-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                              {t('forgot_check_email')}
                            </p>
                          </div>
                        </FadeIn>
                      )
                    : (
                        <FadeIn delay={300}>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleForgotSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                      {t('email_label')}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        autoComplete="email"
                                        className="h-12 border-slate-200 bg-white/50 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-400"
                                        {...field}
                                      />
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
                                        {t('loading_reset_send')}
                                      </div>
                                    )
                                  : (
                                      t('send_reset_button')
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
                  <FadeIn delay={400}>
                    <Button asChild variant="ghost" className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                      <Link href="/auth">
                        ←
                        {t('back_to_login')}
                      </Link>
                    </Button>
                  </FadeIn>
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
                    <span>{t('trust_secure_reset')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('reset_security_note')}
                </p>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
