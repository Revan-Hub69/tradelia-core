/**
 * Premium Drawer - Tradelia 2026
 * 
 * Sistema drawer unificato: professionale, elegante
 * Scroll lock semplice (overflow: hidden), z-index 50
 */

'use client'

import { 
  useEffect, 
  useRef, 
  type ReactNode
} from 'react'

export interface PremiumDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  subtitle?: string | undefined
  icon?: ReactNode
  accentColor?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  footer?: ReactNode
  className?: string
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

const ACCENT_COLORS = {
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary'
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20', 
    text: 'text-emerald-600 dark:text-emerald-400'
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-600 dark:text-red-400'
  }
}

export function PremiumDrawer({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  icon,
  accentColor = 'primary',
  size = 'lg',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className = ''
}: PremiumDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const accent = ACCENT_COLORS[accentColor]

  // Scroll lock SEMPLICE - come quello funzionante
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      setTimeout(() => {
        previousActiveElement.current?.focus()
      }, 200)
    }
  }, [isOpen])

  // ESC to close
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    setTimeout(() => firstElement?.focus(), 100)

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-label="Chiudi"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={`
          absolute top-0 right-0 bottom-0
          w-full ${SIZES[size]}
          bg-background border-l border-border/50
          shadow-xl
          flex flex-col
          overflow-hidden
          animate-slide-in-right
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <header className="flex-shrink-0 px-6 py-5 border-b border-border/30">
            <div className="flex items-start justify-between gap-4">
              {title && (
                <div className="flex items-center gap-4 min-w-0">
                  {icon && (
                    <div className={`w-12 h-12 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
                      <div className={accent.text}>{icon}</div>
                    </div>
                  )}
                  <div className="min-w-0">
                    {subtitle && (
                      <p className={`text-xs font-semibold ${accent.text} uppercase tracking-wider mb-0.5`}>
                        {subtitle}
                      </p>
                    )}
                    <h2 id="drawer-title" className="text-xl font-semibold text-foreground truncate">
                      {title}
                    </h2>
                  </div>
                </div>
              )}

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 border border-border/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Chiudi"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className="flex-shrink-0 px-6 py-4 border-t border-border/30 bg-muted/10">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

// Preset variants
export function InfoDrawer(props: Omit<PremiumDrawerProps, 'accentColor'>) {
  return <PremiumDrawer {...props} accentColor="primary" />
}

export function SuccessDrawer(props: Omit<PremiumDrawerProps, 'accentColor'>) {
  return <PremiumDrawer {...props} accentColor="success" />
}

export function WarningDrawer(props: Omit<PremiumDrawerProps, 'accentColor'>) {
  return <PremiumDrawer {...props} accentColor="warning" />
}

export function ErrorDrawer(props: Omit<PremiumDrawerProps, 'accentColor'>) {
  return <PremiumDrawer {...props} accentColor="error" />
}
