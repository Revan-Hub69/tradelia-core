/**
 * Active Context Pill - Tradelia 2026
 * 
 * Mostra il contesto attivo su mobile (sostituisce breadcrumb)
 * Permette di switchare rapidamente tra percorsi
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDownIcon } from '@/components/icons/TradeliaIcons'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'

interface ActiveContextPillProps {
  className?: string
}

export function ActiveContextPill({ className = '' }: ActiveContextPillProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('journeys')

  // Get current context
  const getCurrentContext = (): { id: JourneyId | 'home'; label: string } => {
    if (pathname.includes('/emergency')) return { id: 'emergency', label: t('emergency.name') }
    if (pathname.includes('/longterm')) return { id: 'longterm', label: t('longterm.name') }
    if (pathname.includes('/speculation')) return { id: 'speculation', label: t('speculation.name') }
    if (pathname.includes('/passive')) return { id: 'passive', label: t('passive.name') }
    return { id: 'home', label: 'Home' }
  }

  const currentContext = getCurrentContext()

  // Handle context switch
  const handleContextSwitch = (journeyId: JourneyId | 'home') => {
    setIsAnimating(true)
    setIsOpen(false)
    
    const targetPath = journeyId === 'home' 
      ? `/${locale}/dashboard`
      : `/${locale}/dashboard/${journeyId}`
    
    // Smooth transition
    setTimeout(() => {
      router.push(targetPath)
      setIsAnimating(false)
    }, 150)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div className={`relative md:hidden ${className}`}>
      {/* Context Pill Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isAnimating}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50
          ${isAnimating 
            ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' 
            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Cambia percorso"
      >
        <span className="text-xs">Percorso:</span>
        <span className={`font-semibold transition-colors ${isAnimating ? '' : 'text-foreground'}`}>
          {currentContext.label}
        </span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          tabIndex={0}
          aria-label="Seleziona percorso"
          onKeyDown={handleKeyDown}
          className="
            absolute top-full left-0 mt-2 w-56 bg-background border border-border/50 rounded-xl shadow-lg
            animate-in fade-in slide-in-from-top-2 duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-primary/50
          "
        >
          <div className="p-2">
            {/* Home Option */}
            <button
              role="option"
              aria-selected={currentContext.id === 'home'}
              onClick={() => handleContextSwitch('home')}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50
                ${currentContext.id === 'home'
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted/50'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${currentContext.id === 'home' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              <span>Home</span>
            </button>

            {/* Journey Options */}
            {JOURNEY_ORDER.map((journeyId) => {
              const isActive = currentContext.id === journeyId
              
              return (
                <button
                  key={journeyId}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleContextSwitch(journeyId)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left
                    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <span>{t(`${journeyId}.name`)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}