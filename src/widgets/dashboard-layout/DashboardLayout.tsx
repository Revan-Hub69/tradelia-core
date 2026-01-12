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
import { NetworkStatus } from '@/src/shared/ui/NetworkStatus'
import Logo from '@/components/Logo'
import { UserMenu } from './UserMenu'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  HomeIcon,
  BellIcon
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header - sempre visibile */}
      <header className="h-16 section-frame border-b-0 rounded-none backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 relative"
              aria-label="Notifiche"
              disabled
              title="Notifiche in fase di implementazione"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            {state.isGuestMode && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-warning/8 border border-warning/20 rounded-lg">
                <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                <span className="text-xs font-medium text-warning">
                  <span className="hidden sm:inline">{tDashboard('guestMode')}</span>
                  <span className="sm:hidden">Guest</span>
                </span>
              </div>
            )}
            <NetworkStatus />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content - full width */}
      <main className="pt-16 pb-20 md:pb-8 dashboard-main-content">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

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
