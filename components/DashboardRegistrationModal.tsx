/**
 * Dashboard Registration Modal - Tradelia 2026
 * 
 * Modal semplice per registrazione dalla dashboard
 * Seguendo i principi: Chiarezza > Persuasione, Design minimalista
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { 
  CloseIcon,
  DiamondIcon,
  CheckIcon,
  MailIcon
} from '@/components/icons/TradeliaIcons'

export default function DashboardRegistrationModal() {
  const t = useTranslations('auth')
  const { isOpen, closeModal } = useDashboardModal()
  const { actions } = useDashboardAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [mode, setMode] = useState<'gateway' | 'email' | 'success'>('gateway')

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await actions.signInWithGoogle()
      closeModal()
    } catch (error) {
      console.error('Google sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await actions.signUp(email, password, fullName)
      setMode('success')
    } catch (error) {
      console.error('Email sign up error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border/50">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <DiamondIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Tradelia</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'gateway' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('title')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('subtitle')}
                </p>
              </div>

              <div className="space-y-3">
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors duration-150 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-foreground">
                    {t('continueWithGoogle')}
                  </span>
                </button>

                {/* Email Sign In */}
                <button
                  onClick={() => setMode('email')}
                  className="w-full flex items-center justify-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors duration-150"
                >
                  <MailIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {t('signInWithEmail')}
                  </span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t('educationalWarning')}
                </p>
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {t('createAccount')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('enterCredentials')}
                </p>
              </div>

              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={t('fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-border/50 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-150"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-border/50 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-150"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-border/50 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-150"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-150 disabled:opacity-50 font-medium"
                >
                  {isLoading ? t('signingUp') : t('createAccount')}
                </button>
              </form>

              <button
                onClick={() => setMode('gateway')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                ← {t('backToLogin')}
              </button>
            </div>
          )}

          {mode === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {t('verificationTitle')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('verificationDescription').replace('{email}', email)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-full p-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-150 font-medium"
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