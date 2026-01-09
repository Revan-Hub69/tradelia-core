/**
 * SubNavigation - Tradelia 2026
 * 
 * Sub-navigazione locale per ogni sezione
 * - Tabs orizzontali scrollabili su mobile
 * - Gestisce la complessità interna
 * - Struttura identica per tutte le sezioni
 */

'use client'

import type { SubNavItem } from '@/src/shared/types/navigation'

interface SubNavigationProps {
  items: SubNavItem[]
  activeId: string
  onItemClick: (id: string) => void
  className?: string
}

export function SubNavigation({ items, activeId, onItemClick, className = '' }: SubNavigationProps) {
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

  return (
    <div className={`border-b border-border/50 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide">
        <nav 
          className="flex space-x-1 min-w-full" 
          role="tablist"
          aria-label="Navigazione sezione"
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
                onClick={() => onItemClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  ${isActive 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon && (
                  <span className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full
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
  )
}