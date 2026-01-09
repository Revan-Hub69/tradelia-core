/**
 * Dashboard Auth Guard - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Loading: skeleton (no spinner fullscreen)
 * - Error: messaggio umano + retry
 * - Email verification alert
 * - Guest mode indicator
 */

'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { SkeletonDashboard, FullPageError } from '@/src/shared/ui'
import { 
  MailIcon, 
  ShieldIcon
} from '@/components/icons/TradeliaIcons'

interface DashboardAuthGuardProps {
  children: ReactNode
}

export function DashboardAuthGuard({ children }: DashboardAuthGuardProps) {
  const t = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  // Loading state - Skeleton invece di spinner (ux-contract)
  if (state.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    )
  }

  // Error state - Messaggio umano + retry (ux-contract)
  if (state.error) {
    return (
      <div className="min-h-screen bg-background">
        <FullPageError
          title={t('authError')}
          message={state.error}
          onRetry={() => window.location.reload()}
        />
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
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors duration-150 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
              >
                {t('resendEmail')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Mode Indicator */}
      {state.isGuestMode && (
        <div className="border-b border-warning/20 bg-warning/5">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-4 h-4 text-warning flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warning">
                  {t('guestModeActive')}
                </p>
              </div>
              <button
                onClick={() => openModal('gateway')}
                className="text-xs font-semibold text-warning hover:text-warning/80 transition-colors duration-150 whitespace-nowrap px-3 py-1.5 rounded-lg bg-warning/10 hover:bg-warning/15 border border-warning/20 focus:outline-none focus:ring-2 focus:ring-warning"
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
