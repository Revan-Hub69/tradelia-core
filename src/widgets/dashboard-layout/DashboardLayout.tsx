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

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useSidebarStore } from '@/src/features/sidebar-state'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, setOpen } = useSidebarStore()
  const lastFocusedElRef = useRef<HTMLElement | null>(null)

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, setOpen])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Force close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, setOpen])

  const handleMenuClick = () => {
    // Track focus so we can restore it after closing (a11y)
    if (!isOpen) {
      lastFocusedElRef.current = (document.activeElement as HTMLElement) ?? null
    }
    setOpen(!isOpen)
  }

  // Restore focus to the menu button (preferred) or the last focused element
  useEffect(() => {
    if (isOpen) return
    const menuBtn = document.getElementById('dashboard-menu-button') as HTMLElement | null
    if (menuBtn) {
      menuBtn.focus()
      return
    }
    lastFocusedElRef.current?.focus?.()
  }, [isOpen])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header - Fixed at top */}
      <DashboardHeader
        onMenuClick={handleMenuClick}
        sidebarOpen={isOpen}
      />

      {/* Sidebar - Overlay che slide in da sinistra */}
      <DashboardSidebar
        isOpen={isOpen}
        onClose={() => setOpen(false)}
      />

      {/* Main Content - Mai si muove, sidebar appare sopra */}
      <main className="pt-16 min-h-screen overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}