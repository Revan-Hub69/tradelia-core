/**
 * Dashboard Header - Tradelia 2026
 * 
 * Header professionale con glassmorphism e navigazione
 * Seguendo le spec del design system
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { Button } from '@/src/shared/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { DiamondIcon, BellIcon, SearchIcon } from '@/components/icons/TradeliaIcons'

export function DashboardHeader() {
  const router = useRouter()
  const { state } = useDashboardAuth()

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
          <DiamondIcon className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Tradelia</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca strumenti, analisi..."
              className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-150"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme & Language Toggles */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle variant="compact" />
            <LanguageToggle variant="compact" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors duration-150">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-xs"></span>
          </button>

          {/* User Status */}
          <div className="flex items-center gap-3">
            {state.isGuestMode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-medium text-amber-700">Modalità Ospite</span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="hidden sm:inline-flex"
            >
              Torna al Sito
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}