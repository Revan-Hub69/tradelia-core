/**
 * HelpButton Component - Tradelia 2026
 * 
 * A "?" button that opens contextual help for a module.
 * Used in JourneyCard, ToolCard, and section headers.
 * 
 * @see Requirements 23.1
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { HelpPanel, type HelpContent } from './HelpPanel'
import { getHelpContent, type HelpModuleId, hasHelpContent } from '@/src/shared/lib/help-content'
import { cn } from './utils'

interface HelpButtonProps {
  /** Module ID for help content */
  moduleId: HelpModuleId | string
  /** Optional custom help content (overrides moduleId lookup) */
  customContent?: HelpContent
  /** Size variant */
  size?: 'sm' | 'md'
  /** Additional className */
  className?: string
  /** Position of the help panel */
  panelPosition?: 'right' | 'left' | 'bottom'
  /** Stop event propagation (useful when inside clickable cards) */
  stopPropagation?: boolean
}

export function HelpButton({
  moduleId,
  customContent,
  size = 'sm',
  className,
  panelPosition = 'right',
  stopPropagation = true,
}: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('help')
  const tModules = useTranslations('help.modules')

  // Get help content from translations or use custom content
  const content = customContent || (hasHelpContent(moduleId) ? getHelpContent(moduleId as HelpModuleId, tModules) : null)

  // Don't render if no content available
  if (!content) {
    return null
  }

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
  }

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
      e.preventDefault()
    }
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (stopPropagation) {
        e.stopPropagation()
        e.preventDefault()
      }
      setIsOpen(true)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1',
          'min-w-[24px] min-h-[24px]', // WCAG 2.5.8 target size
          sizeClasses[size],
          className
        )}
        aria-label={t('buttonLabel')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        <span className="font-semibold">?</span>
      </button>

      <HelpPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={content}
        position={panelPosition}
        className={cn(
          panelPosition === 'right' && 'left-full ml-2',
          panelPosition === 'left' && 'right-full mr-2',
          panelPosition === 'bottom' && 'left-0 top-full mt-2'
        )}
      />
    </div>
  )
}

export default HelpButton
