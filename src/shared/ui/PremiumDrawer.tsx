/**
 * Premium Drawer - Tradelia 2026 Enterprise Edition
 * 
 * Google/OpenAI/Binance-Level Standards Implementation
 * 
 * Enterprise Enhancements:
 * - WAI-ARIA APG dialog/modal pattern compliance
 * - WCAG 2.2 Focus Not Obscured (scroll-margin)
 * - Enterprise contrast standards (≥7:1, 4.5:1, 3.5:1)
 * - Professional motion system (160-280ms)
 * - I18N safety with user-safe fallbacks
 * - Semantic alert correctness (warning ≠ danger)
 * - Content structure optimization for scanning
 * - Apple HIG dark mode compliance
 */

'use client'

import React, { 
  useEffect, 
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type TouchEvent as ReactTouchEvent
} from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon, InfoIcon, AlertTriangleIcon, CheckIcon } from '@/components/icons/TradeliaIcons'
import { useDeepLink } from '../hooks/useDeepLink'
import { useDrawerTabRestore } from '../hooks/useSessionContinuity'
import { useScrollShadow } from '../hooks/useScrollShadow'
import { useSafeTranslations } from '../lib/i18n-safe'

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
  /** Internal breadcrumb path for sticky header (REQ 24.4) */
  breadcrumb?: string[]
  /** Enable swipe to close on mobile (REQ 24.3) */
  enableSwipeClose?: boolean
}

interface AlertEnterpriseProps {
  type: 'info' | 'warning' | 'danger' | 'success'
  title: string
  message: string
  className?: string
}

interface DrawerListItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

interface ProgressStateBadgeProps {
  state: 'not-started' | 'fundamental' | 'in-progress' | 'completed'
  timeEstimate?: string
}

interface CTAEnterpriseProps {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

interface FocusChipProps {
  children: ReactNode
  isPrimary?: boolean
  className?: string
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

/**
 * Enterprise Alert Component with semantic correctness
 */
export function AlertEnterprise({ type, title, message, className = '' }: AlertEnterpriseProps) {
  const iconMap = {
    info: InfoIcon,
    warning: AlertTriangleIcon,
    danger: AlertTriangleIcon, // Using AlertTriangleIcon for danger too
    success: CheckIcon
  }
  
  const Icon = iconMap[type]
  
  return (
    <div className={`alert-enterprise-${type} ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          <p className="text-sm reading-line-height">{message}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Enterprise Drawer List Item
 * Optimized for scanning with proper spacing and hierarchy
 */
export function DrawerListItem({ 
  children, 
  className = '',
  onClick 
}: DrawerListItemProps) {
  const Component = onClick ? 'button' : 'div'
  
  return (
    <Component
      onClick={onClick}
      className={`drawer-list-item ${onClick ? 'tap-target focus-enterprise-ring cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Component>
  )
}

/**
 * Enterprise Progress State Badge
 * Clear, specific states instead of generic "Da completare"
 */
export function ProgressStateBadge({ 
  state, 
  timeEstimate 
}: ProgressStateBadgeProps) {
  const stateConfig = {
    'not-started': {
      label: 'Non iniziato',
      className: 'progress-state-not-started'
    },
    'fundamental': {
      label: 'Fondamentale',
      className: 'progress-state-fundamental'
    },
    'in-progress': {
      label: 'In corso',
      className: 'progress-state-not-started'
    },
    'completed': {
      label: 'Completato',
      className: 'progress-state-completed'
    }
  }
  
  const config = stateConfig[state]
  
  return (
    <span className={config.className}>
      {config.label}
      {timeEstimate && state === 'fundamental' && (
        <span className="text-xs opacity-75"> · {timeEstimate}</span>
      )}
    </span>
  )
}

/**
 * Enterprise CTA Button
 * Clear action description, not generic
 */
export function CTAEnterprise({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  className = ''
}: CTAEnterpriseProps) {
  const baseClass = variant === 'primary' ? 'cta-enterprise-primary' : 'cta-enterprise-secondary'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} focus-enterprise-ring disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * Focus Chip with hierarchy
 * First chip primary, others secondary for better scanning
 */
export function FocusChip({
  children,
  isPrimary = false,
  className = ''
}: FocusChipProps) {
  const chipClass = isPrimary ? 'focus-chip-primary' : 'focus-chip-secondary'
  
  return (
    <span className={`${chipClass} ${className}`}>
      {children}
    </span>
  )
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
  onTabRestore,
  breadcrumb,
  enableSwipeClose = true
}: PremiumDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [hasRestoredTab, setHasRestoredTab] = useState(false)
  const accent = ACCENT_COLORS[accentColor]
  const safeT = useSafeTranslations()
  
  // Swipe to close state (REQ 24.3)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  
  // Scroll shadow for header (REQ 24.6)
  const { isScrolled } = useScrollShadow(contentRef)
  
  // Deep linking support (REQ 17.3, 17.4)
  const { setDeepLink, clearDeepLink, getCurrentUrl } = useDeepLink()
  
  // Session continuity for tab restore (REQ 18.3)
  const { lastDrawerTab, setLastDrawerTab, isRestored: isSessionRestored } = useDrawerTabRestore()

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Focus management - WAI-ARIA APG pattern
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Make page inert (not focusable) - this replaces aria-hidden
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.setAttribute('inert', '')
      }
      
      // Focus first focusable element after a short delay to ensure drawer is rendered
      const focusTimer = setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 150)
      
