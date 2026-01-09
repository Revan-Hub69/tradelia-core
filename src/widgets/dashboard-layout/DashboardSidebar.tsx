/**
 * Dashboard Sidebar - Tradelia 2026 Enterprise
 * 
 * Sidebar mobile overlay con design enterprise moderno
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import Logo from '@/components/Logo'
import { 
  UserIcon,
  ChartIcon,
  SettingsIcon,
  ShieldIcon,
  BookIcon,
  LogOutIcon,
  DiamondIcon,
  CloseIcon
} from '@/components/icons/TradeliaIcons'

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('navigation')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  const navigationItems = [
    { name: t('overview'), href: `/${locale}/dashboard`, icon: ChartIcon },
    { name: t('portfolio'), href: `/${locale}/dashboard/portfolio`, icon: DiamondIcon },
    { name: t('verify'), href: `/${locale}/dashboard/verify`, icon: ShieldIcon },
    { name: t('education'), href: `/${locale}/dashboard/education`, icon: BookIcon },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: SettingsIcon },
  ]

  // Close on route change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isOpen) onClose()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button 
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Chiudi menu"
      />
      
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="absolute top-0 left-0 h-full w-[300px] bg-background border-r border-border shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-5">
            <Logo />
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Chiudi menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
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
              onClick={() => {
                onClose()
                openModal()
              }}
              className="w-full mt-3 py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('unlockFeatures')}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('menuLabel')}
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Preferences - Using existing components */}
        <div className="p-4 border-t border-border/50 space-y-4">
          <ThemeToggle 
            variant="full" 
            labels={{
              theme: tDashboard('loading') ? 'Tema' : 'Tema', // fallback
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
        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => actions.signOut()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
