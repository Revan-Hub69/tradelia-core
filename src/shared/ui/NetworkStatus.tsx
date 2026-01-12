/**
 * Network Status Component - Tradelia 2026
 * 
 * Banner per gestire connessione offline/instabile
 * Qualità percepita enorme senza errori brutali
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangleIcon, WifiOffIcon, WifiIcon, RefreshIcon, CheckIcon } from '@/components/icons/TradeliaIcons'
import { StatusCenter } from './StatusCenter'

interface NetworkStatusProps {
  className?: string
}

type NetworkState = 'online' | 'offline' | 'slow' | 'reconnecting'

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const t = useTranslations('common.networkStatus')
  const [networkState, setNetworkState] = useState<NetworkState>('online')
  const [showBanner, setShowBanner] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [hasTestedConnection, setHasTestedConnection] = useState(false)

  // Check network status
  useEffect(() => {
    let isMounted = true

    const testConnectionSpeed = async () => {
      try {
        const start = Date.now()
        // Use a more reliable endpoint - try the current page or a known endpoint
        const response = await fetch(window.location.origin + '/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        const duration = Date.now() - start

        if (!isMounted) return

        setHasTestedConnection(true)

        if (!response.ok) {
          throw new Error('Network error')
        }

        if (duration > 5000) {
          setNetworkState('slow')
          setShowBanner(true)
        } else {
          setNetworkState(prev => {
            // Only show success message if we were previously having issues
            if (prev === 'offline' || prev === 'reconnecting') {
              setTimeout(() => isMounted && setShowBanner(false), 3000)
            } else {
              // Don't show banner if connection is good from the start
              setShowBanner(false)
            }
            return 'online'
          })
        }
      } catch {
        if (!isMounted) return
        setHasTestedConnection(true)
        setNetworkState('offline')
        setShowBanner(true)
      }
    }

    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkState('offline')
        setShowBanner(true)
        setHasTestedConnection(true)
      } else if (!hasTestedConnection) {
        // Only test on first load or after being offline
        testConnectionSpeed()
      }
    }

    // Initial check
    updateNetworkStatus()

    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      isMounted = false
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [hasTestedConnection])

  // Handle retry
  const handleRetry = async () => {
    setNetworkState('reconnecting')
    setRetryCount(prev => prev + 1)

    try {
      const response = await fetch(window.location.origin + '/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      })

      if (response.ok) {
        setNetworkState('online')
        setRetryCount(0)
        setTimeout(() => setShowBanner(false), 2000)
      } else {
        throw new Error('Still offline')
      }
    } catch {
      setNetworkState('offline')
      // Exponential backoff for retries
      setTimeout(() => {
        if (retryCount < 3) {
          handleRetry()
        }
      }, Math.min(1000 * Math.pow(2, retryCount), 10000))
    }
  }

  // Don't show banner if online and no issues
  if (!showBanner && networkState === 'online') {
    return null
  }

  const getConfig = () => {
    switch (networkState) {
      case 'offline':
        return {
          icon: WifiOffIcon,
          title: t('offline'),
          message: t('offlineMessage'),
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          showRetry: true
        }
      case 'slow':
        return {
          icon: AlertTriangleIcon,
          title: t('slow'),
          message: t('slowMessage'),
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          showRetry: true
        }
      case 'reconnecting':
        return {
          icon: RefreshIcon,
          title: t('reconnecting'),
          message: t('reconnectingMessage'),
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          showRetry: false
        }
      case 'online':
        return {
          icon: CheckIcon,
          title: t('restored'),
          message: t('restoredMessage'),
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          showRetry: false
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <div className={`
      fixed top-16 left-0 right-0 z-30 mx-4 md:left-64 md:mx-8
      animate-in slide-in-from-top-2 duration-300 ${className}
    `}>
      <div className={`
        flex items-center justify-between p-4 rounded-lg border
        ${config.bgColor} ${config.borderColor}
      `}>
        <div className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-lg ${config.bgColor.replace('/10', '/20')} 
            flex items-center justify-center
          `}>
            <Icon className={`w-4 h-4 ${config.textColor} ${
              networkState === 'reconnecting' ? 'animate-spin' : ''
            }`} />
          </div>
          
          <div>
            <h4 className={`font-medium ${config.textColor}`}>
              {config.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {config.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {config.showRetry && (
            <button
              onClick={handleRetry}
              disabled={networkState === 'reconnecting'}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${config.textColor} hover:opacity-80 disabled:opacity-50
                border border-current hover:bg-current hover:text-white
              `}
            >
              {networkState === 'reconnecting' ? t('retryingButton') : t('retryButton')}
            </button>
          )}
          
          <button
            onClick={() => setShowBanner(false)}
            className="tap-target-icon p-2 text-muted-foreground hover:text-foreground transition-colors rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Chiudi notifica stato rete"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for network status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Test connection speed
  const testConnectionSpeed = async (): Promise<boolean> => {
    try {
      const start = Date.now()
      await fetch(window.location.origin + '/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
      const duration = Date.now() - start
      
      const isSlow = duration > 3000
      setIsSlowConnection(isSlow)
      return !isSlow
    } catch {
      return false
    }
  }

  return {
    isOnline,
    isSlowConnection,
    testConnectionSpeed
  }
}

// Wrapper component that shows network status globally
export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NetworkStatus />
    </>
  )
}

/**
 * NetworkStatusIndicator - Compact indicator for header/toolbar
 * Clicking opens the StatusCenter popover
 * 
 * @see Requirements 19.1
 */
interface NetworkStatusIndicatorProps {
  /** Whether user is in guest mode - passed to StatusCenter */
  isGuestMode?: boolean
  className?: string
}

export function NetworkStatusIndicator({ isGuestMode = false, className = '' }: NetworkStatusIndicatorProps) {
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const [isStatusCenterOpen, setIsStatusCenterOpen] = useState(false)
  const indicatorRef = useRef<HTMLButtonElement>(null)

  // Determine indicator state
  const getIndicatorConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOffIcon,
        color: 'text-error',
        bgColor: 'bg-error/10',
        pulse: true,
        ariaLabel: 'Offline - Click for status details'
      }
    }
    if (isSlowConnection) {
      return {
        icon: AlertTriangleIcon,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        pulse: true,
        ariaLabel: 'Slow connection - Click for status details'
      }
    }
    return {
      icon: WifiIcon,
      color: 'text-success',
      bgColor: 'bg-success/10',
      pulse: false,
      ariaLabel: 'Online - Click for status details'
    }
  }

  const config = getIndicatorConfig()
  const Icon = config.icon

  return (
    <>
      <button
        ref={indicatorRef}
        onClick={() => setIsStatusCenterOpen(prev => !prev)}
        className={`
          tap-target relative p-2 rounded-lg transition-colors
          hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50
          ${config.bgColor} ${className}
        `}
        aria-label={config.ariaLabel}
        aria-expanded={isStatusCenterOpen}
        aria-haspopup="dialog"
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
        {config.pulse && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-current animate-pulse" />
        )}
      </button>

      <StatusCenter
        isOpen={isStatusCenterOpen}
        onClose={() => setIsStatusCenterOpen(false)}
        isGuestMode={isGuestMode}
        anchorRef={indicatorRef}
      />
    </>
  )
}