/**
 * GuestModeAlert - Tradelia 2026
 * 
 * Alert discreto per utenti guest che avvisa:
 * - Progressi salvati solo localmente
 * - Invito alla registrazione gratuita
 * 
 * Best practice: dismissibile ma riappare ogni sessione
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface GuestModeAlertProps {
  onRegisterClick?: () => void
  className?: string
}

const DISMISS_KEY = 'tradelia_guest_alert_dismissed'

export function GuestModeAlert({ onRegisterClick, className = '' }: GuestModeAlertProps) {
  const t = useTranslations('guestMode')
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to avoid flash

  useEffect(() => {
    // Check if dismissed this session
    const dismissed = sessionStorage.getItem(DISMISS_KEY)
    setIsDismissed(!!dismissed)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true')
    setIsDismissed(true)
  }

  if (isDismissed) return null

  return (
    <div className={`rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
            {t('alertTitle')}
          </h4>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed mb-3">
            {t('alertDescription')}
          </p>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRegisterClick}
              className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 underline underline-offset-2 transition-colors"
            >
              {t('registerFree')}
            </button>
            <button
              onClick={handleDismiss}
              className="text-xs text-amber-600/60 dark:text-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {t('dismiss')}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors rounded"
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
