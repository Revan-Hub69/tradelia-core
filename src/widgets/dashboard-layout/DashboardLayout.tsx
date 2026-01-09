/**
 * Dashboard Layout - Tradelia 2026 Super Premium v4.0
 * 
 * Layout enterprise con sidebar overlay moderna seguendo best practice 2024:
 * - Sidebar overlay che appare sopra il contenuto (non sposta mai)
 * - Backdrop scuro quando sidebar è aperta
 * - Animazioni fluide e performance ottimizzate
 * - Accessibilità WCAG AAA compliant
 * - Mobile-first responsive design
 * - Stato sidebar sempre chiuso di default
 */

'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Sidebar sempre chiusa di default - mai aperta automaticamente
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  // Force close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed at top */}
      <DashboardHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Backdrop - Only appears when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Overlay che slide in da sinistra */}
      <DashboardSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Main Content - Mai si muove, sidebar appare sopra */}
      <main className="pt-16 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}