/**
 * Dashboard Sidebar - Tradelia 2026 Super Premium v5.0
 * 
 * Sidebar overlay moderna - SEMPRE NASCOSTA DI DEFAULT:
 * - Overlay che appare sopra il contenuto (mai sposta il contenuto)
 * - Animazione slide-in fluida da sinistra
 * - Chiusura automatica su route change e resize
 * - Accessibilità completa con focus trap
 * - Design system Tradelia 2026 compliant
 * - FORZATAMENTE nascosta se isOpen è false
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
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
  DiamondIcon
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
  const sidebarRef = useRef<HTMLDivElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)

  const navigationItems = [
    {
      name: t('overview'),
      href: `/${locale}/dashboard`,
      icon: ChartIcon,
      description: t('overviewDescription')
    },
    {
      name: t('portfolio'),
      href: `/${locale}/dashboard/portfolio`,
      icon: DiamondIcon,
      description: t('portfolioDescription')
    },
    {
      name: t('verify'),
      href: `/${locale}/dashboard/verify`,
      icon: ShieldIcon,
      description: t('verifyDescription')
    },
    {
      name: t('education'),
      href: `/${locale}/dashboard/education`,
      icon: BookIcon,
      description: t('educationDescription')
    },
    {
      name: t('settings'),
      href: `/${locale}/dashboard/settings`,
      icon: SettingsIcon,
      description: t('settingsDescription')
    }
  ]

  const handleSignOut = async () => {
    await actions.signOut()
  }

  // Close sidebar on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Focus management for accessibility
  useEffect(() => {
    if (!isOpen) {
      return
    }

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ]
    const getFocusableElements = () =>
      sidebarRef.current?.querySelectorAll<HTMLElement>(
        focusableSelectors.join(',')
      )
    const focusableElements = getFocusableElements()
    const firstElement = focusableElements?.[0]
    if (firstElement) {
      firstElement.focus()
    } else {
      sidebarRef.current?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentFocusableElements = getFocusableElements()
      if (
        event.key !== 'Tab' ||
        !currentFocusableElements ||
        currentFocusableElements.length === 0
      ) {
        return
      }

      const first = currentFocusableElements[0]
      const last = currentFocusableElements[currentFocusableElements.length - 1]
      if (!first || !last) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedElementRef.current?.focus()
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <aside 
      id="dashboard-sidebar"
      ref={sidebarRef}
      className={`
        fixed top-0 left-0 z-50 h-full w-[80vw] max-w-[20rem] sm:max-w-none sm:w-72 lg:w-80
        bg-background border-r border-border
        flex flex-col shadow-2xl
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="dashboard-sidebar-title"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      {/* Header with Logo */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/50">
        <h2 id="dashboard-sidebar-title" className="sr-only">
          Dashboard navigation
        </h2>
        <Logo />
        <button
          onClick={onClose}
          type="button"
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Close menu"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 sm:p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
            {state.isGuestMode ? (
              <ShieldIcon className="w-6 h-6 text-primary" />
            ) : (
              <UserIcon className="w-6 h-6 text-primary" />
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 sm:p-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary/50
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.name}
                </p>
                <p className="text-xs opacity-70 truncate">
                  {item.description}
                </p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 sm:p-6 border-t border-border/30 space-y-4">
        {/* Theme & Language Controls */}
        <div className="space-y-3">
          <ThemeToggle variant="full" />
          <LanguageToggle variant="full" />
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          <LogOutIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
