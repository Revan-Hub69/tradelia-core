/**
 * Dashboard Layout - Tradelia 2026
 * NO SIDEBAR - Solo header + bottom nav mobile
 */

'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { NetworkStatus } from '@/src/shared/ui/NetworkStatus'
import { SkipLink } from '@/src/shared/ui/SkipLink'
import Logo from '@/components/Logo'
import { UserMenu } from './UserMenu'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  HomeIcon,
  BellIcon,
  GraduationCapIcon
} from '@/components/icons/TradeliaIcons'

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const tJourneys = useTranslations('journeys')
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  const isOnHome = pathname === `/${locale}/dashboard` || pathname === `/${locale}/dashboard/`
  const getActiveJourney = (): JourneyId | null => {
    if (pathname.includes('/emergency')) return 'emergency'
    if (pathname.includes('/longterm')) return 'longterm'
    if (pathname.includes('/speculation')) return 'speculation'
    if (pathname.includes('/passive')) return 'passive'
    return null
  }
  const activeJourney = getActiveJourney()

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      {/* Skip Link - Accessibility (REQ 5.4, 5.5) */}
      <SkipLink targetId="main-content" />

      {/* Header - sempre visibile */}
      <header className="h-16 section-frame border-b-0 rounded-none backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="tap-target-icon p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 relative"
              aria-label="Notifiche"
              disabled
              title="Notifiche in fase di implementazione"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            {state.isGuestMode && (
              <button
                onClick={() => openModal('gateway')}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-warning/8 border border-warning/20 rounded-lg cursor-pointer hover:bg-warning/15 hover:border-warning/30 transition-colors focus:outline-none focus:ring-2 focus:ring-warning/50"
                aria-label={locale === 'en' ? 'Register to save your progress' : 'Registrati per salvare i progressi'}
              >
                <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                <span className="text-xs font-medium text-warning">
                  <span className="hidden sm:inline">{tDashboard('guestMode')}</span>
                  <span className="sm:hidden">Guest</span>
                </span>
              </button>
            )}
            <NetworkStatus />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Breadcrumb - sticky sotto header */}
      {!isOnHome && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
          <div className="px-4 sm:px-6 md:px-8 py-2.5 max-w-7xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link 
                href={`/${locale}/dashboard`}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <HomeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {activeJourney && (
                <>
                  <svg className="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <span className="font-medium text-foreground flex items-center gap-1.5" aria-current="page">
                    {(() => {
                      const Icon = JOURNEY_ICONS[activeJourney]
                      return <Icon className="w-4 h-4" />
                    })()}
                    {tJourneys(`${activeJourney}.name`)}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main content - full width */}
      <main 
        id="main-content"
        tabIndex={-1}
        className={`${isOnHome ? 'pt-16' : 'pt-[104px]'} pb-20 md:pb-8 dashboard-main-content flex-1 focus:outline-none`}
      >
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Technical Footer - Desktop */}
      <footer className="hidden md:block border-t border-border/30 bg-muted/20 mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <ShieldIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">SSL Secure</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <ShieldIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Zero Tracking</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <GraduationCapIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Educational Only</span>
              </div>
            </div>

            {/* Technical Info */}
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>{tDashboard('version')} 2026.02</span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tDashboard('uptime')} 99.9%
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="cursor-default" title="Coming soon">
                {tDashboard('privacyPolicy')}
              </span>
              <span className="cursor-default" title="Coming soon">
                {tDashboard('termsOfService')}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 pt-4 border-t border-border/20 text-center">
            <p className="text-xs text-muted-foreground/80">
              {tDashboard('educationalTool')} • {tDashboard('noFinancialAdvice')} • {tDashboard('madeWithLove')}
            </p>
          </div>
        </div>
      </footer>

      {/* Technical Footer - Mobile (sopra bottom nav) */}
      <footer className="md:hidden border-t border-border/30 bg-muted/20 pb-20">
        <div className="px-4 py-4">
          {/* Trust Badges - Compact */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <ShieldIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">SSL</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <ShieldIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Privacy</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <GraduationCapIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Edu</span>
            </div>
          </div>

          {/* Info & Links */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground mb-2">
            <span>v2026.02</span>
            <span>•</span>
            <span className="cursor-default">Privacy</span>
            <span>•</span>
            <span className="cursor-default">Terms</span>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/70 text-center">
            {tDashboard('educationalTool')} • {tDashboard('noFinancialAdvice')}
          </p>
        </div>
      </footer>

      {/* Bottom navigation - solo mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border/50 z-30 safe-area-bottom md:hidden">
        <div className="h-full px-2 flex items-center justify-around">
          <Link
            href={`/${locale}/dashboard`}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg text-[11px] font-medium leading-tight transition-all min-w-[60px] min-h-[44px] ${isOnHome ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
            aria-current={isOnHome ? 'page' : undefined}
          >
            <HomeIcon className={`w-5 h-5 mb-1 ${isOnHome ? 'text-primary' : ''}`} />
            <span>Home</span>
          </Link>
          {JOURNEY_ORDER.map((journeyId) => {
            const Icon = JOURNEY_ICONS[journeyId]
            const isActive = activeJourney === journeyId
            return (
              <Link
                key={journeyId}
                href={`/${locale}/dashboard/${journeyId}`}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg text-[11px] font-medium leading-tight transition-all min-w-[60px] min-h-[44px] ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className="truncate max-w-[50px]">
                  {tJourneys(`${journeyId}.shortName`) || tJourneys(`${journeyId}.name`)}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
