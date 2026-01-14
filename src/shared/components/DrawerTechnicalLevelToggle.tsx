/**
 * Drawer Technical Level Toggle - Enterprise Edition
 * 
 * Features:
 * - Compact toggle for drawer headers
 * - Dropdown with 3 levels
 * - Centralized state (changes in one drawer = changes in all)
 * - Smooth animations (150ms)
 * - Full accessibility (WCAG 2.2 AA)
 * - Mobile-optimized
 * - Translations (IT/EN)
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { 
  GraduationCapIcon,
  ChevronDownIcon,
  SeedlingIcon,
  BookIcon,
  SparklesIcon,
  CheckIcon
} from '@/src/shared/ui/icons/PreferencesIcons'
import { useUserPreferences } from '@/src/shared/hooks/useUserPreferences'
import type { TechnicalLevel } from './TechnicalLevelSelector'

interface DrawerTechnicalLevelToggleProps {
  userId?: string | undefined
  className?: string
}

export function DrawerTechnicalLevelToggle({ 
  userId,
  className = '' 
}: DrawerTechnicalLevelToggleProps) {
  const t = useTranslations('preferences.technicalLevel')
  const { technicalLevel, updateTechnicalLevel, isSyncing } = useUserPreferences(userId)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])
  
  const handleSelect = async (level: TechnicalLevel) => {
    await updateTechnicalLevel(level)
    setIsOpen(false)
  }
  
  const levels: Array<{
    id: TechnicalLevel
    icon: React.ReactNode
    iconColor: string
    bgColor: string
  }> = [
    {
      id: 'noob',
      icon: <SeedlingIcon className="w-4 h-4" />,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'informato',
      icon: <BookIcon className="w-4 h-4" />,
      iconColor: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-500/10'
    },
    {
      id: 'smart',
      icon: <SparklesIcon className="w-4 h-4" />,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10'
    }
  ]
  
  const currentLevel = levels.find(l => l.id === technicalLevel) || levels[1]
  
  if (!currentLevel) return null // Safety check
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSyncing}
        className="
          flex items-center gap-2 px-3 py-2 rounded-lg
          border border-border/50 bg-background
          hover:bg-muted/50 hover:border-border
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          min-h-[40px] tap-target
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('change')}
      >
        {/* Icon */}
        <div className={`
          w-7 h-7 rounded-lg flex items-center justify-center
          ${currentLevel.bgColor}
        `}>
          <div className={currentLevel.iconColor}>
            {currentLevel.icon}
          </div>
        </div>
        
        {/* Label (hidden on mobile) */}
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {t(`${technicalLevel}.shortTitle`)}
        </span>
        
        {/* Chevron */}
        <ChevronDownIcon 
          className={`
            w-3 h-3 text-muted-foreground transition-transform duration-150
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
        
        {/* Syncing indicator */}
        {isSyncing && (
          <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2 w-72
          bg-background border-2 border-border/50 rounded-xl
          shadow-xl z-50
          animate-in fade-in slide-in-from-top-2 duration-150
        ">
          <div className="p-2">
            {levels.map((level) => {
              const isSelected = technicalLevel === level.id
              
              return (
                <button
                  key={level.id}
                  onClick={() => handleSelect(level.id)}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg
                    text-left transition-all duration-150
                    min-h-[44px] tap-target
                    ${isSelected 
                      ? `${level.bgColor} border-2 border-${level.iconColor.split('-')[1]}/30` 
                      : 'hover:bg-muted/50'
                    }
                  `}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Icon */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? level.bgColor : 'bg-muted/30'}
                  `}>
                    <div className={isSelected ? level.iconColor : 'text-muted-foreground'}>
                      {level.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {t(`${level.id}.title`)}
                      </span>
                      {isSelected && (
                        <CheckIcon className={`w-3 h-3 ${level.iconColor}`} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground reading-line-height">
                      {t(`${level.id}.description`)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Footer hint */}
          <div className="px-3 py-2 border-t border-border/30 bg-muted/20">
            <p className="text-xs text-muted-foreground text-center">
              {t('description')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
