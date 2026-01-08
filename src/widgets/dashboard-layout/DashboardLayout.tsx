/**
 * Dashboard Layout - Tradelia 2026
 * 
 * Layout professionale per dashboard enterprise seguendo i principi:
 * - Design system Tradelia 2026
 * - Layout full-width con sidebar
 * - Glassmorphism e effetti moderni
 */

'use client'

import type { ReactNode } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <DashboardHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}