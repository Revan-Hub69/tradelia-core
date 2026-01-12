'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from './LanguageSelector';
import { SafeButton } from '@/src/shared/ui/SafeButton';
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping';
import { loginSchema, registerSchema, resetRequestSchema, validateForm, validateField, emailSchema, passwordSchema, nicknameSchema, countrySchema, getMessages } from '@/src/shared/lib/validation';
import { PasswordStrength } from '@/src/shared/ui/PasswordStrength';
import { getCountriesSortedByLocale } from '@/lib/countries';
import Logo from './Logo';
import { 
  CloseIcon, 
  ArrowLeftIcon,
  ShieldIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  GlobeIcon,
  SearchIcon
} from '@/components/icons/TradeliaIcons';

type AuthMode = 'gateway' | 'login' | 'register' | 'reset-request' | 'reset-sent';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  country: string;
}

// Searchable Country Select Component
interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  onBlur: () => void;
  locale: 'en' | 'it';
  error: string | undefined;
  label: string;
  placeholder: string;
}

function CountrySelect({ value, onChange, onBlur, locale, error, label, placeholder }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const countries = useMemo(() => getCountriesSortedByLocale(locale), [locale]);
  
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase();
    return countries.filter(c => {
      const name = locale === 'it' ? c.nameIt : c.name;
      return name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [countries, search, locale]);
  
  const selectedCountry = countries.find(c => c.code === value);
  const displayValue = selectedCountry 
    ? (locale === 'it' ? selectedCountry.nameIt : selectedCountry.name)
    : '';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onBlur();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none z-10" />
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
          className={`w-full h-11 pl-10 pr-10 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 text-left ${!value ? 'text-muted-foreground' : 'text-foreground'} ${error ? 'border-error' : 'border-border'}`}
        >
          {displayValue || placeholder}
        </button>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-border/50">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={locale === 'it' ? 'Cerca paese...' : 'Search country...'}
                  className="w-full h-9 pl-8 pr-3 text-sm bg-muted/30 border-0 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  {locale === 'it' ? 'Nessun paese trovato' : 'No country found'}
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors flex items-center gap-2 ${value === country.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                  >
                    <span className="text-xs text-muted-foreground w-6">{country.code}</span>
                    <span>{locale === 'it' ? country.nameIt : country.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error" role="alert">{error}</p>}
    </div>
  );
}

export default function AuthModal() {
  const { t, locale } = useLanguage();
  const { isOpen, closeModal, initialMode } = useDashboardModal();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<AuthMode>('gateway');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '', password: '', confirmPassword: '', nickname: '', country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationLocale = (locale === 'it' || locale === 'en') ? locale : 'it';
  const messages = getMessages(validationLocale);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      if (user) {
        router.replace(`/${locale}/dashboard`);
        closeModal();
        return;
      }
      setMode(initialMode === 'login' ? 'login' : 'gateway');
      setFormData({ email: '', password: '', confirmPassword: '', nickname: '', country: '' });
      setErrors({});
    }
  }, [isOpen, initialMode, user, closeModal, router, locale]);

  // Focus management
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setTimeout(() => {
        const firstBtn = contentRef.current?.querySelector('button:not([data-close-button])');
        if (firstBtn) (firstBtn as HTMLElement).focus();
      }, 150);
    }
  }, [mode, isOpen]);

  // Keyboard + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { 
      document.removeEventListener('keydown', handleKeyDown); 
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen, closeModal]);

  // Validation
  const validateLogin = useCallback(() => {
    const schema = loginSchema(validationLocale);
    const result = validateForm(schema, { email: formData.email, password: formData.password });
    if (!result.success) { setErrors(result.errors); return false; }
    setErrors({});
    return true;
  }, [formData.email, formData.password, validationLocale]);

  const validateRegister = useCallback(() => {
    const schema = registerSchema(validationLocale);
    const result = validateForm(schema, {
      nickname: formData.nickname,
      country: formData.country,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });
    if (!result.success) { setErrors(result.errors); return false; }
    setErrors({});
    return true;
  }, [formData, validationLocale]);

  const validateResetEmail = useCallback(() => {
    const schema = resetRequestSchema(validationLocale);
    const result = validateForm(schema, { email: formData.email });
    if (!result.success) { setErrors(result.errors); return false; }
    setErrors({});
    return true;
  }, [formData.email, validationLocale]);

  // Blur handlers
  const handleBlurEmail = useCallback(() => {
    if (!formData.email) return;
    const error = validateField(emailSchema(messages), formData.email);
    setErrors(prev => error ? { ...prev, email: error } : (({ email: _, ...rest }) => rest)(prev));
  }, [formData.email, messages]);

  const handleBlurPassword = useCallback(() => {
    if (!formData.password) return;
    const error = validateField(passwordSchema(messages), formData.password);
    setErrors(prev => error ? { ...prev, password: error } : (({ password: _, ...rest }) => rest)(prev));
  }, [formData.password, messages]);

  const handleBlurNickname = useCallback(() => {
    if (!formData.nickname) return;
    const error = validateField(nicknameSchema(messages), formData.nickname);
    setErrors(prev => error ? { ...prev, nickname: error } : (({ nickname: _, ...rest }) => rest)(prev));
  }, [formData.nickname, messages]);

  const handleBlurCountry = useCallback(() => {
    if (!formData.country) return;
    const error = validateField(countrySchema(messages), formData.country);
    setErrors(prev => error ? { ...prev, country: error } : (({ country: _, ...rest }) => rest)(prev));
  }, [formData.country, messages]);

  const handleBlurConfirmPassword = useCallback(() => {
    if (!formData.confirmPassword) return;
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: messages.confirmPassword.mismatch }));
    } else {
      setErrors(prev => (({ confirmPassword: _, ...rest }) => rest)(prev));
    }
  }, [formData.password, formData.confirmPassword, messages]);

  // Handlers
  const handleGuest = () => {
    router.push(`/${locale}/dashboard?guest=true`);
    closeModal();
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err);
      setErrors({ submit: t(key) });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsSubmitting(true);
    try {
      await signInWithEmail(formData.email, formData.password);
      router.push(`/${locale}/dashboard`);
      closeModal();
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err);
      setErrors({ submit: t(key) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setIsSubmitting(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.nickname, formData.country);
      router.push(`/${locale}/dashboard`);
      closeModal();
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err);
      setErrors({ submit: t(key) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateResetEmail()) return;
    setIsSubmitting(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      setMode('reset-sent');
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err);
      setErrors({ submit: t(key) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (mode === 'reset-request' || mode === 'reset-sent') setMode('login');
    else if (mode === 'login' || mode === 'register') setMode('gateway');
    else closeModal();
  };

  if (!isOpen) return null;

  const showBackButton = mode !== 'gateway';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={closeModal} onKeyDown={(e) => e.key === 'Enter' && closeModal()} role="button" tabIndex={0} aria-label="Close modal" />
      <div ref={modalRef} className="relative w-full max-w-md bg-background border border-border/50 rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded transition-colors">
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
            )}
            <Logo />
          </div>
          <button ref={firstFocusableRef} onClick={closeModal} className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded transition-colors" data-close-button>
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto flex-1" ref={contentRef}>

          {/* GATEWAY */}
          {mode === 'gateway' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {locale === 'it' ? 'Accedi o Registrati' : 'Sign In or Register'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === 'it' ? 'Scegli come vuoi continuare' : 'Choose how to continue'}
                </p>
              </div>

              <div className="space-y-3">
                {/* Guest */}
                <button onClick={handleGuest} className="w-full p-4 text-left rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <ShieldIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm sm:text-base">
                        {locale === 'it' ? 'Continua come ospite' : 'Continue as guest'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {locale === 'it' ? 'Accesso rapido. Dati solo su questo dispositivo.' : 'Quick access. Data only on this device.'}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-xs text-muted-foreground uppercase">{locale === 'it' ? 'oppure' : 'or'}</span>
                  </div>
                </div>

                {/* Google */}
                <button onClick={handleGoogle} className="w-full p-4 flex items-center justify-center gap-3 rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">{locale === 'it' ? 'Continua con Google' : 'Continue with Google'}</span>
                </button>

                {/* Email - Login */}
                <button onClick={() => setMode('login')} className="w-full p-4 text-left rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <MailIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm sm:text-base">
                        {locale === 'it' ? 'Accedi con email' : 'Sign in with email'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {locale === 'it' ? 'Hai già un account? Accedi qui.' : 'Already have an account? Sign in here.'}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Email - Register */}
                <button onClick={() => setMode('register')} className="w-full p-4 text-left rounded border border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-primary text-sm sm:text-base">
                        {locale === 'it' ? 'Crea un account' : 'Create an account'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {locale === 'it' ? 'Nuovo utente? Registrati gratis.' : 'New user? Register for free.'}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {locale === 'it' ? 'Strumento educativo. Non forniamo consulenza finanziaria.' : 'Educational tool. We do not provide financial advice.'}
              </p>
            </div>
          )}

          {/* LOGIN */}
          {mode === 'login' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{locale === 'it' ? 'Bentornato' : 'Welcome back'}</h3>
                <p className="text-sm text-muted-foreground">{locale === 'it' ? 'Accedi al tuo account' : 'Sign in to your account'}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Email' : 'Email'}</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="login-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={handleBlurEmail} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-error' : 'border-border'}`} placeholder="nome@esempio.com" autoComplete="email" />
                  </div>
                  {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Password' : 'Password'}</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="login-password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onBlur={handleBlurPassword} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-error' : 'border-border'}`} placeholder="••••••••" autoComplete="current-password" />
                  </div>
                  {errors.password && <p className="text-xs text-error">{errors.password}</p>}
                </div>

                {errors.submit && <div className="p-3 rounded border border-error/20 bg-error/5 text-sm text-error">{errors.submit}</div>}

                <SafeButton variant="safe" type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50">
                  {isSubmitting ? (locale === 'it' ? 'Accesso...' : 'Signing in...') : (locale === 'it' ? 'Accedi' : 'Sign in')}
                </SafeButton>
              </form>

              <div className="space-y-3 text-center">
                <button onClick={() => { setErrors({}); setMode('reset-request'); }} className="text-xs text-muted-foreground hover:text-foreground">
                  {locale === 'it' ? 'Password dimenticata?' : 'Forgot password?'}
                </button>
                <p className="text-xs text-muted-foreground">
                  {locale === 'it' ? 'Non hai un account?' : "Don't have an account?"}{' '}
                  <button onClick={() => { setErrors({}); setMode('register'); }} className="text-primary font-medium hover:underline">
                    {locale === 'it' ? 'Registrati' : 'Register'}
                  </button>
                </p>
              </div>
            </div>
          )}


          {/* REGISTER */}
          {mode === 'register' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{locale === 'it' ? 'Crea il tuo account' : 'Create your account'}</h3>
                <p className="text-sm text-muted-foreground">{locale === 'it' ? 'Registrati per accedere a tutte le funzionalità' : 'Register to access all features'}</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nickname */}
                <div className="space-y-2">
                  <label htmlFor="register-nickname" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Nickname' : 'Nickname'}</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="register-nickname" type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} onBlur={handleBlurNickname} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.nickname ? 'border-error' : 'border-border'}`} placeholder={locale === 'it' ? 'Il tuo nickname' : 'Your nickname'} autoComplete="username" />
                  </div>
                  <p className="text-xs text-muted-foreground">{locale === 'it' ? '3-20 caratteri, solo lettere, numeri e _' : '3-20 characters, letters, numbers and _ only'}</p>
                  {errors.nickname && <p className="text-xs text-error">{errors.nickname}</p>}
                </div>

                {/* Country */}
                <CountrySelect
                  value={formData.country}
                  onChange={(code) => setFormData({ ...formData, country: code })}
                  onBlur={handleBlurCountry}
                  locale={validationLocale}
                  error={errors.country}
                  label={locale === 'it' ? 'Paese di residenza' : 'Country of residence'}
                  placeholder={locale === 'it' ? 'Seleziona il tuo paese' : 'Select your country'}
                />

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="register-email" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Email' : 'Email'}</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="register-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={handleBlurEmail} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-error' : 'border-border'}`} placeholder="nome@esempio.com" autoComplete="email" />
                  </div>
                  {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="register-password" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Password' : 'Password'}</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="register-password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onBlur={handleBlurPassword} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-error' : 'border-border'}`} placeholder={locale === 'it' ? 'Scegli una password sicura' : 'Choose a secure password'} autoComplete="new-password" />
                  </div>
                  {errors.password && <p className="text-xs text-error">{errors.password}</p>}
                  <PasswordStrength password={formData.password} locale={validationLocale} showRequirements={true} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="register-confirm" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Conferma password' : 'Confirm password'}</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="register-confirm" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} onBlur={handleBlurConfirmPassword} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-error' : 'border-border'}`} placeholder={locale === 'it' ? 'Ripeti la password' : 'Repeat password'} autoComplete="new-password" />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword}</p>}
                </div>

                {errors.submit && <div className="p-3 rounded border border-error/20 bg-error/5 text-sm text-error">{errors.submit}</div>}

                <SafeButton variant="safe" type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50">
                  {isSubmitting ? (locale === 'it' ? 'Creazione...' : 'Creating...') : (locale === 'it' ? 'Crea account' : 'Create account')}
                </SafeButton>
              </form>

              <p className="text-xs text-muted-foreground text-center">
                {locale === 'it' ? 'Hai già un account?' : 'Already have an account?'}{' '}
                <button onClick={() => { setErrors({}); setMode('login'); }} className="text-primary font-medium hover:underline">
                  {locale === 'it' ? 'Accedi' : 'Sign in'}
                </button>
              </p>
            </div>
          )}

          {/* RESET REQUEST */}
          {mode === 'reset-request' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{locale === 'it' ? 'Recupera password' : 'Reset password'}</h3>
                <p className="text-sm text-muted-foreground">{locale === 'it' ? 'Inserisci la tua email per ricevere il link di reset' : 'Enter your email to receive reset link'}</p>
              </div>

              <form onSubmit={handleResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-foreground">{locale === 'it' ? 'Email' : 'Email'}</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                    <input id="reset-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={handleBlurEmail} className={`w-full h-11 pl-10 pr-4 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-error' : 'border-border'}`} placeholder="nome@esempio.com" autoComplete="email" />
                  </div>
                  {errors.email && <p className="text-xs text-error">{errors.email}</p>}
                </div>

                {errors.submit && <div className="p-3 rounded border border-error/20 bg-error/5 text-sm text-error">{errors.submit}</div>}

                <SafeButton variant="safe" type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50">
                  {isSubmitting ? (locale === 'it' ? 'Invio...' : 'Sending...') : (locale === 'it' ? 'Invia link' : 'Send link')}
                </SafeButton>
              </form>

              <p className="text-xs text-muted-foreground text-center">
                <button onClick={() => { setErrors({}); setMode('login'); }} className="text-primary font-medium hover:underline">
                  {locale === 'it' ? 'Torna al login' : 'Back to login'}
                </button>
              </p>
            </div>
          )}

          {/* RESET SENT */}
          {mode === 'reset-sent' && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <MailIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{locale === 'it' ? 'Controlla la tua email' : 'Check your email'}</h3>
                <p className="text-sm text-muted-foreground">{locale === 'it' ? 'Abbiamo inviato le istruzioni per reimpostare la password.' : 'We sent instructions to reset your password.'}</p>
              </div>
              <button onClick={() => setMode('login')} className="h-11 px-6 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90">
                {locale === 'it' ? 'Torna al login' : 'Back to login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
