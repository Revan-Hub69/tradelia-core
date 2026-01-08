'use client';

import { useEffect, useRef, useState } from 'react';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from './LanguageSelector';
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping';
import Logo from './Logo';
import { 
  CloseIcon, 
  ArrowLeftIcon,
  ShieldIcon,
  MailIcon,
  LockIcon,
  UserIcon
} from '@/components/icons/TradeliaIcons';

type AuthMode = 'gateway' | 'login' | 'register' | 'reset-request' | 'reset-sent';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export default function AuthModal() {
  const { t } = useLanguage();
  const { isOpen, closeModal, initialMode } = useDashboardModal();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<AuthMode>('gateway');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '', password: '', confirmPassword: '', fullName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset on open + check if already logged in
  useEffect(() => {
    if (isOpen) {
      // If user is already authenticated, redirect to dashboard
      if (user) {
        closeModal();
        window.location.href = '/dashboard';
        return;
      }
      
      setMode(initialMode === 'login' ? 'login' : 'gateway');
      setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
      setErrors({});
    }
  }, [isOpen, initialMode, user, closeModal]);

  // Focus management
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setTimeout(() => {
        const firstBtn = contentRef.current?.querySelector('button:not([data-close-button])');
        if (firstBtn) (firstBtn as HTMLElement).focus();
      }, 150);
    }
  }, [mode, isOpen]);

  // Keyboard + focus trap + mobile back button
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
        if (focusable?.length) {
          const first = focusable[0] as HTMLElement;
          const last = focusable[focusable.length - 1] as HTMLElement;
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    // Handle mobile back button
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      closeModal();
    };

    // Push a dummy state when modal opens
    window.history.pushState({ modalOpen: true }, '', window.location.href);
    
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    setTimeout(() => firstFocusableRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    
    return () => { 
      document.removeEventListener('keydown', handleKeyDown); 
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen, closeModal]);

  // Validation
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!formData.email) errs.email = t('modal.auth.login.errors.required');
    else if (!validateEmail(formData.email)) errs.email = t('modal.auth.login.errors.invalidFormat');
    if (!formData.password) errs.password = t('modal.auth.login.errors.required');
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const validateRegister = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = t('modal.auth.register.errors.required');
    if (!formData.email) errs.email = t('modal.auth.register.errors.required');
    else if (!validateEmail(formData.email)) errs.email = t('modal.auth.register.errors.invalidFormat');
    if (!formData.password) errs.password = t('modal.auth.register.errors.required');
    else if (formData.password.length < 8) errs.password = t('modal.auth.register.errors.minLength');
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = t('modal.auth.register.errors.mismatch');
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // Handlers
  const handleGuest = async () => {
    console.log('🔄 Guest button clicked');
    closeModal();
    window.location.href = '/dashboard?guest=true';
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
      closeModal();
      window.location.href = '/dashboard';
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
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      closeModal();
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err);
      setErrors({ submit: t(key) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors({ email: t('modal.auth.resetRequest.errors.invalidEmail') });
      return;
    }
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


  // === RENDER FUNCTIONS ===

  // Gateway - Prima schermata
  const renderGateway = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          {t('modal.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('modal.auth.gateway.subtitle')}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Guest */}
        <button 
          onClick={handleGuest} 
          className="w-full p-4 text-left rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
              <ShieldIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm sm:text-base">
                {t('modal.auth.gateway.guestTitle')}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('modal.auth.gateway.guestDescription')}
              </div>
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground uppercase tracking-wide">
              {t('modal.auth.gateway.or')}
            </span>
          </div>
        </div>

        {/* Google */}
        <button 
          onClick={handleGoogle} 
          className="w-full p-4 flex items-center justify-center gap-3 rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-foreground">{t('modal.auth.gateway.google')}</span>
        </button>

        {/* Email */}
        <button 
          onClick={() => setMode('login')} 
          className="w-full p-4 text-left rounded border border-border/50 bg-background hover:border-border hover:bg-muted/30 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
              <MailIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground text-sm sm:text-base">
                {t('modal.auth.gateway.email')}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('modal.auth.gateway.emailDescription')}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        {t('modal.auth.gateway.footer')}
      </p>
    </div>
  );


  // Login Form
  const renderLogin = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          {t('modal.auth.login.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('modal.auth.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-sm font-medium text-foreground">
            {t('modal.auth.login.email')}
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.login.emailPlaceholder')}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
            {t('modal.auth.login.password')}
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="login-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.login.passwordPlaceholder')}
              autoComplete="current-password"
            />
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Error */}
        {errors.submit && (
          <div className="p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          {isSubmitting ? t('modal.auth.login.submitting') : t('modal.auth.login.submit')}
        </button>
      </form>

      {/* Links */}
      <div className="space-y-3 text-center">
        <button
          onClick={() => { setErrors({}); setMode('reset-request'); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          {t('modal.auth.login.forgotPassword')}
        </button>
        <p className="text-xs text-muted-foreground">
          {t('modal.auth.login.noAccount')}{' '}
          <button 
            onClick={() => { setErrors({}); setMode('register'); }} 
            className="text-foreground font-medium hover:text-primary transition-colors duration-150"
          >
            {t('modal.auth.login.register')}
          </button>
        </p>
      </div>
    </div>
  );


  // Register Form
  const renderRegister = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          {t('modal.auth.register.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('modal.auth.register.subtitle')}
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="register-name" className="block text-sm font-medium text-foreground">
            {t('modal.auth.register.name')}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="register-name"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.register.namePlaceholder')}
              autoComplete="name"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="register-email" className="block text-sm font-medium text-foreground">
            {t('modal.auth.register.email')}
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="register-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.register.emailPlaceholder')}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="register-password" className="block text-sm font-medium text-foreground">
            {t('modal.auth.register.password')}
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="register-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.register.passwordPlaceholder')}
              autoComplete="new-password"
            />
          </div>
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="register-confirm" className="block text-sm font-medium text-foreground">
            {t('modal.auth.register.confirmPassword')}
          </label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="register-confirm"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.register.confirmPlaceholder')}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
        </div>

        {/* Error */}
        {errors.submit && (
          <div className="p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          {isSubmitting ? t('modal.auth.register.submitting') : t('modal.auth.register.submit')}
        </button>
      </form>

      {/* Link */}
      <p className="text-xs text-muted-foreground text-center">
        {t('modal.auth.register.hasAccount')}{' '}
        <button 
          onClick={() => { setErrors({}); setMode('login'); }} 
          className="text-foreground font-medium hover:text-primary transition-colors duration-150"
        >
          {t('modal.auth.register.login')}
        </button>
      </p>
    </div>
  );


  // Reset Password Request
  const renderResetRequest = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          {t('modal.auth.resetRequest.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('modal.auth.resetRequest.subtitle')}
        </p>
      </div>

      <form onSubmit={handleResetRequest} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="reset-email" className="block text-sm font-medium text-foreground">
            {t('modal.auth.resetRequest.email')}
          </label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
            <input
              id="reset-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150 placeholder:text-muted-foreground"
              placeholder={t('modal.auth.resetRequest.emailPlaceholder')}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {errors.submit && (
          <div className="p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 shadow-sm hover:shadow-md"
        >
          {isSubmitting ? t('modal.auth.resetRequest.submitting') : t('modal.auth.resetRequest.submit')}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        <button 
          onClick={() => { setErrors({}); setMode('login'); }} 
          className="text-foreground font-medium hover:text-primary transition-colors duration-150"
        >
          {t('modal.auth.resetRequest.backToLogin')}
        </button>
      </p>
    </div>
  );

  // Reset Sent Confirmation
  const renderResetSent = () => (
    <div className="space-y-6 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
        <MailIcon className="w-6 h-6 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          {t('modal.auth.resetSent.title')}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {t('modal.auth.resetSent.description')}
        </p>
      </div>

      <button
        onClick={() => setMode('login')}
        className="h-11 px-6 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 shadow-sm hover:shadow-md"
      >
        {t('modal.auth.resetSent.backToLogin')}
      </button>
    </div>
  );

  // Content router
  const renderContent = () => {
    switch (mode) {
      case 'gateway': return renderGateway();
      case 'login': return renderLogin();
      case 'register': return renderRegister();
      case 'reset-request': return renderResetRequest();
      case 'reset-sent': return renderResetSent();
      default: return null;
    }
  };

  const showBackButton = mode !== 'gateway';


  // === MAIN RENDER ===
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={closeModal}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef} 
        className="relative w-full max-w-md bg-background border border-border/50 rounded-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={handleBack} 
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60"
                aria-label={t('modal.actions.back')}
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
            )}
            <Logo />
          </div>
          <button 
            ref={firstFocusableRef} 
            onClick={closeModal} 
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60" 
            aria-label={t('auth.common.aria.closeModal')}
            data-close-button
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="px-6 py-6 overflow-y-auto flex-1" 
          ref={contentRef} 
          tabIndex={-1}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
