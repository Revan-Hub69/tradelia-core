'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
  ShieldIcon
} from '@/components/icons/TradeliaIcons'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
          {state.isGuestMode ? (
            <ShieldIcon className="w-4 h-4 text-white" />
          ) : (
            <UserIcon className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">
            {state.profile?.full_name || tDashboard('guestUser')}
          </p>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                {state.isGuestMode ? (
                  <ShieldIcon className="w-4 h-4 text-white" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {state.profile?.full_name || tDashboard('guestUser')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {state.isGuestMode ? tDashboard('limitedMode') : tDashboard('verifiedAccount')}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Settings */}
            <Link
              href={`/${locale}/dashboard/settings`}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2 text-sm transition-colors
                ${pathname.includes('/settings') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>{t('settings')}</span>
            </Link>

            {/* Divider */}
            <div className="my-1 border-t border-border/50" />

            {/* Theme Toggle */}
            <div className="px-3 py-2">
              <ThemeToggle 
                variant="compact" 
                labels={{
                  theme: locale === 'en' ? 'Theme' : 'Tema',
                  light: locale === 'en' ? 'Light' : 'Chiaro',
                  dark: locale === 'en' ? 'Dark' : 'Scuro',
                  system: locale === 'en' ? 'System' : 'Sistema'
                }}
              />
            </div>

            {/* Language Toggle */}
            <div className="px-3 py-2">
              <LanguageToggle 
                variant="compact" 
                currentLocale={locale}
                labelText={locale === 'en' ? 'Language' : 'Lingua'}
              />
            </div>

            {/* Divider */}
            <div className="my-1 border-t border-border/50" />

            {/* Ultra-Chicche: SafeButton for Logout */}
            <div className="px-3 py-2">
              <SafeButton
                variant="destructive"
                onClick={() => {
                  setIsOpen(false)
                  actions.signOut()
                }}
                className="w-full flex items-center gap-3 px-0 py-1 text-sm text-error hover:bg-error/10 transition-colors bg-transparent border-none shadow-none"
                size="sm"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>{t('logout')}</span>
              </SafeButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}