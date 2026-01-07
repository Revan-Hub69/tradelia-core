'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/components/LanguageSelector'
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping'
import { safeRedirect } from '@/lib/auth/safe-redirect'
import { 
  MailIcon, 
  LockIcon,
  ArrowRightIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function Login() {
  const router = useRouter()
  const { t } = useLanguage()
  const { signInWithEmail, signInWithGoogle, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError(t('auth.login.errors.required'))
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      await signInWithEmail(formData.email, formData.password)
      router.push(safeRedirect('/dashboard', '/dashboard'))
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err)
      setError(t(key))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err)
      setError(t(key))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              {t('auth.login.title')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.login.subtitle')}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded border border-red-200 bg-red-50" role="alert">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 h-11 border border-border/50 rounded hover:bg-muted/30 transition-all duration-150 disabled:opacity-50 text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('auth.common.continueWithGoogle')}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('auth.common.or')}</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {t('auth.login.email')}
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder={t('auth.login.emailPlaceholder')}
                aria-label={t('auth.common.aria.emailField')}
                aria-invalid={!!error}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              {t('auth.login.password')}
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder={t('auth.login.passwordPlaceholder')}
                aria-label={t('auth.common.aria.passwordField')}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-foreground text-background text-sm font-medium rounded hover:bg-foreground/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              t('auth.login.submitting')
            ) : (
              <>
                {t('auth.login.submit')}
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <a
            href="/auth/forgot-password"
            className="text-xs text-primary hover:text-primary/80 transition-colors duration-150"
          >
            {t('auth.login.forgotPassword')}
          </a>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label={t('auth.common.aria.backToHome')}
          >
            {t('auth.common.backToHome')}
          </button>
        </div>

        <div className="p-3 rounded border border-border/50 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {t('auth.login.noAccount')}
          </p>
        </div>
      </div>
    </div>
  )
}
