'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { checkEmailExistsServer, signInWithEmailAndPassword } from '@/app/actions/auth';
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
import { useAuthRateLimit, useEmailCheckRateLimit } from '@/hooks/useRateLimit';
import { Link, useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';
import { Logo } from '@/templates/Logo';
import { checkSupabaseConfig } from '@/utils/supabase-config-check';

/**
 * Premium Auth Page 2026 - Best Practices Implementation
 *
 * Features:
 * - Mobile-first responsive design
 * - Glassmorphism with spatial depth
 * - Progressive enhancement
 * - Micro-interactions and motion design
 * - Container queries for true responsiveness
 * - Accessibility-first approach
 * - Trust signals and security indicators
 * - Email-first unified flow
 * - Context-aware adaptive UI
 */
const UnifiedAuthPageContent = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Rate limiting hooks
  const authRateLimit = useAuthRateLimit();
  const emailCheckRateLimit = useEmailCheckRateLimit();

  // Auto-reset rate limits when expired
  useEffect(() => {
    const interval = setInterval(() => {
      authRateLimit.resetIfExpired();
      emailCheckRateLimit.resetIfExpired();
    }, 1000);

    return () => clearInterval(interval);
  }, [authRateLimit, emailCheckRateLimit]);

  // Check Supabase configuration in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      checkSupabaseConfig().then((config) => {
        if (!config.connection) {
          setError('Supabase connection failed. Check configuration.');
        }
      });
    }
  }, []);

  // Enhanced schemas with better validation
  const emailSchema = z.object({
    email: z.string()
      .email(t('error_email_invalid'))
      .min(1, t('error_email_required')),
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, t('error_password_required')),
  });

  const signupSchema = z.object({
    email: z.string().email(),
    password: z.string()
      .min(8, t('error_password_length'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('error_password_strength')),
  });

  // Enhanced state management
  type AuthMode = 'email' | 'login' | 'signup' | 'success';
  type EmailForm = z.infer<typeof emailSchema>;
  type LoginForm = z.infer<typeof loginSchema>;
  type SignupForm = z.infer<typeof signupSchema>;

  const [authMode, setAuthMode] = useState<AuthMode>('email');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check for rate limit error from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const resetTimeParam = searchParams.get('resetTime');

    if (errorParam === 'rate_limit' && resetTimeParam) {
      const resetTime = Number.parseInt(resetTimeParam);
      const remainingMs = resetTime - Date.now();

      if (remainingMs > 0) {
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        setError(`${t('error_rate_limit')} ${timeString}`);

        // Auto-clear error when time expires
        const timeout = setTimeout(() => {
          setError(null);
          // Remove error params from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('error');
          newUrl.searchParams.delete('resetTime');
          window.history.replaceState({}, '', newUrl.toString());
        }, remainingMs);

        return () => clearTimeout(timeout);
      }
    }

    return undefined;
  }, [searchParams, t]);

  // Enhanced forms with better UX
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
    mode: 'onBlur', // Real-time validation
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: userEmail, password: '' },
    mode: 'onBlur',
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: userEmail, password: '' },
    mode: 'onBlur',
  });

  // Server-side email checking - More reliable than client-side
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      console.log('📧 Server-side email check for:', email);
      const result = await checkEmailExistsServer(email);
      
      if (result.error) {
        console.error('❌ Email check error:', result.error);
        // On error, assume new user to allow signup attempt
        return false;
      }

      console.log('📧 Email check result:', result.exists ? 'EXISTS' : 'NEW');
      return result.exists;
    } catch (error) {
      console.error('💥 Email check exception:', error);
      // On exception, assume new user
      return false;
    }
  };

  // Enhanced handlers with rate limiting
  const handleEmailSubmit = async (data: EmailForm) => {
    // Check rate limit before proceeding
    const emailCheck = emailCheckRateLimit.checkLimit();
    if (!emailCheck.allowed) {
      setError(`${t('error_rate_limit')} ${emailCheckRateLimit.getTimeUntilReset()}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      emailCheckRateLimit.recordAttempt();
      const userExists = await checkEmailExists(data.email);
      setUserEmail(data.email);

      if (userExists) {
        setAuthMode('login');
        loginForm.setValue('email', data.email);
      } else {
        setAuthMode('signup');
        signupForm.setValue('email', data.email);
      }
    } catch {
      setError(t('error_connection'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (data: LoginForm) => {
    // Check rate limit before proceeding
    const authCheck = authRateLimit.checkLimit();
    if (!authCheck.allowed) {
      setError(`${t('error_rate_limit')} ${authRateLimit.getTimeUntilReset()}`);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('🔐 Server-side login attempt for:', data.email);

    try {
      const result = await signInWithEmailAndPassword({
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        console.error('❌ Login failed:', result.error);
        authRateLimit.recordAttempt();
        setError(result.error || 'Errore durante l\'accesso');
        setLoading(false);
        return;
      }

      console.log('✅ Login successful');
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
      router.refresh();
    } catch (error) {
      console.error('💥 Login exception:', error);
      authRateLimit.recordAttempt();
      setError('Errore del server. Riprova più tardi.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (data: SignupForm) => {
    // Check rate limit before proceeding
    const authCheck = authRateLimit.checkLimit();
    if (!authCheck.allowed) {
      setError(`${t('error_rate_limit')} ${authRateLimit.getTimeUntilReset()}`);
      return;
    }

    setLoading(true);
    setError(null);

    console.log('🔐 Client-side signup attempt for:', data.email);

    try {
      // Use client-side signup with identities check (Tier 1 2026 method)
      const supabase = createClient();
      const { data: signupData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
          data: {
            email_confirm: false, // Soft email confirmation
          },
        },
      });

      if (signUpError) {
        console.error('❌ Signup error:', signUpError);
        authRateLimit.recordAttempt();
        setError(`Errore registrazione: ${signUpError.message}`);
        setLoading(false);
        return;
      }

      // ✅ TIER 1 2026: Check identities array for existing users
      if (signupData.user) {
        if (signupData.user.identities && signupData.user.identities.length === 0) {
          // 🚨 USER ALREADY EXISTS (Security obfuscation detected)
          console.log('🔄 User already exists (detected via empty identities array)');
          setError('📧 Questa email è già registrata! Ti porto alla pagina di accesso.');
          
          setTimeout(() => {
            setAuthMode('login');
            loginForm.setValue('email', data.email);
            setError(null);
          }, 2500);
          
          setLoading(false);
          return;
        } else {
          // ✅ NEW USER CREATED - SOFT EMAIL CONFIRMATION
          console.log('✅ New user created successfully - redirecting to dashboard with email verification notice');
          
          // Redirect to dashboard immediately with email verification notice
          const redirect = searchParams.get('redirect') || '/dashboard';
          const redirectUrl = `${redirect}?emailVerification=pending&email=${encodeURIComponent(data.email)}`;
          
          router.push(redirectUrl);
          router.refresh();
          return;
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('💥 Signup exception:', error);
      authRateLimit.recordAttempt();
      setError('Errore del server. Riprova più tardi.');
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // Check rate limit before proceeding
    const authCheck = authRateLimit.checkLimit();
    if (!authCheck.allowed) {
      setError(`${t('error_rate_limit')} ${authRateLimit.getTimeUntilReset()}`);
      return;
    }

    setIsGoogleLoading(true);
    setError(null);

    const supabase = createClient();

    // Use current origin for redirect (localhost in development)
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Skip email confirmation for OAuth providers
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      authRateLimit.recordAttempt();
      setError(`${t('error_google_auth')}: ${error.message}`);
      setIsGoogleLoading(false);
    }
  };

  const resetToEmail = () => {
    setAuthMode('email');
    setUserEmail('');
    setError(null);
    emailForm.reset();
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-950/30" />

      {/* Optimized Background Elements - Reduced for Performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-600/15 blur-2xl" />
        <div className="absolute -bottom-40 -left-40 size-80 animate-pulse rounded-full bg-gradient-to-tr from-emerald-400/15 to-blue-500/15 blur-2xl delay-1000" />
      </div>

      {/* Main Container - Mobile First */}
      <div className="relative flex min-h-screen flex-col">
        {/* Header - Minimal and Clean */}
        <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <Logo size="md" href="/" />

          {/* Trust Indicators */}
          <div className="hidden items-center gap-3 text-xs text-slate-600 dark:text-slate-400 sm:flex">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-500" />
              <span>{t('trust_secure')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-blue-500" />
              <span>{t('trust_encrypted')}</span>
            </div>
          </div>
        </header>

        {/* Main Content - Centered with Spatial Design */}
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Optimized Glassmorphism Card */}
            <Card className="relative overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80 sm:bg-white/70 sm:backdrop-blur-xl">
              {/* Subtle Border Glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-transparent to-emerald-500/20 p-px">
                <div className="size-full rounded-lg bg-white/90 dark:bg-slate-900/90" />
              </div>

              <div className="relative">
                <CardHeader className="space-y-2 pb-6 text-center">
                  <SlideReveal>
                    <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {authMode === 'email' && t('enter_title')}
                      {authMode === 'login' && t('welcome_back')}
                      {authMode === 'signup' && t('create_account')}
                      {authMode === 'success' && t('check_email_title')}
                    </CardTitle>
                  </SlideReveal>

                  <FadeIn delay={200}>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {authMode === 'email' && t('email_step_description')}
                      {authMode === 'login' && t('login_step_description', { email: userEmail })}
                      {authMode === 'signup' && t('signup_step_description', { email: userEmail })}
                      {authMode === 'success' && t('check_email_description')}
                    </CardDescription>
                  </FadeIn>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  {authMode !== 'success' && (
                    <>
                      {/* Google OAuth - Premium Design */}
                      <FadeIn delay={300}>
                        <Button
                          onClick={handleGoogleAuth}
                          disabled={loading || isGoogleLoading}
                          variant="outline"
                          size="lg"
                          className="group relative w-full overflow-hidden border-slate-200 bg-white/50 text-slate-700 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-blue-500/25 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          <div className="relative flex items-center justify-center gap-3">
                            {isGoogleLoading
                              ? (
                                  <div className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                                )
                              : (
                                  <svg className="size-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                  </svg>
                                )}
                            <span className="font-medium">
                              {isGoogleLoading
                                ? t('loading_google')
                                : t('google_button')}
                            </span>
                          </div>
                        </Button>
                      </FadeIn>

                      {/* Elegant Divider */}
                      <FadeIn delay={400}>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/80 px-4 text-slate-500 backdrop-blur-sm dark:bg-slate-900/80 dark:text-slate-400">
                              {t('or_divider')}
                            </span>
                          </div>
                        </div>
                      </FadeIn>
                    </>
                  )}

                  {/* Email Form - Enhanced UX */}
                  {authMode === 'email' && (
                    <FadeIn delay={500}>
                      <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                          <FormField
                            control={emailForm.control}
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
                                    {t('loading_verify')}
                                  </div>
                                )
                              : (
                                  t('continue_button')
                                )}
                          </Button>
                        </form>
                      </Form>
                    </FadeIn>
                  )}

                  {/* Login Form - Enhanced */}
                  {authMode === 'login' && (
                    <FadeIn delay={500}>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    disabled
                                    className="h-12 border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder={t('password_placeholder')}
                                      autoComplete="current-password"
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
                                    {t('loading_login')}
                                  </div>
                                )
                              : (
                                  t('login_button')
                                )}
                          </Button>

                          {/* Forgot Password Link */}
                          <div className="text-center">
                            <Link
                              href="/forgot-password"
                              className="text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {t('forgot_password_link')}
                            </Link>
                          </div>
                        </form>
                      </Form>
                    </FadeIn>
                  )}

                  {/* Signup Form - Enhanced */}
                  {authMode === 'signup' && (
                    <FadeIn delay={500}>
                      <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                          <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    disabled
                                    className="h-12 border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Password
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

                          <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-blue-700 hover:shadow-xl hover:shadow-emerald-500/25 disabled:opacity-50"
                          >
                            {loading
                              ? (
                                  <div className="flex items-center gap-2">
                                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    {t('loading_signup')}
                                  </div>
                                )
                              : (
                                  t('signup_button')
                                )}
                          </Button>
                        </form>
                      </Form>
                    </FadeIn>
                  )}

                  {/* Success State */}
                  {authMode === 'success' && (
                    <FadeIn delay={500}>
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <svg className="size-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {t('check_email_sent')}
                        </p>
                      </div>
                    </FadeIn>
                  )}

                  {/* Error Message - Enhanced with Actions */}
                  {error && (
                    <FadeIn>
                      <div className="rounded-lg border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                          <svg className="size-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
                            
                            {/* Show helpful actions for "User already registered" */}
                            {error.includes('già registrata') && (
                              <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setAuthMode('login');
                                    loginForm.setValue('email', userEmail);
                                    setError(null);
                                  }}
                                  className="text-xs border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                                >
                                  🔑 Accedi invece
                                </Button>
                                <Link
                                  href="/forgot-password"
                                  className="inline-flex items-center justify-center rounded-md border border-red-300 bg-transparent px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                                >
                                  🔄 Password dimenticata
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  )}

                  {/* Back Button - Enhanced */}
                  {authMode !== 'email' && authMode !== 'success' && (
                    <FadeIn delay={600}>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetToEmail}
                        className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        ←
                        {t('back_to_email')}
                      </Button>
                    </FadeIn>
                  )}
                </CardContent>
              </div>
            </Card>

            {/* Trust Signals - Mobile Optimized */}
            <FadeIn delay={700}>
              <div className="mt-8 text-center">
                <div className="mb-4 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>{t('trust_data_protected')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>{t('trust_no_spam')}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('terms_text')}
                  {' '}
                  <Link href="/terms" className="underline transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                    {t('terms_link')}
                  </Link>
                  {' '}
                  e
                  {' '}
                  <Link href="/privacy" className="underline transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                    {t('privacy_link')}
                  </Link>
                </p>
              </div>
            </FadeIn>
          </div>
        </main>

        {/* Footer - Minimal */}
        <footer className="p-4 text-center sm:p-6">
          <FadeIn delay={800}>
            <Link
              href="/"
              className="text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              ←
              {t('back_home')}
            </Link>
          </FadeIn>
        </footer>
      </div>
    </div>
  );
};

const UnifiedAuthPage = () => {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )}
    >
      <UnifiedAuthPageContent />
    </Suspense>
  );
};

export default UnifiedAuthPage;
