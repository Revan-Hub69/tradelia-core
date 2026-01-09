/**
 * Network Status Component - Tradelia 2026
 * 
 * Banner per gestire connessione offline/instabile
 * Qualità percepita enorme senza errori brutali
 */

'use client'

import { useState, useEffect } from 'react'
import { AlertTriangleIcon, WifiOffIcon, RefreshIcon, CheckIcon } from '@/components/icons/TradeliaIcons'

interface NetworkStatusProps {
  className?: string
}

type NetworkState = 'online' | 'offline' | 'slow' | 'reconnecting'

export function NetworkStatus({ className = '' }: NetworkStatusProps) {
  const [networkState, setNetworkState] = useState<NetworkState>('online')
  const [showBanner, setShowBanner] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Check network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkState('offline')
        setShowBanner(true)
      } else {
        // Test connection speed with a small request
        testConnectionSpeed()
      }
    }

    const testConnectionSpeed = async () => {
      try {
        const start = Date.now()
        const response = await fetch('/api/ping', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        const duration = Date.now() - start

        if (!response.ok) {
          throw new Error('Network error')
        }

        if (duration > 5000) {
          setNetworkState('slow')
          setShowBanner(true)
        } else if (networkState !== 'online') {
          setNetworkState('online')
          // Show brief success message
          setTimeout(() => setShowBanner(false), 3000)
        }
      } catch {
        setNetworkState('offline')
        setShowBanner(true)
      }
    }

    // Initial check
    updateNetworkStatus()

    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Periodic check when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        testConnectionSpeed()
      }
    }, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
      clearInterval(interval)
    }
  }, [networkState])

  // Handle retry
  const handleRetry = async () => {
    setNetworkState('reconnecting')
    setRetryCount(prev => prev + 1)

    try {
      const response = await fetch('/api/ping', { 
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
          title: 'Connessione persa',
          message: 'Verifica la tua connessione internet',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          showRetry: true
        }
      case 'slow':
        return {
          icon: AlertTriangleIcon,
          title: 'Connessione lenta',
          message: 'Alcune funzionalità potrebbero essere rallentate',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          showRetry: true
        }
      case 'reconnecting':
        return {
          icon: RefreshIcon,
          title: 'Riconnessione...',
          message: 'Tentativo di ripristino della connessione',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          showRetry: false
        }
      case 'online':
        return {
          icon: CheckIcon,
          title: 'Connessione ripristinata',
          message: 'Tutte le funzionalità sono disponibili',
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
              {networkState === 'reconnecting' ? 'Connessione...' : 'Riprova'}
            </button>
          )}
          
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Chiudi notifica"
          >
            ×
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
      await fetch('/api/ping', { method: 'HEAD', cache: 'no-cache' })
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