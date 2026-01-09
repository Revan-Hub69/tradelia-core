/**
 * Dashboard Layout - Tradelia 2026
 *
 * Layout responsive:
 * - Mobile (<1024px): Solo BottomNav, no sidebar
 * - Desktop (>=1024px): Sidebar fissa a sinistra
 */

'use client'

import type { ReactNode } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { DesktopSidebar } from './DesktopSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed at top */}
      <DashboardHeader />

      {/* Desktop Sidebar - Fixed left, hidden on mobile */}
      <DesktopSidebar />

      {/* Main Content */}
      <main className="pt-16 min-h-screen lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}