/**
 * Dashboard Layout - Tradelia 2026
 * Simplified version to fix build issues
 */

'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useFocusTrap } from '@/src/shared/hooks/useFocusTrap'
import { useSmartNavigation } from '@/src/shared/hooks/useSmartNavigation'
import { NetworkStatus } from '@/src/shared/ui/NetworkStatus'
import { TrustBadges } from '@/src/shared/ui/TrustBadges'
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
  SearchIcon,
  MenuIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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

interface SidebarNavigationProps {
  isOnHome: boolean
  activeJourney: JourneyId | null
  locale: string
  t: (key: string) => string
  tJourneys: (key: string) => string
  collapsed?: boolean
  onNavigate?: () => void
}

function SidebarNavigation({ 
  isOnHome, 
  activeJourney, 
  locale, 
  t, 
  tJourneys, 
  collapsed = false,
  onNavigate 
}: SidebarNavigationProps) {
  const handleClick = onNavigate ? () => onNavigate() : undefined

  return (
    <div className="space-y-2">
      <Link
        href={`/${locale}/dashboard`}
        {...(handleClick && { onClick: handleClick })}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isOnHome 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50'
        }`}
        aria-current={isOnHome ? 'page' : undefined}
        title={collapsed ? 'Home' : undefined}
      >
        <HomeIcon className={`w-5 h-5 flex-shrink-0 ${isOnHome ? 'text-primary' : ''}`} />
        {!collapsed && <span>Home</span>}
      </Link>

      <div className={`space-y-1 ${!collapsed ? 'pt-2' : ''}`}>
        {!collapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('journeys')}
          </div>
        )}
        {JOURNEY_ORDER.map((journeyId) => {
          const Icon = JOURNEY_ICONS[journeyId]
          const isActive = activeJourney === journeyId
          const journeyName = tJourneys(`${journeyId}.name`)
          
          return (
            <Link
              key={journeyId}
              href={`/${locale}/dashboard/${journeyId}`}
              {...(handleClick && { onClick: handleClick })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50'
              }`}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? journeyName : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!collapsed && <span>{journeyName}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('navigation')
  const tJourneys = useTranslations('journeys')
  const tDashboard = useTranslations('dashboard')
  const { state } = useDashboardAuth()

  const {
    showBottomNav,
    showDesktopSidebar,
    sidebarCollapsed,
    canCollapseSidebar,
    isMobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleSidebarCollapse,
    isMobile
  } = useSmartNavigation()

  const { containerRef: sidebarRef } = useFocusTrap({
    isActive: isMobileSidebarOpen,
    onEscape: closeMobileSidebar
  })

  useEffect(() => {
    if (isMobile) {
      closeMobileSidebar()
    }
  }, [pathname, isMobile, closeMobileSidebar])

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileSidebarOpen])

  const isOnHome = pathname === `/${locale}/dashboard` || pathname === `/${locale}/dashboard/`
  const getActiveJourney = (): JourneyId | null => {
    if (pathname.includes('/emergency')) return 'emergency'
    if (pathname.includes('/longterm')) return 'longterm'
    if (pathname.includes('/speculation')) return 'speculation'
    if (pathname.includes('/passive')) return 'passive'
    return null
  }
  const activeJourney = getActiveJourney()

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64'
  const contentOffset = sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'
  const headerOffset = sidebarCollapsed ? 'md:left-16' : 'md:left-64'

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {isMobile && (
        <aside 
          ref={sidebarRef}
          className={`fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-background border-r border-border z-[60] transform transition-transform duration-300 ease-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role="navigation"
          aria-label={t('common.mainNavigation')}
          aria-hidden={!isMobileSidebarOpen}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-border/50 bg-background">
            <Logo />
            <button
              onClick={closeMobileSidebar}
              className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border/30"
              aria-label="Chiudi menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNavigation 
              isOnHome={isOnHome}
              activeJourney={activeJourney}
              locale={locale}
              t={t}
              tJourneys={tJourneys}
              onNavigate={closeMobileSidebar}
              collapsed={false}
            />
          </div>
          <div className="p-3 border-t border-border/50 flex-shrink-0">
            <div className="trust-badge-no-select">
              <TrustBadges placement="sidebar" variant="compact" showTooltips={true} className="text-xs trust-badge-no-select" />
            </div>
          </div>
        </aside>
      )}

      {showDesktopSidebar && (
        <aside className={`hidden md:flex fixed top-0 left-0 bottom-0 ${sidebarWidth} section-frame border-r-0 rounded-none flex-col z-40 transition-all duration-300 ease-out`}>
          <div className="h-16 px-4 flex items-center justify-between section-divider flex-shrink-0">
            {!sidebarCollapsed && <Logo />}
            {sidebarCollapsed && (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Logo />
                </div>
              </div>
            )}
            {canCollapseSidebar && (
              <button
                onClick={toggleSidebarCollapse}
                className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border bg-muted/30"
                aria-label={sidebarCollapsed ? "Espandi sidebar" : "Riduci sidebar"}
                title={sidebarCollapsed ? "Espandi sidebar" : "Riduci sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRightIcon className="w-5 h-5" />
                ) : (
                  <ChevronLeftIcon className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto p-4 min-h-0" aria-label={t('menuLabel')}>
            <SidebarNavigation 
              isOnHome={isOnHome}
              activeJourney={activeJourney}
              locale={locale}
              t={t}
              tJourneys={tJourneys}
              collapsed={sidebarCollapsed}
            />
          </nav>
          {!sidebarCollapsed && (
            <div className="p-3 section-divider flex-shrink-0">
              <div className="trust-badge-no-select">
                <TrustBadges placement="sidebar" variant="compact" showTooltips={true} className="text-xs trust-badge-no-select" />
              </div>
            </div>
          )}
        </aside>
      )}

      <header className={`h-16 section-frame border-b-0 rounded-none backdrop-blur-sm fixed top-0 left-0 right-0 z-50 ${headerOffset} transition-all duration-300 ease-out`}>
        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={openMobileSidebar}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Apri menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <Logo />
          </div>
          <div className="hidden md:block" />
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tDashboard('searchPlaceholder')}
                className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-background transition-all duration-150"
                disabled
                title="Ricerca in fase di implementazione"
              />
            </div>
          </div>
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

      <main className={`pt-16 ${contentOffset} transition-all duration-300 ease-out ${showBottomNav ? 'pb-20' : 'pb-16'} dashboard-main-content`}>
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {showBottomNav && (
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
      )}
    </div>
  )
}
