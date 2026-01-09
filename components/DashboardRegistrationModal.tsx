/**
 * Dashboard Registration Modal - Tradelia 2026 Enterprise
 * 
 * Modal premium per registrazione dalla dashboard
 * Design enterprise con glassmorphism e animazioni fluide
 */

'use client'

import { useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { registerSchema, validateForm, validateField, emailSchema, passwordSchema, nameSchema, getMessages, type Locale } from '@/src/shared/lib/validation'
import { PasswordStrength } from '@/src/shared/ui/PasswordStrength'
import Logo from '@/components/Logo'
import { 
  CloseIcon,
  CheckIcon,
  MailIcon,
  ShieldIcon
} from '@/components/icons/TradeliaIcons'

export default function DashboardRegistrationModal() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const { isOpen, closeModal } = useDashboardModal()
  const { actions } = useDashboardAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [mode, setMode] = useState<'gateway' | 'email' | 'success'>('gateway')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validation locale
  const validationLocale: Locale = (locale === 'it' || locale === 'en') ? locale : 'it'

  const validateRegistration = useCallback(() => {
    const schema = registerSchema(validationLocale)
    const result = validateForm(schema, { fullName, email, password, confirmPassword })
    if (!result.success) {
      setFieldErrors(result.errors)
      return false
    }
    setFieldErrors({})
    return true
  }, [fullName, email, password, confirmPassword, validationLocale])

  // On-blur field validation
  const messages = getMessages(validationLocale)

  const handleBlurEmail = useCallback(() => {
    if (!email) return
    const err = validateField(emailSchema(messages), email)
    setFieldErrors(prev => err ? { ...prev, email: err } : (({ email: _, ...rest }) => rest)(prev))
  }, [email, messages])

  const handleBlurPassword = useCallback(() => {
    if (!password) return
    const err = validateField(passwordSchema(messages), password)
    setFieldErrors(prev => err ? { ...prev, password: err } : (({ password: _, ...rest }) => rest)(prev))
  }, [password, messages])

  const handleBlurFullName = useCallback(() => {
    if (!fullName) return
    const err = validateField(nameSchema(messages), fullName)
    setFieldErrors(prev => err ? { ...prev, fullName: err } : (({ fullName: _, ...rest }) => rest)(prev))
  }, [fullName, messages])

  const handleBlurConfirmPassword = useCallback(() => {
    if (!confirmPassword) return
    if (password !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: messages.confirmPassword.mismatch }))
    } else {
      setFieldErrors(prev => (({ confirmPassword: _, ...rest }) => rest)(prev))
    }
  }, [password, confirmPassword, messages])

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await actions.signInWithGoogle()
      closeModal()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'accesso con Google'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegistration()) return
    
    setIsLoading(true)
    setError(null)
    try {
      await actions.signUp(email, password, fullName)
      setMode('success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la registrazione'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setMode('gateway')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setError(null)
    setFieldErrors({})
    closeModal()
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal - scrollabile e compatto */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Gradient accent top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 z-10"
          aria-label="Chiudi"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-4 pb-2 flex-shrink-0">
          <Logo />
        </div>

        {/* Content - scrollabile */}
        <div className="px-4 pb-4 overflow-y-auto flex-1">
          {mode === 'gateway' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mx-auto border border-primary/10">
                  <ShieldIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 id="modal-title" className="text-xl font-bold text-foreground">
                  {t('title')}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('subtitle')}
                </p>
              </div>

              {error && (
                <div className="p-2 alert-error border rounded-lg">
                  <p className="text-xs text-error text-center">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-white border border-border rounded-xl hover:bg-muted transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">
                    {t('continueWithGoogle')}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">oppure</span>
                  </div>
                </div>

                {/* Email Sign In */}
                <button
                  onClick={() => setMode('email')}
                  className="w-full flex items-center justify-center gap-2 p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-150"
                >
                  <MailIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {t('signInWithEmail')}
                  </span>
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                {t('educationalWarning')}
              </p>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  {t('createAccount')}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('enterCredentials')}
                </p>
              </div>

              {error && (
                <div className="p-2 alert-error border rounded-lg">
                  <p className="text-xs text-error text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailSignUp} className="space-y-3">
                <div>
                  <label htmlFor="fullName" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nome
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder={t('fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={handleBlurFullName}
                    className={`w-full mt-1 p-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${fieldErrors.fullName ? 'border-error' : 'border-border/50'}`}
                  />
                  {fieldErrors.fullName && <p className="text-[10px] text-error mt-0.5">{fieldErrors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlurEmail}
                    className={`w-full mt-1 p-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${fieldErrors.email ? 'border-error' : 'border-border/50'}`}
                  />
                  {fieldErrors.email && <p className="text-[10px] text-error mt-0.5">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handleBlurPassword}
                    className={`w-full mt-1 p-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${fieldErrors.password ? 'border-error' : 'border-border/50'}`}
                  />
                  {fieldErrors.password && <p className="text-[10px] text-error mt-0.5">{fieldErrors.password}</p>}
                  <PasswordStrength password={password} locale={validationLocale} showRequirements={false} />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Conferma Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Conferma la password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={handleBlurConfirmPassword}
                    className={`w-full mt-1 p-2.5 border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${fieldErrors.confirmPassword ? 'border-error' : 'border-border/50'}`}
                  />
                  {fieldErrors.confirmPassword && <p className="text-[10px] text-error mt-0.5">{fieldErrors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {isLoading ? t('signingUp') : t('createAccount')}
                </button>
              </form>

              <button
                onClick={() => {
                  setMode('gateway')
                  setError(null)
                  setFieldErrors({})
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 py-1"
              >
                ← {t('backToLogin')}
              </button>
            </div>
          )}

          {mode === 'success' && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center mx-auto border border-green-500/20">
                <CheckIcon className="w-7 h-7 text-success" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {t('verificationTitle')}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('verificationDescription').replace('{email}', email)}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-150 font-medium text-sm"
              >
                {t('close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
