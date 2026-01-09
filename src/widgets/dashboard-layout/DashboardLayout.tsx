/**
 * Dashboard Layout - Tradelia 2026 Super Premium v2.1
 * 
 * Layout enterprise seguendo paper accademici e best practices:
 * - Sidebar overlay (non push) per mobile-first design
 * - Performance ottimizzata con CSS Grid e Flexbox
 * - Accessibilità WCAG AAA compliant
 * - Responsive design mobile-first
 * - Dark mode ottimizzato per contrasti
 * - Enterprise-grade microanimazioni
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive detection with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const checkMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth < 1024
        setIsMobile(mobile)
        
        // Auto-close mobile sidebar when switching to desktop
        if (!mobile && sidebarOpen) {
          setSidebarOpen(false)
        }
      }, 100)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timeoutId)
    }
  }, [sidebarOpen])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isMobile, sidebarOpen])

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed at top */}
      <DashboardHeader 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Layout Container */}
      <div className="relative">
        {/* Mobile Backdrop */}
        <div 
          className={`
            fixed inset-0 bg-black/50 z-40 lg:hidden
            transition-opacity duration-300 ease-in-out
            ${isMobile && sidebarOpen 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible'
            }
          `}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        
        {/* Sidebar - Overlay on mobile, fixed on desktop */}
        <DashboardSidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />
        
        {/* Main Content - Responsive margin */}
        <main 
          className={`
            min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
            ${isMobile 
              ? 'ml-0' 
              : 'lg:ml-64'
            }
          `}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}