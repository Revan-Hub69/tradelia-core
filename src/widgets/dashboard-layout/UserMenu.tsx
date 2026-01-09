'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
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
          <p className="text-xs text-muted-foreground">
            {state.isGuestMode ? tDashboard('limitedMode') : tDashboard('verifiedAccount')}
          </p>
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
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
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Settings */}
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <SettingsIcon className="w-4 h-4" />
              <span>{t('settings')}</span>
            </button>

            {/* Theme Toggle */}
            <div className="px-3 py-2">
              <ThemeToggle 
                variant="full" 
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
                variant="full" 
                currentLocale={locale}
                labelText={locale === 'en' ? 'Language' : 'Lingua'}
              />
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-border/50" />

            {/* Logout */}
            <button
              onClick={() => {
                setIsOpen(false)
                actions.signOut()
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}