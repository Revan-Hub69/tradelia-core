'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageSelector'
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping'
import { 
  LockIcon, 
  CheckIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check if we have access token from email link and strip it after consuming
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    
    if (!accessToken) {
      setError(t('auth.resetPassword.errors.invalidLink'))
    } else {
      // Strip token from URL after consuming (security)
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError(t('auth.resetPassword.errors.mismatch'))
      return
    }

    if (password.length < 8) {
      setError(t('auth.resetPassword.errors.minLength'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.updateUser({
        password: password
      })

      if (supabaseError) {
        const key = mapAuthErrorToKey(supabaseError)
        setError(t(key))
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
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
                {t('auth.resetPassword.successTitle')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('auth.resetPassword.successSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded border border-green-200 bg-green-50 text-center">
            <CheckIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">
              {t('auth.resetPassword.redirecting')}
            </p>
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
              {t('auth.resetPassword.title')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.resetPassword.subtitle')}
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
            <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
              {t('auth.resetPassword.newPassword')}
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                aria-label={t('auth.common.aria.passwordField')}
                aria-invalid={!!error}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
              {t('auth.resetPassword.confirmPassword')}
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            {loading ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
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
      </div>
    </div>
  )
}
