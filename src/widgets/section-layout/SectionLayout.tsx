/**
 * SectionLayout - Tradelia 2026
 * 
 * Layout standardizzato per ogni sezione
 * Implementa la struttura definitiva:
 * 1. Header di contesto (breadcrumb + titolo + descrizione)
 * 2. Sub-navigazione locale (tabs)
 * 3. Contenuto dinamico con skeleton loading
 * 4. Section memory per ricordare ultima tab visitata
 */

'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { SectionHeader } from '@/src/shared/ui/SectionHeader'
import { SubNavigation } from '@/src/shared/ui/SubNavigation'
import { SkeletonSectionLayout } from '@/src/shared/ui/SkeletonLayouts'
import { useSectionMemory } from '@/src/shared/hooks/useSectionMemory'
import type { BreadcrumbItem, SubNavItemWithContent } from '@/src/shared/types/navigation'

interface SectionLayoutProps {
  // Header
  breadcrumb?: BreadcrumbItem[]
  title: string
  description?: string
  icon?: ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
  }
  
  // Sub-navigation
  subNavItems: SubNavItemWithContent[]
  defaultActiveTab?: string
  
  // Section memory
  sectionId: string // Required for section memory
  
  // Loading state
  isLoading?: boolean
  
  // Layout
  className?: string
}

export function SectionLayout({
  breadcrumb,
  title,
  description,
  icon,
  primaryAction,
  subNavItems,
  defaultActiveTab,
  sectionId,
  isLoading = false,
  className = ''
}: SectionLayoutProps) {
  const { getRememberedTab, rememberTab, hasMemory } = useSectionMemory(
    sectionId, 
    defaultActiveTab || subNavItems[0]?.id || ''
  )
  
  const [activeTab, setActiveTab] = useState(() => getRememberedTab())
  const [isContentLoading, setIsContentLoading] = useState(false)
  
  const activeItem = subNavItems.find(item => item.id === activeTab)

  // Handle tab change with loading state and memory
  const handleTabChange = (newTabId: string) => {
    if (newTabId === activeTab) return
    
    setIsContentLoading(true)
    setActiveTab(newTabId)
    
    // Remember this tab choice
    rememberTab(newTabId)
    
    // Scroll to top on tab change (UX best practice) - Respects reduced motion (REQ 26.4)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    
    // Simulate content loading (remove in production if content is synchronous)
    setTimeout(() => {
      setIsContentLoading(false)
    }, 150)
  }

  // Show memory indicator for first-time users
  useEffect(() => {
    if (hasMemory && process.env.NODE_ENV === 'development') {
      console.log(`[Section Memory] Restored tab "${activeTab}" for section "${sectionId}"`)
    }
  }, [hasMemory, activeTab, sectionId])

  // Show skeleton during initial loading
  if (isLoading) {
    return <SkeletonSectionLayout />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header di contesto */}
      <SectionHeader
        {...(breadcrumb && { breadcrumb })}
        title={title}
        {...(description && { description })}
        {...(icon && { icon })}
        {...(primaryAction && { primaryAction })}
      />

      {/* Sub-navigazione locale con sticky behavior */}
      <SubNavigation
        items={subNavItems.map(({ content: _content, ...item }) => item)}
        activeId={activeTab}
        onItemClick={handleTabChange}
        enableSticky={false}
        showStructureLabel={false}
      />

      {/* Contenuto dinamico */}
      <div className="min-h-[400px]">
        {isContentLoading ? (
          <div className="space-y-6">
            <div className="bg-background/60 border border-border/50 rounded-xl p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted/60 rounded w-1/4"></div>
                <div className="h-4 bg-muted/60 rounded w-3/4"></div>
                <div className="h-4 bg-muted/60 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : activeItem?.content ? (
          <div 
            key={activeTab} 
            className="animate-in fade-in duration-200"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeItem.content}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Contenuto non trovato
          </div>
        )}
      </div>
    </div>
  )
}