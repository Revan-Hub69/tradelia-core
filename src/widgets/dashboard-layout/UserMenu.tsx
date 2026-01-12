'use client'

import { useState, useCallback, useId, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { useRovingTabindex } from '@/src/shared/hooks/useRovingTabindex'
import { useDismissableLayer } from '@/src/shared/hooks/useDismissableLayer'
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


// Menu item types for roving tabindex
interface MenuItem {
  id: string
  type: 'link' | 'button' | 'component'
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
  component?: React.ReactNode
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const buttonId = useId()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('navigation')
  const tDashboard = useTranslations('dashboard')
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()

  const displayName = state.profile?.nickname || state.profile?.full_name || tDashboard('guestUser')

  // Close menu handler
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Use dismissable layer for ESC and click outside
  const menuRef = useDismissableLayer<HTMLDivElement>(isOpen, closeMenu, {
    escapeKey: true,
    clickOutside: true,
    restoreFocus: true,
  })

  // Define menu items for roving tabindex
  const menuItems: MenuItem[] = useMemo(() => [
    {
      id: 'settings',
      type: 'link',
      label: t('settings'),
      href: `/${locale}/dashboard/settings`,
      icon: <SettingsIcon className="w-4 h-4" />,
      className: pathname.includes('/settings') 
        ? 'bg-primary/10 text-primary' 
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
    },
    {
      id: 'theme',
      type: 'component',
      label: locale === 'en' ? 'Theme' : 'Tema',
      component: (
        <ThemeToggle 
          variant="compact" 
          labels={{
            theme: locale === 'en' ? 'Theme' : 'Tema',
            light: locale === 'en' ? 'Light' : 'Chiaro',
            dark: locale === 'en' ? 'Dark' : 'Scuro',
            system: locale === 'en' ? 'System' : 'Sistema'
          }}
        />
      ),
    },
    {
      id: 'language',
      type: 'component',
      label: locale === 'en' ? 'Language' : 'Lingua',
      component: (
        <LanguageToggle 
          variant="compact" 
          currentLocale={locale}
          labelText={locale === 'en' ? 'Language' : 'Lingua'}
        />
      ),
    },
    state.isGuestMode ? {
      id: 'register',
      type: 'button',
      label: locale === 'en' ? 'Register' : 'Registrati',
      onClick: () => {
        closeMenu()
        openModal('gateway')
      },
      icon: <UserIcon className="w-4 h-4" />,
      className: 'text-primary hover:text-primary hover:bg-primary/10',
    } : {
      id: 'logout',
      type: 'button',
      label: t('logout'),
      onClick: () => {
        closeMenu()
        actions.signOut()
      },
      icon: <LogOutIcon className="w-4 h-4" />,
      className: 'text-error hover:text-error hover:bg-error/10',
    },
  ], [t, locale, pathname, state.isGuestMode, closeMenu, openModal, actions])

  // Handle menu item selection via keyboard
  const handleMenuSelect = useCallback((index: number) => {
    const item = menuItems[index]
    if (!item) return

    if (item.type === 'link' && item.href) {
      closeMenu()
      router.push(item.href)
    } else if (item.type === 'button' && item.onClick) {
      item.onClick()
    }
    // For 'component' type, let the component handle its own interaction
  }, [menuItems, closeMenu, router])

  // Roving tabindex for menu items
  const { getItemProps, setActiveIndex } = useRovingTabindex<HTMLElement>(
    menuItems.length,
    {
      orientation: 'vertical',
      loop: true,
      onSelect: handleMenuSelect,
    }
  )

  // Toggle menu
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        // Reset active index when opening
        setActiveIndex(0)
      }
      return !prev
    })
  }, [setActiveIndex])

  // Handle button keydown for ArrowDown to open menu
  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault()
      setIsOpen(true)
      setActiveIndex(0)
    }
  }, [isOpen, setActiveIndex])

  return (
    <div className="relative">
      {/* User Button */}
      <button
        id={buttonId}
        onClick={toggleMenu}
        onKeyDown={handleButtonKeyDown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`${displayName} menu`}
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
        <div 
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={buttonId}
          className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
        >
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
          <div className="py-1" role="none">
            {menuItems.map((item, index) => {
              const itemProps = getItemProps(index)
              const baseClassName = "flex items-center gap-3 px-3 py-2 text-sm transition-colors w-full"
              
              // For component type items (Theme, Language toggles)
              if (item.type === 'component') {
                return (
                  <div 
                    key={item.id}
                    role="menuitem"
                    {...itemProps}
                    className="px-3 py-2 focus:outline-none focus:bg-muted/50"
                  >
                    {item.component}
                  </div>
                )
              }

              // For link items
              if (item.type === 'link' && item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeMenu}
                    role="menuitem"
                    {...itemProps}
                    className={`${baseClassName} ${item.className} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )
              }

              // For button items
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  role="menuitem"
                  {...itemProps}
                  className={`${baseClassName} ${item.className} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
