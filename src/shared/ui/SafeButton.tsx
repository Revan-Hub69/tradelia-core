/**
 * SafeButton - Ultra-Chicca 2026
 * 
 * Design for Misclick Protection
 * - 120-180ms delay for critical actions
 * - Larger touch areas (44px minimum)
 * - Double-tap prevention
 * - Processing states with visual feedback
 * - Prevents costly errors in financial context
 */

'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { LoaderIcon } from '@/components/icons/TradeliaIcons'

export interface SafeButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant: 'safe' | 'critical' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  delayMs?: number
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  children: React.ReactNode
}

export function SafeButton({ 
  variant, 
  size = 'md',
  delayMs,
  onClick,
  children,
  className = '',
  disabled = false,
  ...props 
}: SafeButtonProps) {
  const t = useTranslations('common.safeButton')
  const [isPressed, setIsPressed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClickRef = useRef<number>(0)

  // Calculate delay based on variant
  const effectiveDelay = delayMs ?? (
    variant === 'critical' ? 150 : 
    variant === 'destructive' ? 180 : 
    0
  )

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-w-[40px] min-h-[40px]',
    md: 'px-4 py-2 text-sm min-w-[44px] min-h-[44px]',
    lg: 'px-6 py-3 text-base min-w-[48px] min-h-[48px]'
  }

  // Variant classes
  const variantClasses = {
    safe: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    critical: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning/50',
    destructive: 'bg-error text-white hover:bg-error/90 focus:ring-error/50'
  }

  const handleTouchStart = useCallback(() => {
    if (effectiveDelay > 0 && !disabled && !isProcessing) {
      setIsPressed(true)
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsPressed(false)
      }, effectiveDelay)
    }
  }, [effectiveDelay, disabled, isProcessing])

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPressed(false)
  }, [])

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent double-tap (1000ms cooldown)
    const now = Date.now()
    if (now - lastClickRef.current < 1000) {
      event.preventDefault()
      return
    }

    // Check if delay is required and not satisfied
    if (effectiveDelay > 0 && !isPressed) {
      event.preventDefault()
      return
    }

    // Prevent multiple simultaneous clicks
    if (isProcessing) {
      event.preventDefault()
      return
    }

    lastClickRef.current = now
    setIsProcessing(true)

    try {
      await onClick?.(event)
    } catch (error) {
      console.error('SafeButton onClick error:', error)
    } finally {
      // Minimum processing time to prevent rapid clicks
      setTimeout(() => {
        setIsProcessing(false)
      }, 300)
    }
  }, [effectiveDelay, isPressed, isProcessing, onClick])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const isDisabled = disabled || isProcessing

  return (
    <button
      {...props}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        relative font-medium rounded-lg transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95 touch-manipulation
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isPressed ? 'ring-2 ring-offset-2 ring-current scale-95' : ''}
        ${isProcessing ? 'cursor-wait' : ''}
        ${className}
      `}
      aria-busy={isProcessing}
      aria-label={isProcessing ? t('processing') : undefined}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <LoaderIcon className="w-4 h-4 animate-spin" />
          <span>{t('processing')}</span>
        </div>
      ) : (
        <>
          {children}
          {effectiveDelay > 0 && !isPressed && (
            <div className="absolute inset-0 flex items-center justify-center bg-current/10 rounded-lg">
              <span className="text-xs font-medium opacity-80">
                {t('holdToConfirm')}
              </span>
            </div>
          )}
        </>
      )}
    </button>
  )
}

// Preset components for common use cases
export function CriticalButton(props: Omit<SafeButtonProps, 'variant'>) {
  return <SafeButton variant="critical" {...props} />
}

export function DestructiveButton(props: Omit<SafeButtonProps, 'variant'>) {
  return <SafeButton variant="destructive" {...props} />
}

export function SafeActionButton(props: Omit<SafeButtonProps, 'variant'>) {
  return <SafeButton variant="safe" {...props} />
}