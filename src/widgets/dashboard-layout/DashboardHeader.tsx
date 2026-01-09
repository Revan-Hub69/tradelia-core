/**
 * Dashboard Header - Tradelia 2026 Super Premium
 * 
 * Header enterprise seguendo paper accademici:
 * - Performance ottimizzata (no backdrop-blur pesante)
 * - Accessibilità WCAG AAA (focus management, keyboard nav)
 * - Mobile-first responsive design
 * - Logo Tradelia corretto
 * - Contrasti ottimizzati per dark mode
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { Button } from '@/src/shared/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import Logo from '@/components/Logo'
import { 
  BellIcon, 
  SearchIcon, 
  MenuIcon,
  CloseIcon
} from '@/components/icons/TradeliaIcons'

interface DashboardHeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
  const router = useRouter()
  const t = useTranslations('dashboard')
  const { state } = useDashboardAuth()

  return (
    <header className="h-16 bg-background/95 border-b border-border/50 sticky top-0 z-30 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Menu Button - Visibile per test */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-controls="dashboard-sidebar"
            aria-expanded={sidebarOpen}
            type="button"
          >
            {sidebarOpen ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <div className="hidden sm:block">
            <Logo />
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-background transition-all duration-150"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme & Language Toggles */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle variant="compact" />
            <LanguageToggle variant="compact" />
          </div>

          {/* Notifications */}
          <button 
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {/* Notification Badge */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User Status & Back to Site */}
          <div className="flex items-center gap-2">
            {state.isGuestMode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-warning/8 border border-warning/20 rounded-lg backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                <span className="text-xs font-medium text-warning">
                  {t('guestMode')}
                </span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="hidden sm:inline-flex text-xs"
            >
              {t('backToSite')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
