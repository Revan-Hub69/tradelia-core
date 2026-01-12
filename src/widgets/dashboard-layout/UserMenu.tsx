'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
  ShieldIcon
} from '@/components/icons/TradeliaIcons'

// Generate initials from nickname
function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/[\s_-]+/)
  if (parts.length >= 2) {
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Generate consistent color from string
function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-rose-500 to-rose-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % colors.length
  return colors[idx] ?? 'from-blue-500 to-blue-600'
}

// Avatar component
function UserAvatar({ profile, isGuest, size = 'sm' }: { 
  profile: { nickname?: string; full_name?: string; avatar_url?: string } | null; 
  isGuest: boolean;
  size?: 'sm' | 'md';
}) {
  const sizeClass = size === 'md' ? 'w-10 h-10' : 'w-8 h-8'
  const textSize = size === 'md' ? 'text-sm' : 'text-xs'
  
  if (isGuest) {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-sm`}>
        <ShieldIcon className="w-4 h-4 text-white" />
      </div>
    )
  }

  // If has Google avatar
  if (profile?.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={profile.avatar_url} 
        alt={profile.nickname || 'User'} 
        className={`${sizeClass} rounded-full object-cover shadow-sm`}
      />
    )
  }

  // Generate avatar with initials
  const name = profile?.nickname || profile?.full_name || 'User'
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-sm`}>
      <span className={`${textSize} font-semibold text-white`}>{initials}</span>
    </div>
  )
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  const displayName = state.profile?.nickname || state.profile?.full_name || tDashboard('guestUser')

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
        <UserAvatar profile={state.profile} isGuest={state.isGuestMode} size="sm" />
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">
            {displayName}
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
              <UserAvatar profile={state.profile} isGuest={state.isGuestMode} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayName}
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

            {/* Conditional: Register for guest, Logout for authenticated */}
            {state.isGuestMode ? (
              <button
                onClick={() => {
                  setIsOpen(false)
                  openModal('gateway')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-primary hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>{locale === 'en' ? 'Register' : 'Registrati'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false)
                  actions.signOut()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:text-error hover:bg-error/10 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}