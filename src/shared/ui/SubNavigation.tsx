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
  enableSticky = true,
  showStructureLabel = false
}: SubNavigationProps) {
  const t = useTranslations('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const [inkBarStyle, setInkBarStyle] = useState<React.CSSProperties>({})
  const [showScrollHint, setShowScrollHint] = useState({ left: false, right: false })
  const [isSticky, setIsSticky] = useState(false)
  const [originalTop, setOriginalTop] = useState(0)

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

  // Check scroll hints
  const updateScrollHints = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const canScrollLeft = container.scrollLeft > 0
    const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth)

    setShowScrollHint({ left: canScrollLeft, right: canScrollRight })
  }, [])

  // Handle sticky behavior
  const handleScroll = useCallback(() => {
    if (!enableSticky || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const headerHeight = 64 // Height of main header
    
    // Become sticky when the element would go above the header
    const shouldBeSticky = rect.top <= headerHeight && originalTop > headerHeight
    
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }
  }, [enableSticky, isSticky, originalTop])

  // Store original position
  useEffect(() => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    setOriginalTop(rect.top + window.scrollY)
  }, [])

  // Add scroll listener for sticky behavior
  useEffect(() => {
    if (!enableSticky) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, enableSticky])

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
          ${isSticky 
            ? 'fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm shadow-sm md:left-64' 
            : ''
          }
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
                onClick={() => !item.disabled && onItemClick(item.id)}
                onKeyDown={(e) => !item.disabled && handleKeyDown(e, item.id)}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  transition-all duration-150 relative
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${item.secondary && !item.disabled ? 'opacity-70' : ''}
                  ${isActive && !item.disabled
                    ? 'text-primary border-b-2 border-primary' 
                    : `text-muted-foreground ${!item.disabled ? 'hover:text-foreground' : ''} ${item.secondary && !item.disabled ? 'hover:opacity-90' : ''} border-b-2 border-transparent`
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon && (
                  <span className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.recommended && !isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary/60 rounded-full" />
                )}
                {item.count !== undefined && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full transition-colors
                    ${isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
      </div>
      
      {/* Spacer when sticky to prevent content jump */}
      {isSticky && <div className="h-12" />}
    </div>
  )
}