/**
 * Dashboard Auth Guard - Tradelia 2026
 * 
 * Widget che gestisce gli stati di autenticazione della dashboard:
 * - Loading state
 * - Error state  
 * - Email verification alert
 * - Guest mode indicator
 */

'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { 
  MailIcon, 
  AlertTriangleIcon,
  UserIcon,
  ShieldIcon
} from '@/components/icons/TradeliaIcons'

interface DashboardAuthGuardProps {
  children: ReactNode
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const t = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  // Loading state - Ottimizzato per performance
  if (state.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary mx-auto" />
          <p className="text-xs text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="p-4 rounded border-2 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  {t('authError')}
                </p>
                <p className="text-xs text-red-800">
                  {state.error}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="h-10 px-6 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
          >
            {t('reloadPage')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Email Verification Alert */}
      {state.user && !state.user.email_confirmed_at && !state.isGuestMode && (
        <div className="border-b border-border/50 bg-primary/5">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              <MailIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {t('emailVerification')}
                </p>
              </div>
              <button
                onClick={actions.resendVerification}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors duration-150 whitespace-nowrap"
              >
                {t('resendEmail')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Mode Indicator - Ottimizzato per dark mode */}
      {state.isGuestMode && (
        <div className="border-b border-border/50 bg-warning/8 dark:bg-warning/5 dark:border-warning/20">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-4 h-4 text-warning dark:text-warning/90 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warning dark:text-warning/90">
                  {t('guestModeActive')}
                </p>
              </div>
              <button
                onClick={() => openModal('gateway')}
                className="text-xs font-semibold text-warning dark:text-warning/90 hover:text-warning/80 dark:hover:text-warning/70 transition-colors duration-200 whitespace-nowrap px-3 py-1 rounded-md bg-warning/10 dark:bg-warning/10 hover:bg-warning/20 dark:hover:bg-warning/15 border border-warning/20 dark:border-warning/30"
              >
                {t('registerNowShort')}
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
