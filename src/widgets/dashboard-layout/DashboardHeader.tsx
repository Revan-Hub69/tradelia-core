/**
 * Dashboard Header - Tradelia 2026
 * 
 * Header minimalista seguendo le linee guida:
 * - Altezza: h-14 (56px)
 * - Logo: 24x24px, minimal
 * - Nav: Solo link essenziali
 * - Max-width: max-w-2xl (allineato al contenuto)
 */

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { Button } from '@/src/shared/ui/Button'
import { DiamondIcon } from '@/components/icons/TradeliaIcons'

export function DashboardHeader() {
  const router = useRouter()
  const { state, actions } = useDashboardAuth()

  const handleSignOut = async () => {
    try {
      await actions.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <header className="h-14 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="px-6 sm:px-8 h-full">
        <div className="max-w-2xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 transition-colors duration-150 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-sm"
            aria-label="Torna alla homepage"
          >
            <DiamondIcon className="w-6 h-6" />
            <span className="text-sm font-semibold text-foreground">
              Tradelia
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-foreground">
                  {state.profile?.full_name || 'Utente'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {state.isGuestMode ? 'Modalità ospite' : 'Utente registrato'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {state.isGuestMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoHome}
                  className="text-xs"
                >
                  Registrati
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs"
                >
                  Esci
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}