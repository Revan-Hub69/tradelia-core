/**
 * SubNavigation - Tradelia 2026
 * 
 * Sub-navigazione locale per ogni sezione
 * - Tabs orizzontali scrollabili su mobile
 * - Gestisce la complessità interna
 * - Struttura identica per tutte le sezioni
 * - Ink bar animato per tab attiva
 * - Scroll hints per mobile
 * - Smart sticky behavior (solo quando serve)
 */

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useThrottledCallback } from '@/src/shared/hooks/useDebounce'
import type { SubNavItem } from '@/src/shared/types/navigation'

interface SubNavigationProps {
  items: SubNavItem[]
  activeId: string
  onItemClick: (id: string) => void
  className?: string
  enableSticky?: boolean
  showStructureLabel?: boolean
}

export function SubNavigation({ 
  items, 
  activeId, 
  onItemClick, 
  className = '',
  enableSticky: _enableSticky = true, // Disabled for Ultra-Chicche
  showStructureLabel = false
}: SubNavigationProps) {
  const t = useTranslations('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const [inkBarStyle, setInkBarStyle] = useState<React.CSSProperties>({})
  const [showScrollHint, setShowScrollHint] = useState({ left: false, right: false })

  // Update ink bar position
  const updateInkBar = useCallback(() => {
    if (!containerRef.current) return

    const activeTab = containerRef.current.querySelector(`[data-tab-id="${activeId}"]`) as HTMLElement
    if (!activeTab) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const activeRect = activeTab.getBoundingClientRect()

    setInkBarStyle({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
      transform: 'translateX(0)',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
    })
  }, [activeId])

  // Check scroll hints - throttled for performance (REQ 12.4)
  const updateScrollHints = useThrottledCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const canScrollLeft = container.scrollLeft > 0
    const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth)

    setShowScrollHint({ left: canScrollLeft, right: canScrollRight })
  }, 100) // 100ms throttle per requirements

  // Store original position - DISABLED
  useEffect(() => {
    // Position tracking disabled for Ultra-Chicche design
    return
  }, [])

  // Add scroll listener for sticky behavior - DISABLED
  useEffect(() => {
    // Sticky behavior disabled for Ultra-Chicche design
    return
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, currentId: string) => {
    const currentIndex = items.findIndex(item => item.id === currentId)
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        break
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = items.length - 1
        break
      default:
        return
    }

    const nextItem = items[nextIndex]
    if (nextItem) {
      onItemClick(nextItem.id)
      // Focus the next tab
      setTimeout(() => {
        const nextTab = document.querySelector(`[data-tab-id="${nextItem.id}"]`) as HTMLButtonElement
        nextTab?.focus()
      }, 0)
    }
  }

  // Update ink bar when active tab changes
  useEffect(() => {
    updateInkBar()
  }, [activeId, updateInkBar])

  // Update ink bar on resize
  useEffect(() => {
    const handleResize = () => {
      updateInkBar()
      updateScrollHints()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateInkBar, updateScrollHints])

  // Initial setup
  useEffect(() => {
    updateInkBar()
    updateScrollHints()
  }, [items, updateInkBar, updateScrollHints])

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Journey structure label - wayfinding */}
      {showStructureLabel && (
        <div className="text-sm text-muted-foreground mb-3">
          {t('journeyStructure')}
        </div>
      )}
      
      <div 
        className={`
          border-b border-border/50 relative transition-all duration-200
        `}
      >
      {/* Scroll hint - Left */}
      {showScrollHint.left && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
      )}

      {/* Scroll hint - Right */}
      {showScrollHint.right && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />
      )}

      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide relative max-w-full"
        onScroll={updateScrollHints}
      >
        {/* Ink bar */}
        <div 
          className="absolute bottom-0 h-0.5 bg-primary rounded-full z-10"
          style={inkBarStyle}
          aria-hidden="true"
        />
        
        <nav 
          className="flex space-x-1 min-w-full" 
          role="tablist"
          aria-label={t('sectionNavigation')}
        >
          {items.map((item) => {
            const isActive = item.id === activeId
            
            return (
              <button
                key={item.id}
                data-tab-id={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  // Only allow clicking previous steps (back only)
                  const currentIndex = items.findIndex(i => i.id === activeId)
                  const clickedIndex = items.findIndex(i => i.id === item.id)
                  
                  if (!item.disabled && clickedIndex < currentIndex) {
                    onItemClick(item.id)
                  }
                  // Current step and future steps: no action
                }}
                onKeyDown={(e) => !item.disabled && handleKeyDown(e, item.id)}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap
                  transition-colors duration-150 relative border-b-2
                  focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2
                  ${(() => {
                    const currentIndex = items.findIndex(i => i.id === activeId)
                    const itemIndex = items.findIndex(i => i.id === item.id)
                    
                    // Current step: subtle underline
                    if (isActive) {
                      return 'text-foreground border-foreground/30 cursor-default'
                    }
                    
                    // Previous steps: clickable (back only)
                    if (itemIndex < currentIndex) {
                      return 'text-muted-foreground border-transparent hover:text-foreground cursor-pointer'
                    }
                    
                    // Future steps: muted, no hover, no click affordance + "not ready" styling
                    return 'text-muted-foreground/40 border-transparent cursor-default opacity-60'
                  })()}
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Progression guidance - micro-line under tabs */}
      <div className="px-4 py-2 text-xs text-muted-foreground">
        {t('progressionGuidance')}
      </div>
      </div>
      
      {/* Spacer removed - no more sticky behavior */}
    </div>
  )
}