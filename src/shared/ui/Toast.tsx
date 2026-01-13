/**
 * Toast Notification System - Tradelia 2026
 * 
 * Seguendo ux-contract.md + REQ 21.2, 21.3:
 * - Posizione: top-right
 * - Auto-dismiss: 5s (info/success), manual (error)
 * - Max 1 visibile (queue system) - REQ 21.3
 * - Animazioni enter/exit
 * - Accessibilità: role="alert", aria-live
 * - Undo support for reversible actions - REQ 21.2
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { 
  CheckIcon, 
  AlertTriangleIcon, 
  CloseIcon,
  InfoIcon
} from '@/components/icons/TradeliaIcons'

// Types
type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastAction {
  label: string
  onClick: () => void
}

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  message?: string
  duration?: number // ms, 0 = manual dismiss
  action?: ToastAction // For undo/retry actions (REQ 21.2)
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string, action?: ToastAction) => void
  error: (title: string, message?: string, action?: ToastAction) => void
  warning: (title: string, message?: string, action?: ToastAction) => void
  info: (title: string, message?: string, action?: ToastAction) => void
  /** Show a toast with undo action for reversible operations */
  successWithUndo: (title: string, onUndo: () => void, message?: string) => void
  /** Show an error toast with retry action (REQ 25.4) */
  errorWithRetry: (title: string, onRetry: () => void, message?: string) => void
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

export function ToastProvider({ children, maxToasts = 1 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [queue, setQueue] = useState<Toast[]>([])
  const timeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeToast = useCallback((id: string) => {
    // Clear any existing timeout for this toast
    const timeout = timeoutRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRef.current.delete(id)
    }
    
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Process queue when a toast is removed
  useEffect(() => {
    if (toasts.length < maxToasts && queue.length > 0) {
      const nextToast = queue[0]
      if (!nextToast) return
      
      const remainingQueue = queue.slice(1)
      setQueue(remainingQueue)
      setToasts(prev => [...prev, nextToast])
      
      // Set auto-dismiss timeout for the new toast
      if (nextToast.duration && nextToast.duration > 0) {
        const timeout = setTimeout(() => removeToast(nextToast.id), nextToast.duration)
        timeoutRef.current.set(nextToast.id, timeout)
      }
    }
  }, [toasts.length, queue, maxToasts, removeToast])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const duration = toast.duration ?? (toast.variant === 'error' ? 0 : 5000)
    const newToast = { ...toast, id, duration }
    
    setToasts(prev => {
      if (prev.length >= maxToasts) {
        // Add to queue instead of showing immediately (REQ 21.3)
        setQueue(q => [...q, newToast])
        return prev
      }
      return [...prev, newToast]
    })

    // Auto dismiss (only if not queued)
    if (duration > 0) {
      // Check if toast was added directly or queued
      setToasts(prev => {
        if (prev.some(t => t.id === id)) {
          const timeout = setTimeout(() => removeToast(id), duration)
          timeoutRef.current.set(id, timeout)
        }
        return prev
      })
    }
  }, [maxToasts, removeToast])

  // Convenience methods with action support
  const success = useCallback((title: string, message?: string, action?: ToastAction) => {
    addToast({ variant: 'success', title, ...(message && { message }), ...(action && { action }) })
  }, [addToast])

  const error = useCallback((title: string, message?: string, action?: ToastAction) => {
    addToast({ variant: 'error', title, duration: 0, ...(message && { message }), ...(action && { action }) })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, action?: ToastAction) => {
    addToast({ variant: 'warning', title, ...(message && { message }), ...(action && { action }) })
  }, [addToast])

  const info = useCallback((title: string, message?: string, action?: ToastAction) => {
    addToast({ variant: 'info', title, ...(message && { message }), ...(action && { action }) })
  }, [addToast])

  // Undo helper for reversible actions (REQ 21.2)
  const successWithUndo = useCallback((title: string, onUndo: () => void, message?: string) => {
    addToast({
      variant: 'success',
      title,
      ...(message && { message }),
      duration: 8000, // Longer duration for undo actions
      action: {
        label: 'Annulla',
        onClick: onUndo
      }
    })
  }, [addToast])

  // Error with retry helper (REQ 25.4)
  const errorWithRetry = useCallback((title: string, onRetry: () => void, message?: string) => {
    addToast({
      variant: 'error',
      title,
      ...(message && { message }),
      duration: 0, // Manual dismiss for errors
      action: {
        label: 'Riprova',
        onClick: onRetry
      }
    })
  }, [addToast])

  // Cleanup timeouts on unmount
  useEffect(() => {
    const currentTimeouts = timeoutRef.current
    return () => {
      currentTimeouts.forEach(timeout => clearTimeout(timeout))
      currentTimeouts.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      success, 
      error, 
      warning, 
      info,
      successWithUndo,
      errorWithRetry
    }}>
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

  const handleAction = () => {
    if (toast.action) {
      toast.action.onClick()
      handleDismiss()
    }
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
        {/* Action button for undo/retry (REQ 21.2) */}
        {toast.action && (
          <button
            onClick={handleAction}
            className="mt-2 text-xs font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded"
          >
            {toast.action.label}
          </button>
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
export type { Toast, ToastVariant, ToastContextType, ToastAction }
