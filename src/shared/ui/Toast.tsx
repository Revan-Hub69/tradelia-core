/**
 * Toast Notification System - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Posizione: top-right
 * - Auto-dismiss: 5s (info/success), manual (error)
 * - Max 3 visibili contemporaneamente
 * - Animazioni enter/exit
 * - Accessibilità: role="alert", aria-live
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  CheckIcon, 
  AlertTriangleIcon, 
  CloseIcon,
  InfoIcon
} from '@/components/icons/TradeliaIcons'

// Types
type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message?: string
  duration?: number // ms, 0 = manual dismiss
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

// Context
const ToastContext = createContext<ToastContextType | null>(null)

// Hook
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Provider
interface ToastProviderProps {
  children: ReactNode
  maxToasts?: number
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const duration = toast.duration ?? (toast.variant === 'error' ? 0 : 5000)
    
    setToasts(prev => {
      const newToasts = [...prev, { ...toast, id, duration }]
      // Keep only last maxToasts
      return newToasts.slice(-maxToasts)
    })

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }, [maxToasts, removeToast])

  // Convenience methods
  const success = useCallback((title: string, message?: string) => {
    addToast({ variant: 'success', title, ...(message && { message }) })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ variant: 'error', title, duration: 0, ...(message && { message }) })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ variant: 'warning', title, ...(message && { message }) })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ variant: 'info', title, ...(message && { message }) })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container
interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div 
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label="Notifiche"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Single Toast
interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 150)
  }

  // Keyboard dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const variantStyles = {
    success: {
      bg: 'bg-background border-success/30',
      icon: <CheckIcon className="w-5 h-5 text-success" />,
      title: 'text-success'
    },
    error: {
      bg: 'bg-background border-error/30',
      icon: <AlertTriangleIcon className="w-5 h-5 text-error" />,
      title: 'text-error'
    },
    warning: {
      bg: 'bg-background border-warning/30',
      icon: <AlertTriangleIcon className="w-5 h-5 text-warning" />,
      title: 'text-warning'
    },
    info: {
      bg: 'bg-background border-primary/30',
      icon: <InfoIcon className="w-5 h-5 text-primary" />,
      title: 'text-primary'
    }
  }

  const styles = variantStyles[toast.variant]

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto w-80 max-w-[calc(100vw-2rem)]
        ${styles.bg} border rounded-lg shadow-lg
        p-4 flex items-start gap-3
        ${isExiting ? 'animate-toast-exit' : 'animate-toast-enter'}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${styles.title}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-muted-foreground mt-1">
            {toast.message}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="tap-target-icon flex-shrink-0 p-1.5 -mr-1 -mt-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Chiudi notifica"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

// Export types
export type { Toast, ToastVariant, ToastContextType }
