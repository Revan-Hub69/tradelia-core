/**
 * Dashboard Registration Modal - Tradelia 2026 MODERNIZED
 * 
 * Modal premium per registrazione dalla dashboard
 * - Professional design with system colors
 * - Glass morphism and advanced effects
 * - Enhanced animations and accessibility
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
  ShieldIcon,
  UserIcon,
  LockIcon
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
  const [isAnimating, setIsAnimating] = useState(false)

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
    setIsAnimating(true)
    try {
      await actions.signInWithGoogle()
      closeModal()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'accesso con Google'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setIsAnimating(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateRegistration()) return
    
    setIsLoading(true)
    setError(null)
    setIsAnimating(true)
    try {
      await actions.signUp(email, password, fullName)
      setMode('success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la registrazione'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setIsAnimating(false)
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

  const handleModeChange = (newMode: 'gateway' | 'email' | 'success') => {
    setIsAnimating(true)
    setTimeout(() => {
      setMode(newMode)
      setError(null)
      setFieldErrors({})
      setIsAnimating(false)
    }, 200)
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
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-lg backdrop-saturate-150" />
      
      {/* Modern Modal */}
      <div className={`
        relative w-full max-w-md section-frame backdrop-blur-xl backdrop-saturate-150
        shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-400 ease-out
        max-h-[90vh] flex flex-col
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        ${isAnimating ? 'pointer-events-none' : 'pointer-events-auto'}
      `}
      style={{
        background: 'linear-gradient(135deg, hsl(var(--bg-section)) 0%, hsl(var(--bg-section)/0.95) 100%)',
      }}>
        {/* Gradient accent top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="
            absolute top-4 right-4 p-3 rounded-xl transition-all duration-200 ease-out z-10
            bg-muted/30 hover:bg-error/10 active:scale-95
            border border-border/30 hover:border-error/30
            text-muted-foreground hover:text-error
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-2
          "
          aria-label="Chiudi"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 flex-shrink-0">
          <Logo />
        </div>

        {/* Content - scrollabile */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <div className={`
            transition-all duration-300 ease-out
            ${isAnimating ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'}
          `}>
            {mode === 'gateway' && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto border border-primary/20 shadow-sm">
                    <ShieldIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 id="modal-title" className="text-2xl font-bold content-primary">
                    {t('title')}
                  </h2>
                  <p className="text-sm content-secondary">
                    {t('subtitle')}
                  </p>
                </div>

                {error && (
                  <div className="section-frame-error p-4 rounded-xl">
                    <p className="text-sm text-error text-center">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="
                      w-full flex items-center justify-center gap-3 p-4 rounded-xl
                      bg-background hover:bg-muted/30 active:scale-95
                      border border-border/50 hover:border-border
                      transition-all duration-200 ease-out
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                    "
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-semibold content-primary">
                      {t('continueWithGoogle')}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-background content-tertiary uppercase tracking-wide">oppure</span>
                    </div>
                  </div>

                  {/* Email Sign In */}
                  <button
                    onClick={() => handleModeChange('email')}
                    className="
                      w-full flex items-center justify-center gap-3 p-4 rounded-xl
                      bg-muted/30 hover:bg-muted/50 active:scale-95
                      border border-border/50 hover:border-border
                      transition-all duration-200 ease-out
                      shadow-sm hover:shadow-md
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                    "
                  >
                    <MailIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-semibold content-primary">
                      {t('signInWithEmail')}
                    </span>
                  </button>
                </div>

                <p className="text-xs content-tertiary text-center leading-relaxed">
                  {t('educationalWarning')}
                </p>
              </div>
            )}

            {mode === 'email' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold content-primary">
                    {t('createAccount')}
                  </h2>
                  <p className="text-sm content-secondary">
                    {t('enterCredentials')}
                  </p>
                </div>

                {error && (
                  <div className="section-frame-error p-4 rounded-xl">
                    <p className="text-sm text-error text-center">{error}</p>
                  </div>
                )}

                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold content-secondary uppercase tracking-wide mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                      <input
                        id="fullName"
                        type="text"
                        placeholder={t('fullName')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={handleBlurFullName}
                        className={`
                          w-full h-12 pl-10 pr-4 text-sm bg-background border rounded-xl
                          placeholder:text-muted-foreground transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                          ${fieldErrors.fullName ? 'border-error' : 'border-border/50 hover:border-border'}
                        `}
                      />
                    </div>
                    {fieldErrors.fullName && <p className="text-xs text-error mt-1">{fieldErrors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold content-secondary uppercase tracking-wide mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlurEmail}
                        className={`
                          w-full h-12 pl-10 pr-4 text-sm bg-background border rounded-xl
                          placeholder:text-muted-foreground transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                          ${fieldErrors.email ? 'border-error' : 'border-border/50 hover:border-border'}
                        `}
                      />
                    </div>
                    {fieldErrors.email && <p className="text-xs text-error mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-semibold content-secondary uppercase tracking-wide mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                      <input
                        id="password"
                        type="password"
                        placeholder={t('passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handleBlurPassword}
                        className={`
                          w-full h-12 pl-10 pr-4 text-sm bg-background border rounded-xl
                          placeholder:text-muted-foreground transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                          ${fieldErrors.password ? 'border-error' : 'border-border/50 hover:border-border'}
                        `}
                      />
                    </div>
                    {fieldErrors.password && <p className="text-xs text-error mt-1">{fieldErrors.password}</p>}
                    <PasswordStrength password={password} locale={validationLocale} showRequirements={false} />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold content-secondary uppercase tracking-wide mb-2">
                      Conferma Password
                    </label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 pointer-events-none" />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Conferma la password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleBlurConfirmPassword}
                        className={`
                          w-full h-12 pl-10 pr-4 text-sm bg-background border rounded-xl
                          placeholder:text-muted-foreground transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                          ${fieldErrors.confirmPassword ? 'border-error' : 'border-border/50 hover:border-border'}
                        `}
                      />
                    </div>
                    {fieldErrors.confirmPassword && <p className="text-xs text-error mt-1">{fieldErrors.confirmPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                      w-full h-12 px-6 text-base font-semibold rounded-xl
                      bg-gradient-to-r from-primary to-primary/90
                      text-white shadow-lg shadow-primary/20
                      transition-all duration-200 ease-out
                      hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                      active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                    "
                  >
                    {isLoading ? t('signingUp') : t('createAccount')}
                  </button>
                </form>

                <button
                  onClick={() => handleModeChange('gateway')}
                  className="w-full text-sm content-secondary hover:text-foreground transition-colors duration-200 py-2"
                >
                  ← {t('backToLogin')}
                </button>
              </div>
            )}

            {mode === 'success' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/5 rounded-2xl flex items-center justify-center mx-auto border border-success/20 shadow-sm">
                  <CheckIcon className="w-10 h-10 text-success" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold content-primary">
                    {t('verificationTitle')}
                  </h2>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('verificationDescription').replace('{email}', email)}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="
                    w-full h-12 px-6 text-base font-semibold rounded-xl
                    bg-gradient-to-r from-primary to-primary/90
                    text-white shadow-lg shadow-primary/20
                    transition-all duration-200 ease-out
                    hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                    active:scale-[0.98]
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  "
                >
                  {t('close')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}