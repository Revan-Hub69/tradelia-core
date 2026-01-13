/**
 * HelpPanel Component - Tradelia 2026
 * 
 * Contextual help panel showing definition, common errors, and what to look for.
 * Dismissable with ESC key or click outside.
 * 
 * @see Requirements 23.1, 23.2, 23.3
 */

'use client'

import { useTranslations } from 'next-intl'
import { useDismissableLayer } from '@/src/shared/hooks/useDismissableLayer'
import { cn } from './utils'
import {
  CloseIcon,
  AlertTriangleIcon,
  EyeIcon,
  BookOpenIcon,
} from '@/components/icons/TradeliaIcons'

export interface HelpContent {
  /** Title of the help topic */
  title: string
  /** Definition/explanation of the concept */
  definition: string
  /** Common errors users make */
  commonErrors: string[]
  /** What to look for / key points */
  whatToLook: string[]
  /** Optional related links */
  relatedLinks?: { label: string; href: string }[]
}

export interface HelpPanelProps {
  /** Whether the panel is open */
  isOpen: boolean
  /** Callback when panel should close */
  onClose: () => void
  /** Help content to display */
  content: HelpContent
  /** Optional className for positioning */
  className?: string
  /** Position relative to trigger */
  position?: 'right' | 'left' | 'bottom'
}

export function HelpPanel({ 
  isOpen, 
  onClose, 
  content,
  className,
  position = 'right'
}: HelpPanelProps) {
  const t = useTranslations('help')
  const layerRef = useDismissableLayer<HTMLDivElement>(isOpen, onClose)

  if (!isOpen) return null

  const positionClasses = {
    right: 'right-0 top-0',
    left: 'left-0 top-0',
    bottom: 'left-0 top-full mt-2'
  }

  return (
    <div
      ref={layerRef}
      className={cn(
        'absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg',
        'animate-in fade-in slide-in-from-right-2 duration-200',
        positionClasses[position],
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-panel-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 id="help-panel-title" className="text-sm font-semibold flex items-center gap-2">
          <BookOpenIcon className="w-4 h-4 text-primary" />
          {content.title}
        </h3>
        <button
          onClick={onClose}
          className="tap-target p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={t('close')}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-sm max-h-80 overflow-y-auto">
        {/* Definition */}
        <div>
          <h4 className="font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <BookOpenIcon className="w-3.5 h-3.5" />
            {t('whatIs')}
          </h4>
          <p className="text-foreground leading-relaxed">{content.definition}</p>
        </div>

        {/* Common Errors */}
        {content.commonErrors.length > 0 && (
          <div>
            <h4 className="font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <AlertTriangleIcon className="w-3.5 h-3.5 text-warning" />
              {t('commonErrors')}
            </h4>
            <ul className="space-y-1.5">
              {content.commonErrors.map((error, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <span className="text-warning mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What to Look For */}
        {content.whatToLook.length > 0 && (
          <div>
            <h4 className="font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <EyeIcon className="w-3.5 h-3.5 text-primary" />
              {t('whatToLook')}
            </h4>
            <ul className="space-y-1.5">
              {content.whatToLook.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Links */}
        {content.relatedLinks && content.relatedLinks.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <h4 className="font-medium text-muted-foreground mb-1.5">
              {t('relatedLinks')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {content.relatedLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HelpPanel
