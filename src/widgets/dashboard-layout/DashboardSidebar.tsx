/**
 * Dashboard Sidebar - Tradelia 2026 Enterprise
 * 
 * Sidebar mobile overlay seguendo sidebar-contract.md:
 * - Hybrid: overlay su mobile, persistent su desktop (futuro)
 * - Focus trap attivo
 * - ESC / click fuori / route change chiude
 * - Animazione slide-in 200ms
 * - Header/Footer sticky, nav scrolla
 * - Active state con accent stripe
 * - Accessibilità WCAG AAA
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const isFirstRender = useRef(true)
  const previousPathname = useRef(pathname)

  const navigationItems = [
    { name: t('overview'), href: `/${locale}/dashboard`, icon: ChartIcon },
    { name: t('portfolio'), href: `/${locale}/dashboard/portfolio`, icon: DiamondIcon },
    { name: t('verify'), href: `/${locale}/dashboard/verify`, icon: ShieldIcon },
    { name: t('education'), href: `/${locale}/dashboard/education`, icon: BookIcon },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: SettingsIcon },
  ]

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab' && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [])

  // Focus management when opening
  useEffect(() => {
    if (isOpen) {
      // Focus close button when sidebar opens
      setTimeout(() => closeButtonRef.current?.focus(), 50)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  // Close on route change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      previousPathname.current = pathname
      return
    }
    
    if (pathname !== previousPathname.current && isOpen) {
      onClose()
    }
    previousPathname.current = pathname
  }, [pathname, isOpen, onClose])

  // Don't render if closed (after animation)
  if (!isOpen) return null

  const handleLogout = () => {
    onClose()
    actions.signOut()
  }

  const handleRegister = () => {
    onClose()
    openModal()
  }

  return (
    <div 
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t('menuLabel')}
    >
      {/* Backdrop - animato */}
      <button 
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default animate-fade-in"
        onClick={onClose}
        aria-label={t('closeMenu') || 'Chiudi menu'}
        tabIndex={-1}
      />
      
      {/* Sidebar Panel - slide in da sinistra */}
      <aside
        ref={sidebarRef}
        className="absolute top-0 left-0 h-full w-[300px] bg-background border-r border-border shadow-2xl flex flex-col animate-slide-in-left"
      >
        {/* Header - STICKY */}
        <header className="sticky top-0 z-10 bg-background border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-5">
            <Logo />
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('closeMenu') || 'Chiudi menu'}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
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
                onClick={handleRegister}
                className="w-full mt-3 py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {t('unlockFeatures')}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4" aria-label={t('menuLabel')}>
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('menuLabel')}
            </p>
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
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
                      {/* Active indicator stripe */}
                      {isActive && (
                        <span 
                          className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full"
                          aria-hidden="true"
                        />
                      )}
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Preferences */}
          <div className="p-4 border-t border-border/50 space-y-4">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('preferencesLabel')}
            </p>
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
        </div>

        {/* Footer - STICKY */}
        <footer className="sticky bottom-0 bg-background border-t border-border p-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors focus:outline-none focus:ring-2 focus:ring-error"
          >
            <LogOutIcon className="w-4 h-4" />
            {t('logout')}
          </button>
        </footer>
      </aside>
    </div>
  )
}
