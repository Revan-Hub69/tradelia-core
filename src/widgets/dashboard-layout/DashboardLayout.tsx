/**
 * Dashboard Layout - Tradelia 2026
 * Navigation Contract v1.0
 *
 * LAYOUT UNICO che include:
 * - Desktop (≥768px): Sidebar fissa a sinistra + Header + Content
 * - Mobile (<768px): Header + Content + BottomNav fissa in basso
 */

'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import Logo from '@/components/Logo'
import { UserMenu } from './UserMenu'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'
import {
  UserIcon,
  ShieldIcon,
  LogOutIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  HomeIcon,
  BellIcon,
  SearchIcon
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
  const t = useTranslations('navigation')
  const tJourneys = useTranslations('journeys')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  // Navigation state
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
    <div className="min-h-screen bg-background">
      {/* ========== DESKTOP SIDEBAR (≥768px) ========== */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border flex-col z-40">
        {/* Logo */}
        <div className="h-16 px-4 flex items-center border-b border-border/50">
          <Logo />
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              {state.isGuestMode ? (
                <ShieldIcon className="w-5 h-5 text-white" />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {state.profile?.full_name || tDashboard('guestUser')}
              </p>
              <p className="text-xs text-muted-foreground">
                {state.isGuestMode ? tDashboard('limitedMode') : tDashboard('verifiedAccount')}
              </p>
            </div>
          </div>
          
          {state.isGuestMode && (
            <button
              onClick={() => openModal()}
              className="w-full mt-3 py-2 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t('unlockFeatures')}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label={t('menuLabel')}>
          {/* Home Link */}
          <Link
            href={`/${locale}/dashboard`}
            className={`
              relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-2
              focus:outline-none focus:ring-2 focus:ring-primary
              ${isOnHome 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
            aria-current={isOnHome ? 'page' : undefined}
          >
            {isOnHome && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" aria-hidden="true" />
            )}
            <HomeIcon className={`w-5 h-5 flex-shrink-0 ${isOnHome ? 'text-primary' : ''}`} />
            <span>Home</span>
          </Link>

          <p className="px-3 mb-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Percorsi
          </p>
          <ul className="space-y-1">
            {JOURNEY_ORDER.map((journeyId) => {
              const Icon = JOURNEY_ICONS[journeyId]
              const isActive = activeJourney === journeyId
              
              return (
                <li key={journeyId}>
                  <Link
                    href={`/${locale}/dashboard/${journeyId}`}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      focus:outline-none focus:ring-2 focus:ring-primary
                      ${isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" aria-hidden="true" />
                    )}
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    <span>{tJourneys(`${journeyId}.name`)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Settings Link */}
          {/* Removed - now in header user menu */}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => actions.signOut()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2"
          >
            <LogOutIcon className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* ========== HEADER ========== */}
      <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border/50 fixed top-0 left-0 right-0 z-50 md:left-64">
        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Mobile: Logo */}
          <div className="flex items-center gap-4 md:hidden">
            <Logo />
          </div>
          
          {/* Desktop: empty left space */}
          <div className="hidden md:block" />

          {/* Desktop: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tDashboard('searchPlaceholder')}
                className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-background transition-all duration-150"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {state.isGuestMode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-warning/8 border border-warning/20 rounded-lg">
                <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                <span className="text-xs font-medium text-warning">
                  {tDashboard('guestMode')}
                </span>
              </div>
            )}
            
            <UserMenu />

          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="pt-16 min-h-screen md:pl-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* ========== MOBILE BOTTOM NAV (<768px) ========== */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border md:hidden"
        aria-label="Navigazione principale"
      >
        <div className="flex items-center justify-around h-16 px-1 safe-area-bottom">
          {/* Home Tab */}
          <Link
            href={`/${locale}/dashboard`}
            className={`
              flex flex-col items-center justify-center flex-1 h-full px-1 py-1
              transition-colors duration-150 active:scale-95
              ${isOnHome 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
            aria-current={isOnHome ? 'page' : undefined}
          >
            <div className={`p-1.5 rounded-lg ${isOnHome ? 'bg-primary/10' : ''}`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isOnHome ? 'text-primary' : ''}`}>
              Home
            </span>
          </Link>

          {/* Journey Tabs */}
          {JOURNEY_ORDER.map((journeyId) => {
            const Icon = JOURNEY_ICONS[journeyId]
            const isActive = activeJourney === journeyId
            
            return (
              <Link
                key={journeyId}
                href={`/${locale}/dashboard/${journeyId}`}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full px-1 py-1
                  transition-colors duration-150 active:scale-95
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium truncate ${isActive ? 'text-primary' : ''}`}>
                  {tJourneys(`${journeyId}.name`)}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
