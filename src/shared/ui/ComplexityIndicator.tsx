/**
 * Complexity Indicator - Tradelia 2026
 * 
 * Indicatore di complessità cognitiva per pre-orientamento utente
 * Riduce ansia da scelta e previene overconfidence
 */

'use client'

import { useTranslations } from 'next-intl'
import { InfoIcon } from '@/components/icons/TradeliaIcons'

export type ComplexityLevel = 'low' | 'medium' | 'medium-high' | 'high' | 'very-high'

interface ComplexityIndicatorProps {
  level: ComplexityLevel
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const COMPLEXITY_CONFIG = {
  'low': {
    dots: 1,
    label: 'Bassa',
    description: 'Concetti chiari, pochi strumenti, focus su accesso e limiti'
  },
  'medium': {
    dots: 2,
    label: 'Media',
    description: 'Richiede attenzione di base, concetti accessibili'
  },
  'medium-high': {
    dots: 3,
    label: 'Medio-Alta',
    description: 'Meccanismi meno intuitivi, rischi nascosti da comprendere'
  },
  'high': {
    dots: 4,
    label: 'Alta',
    description: 'Richiede disciplina, bias temporali, decisioni a lungo termine'
  },
  'very-high': {
    dots: 5,
    label: 'Altissima',
    description: 'Altissimo carico cognitivo, contesto dinamico, errori frequenti'
  }
}

export function ComplexityIndicator({ 
  level, 
  showLabel = true, 
  size = 'md',
  className = '' 
}: ComplexityIndicatorProps) {
  const t = useTranslations('common.complexity')
  const config = COMPLEXITY_CONFIG[level]
  
  const sizeClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2'
  }
  
  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-1.5">
          <span className={`font-medium text-muted-foreground ${textSizeClasses[size]}`}>
            {t('label')}:
          </span>
          <div 
            className="group relative cursor-help"
            title={config.description}
          >
            <InfoIcon className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
            
            {/* Tooltip */}
            <div className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
              bg-background border border-border/50 rounded-lg shadow-lg
              text-xs text-muted-foreground max-w-64 text-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none z-50
            ">
              <div className="font-medium text-foreground mb-1">
                Complessità {config.label}
              </div>
              <div className="leading-relaxed">
                {config.description}
              </div>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-r border-b border-border/50 rotate-45 -mt-1" />
            </div>
          </div>
        </div>
      )}
      
      {/* Dots Indicator */}
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {Array.from({ length: 5 }, (_, index) => {
          const isActive = index < config.dots
          const dotIndex = index + 1
          
          // Determine dot color based on position and activity
          let dotColor = 'bg-muted/30' // Default inactive
          
          if (isActive) {
            if (dotIndex <= 2) {
              dotColor = 'bg-success' // Green for low complexity
            } else if (dotIndex === 3) {
              dotColor = 'bg-warning' // Orange for medium
            } else {
              dotColor = 'bg-error' // Red for high complexity
            }
          }
          
          return (
            <div
              key={index}
              className={`
                ${dotSizeClasses[size]} rounded-full transition-all duration-200
                ${dotColor}
                ${isActive ? 'opacity-100' : 'opacity-40'}
              `}
            />
          )
        })}
      </div>
      
      {showLabel && (
        <span className={`font-medium text-foreground ${textSizeClasses[size]}`}>
          {config.label}
        </span>
      )}
    </div>
  )
}

// Preset components for specific complexity levels
export function LowComplexity(props: Omit<ComplexityIndicatorProps, 'level'>) {
  return <ComplexityIndicator level="low" {...props} />
}

export function MediumComplexity(props: Omit<ComplexityIndicatorProps, 'level'>) {
  return <ComplexityIndicator level="medium" {...props} />
}

export function MediumHighComplexity(props: Omit<ComplexityIndicatorProps, 'level'>) {
  return <ComplexityIndicator level="medium-high" {...props} />
}

export function HighComplexity(props: Omit<ComplexityIndicatorProps, 'level'>) {
  return <ComplexityIndicator level="high" {...props} />
}

export function VeryHighComplexity(props: Omit<ComplexityIndicatorProps, 'level'>) {
  return <ComplexityIndicator level="very-high" {...props} />
}

// Compact version for cards
export function ComplexityDots({ 
  level, 
  size = 'sm' 
}: { 
  level: ComplexityLevel
  size?: 'sm' | 'md' | 'lg' 
}) {
  return (
    <ComplexityIndicator 
      level={level} 
      showLabel={false} 
      size={size}
    />
  )
}