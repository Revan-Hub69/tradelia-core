'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon, InfoIcon, AlertTriangleIcon, CheckIcon } from '@/components/icons/TradeliaIcons';
import { useSafeTranslations } from '../lib/i18n-safe';

/**
 * Enterprise Drawer Component - Google/OpenAI/Binance Level
 * 
 * Implements:
 * - WAI-ARIA APG dialog/modal pattern
 * - WCAG 2.2 Focus Not Obscured
 * - Material Design 3 drawer/sheet patterns
 * - Apple HIG sheet accessibility
 * - Enterprise contrast standards (≥7:1, 4.5:1, 3.5:1)
 * - Professional motion system (160-280ms)
 */

interface DrawerEnterpriseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onCopyLink?: () => void;
  className?: string;
}

interface DrawerHeaderProps {
  title: string;
  subtitle?: string | undefined;
  onClose: () => void;
  onCopyLink?: (() => void) | undefined;
  isScrolled: boolean;
}

interface AlertEnterpriseProps {
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  className?: string;
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
  };
  
  const Icon = iconMap[type];
  
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
  );
}

/**
 * Enterprise Drawer Header with sticky behavior and scroll shadow
 */
function DrawerHeader({ title, subtitle, onClose, onCopyLink, isScrolled }: DrawerHeaderProps) {
  const safeT = useSafeTranslations();
  
  return (
    <div className={`drawer-enterprise-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 
            id="drawer-title" 
            className="text-enterprise-primary text-lg font-semibold mb-1"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-enterprise-secondary text-sm reading-line-height">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {onCopyLink && (
            <button
              onClick={onCopyLink}
              className="tap-target-icon focus-enterprise-ring p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label={safeT('drawer.copyLink', 'Copia link')}
            >
              <InfoIcon className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          
          <button
            onClick={onClose}
            className="tap-target-icon focus-enterprise-ring p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={safeT('drawer.close', 'Chiudi')}
          >
            <CloseIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Enterprise Drawer with full accessibility and UX standards
 */
export function DrawerEnterprise({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  onCopyLink,
  className = ''
}: DrawerEnterpriseProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  
  // Focus management - WAI-ARIA APG pattern
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Make page inert (not focusable) - this replaces aria-hidden
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('inert', '');
      }
      
      // Focus first focusable element after a short delay to ensure drawer is rendered
      const focusTimer = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 150);
      
      return () => clearTimeout(focusTimer);
    } else {
      // Remove inert from page
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('inert');
      }
      
      // Restore focus with proper timing
      if (previousFocusRef.current) {
        const restoreTimer = setTimeout(() => {
          if (previousFocusRef.current && document.body.contains(previousFocusRef.current)) {
            previousFocusRef.current.focus();
          }
        }, 100);
        
        return () => clearTimeout(restoreTimer);
      }
    }
    
    return () => {
      // Cleanup on unmount
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('inert');
      }
    };
  }, [isOpen]);
  
  // Scroll shadow detection
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setIsScrolled(contentRef.current.scrollTop > 0);
      }
    };
    
    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll, { passive: true });
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);
  
  // ESC key handler - WCAG requirement
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return;
      
      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Scrim with controlled blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-backdrop-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`drawer-enterprise fixed right-0 top-0 z-50 animate-slide-in-right ${className}`}
      >
        {/* Header */}
        <DrawerHeader
          title={title}
          subtitle={subtitle}
          onClose={onClose}
          onCopyLink={onCopyLink}
          isScrolled={isScrolled}
        />
        
        {/* Content */}
        <div 
          ref={contentRef}
          className="drawer-enterprise-content flex-1 overflow-y-auto drawer-scrollable"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="border-t border-enterprise-soft p-6 bg-card">
            {footer}
          </div>
        )}
        
        {/* Hidden close button for screen readers */}
        <button
          ref={firstFocusableRef}
          onClick={onClose}
          className="sr-only"
          aria-label="Chiudi drawer"
        >
          Chiudi
        </button>
      </div>
    </>
  );
}

/**
 * Enterprise Drawer List Item
 * Optimized for scanning with proper spacing and hierarchy
 */
export function DrawerListItem({ 
  children, 
  className = '',
  onClick 
}: { 
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`drawer-list-item ${onClick ? 'tap-target focus-enterprise-ring cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}

/**
 * Enterprise Progress State Badge
 * Clear, specific states instead of generic "Da completare"
 */
export function ProgressStateBadge({ 
  state, 
  timeEstimate 
}: { 
  state: 'not-started' | 'fundamental' | 'in-progress' | 'completed';
  timeEstimate?: string | undefined;
}) {
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
  };
  
  const config = stateConfig[state];
  
  return (
    <span className={config.className}>
      {config.label}
      {timeEstimate && state === 'fundamental' && (
        <span className="text-xs opacity-75"> · {timeEstimate}</span>
      )}
    </span>
  );
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
}: {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const baseClass = variant === 'primary' ? 'cta-enterprise-primary' : 'cta-enterprise-secondary';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} focus-enterprise-ring disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Focus Chip with hierarchy
 * First chip primary, others secondary for better scanning
 */
export function FocusChip({
  children,
  isPrimary = false,
  className = ''
}: {
  children: React.ReactNode;
  isPrimary?: boolean;
  className?: string;
}) {
  const chipClass = isPrimary ? 'focus-chip-primary' : 'focus-chip-secondary';
  
  return (
    <span className={`${chipClass} ${className}`}>
      {children}
    </span>
  );
}