/**
 * Premium Drawer - Tradelia 2026
 * 
 * Sistema drawer unificato: professionale, elegante, innovativo
 * Design accademico con transizioni raffinate
 */

'use client'

import { 
  useEffect, 
  useRef, 
  useCallback, 
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'

export interface PremiumDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  subtitle?: string | undefined
  icon?: ReactNode
  accentColor?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'right' | 'left'
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
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    text: 'text-primary',
    glow: 'shadow-primary/5'
  },
  success: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20', 
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/5'
  },
  warning: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/5'
  },
  error: {
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    glow: 'shadow-red-500/5'
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
  position = 'right',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className = ''
}: PremiumDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const accent = ACCENT_COLORS[accentColor]

  // Store previous focus and lock body scroll
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
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
    if (!closeOnEscape) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
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

    // Auto-focus first element
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

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) {
      onClose()
    }
  }, [closeOnBackdrop, onClose])

  if (typeof window === 'undefined') return null

  const positionClasses = position === 'right' 
    ? 'right-0 translate-x-full data-[open=true]:translate-x-0'
    : 'left-0 -translate-x-full data-[open=true]:translate-x-0'

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop - Premium glass effect */}
      <div 
        className={`
          absolute inset-0 
          bg-black/30 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        data-open={isOpen}
        className={`
          absolute top-0 ${position}-0 bottom-0
          w-full ${SIZES[size]}
          bg-background/98 backdrop-blur-xl
          border-${position === 'right' ? 'l' : 'r'} border-border/40
          shadow-2xl ${accent.glow}
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${positionClasses}
          ${className}
        `}
      >
        {/* Header - Refined & Professional */}
        {(title || showCloseButton) && (
          <header className="flex-shrink-0 px-6 py-5 border-b border-border/30">
            <div className="flex items-start justify-between gap-4">
              {/* Title Section */}
              {title && (
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon with accent */}
                  {icon && (
                    <div className={`
                      w-12 h-12 rounded-xl ${accent.bg} border ${accent.border}
                      flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                    `}>
                      <div className={accent.text}>
                        {icon}
                      </div>
                    </div>
                  )}
                  
                  {/* Text */}
                  <div className="min-w-0">
                    {subtitle && (
                      <p className={`text-xs font-semibold ${accent.text} uppercase tracking-wider mb-0.5`}>
                        {subtitle}
                      </p>
                    )}
                    <h2 
                      id="drawer-title" 
                      className="text-xl font-semibold text-foreground truncate"
                    >
                      {title}
                    </h2>
                  </div>
                </div>
              )}

              {/* Close Button - Elegant */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`
                    w-10 h-10 rounded-xl flex-shrink-0
                    flex items-center justify-center
                    text-muted-foreground hover:text-foreground
                    bg-muted/30 hover:bg-muted/50
                    border border-border/30 hover:border-border/50
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                  `}
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Footer - Optional */}
        {footer && (
          <footer className="flex-shrink-0 px-6 py-4 border-t border-border/30 bg-muted/10">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  )
}

// Preset variants for common use cases
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
