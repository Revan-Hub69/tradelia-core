/**
 * Dashboard Layout - Tradelia 2026
 * Navigation Contract v1.0
 *
 * LAYOUT UNICO che include:
 * - Desktop (≥768px): Sidebar fissa a sinistra + Header + Content
 * - Mobile (<768px): Header + Content + BottomNav fissa in basso
 * - Focus trap per sidebar mobile (WCAG 2.2 compliant)
 */

'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useSidebarFocusTrap } from '@/src/shared/hooks/useFocusTrap'
import { NetworkStatus } from '@/src/shared/ui/NetworkStatus'
import { TrustBadges, SecurityStatus } from '@/src/shared/ui/TrustBadges'
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
  CloseIcon
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
  const { state } = useDashboardAuth()

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Focus trap for mobile sidebar
  const { containerRef: sidebarRef } = useSidebarFocusTrap(
    isMobileSidebarOpen,
    () => setIsMobileSidebarOpen(false)
  )

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar is open (mobile)
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

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ========== MOBILE SIDEBAR BACKDROP ========== */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* ========== MOBILE SIDEBAR OVERLAY ========== */}
      <aside 
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border z-50
          transform transition-transform duration-300 ease-out md:hidden
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label={t('common.mainNavigation')}
        aria-hidden={!isMobileSidebarOpen}
      >
        {/* Mobile Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border/50">
          <Logo />
          <button
            onClick={closeMobileSidebar}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Chiudi menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label={t('menuLabel')}>
          {/* Home Link */}
          <Link
            href={`/${locale}/dashboard`}
            onClick={closeMobileSidebar}
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
            {t('journeys')}
          </p>
          <ul className="space-y-1">
            {JOURNEY_ORDER.map((journeyId) => {
              const Icon = JOURNEY_ICONS[journeyId]
              const isActive = activeJourney === journeyId
              
              return (
                <li key={journeyId}>
                  <Link
                    href={`/${locale}/dashboard/${journeyId}`}
                    onClick={closeMobileSidebar}
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
        </nav>

        {/* Ultra-Chicche: Trust Badges in Mobile Sidebar Footer */}
        <div className="p-3 border-t border-border/50 flex-shrink-0">
          <div className="trust-badge-no-select">
            <TrustBadges placement="sidebar" variant="compact" showTooltips={true} className="text-xs trust-badge-no-select" />
          </div>
        </div>
      </aside>

      {/* ========== DESKTOP SIDEBAR (≥768px) ========== */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 section-frame border-r-0 rounded-none flex-col z-40">
        {/* Logo - Section divider */}
        <div className="h-16 px-4 flex items-center section-divider flex-shrink-0">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 min-h-0" aria-label={t('menuLabel')}>
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
            {t('journeys')}
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

        </nav>

        {/* Ultra-Chicche: Trust Badges in Desktop Sidebar Footer - Section divider */}
        <div className="p-3 section-divider flex-shrink-0">
          <div className="trust-badge-no-select">
            <TrustBadges placement="sidebar" variant="compact" showTooltips={true} className="text-xs trust-badge-no-select" />
          </div>
        </div>
      </aside>

      {/* ========== HEADER ========== */}
      <header className="h-16 section-frame border-b-0 rounded-none backdrop-blur-sm fixed top-0 left-0 right-0 z-50 md:left-64">
        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Mobile: Hamburger + Logo */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Apri menu"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
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
      <main className="pt-16 min-h-screen md:pl-64 pb-32 md:pb-16">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
        
        {/* ========== TECHNICAL FOOTER ========== */}
        <footer className="mt-auto section-divider section-frame backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
              {/* Security Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold content-primary">{tDashboard('securityPrivacy')}</h3>
                <p className="text-xs content-secondary leading-relaxed">
                  {tDashboard('securityDescription')}
                </p>
              </div>
              
              {/* Technical Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold content-primary">{tDashboard('technicalInfo')}</h3>
                <div className="space-y-1 text-xs content-secondary">
                  <div className="flex items-center justify-between">
                    <span>{tDashboard('version')}:</span>
                    <span className="font-mono">2026.02</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{tDashboard('uptime')}:</span>
                    <span className="text-success">99.9%</span>
                  </div>
                </div>
              </div>
              
              {/* Legal & Support */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold content-primary">{tDashboard('supportLegal')}</h3>
                <div className="space-y-1 text-xs">
                  <a href="/privacy" className="block content-secondary hover:text-foreground transition-colors">
                    {tDashboard('privacyPolicy')}
                  </a>
                  <a href="/terms" className="block content-secondary hover:text-foreground transition-colors">
                    {tDashboard('termsOfService')}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Bottom Bar - Section divider */}
            <div className="section-divider flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs content-tertiary">
                <span>© 2026 Tradelia</span>
                <span className="hidden sm:inline">•</span>
                <span>{tDashboard('educationalTool')}</span>
                <span className="hidden sm:inline">•</span>
                <span>{tDashboard('noFinancialAdvice')}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <SecurityStatus />
                <div className="w-px h-3 bg-border" />
                <span className="text-xs content-tertiary">
                  {tDashboard('madeWithLove')}
                </span>
              </div>
            </div>

            {/* Mobile Trust Badges - Horizontal compact layout - Section divider */}
            <div className="section-divider md:hidden">
              <div className="flex justify-center">
                <TrustBadges placement="footer" variant="compact" showTooltips={true} className="text-xs gap-2" />
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ========== MOBILE BOTTOM NAV (<768px) ========== */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 section-frame border-t-0 rounded-none backdrop-blur-sm md:hidden"
        aria-label={t('common.mainNavigation')}
      >
        <div className="flex items-center justify-around h-20 px-2 safe-area-bottom">
          {/* Home Tab */}
          <Link
            href={`/${locale}/dashboard`}
            className={`
              flex flex-col items-center justify-center flex-1 h-16 px-2 py-2
              transition-colors duration-150 active:scale-95 rounded-lg
              min-w-[44px] min-h-[44px]
              ${isOnHome 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
            aria-current={isOnHome ? 'page' : undefined}
          >
            <div className={`p-2 rounded-lg transition-colors ${isOnHome ? 'bg-primary/10' : ''}`}>
              <HomeIcon className="w-6 h-6" />
            </div>
            <span className={`text-[11px] mt-1 font-medium leading-tight ${isOnHome ? 'text-primary' : ''}`}>
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
                  flex flex-col items-center justify-center flex-1 h-16 px-2 py-2
                  transition-colors duration-150 active:scale-95 rounded-lg
                  min-w-[44px] min-h-[44px]
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[11px] mt-1 font-medium leading-tight text-center ${isActive ? 'text-primary' : ''}`}>
                  {tJourneys(`${journeyId}.name`)}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ========== NETWORK STATUS ========== */}
      <NetworkStatus />
    </div>
  )
}
