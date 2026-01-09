'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/components/LanguageSelector'
import { mapAuthErrorToKey } from '@/lib/auth/error-mapping'
import { 
  MailIcon, 
  CheckIcon,
  AlertTriangleIcon
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function VerifyEmail() {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get tokens from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        // Strip token from URL after consuming (security)
        if (window.location.hash) {
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session with the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) {
            const key = mapAuthErrorToKey(sessionError)
            setError(t(key))
          } else {
            setSuccess(true)
            // Redirect to localized dashboard after 3 seconds
            setTimeout(() => {
              const locale = document.documentElement.lang || 'it'
              router.push(`/${locale}/dashboard`)
            }, 3000)
          }
        } else {
          setError(t('auth.verifyEmail.errors.invalidLink'))
        }
      } catch {
        setError(t('auth.verifyEmail.errors.verifyError'))
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [router, t])

  const handleResendVerification = async () => {
    setResending(true)
    
    try {
      // Get current user email from URL params
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email')
      
      if (email) {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email
        })
        
        if (resendError) {
          const key = mapAuthErrorToKey(resendError)
          setError(t(key))
        } else {
          // Show success without alert (anti-enumeration)
          setError('')
        }
      } else {
        // Generic error, don't reveal email not found
        setError(t('auth.verifyEmail.errors.resendError'))
      }
    } catch {
      setError(t('auth.verifyEmail.errors.resendError'))
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground text-sm">{t('auth.verifyEmail.verifying')}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Logo />
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                {t('auth.verifyEmail.successTitle')}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('auth.verifyEmail.successSubtitle')}
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded border border-green-200 bg-green-50 text-center">
            <CheckIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">
              {t('auth.verifyEmail.redirecting')}
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
              {t('auth.verifyEmail.errorTitle')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('auth.verifyEmail.errorSubtitle')}
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

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full h-11 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {resending ? (
              t('auth.verifyEmail.resending')
            ) : (
              <>
                <MailIcon className="w-4 h-4" />
                {t('auth.verifyEmail.resend')}
              </>
            )}
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
