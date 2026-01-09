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
import * as Dialog from '@radix-ui/react-dialog'
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
  const closeBtnRef = useRef<HTMLButtonElement>(null)

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

  // Close sidebar on route change (skip initial mount)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isOpen) {
      onClose()
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the close button when opening (Radix will trap focus inside)
  useEffect(() => {
    if (!isOpen) return
    // Let the dialog mount first
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [isOpen])

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      modal
    >
      <Dialog.Portal>
        {/* Backdrop (click outside closes) */}
        <Dialog.Overlay
          data-testid="sidebar-backdrop"
          className={
            `fixed inset-0 z-50 bg-black/60 ` +
            `transition-opacity duration-300 ease-out ` +
            `motion-reduce:transition-none`
          }
        />

        {/* Panel */}
        <Dialog.Content
          data-testid="sidebar-panel"
          className={
            `fixed top-0 left-0 z-[55] h-full w-80 ` +
            `bg-background border-r border-border shadow-2xl ` +
            `flex flex-col ` +
            `focus:outline-none ` +
            // Keep animation fully self-contained (no tailwind-animate dependency)
            `translate-x-0 will-change-transform ` +
            `transition-transform duration-300 ease-out ` +
            `motion-reduce:transition-none motion-reduce:transform-none`
          }
          onEscapeKeyDown={(e) => {
            e.preventDefault()
            onClose()
          }}
          onPointerDownOutside={(e) => {
            // Ensure consistent close on outside interaction
            e.preventDefault()
            onClose()
          }}
          aria-label="Dashboard navigation"
        >
      {/* Header with Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
            <Logo />
            <Dialog.Close asChild>
              <button
                ref={closeBtnRef}
                type="button"
                data-testid="sidebar-close"
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close sidebar"
              >
                ×
              </button>
            </Dialog.Close>
          </div>

      {/* User Profile */}
      <div className="p-6 border-b border-border/30">
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
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
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
      <div className="p-6 border-t border-border/30 space-y-4">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}