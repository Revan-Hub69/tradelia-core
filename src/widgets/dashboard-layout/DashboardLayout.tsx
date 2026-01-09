/**
 * Dashboard Layout - Tradelia 2026
 * Navigation Contract v1.0
 *
 * Breakpoint: md (768px)
 * - md+ (≥768px): Desktop shell → sidebar persistente
 * - <md: Mobile app → bottom nav + drawer
 * 
 * Offsets:
 * - Desktop: main md:pl-64, header md:left-64
 * - Mobile: main pb-16 (bottom nav height)
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
      {/* Desktop Sidebar - md+ only */}
      <DesktopSidebar />

      {/* Header - shifts right on desktop */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="pt-16 min-h-screen md:pl-64">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}