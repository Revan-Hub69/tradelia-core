/**
 * Smart Navigation Hook - Tradelia 2026
 * 
 * Sistema intelligente di navigazione che ottimizza l'UX:
 * - Mobile: Bottom nav primario, sidebar nascosta di default
 * - Desktop: Sidebar primaria con opzione collapse
 * - Elimina ridondanza e confusione nella navigazione
 */

'use client'

import { useState, useEffect } from 'react'
import { useSidebarPreference } from './useSidebarPreference'

interface SmartNavigationState {
  // Visibility states
  showSidebar: boolean
  showBottomNav: boolean
  showDesktopSidebar: boolean
  
  // Sidebar states
  sidebarCollapsed: boolean
  canCollapseSidebar: boolean
  
  // Mobile sidebar overlay
  isMobileSidebarOpen: boolean
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  
  // Desktop sidebar collapse
  toggleSidebarCollapse: () => void
  
  // Responsive state
  isMobile: boolean
  isDesktop: boolean
}

export function useSmartNavigation(): SmartNavigationState {
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { collapsed: sidebarCollapsed, toggle: toggleSidebarCollapse } = useSidebarPreference()

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    if (!isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false)
    }
  }, [isMobile, isMobileSidebarOpen])

  const openMobileSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(true)
    }
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return {
    // Visibility logic
    showSidebar: isMobile ? isMobileSidebarOpen : true, // Desktop: always show, Mobile: only when open
    showBottomNav: isMobile, // Only on mobile
    showDesktopSidebar: !isMobile, // Only on desktop
    
    // Sidebar states
    sidebarCollapsed: !isMobile && sidebarCollapsed, // Only collapse on desktop
    canCollapseSidebar: !isMobile, // Only allow collapse on desktop
    
    // Mobile sidebar overlay
    isMobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    
    // Desktop sidebar collapse
    toggleSidebarCollapse,
    
    // Responsive state
    isMobile,
    isDesktop: !isMobile
  }
}