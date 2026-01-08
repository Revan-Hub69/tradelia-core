/**
 * Dashboard Layout - Tradelia 2026
 * 
 * Layout principale per la dashboard SuperBig seguendo i principi:
 * - Chiarezza > Persuasione
 * - Neutralità > Bias
 * - Design istituzionale e accessibile
 */

'use client'

import { ReactNode } from 'react'
import { DashboardHeader } from './DashboardHeader'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="px-6 sm:px-8">
        <div className="max-w-2xl mx-auto py-12 sm:py-16">
          {children}
        </div>
      </main>
      
      {/* Footer discreto */}
      <footer className="border-t border-border/50 px-6 sm:px-8 py-6 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              © 2026 Tradelia. Strumento educativo per analisi finanziaria.
            </p>
            <p className="text-xs text-muted-foreground">
              Non costituisce consulenza finanziaria professionale.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}