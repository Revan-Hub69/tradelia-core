/**
 * Desktop Sidebar - Tradelia 2026
 * Navigation Contract v1.0
 * 
 * Visibilità: hidden md:flex (solo ≥768px)
 * Posizione: fixed top-16 left-0 bottom-0 w-64
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import Logo from '@/components/Logo'
import { 
  UserIcon,
  SettingsIcon,
  ShieldIcon,
  LogOutIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  HomeIcon
} from '@/components/icons/TradeliaIcons'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

export function DesktopSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('navigation')
  const tJourneys = useTranslations('journeys')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  // Current active journey
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
          prefetch={false}
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
            const href = `/${locale}/dashboard/${journeyId}`
            
            return (
              <li key={journeyId}>
                <Link
                  href={href}
                  prefetch={false}
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
        <Link
          href={`/${locale}/dashboard/settings`}
          prefetch={false}
          className={`
            relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-4
            focus:outline-none focus:ring-2 focus:ring-primary
            ${pathname.includes('/settings') 
              ? 'bg-primary/10 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
          `}
        >
          <SettingsIcon className="w-5 h-5 flex-shrink-0" />
          <span>{t('settings')}</span>
        </Link>
      </nav>

      {/* Preferences */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <ThemeToggle 
          variant="full" 
          labels={{
            theme: locale === 'en' ? 'Theme' : 'Tema',
            light: locale === 'en' ? 'Light' : 'Chiaro',
            dark: locale === 'en' ? 'Dark' : 'Scuro',
            system: locale === 'en' ? 'System' : 'Sistema'
          }}
        />
        <LanguageToggle 
          variant="full" 
          currentLocale={locale}
          labelText={locale === 'en' ? 'Language' : 'Lingua'}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => actions.signOut()}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-error"
        >
          <LogOutIcon className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>
    </aside>
  )
}
