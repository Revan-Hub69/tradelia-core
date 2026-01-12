/**
 * Premium Drawer - Tradelia 2026
 * 
 * Sistema drawer unificato: professionale, elegante
 * Usa createPortal per renderizzare a livello body (fuori dal layout)
 * Supporta deep linking con URL params (REQ 17.3, 17.4, 17.5)
 * Supporta session continuity per tab restore (REQ 18.3)
 */

'use client'

import { 
  useEffect, 
  useRef,
  useState,
  useCallback,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'
import { useDeepLink } from '../hooks/useDeepLink'
import { useDrawerTabRestore } from '../hooks/useSessionContinuity'

export interface PremiumDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  subtitle?: string | undefined
  icon?: ReactNode
  accentColor?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  footer?: ReactNode
  className?: string
  /** Header minimalista mobile: solo "← Torna indietro" */
  minimalHeader?: boolean
  /** Panel ID for deep linking - when set, URL updates with ?panel= */
  panelId?: string
  /** Current tab ID for deep linking - when set, URL updates with ?tab= */
  activeTab?: string
  /** Show copy link button in header (REQ 17.5) */
  showCopyLink?: boolean
  /** Callback when link is copied */
  onCopyLink?: () => void
  /** Callback when tab should be restored from session (REQ 18.3) */
  onTabRestore?: (tab: string) => void
}

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full'
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
  className = '',
  minimalHeader = false,
  panelId,
  activeTab,
  showCopyLink = false,
  onCopyLink,
  onTabRestore
}: PremiumDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [hasRestoredTab, setHasRestoredTab] = useState(false)
  const accent = ACCENT_COLORS[accentColor]
  
  // Deep linking support (REQ 17.3, 17.4)
  const { setDeepLink, clearDeepLink, getCurrentUrl } = useDeepLink()
  
  // Session continuity for tab restore (REQ 18.3)
  const { lastDrawerTab, setLastDrawerTab, isRestored: isSessionRestored } = useDrawerTabRestore()

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update URL when drawer opens/closes (REQ 17.3)
  useEffect(() => {
    if (!panelId) return

    if (isOpen) {
      // Set panel param when drawer opens
      const params: { panel: string; tab?: string } = { panel: panelId }
      if (activeTab) {
        params.tab = activeTab
      }
      setDeepLink(params)
    } else {
      // Clear panel and tab params when drawer closes
      clearDeepLink(['panel', 'tab'])
    }
  }, [isOpen, panelId, activeTab, setDeepLink, clearDeepLink])

  // Update tab in URL when activeTab changes (REQ 17.3)
  useEffect(() => {
    if (!isOpen || !panelId || !activeTab) return
    setDeepLink({ tab: activeTab })
  }, [activeTab, isOpen, panelId, setDeepLink])

  // Restore tab from session when drawer opens (REQ 18.3)
  useEffect(() => {
    if (!isOpen || !isSessionRestored || hasRestoredTab) return
    
    // Only restore if we have a saved tab and a callback to handle it
    if (lastDrawerTab && onTabRestore) {
      onTabRestore(lastDrawerTab)
    }
    setHasRestoredTab(true)
  }, [isOpen, isSessionRestored, hasRestoredTab, lastDrawerTab, onTabRestore])

  // Remember current tab in session (REQ 18.3)
  useEffect(() => {
    if (!isOpen || !activeTab) return
    setLastDrawerTab(activeTab)
  }, [isOpen, activeTab, setLastDrawerTab])

  // Reset tab restoration flag when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setHasRestoredTab(false)
    }
  }, [isOpen])

  // Copy link handler (REQ 17.5)
  const handleCopyLink = useCallback(async () => {
    try {
      const url = getCurrentUrl()
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      onCopyLink?.()
      
      // Reset success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }, [getCurrentUrl, onCopyLink])

  // Scroll lock - nasconde ENTRAMBE le scrollbar
  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement
    
    // Lock scroll su body E html
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
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

  // Scroll to top quando il drawer si apre
  const contentRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Reset scroll position to top
      contentRef.current.scrollTop = 0
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus sul primo elemento E scroll to top
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
      firstElement?.focus()
    }, 100)

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

  if (!isOpen || !mounted) return null

  const drawerContent = (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop - Premium Motion 2026 (REQ 15.2) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-backdrop-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={`
          absolute top-0 right-0 h-full
          w-full ${SIZES[size]}
          bg-background border-l border-border/50
          shadow-2xl
          flex flex-col
          animate-slide-in-right
          ${className}
        `}
        style={{ 
          height: '100dvh', 
          maxHeight: '100dvh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Header */}
        {(title || showCloseButton || minimalHeader) && (
          <header className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-border/30">
            {minimalHeader ? (
              /* Header minimalista mobile: solo torna indietro */
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg px-2 py-1 -ml-2"
                aria-label="Torna indietro e chiudi pannello"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Torna indietro
              </button>
            ) : (
              /* Header standard con titolo */
              <div className="flex items-start justify-between gap-4">
                {title && (
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {icon && (
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
                        <div className={accent.text}>{icon}</div>
                      </div>
                    )}
                    <div className="min-w-0">
                      {subtitle && (
                        <p className={`text-xs font-semibold ${accent.text} uppercase tracking-wider mb-0.5`}>
                          {subtitle}
                        </p>
                      )}
                      <h2 id="drawer-title" className="text-lg sm:text-xl font-semibold text-foreground truncate">
                        {title}
                      </h2>
                    </div>
                  </div>
                )}

                {/* Header action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Copy Link Button (REQ 17.5) */}
                  {showCopyLink && panelId && (
                    <button
                      onClick={handleCopyLink}
                      className="tap-target-icon w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 border border-border/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label={copySuccess ? 'Link copiato!' : 'Copia link sezione'}
                      title={copySuccess ? 'Link copiato!' : 'Copia link sezione'}
                    >
                      {copySuccess ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Close Button */}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="tap-target-icon w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 border border-border/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label="Chiudi pannello"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </header>
        )}

        {/* Content - SOLO questa parte scrolla */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain"
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-border/30 bg-muted/10">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )

  // Render via portal to body
  return createPortal(drawerContent, document.body)
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
