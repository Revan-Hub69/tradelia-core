/**
 * Technical Level Selector - Enterprise Edition
 * 
 * Features:
 * - Radio cards with visual feedback
 * - Icon for each level (Seedling/Book/Sparkles)
 * - Smooth animations (150ms)
 * - Full accessibility (WCAG 2.2 AA)
 * - Mobile-optimized (44px min touch target)
 * - Translations (IT/EN)
 */

'use client'

import { useTranslations } from 'next-intl'
import { 
  SeedlingIcon, 
  BookIcon, 
  SparklesIcon 
} from '@/src/shared/ui/icons/PreferencesIcons'

export type TechnicalLevel = 'noob' | 'informato' | 'smart'

interface TechnicalLevelSelectorProps {
  value: TechnicalLevel
  onChange: (level: TechnicalLevel) => void
  showDetails?: boolean
  className?: string
}

export function TechnicalLevelSelector({ 
  value, 
  onChange,
  showDetails = true,
  className = ''
}: TechnicalLevelSelectorProps) {
  const t = useTranslations('preferences.technicalLevel')
  
  const levels: Array<{
    id: TechnicalLevel
    icon: React.ReactNode
    iconColor: string
    borderColor: string
    bgColor: string
  }> = [
    {
      id: 'noob',
      icon: <SeedlingIcon className="w-5 h-5" />,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/5'
    },
    {
      id: 'informato',
      icon: <BookIcon className="w-5 h-5" />,
      iconColor: 'text-primary-600 dark:text-primary-400',
      borderColor: 'border-primary-500/30',
      bgColor: 'bg-primary-500/5'
    },
    {
      id: 'smart',
      icon: <SparklesIcon className="w-5 h-5" />,
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/5'
    }
  ]
  
  return (
    <div className={`space-y-3 ${className}`}>
      {levels.map((level) => {
        const isSelected = value === level.id
        
        return (
          <label 
            key={level.id}
            className={`
              group
              flex items-start gap-4 p-4 rounded-xl 
              border-2 cursor-pointer 
              transition-all duration-150
              min-h-[48px] tap-target
              ${isSelected 
                ? `${level.borderColor} ${level.bgColor}` 
                : 'border-border/50 hover:border-border bg-background hover:bg-muted/20'
              }
            `}
          >
            {/* Radio input (hidden but accessible) */}
            <input 
              type="radio"
              name="technical-level"
              value={level.id}
              checked={isSelected}
              onChange={() => onChange(level.id)}
              className="sr-only"
              aria-label={t(`${level.id}.title`)}
            />
            
            {/* Custom radio indicator */}
            <div className={`
              flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
              flex items-center justify-center
              transition-all duration-150
              ${isSelected 
                ? `${level.borderColor} ${level.bgColor}` 
                : 'border-border/50 group-hover:border-border'
              }
            `}>
              {isSelected && (
                <div className={`
                  w-2.5 h-2.5 rounded-full 
                  ${level.iconColor}
                  animate-in zoom-in duration-150
                `} 
                style={{ backgroundColor: 'currentColor' }}
                />
              )}
            </div>
            
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-lg 
              flex items-center justify-center
              transition-all duration-150
              ${isSelected 
                ? `${level.bgColor} ${level.borderColor} border` 
                : 'bg-muted/30 group-hover:bg-muted/50'
              }
            `}>
              <div className={isSelected ? level.iconColor : 'text-muted-foreground'}>
                {level.icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-base mb-1">
                {t(`${level.id}.title`)}
              </div>
              <div className="text-sm text-muted-foreground reading-line-height">
                {t(`${level.id}.description`)}
              </div>
              {showDetails && (
                <div className={`
                  text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30
                  transition-all duration-150
                  ${isSelected ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}
                `}>
                  {t(`${level.id}.details`)}
                </div>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}