      return () => clearTimeout(focusTimer)
    } else {
      // Remove inert from page
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.removeAttribute('inert')
      }
      
      // Restore focus with proper timing
      if (previousActiveElement.current) {
        // Use requestAnimationFrame to ensure DOM is ready after route change
        requestAnimationFrame(() => {
          const restoreTimer = setTimeout(() => {
            // Check if the element is still in the DOM (might be removed after route change)
            if (previousActiveElement.current && document.body.contains(previousActiveElement.current)) {
              previousActiveElement.current.focus()
            }
          }, 100)
          
          return () => clearTimeout(restoreTimer)
        })
      }
    }
    
    return () => {
      // Cleanup on unmount
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.removeAttribute('inert')
      }
    }
  }, [isOpen])

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

  // Swipe to close handlers (REQ 24.3)
  const handleTouchStart = useCallback((e: ReactTouchEvent) => {
    if (!enableSwipeClose) return
    const touch = e.touches[0]
    if (!touch) return
    setTouchStart(touch.clientY)
    setTouchStartX(touch.clientX)
  }, [enableSwipeClose])

  const handleTouchMove = useCallback((e: ReactTouchEvent) => {
    if (!enableSwipeClose || touchStart === null || touchStartX === null) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    const currentY = touch.clientY
    const currentX = touch.clientX
    const diffY = currentY - touchStart
    const diffX = Math.abs(currentX - touchStartX)
    
    // Only track vertical swipes (not horizontal scrolling)
    // Swipe down only (positive diff) and more vertical than horizontal
    if (diffY > 0 && diffY > diffX) {
      setSwipeOffset(Math.min(diffY, 150)) // Cap at 150px
    }
  }, [enableSwipeClose, touchStart, touchStartX])

  const handleTouchEnd = useCallback(() => {
    if (!enableSwipeClose || touchStart === null) {
      setTouchStart(null)
      setTouchStartX(null)
      setSwipeOffset(0)
      return
    }
    
    // Close if swiped down more than 100px
    if (swipeOffset > 100) {
      onClose()
    }
    
    setTouchStart(null)
    setTouchStartX(null)
    setSwipeOffset(0)
  }, [enableSwipeClose, touchStart, swipeOffset, onClose])

  // Scroll lock - iOS safe (REQ 24.1)
  // Uses overflow hidden on both body and html
  useEffect(() => {
    if (!isOpen) return
    
    // Lock scroll on body AND html
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  // ESC to close - WCAG requirement
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

  // Scroll to top when drawer opens (REQ 24.5)
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [isOpen])

  // Scroll to top on tab change (REQ 24.5)
  useEffect(() => {
    if (isOpen && contentRef.current && activeTab) {
      contentRef.current.scrollTop = 0
    }
  }, [activeTab, isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

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

      {/* Drawer Panel - Enterprise Pattern */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={`
          drawer-enterprise
          absolute top-0 right-0 h-full
          w-full ${SIZES[size]}
          flex flex-col
          animate-slide-in-right
          ${className}
        `}
        style={{ 
          height: '100dvh', 
          maxHeight: '100dvh',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          transform: swipeOffset > 0 ? `translateY(${swipeOffset}px)` : undefined,
          transition: swipeOffset === 0 ? 'transform 0.2s ease-out' : 'none',
          touchAction: 'pan-x' // Allow horizontal scroll, control vertical
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with Enterprise styling and scroll shadow */}
        {(title || showCloseButton || minimalHeader) && (
          <header 
            className={`drawer-enterprise-header ${isScrolled ? 'scrolled' : ''}`}
          >
            {minimalHeader ? (
              /* Header minimalista mobile: solo torna indietro */
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors focus-enterprise-ring rounded-lg px-2 py-1 -ml-2"
                aria-label={safeT('drawer.backAndClose', 'Torna indietro e chiudi pannello')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {safeT('drawer.back', 'Torna indietro')}
              </button>
            ) : (
              /* Header standard with enterprise styling */
              <div className="flex flex-col gap-2">
                {/* Breadcrumb row */}
                {breadcrumb && breadcrumb.length > 0 && (
                  <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-enterprise-secondary">
                    {breadcrumb.map((item, index) => (
                      <span key={`breadcrumb-${item.replace(/\s+/g, '-').toLowerCase()}-${index}`} className="flex items-center gap-1">
                        {index > 0 && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        <span className={index === breadcrumb.length - 1 ? 'text-enterprise-primary font-medium' : ''}>
                          {item}
                        </span>
                      </span>
                    ))}
                  </nav>
                )}
                
                {/* Title row */}
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
                        <h2 id="drawer-title" className="text-enterprise-primary text-lg sm:text-xl font-semibold truncate">
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
                        className="tap-target-icon focus-enterprise-ring p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        aria-label={copySuccess ? safeT('drawer.linkCopied', 'Link copiato!') : safeT('drawer.copyLink', 'Copia link sezione')}
                        title={copySuccess ? safeT('drawer.linkCopied', 'Link copiato!') : safeT('drawer.copyLink', 'Copia link sezione')}
                      >
                        {copySuccess ? (
                          <CheckIcon className="w-4 h-4 text-success" aria-hidden="true" />
                        ) : (
                          <InfoIcon className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    )}

                    {/* Close Button */}
                    {showCloseButton && (
                      <button
                        ref={!minimalHeader ? firstFocusableRef : undefined}
                        onClick={onClose}
                        className="tap-target-icon focus-enterprise-ring p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        aria-label={safeT('drawer.close', 'Chiudi pannello')}
                      >
                        <CloseIcon className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </header>
        )}

        {/* Content with Enterprise styling and focus scroll-margin */}
        <div 
          ref={contentRef}
          className="drawer-enterprise-content flex-1 overflow-y-auto drawer-scrollable"
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className="border-t border-enterprise-soft p-6 bg-card">
            {footer}
          </footer>
        )}
        
        {/* Hidden close button for screen readers */}
        {!showCloseButton && !minimalHeader && (
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="sr-only"
            aria-label={safeT('drawer.close', 'Chiudi drawer')}
          >
            {safeT('drawer.close', 'Chiudi')}
          </button>
        )}
      </div>
    </div>
  )

  // Render via portal to body
  return createPortal(drawerContent, document.body)
}

// Preset variants with enterprise styling
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
