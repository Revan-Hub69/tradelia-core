/**
 * Dashboard Header - Tradelia 2026
 * Navigation Contract v1.0
 * 
 * Posizione: fixed, md:left-64 (shift per sidebar)
 * Mobile: logo + notifiche
 * Desktop: search + notifiche + back to site
 */

'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { Button } from '@/src/shared/ui/Button'
import Logo from '@/components/Logo'
import { 
  BellIcon, 
  SearchIcon
} from '@/components/icons/TradeliaIcons'

export function DashboardHeader() {
  const router = useRouter()
  const t = useTranslations('dashboard')
  const { state } = useDashboardAuth()

  return (
    <header className="h-16 bg-background/95 border-b border-border/50 fixed top-0 left-0 right-0 z-50 md:left-64">
      <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left Section - Logo (mobile only) */}
        <div className="flex items-center gap-4 md:hidden">
          <Logo />
        </div>
        
        {/* Desktop: empty left space */}
        <div className="hidden md:block" />

        {/* Center - Search Bar (desktop only) */}
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
          {/* Notifications */}
          <button 
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Guest Mode Badge & Back to Site */}
          <div className="flex items-center gap-2">
            {state.isGuestMode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-warning/8 border border-warning/20 rounded-lg">
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