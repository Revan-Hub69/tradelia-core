'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageSelector'
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping'
import { 
  MailIcon, 
  ArrowRightIcon,
  CheckIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function ForgotPassword() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError(t('auth.forgotPassword.errors.required'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.forgotPassword.errors.invalid'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (supabaseError) {
        const key = mapAuthErrorToKey(supabaseError)
        setError(t(key))
      } else {
        setSuccess(true)
      }
    } catch (err: unknown) {
      const key = mapAuthErrorToKey(err)
      setError(t(key))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Logo />
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                {t('auth.forgotPassword.successTitle')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('auth.forgotPassword.successSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded border border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-green-800 font-medium">
                  {t('auth.forgotPassword.successTitle')}
                </p>
                <p className="text-xs text-green-700 leading-relaxed">
                  {t('auth.forgotPassword.successDetail')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full h-10 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 border border-border/50 rounded"
            >
              {t('auth.forgotPassword.retry')}
            </button>
            
            <div className="text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label={t('auth.common.aria.backToHome')}
              >
                {t('auth.common.backToHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              {t('auth.forgotPassword.title')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.forgotPassword.subtitle')}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {t('auth.forgotPassword.email')}
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                aria-label={t('auth.common.aria.emailField')}
                aria-invalid={!!error}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-foreground text-background text-sm font-medium rounded hover:bg-foreground/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              t('auth.forgotPassword.submitting')
            ) : (
              <>
                {t('auth.forgotPassword.submit')}
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

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
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>{t('auth.forgotPassword.note')}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
