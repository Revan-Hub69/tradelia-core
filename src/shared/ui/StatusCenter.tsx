/**
 * StatusCenter Component - Tradelia 2026
 * 
 * Popover showing system status: online/offline, sync status, guest mode, privacy mode.
 * Expands from NetworkStatus indicator for detailed status view.
 * 
 * @see Requirements 19.1, 19.2
 */

'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useNetworkStatus } from './NetworkStatus'
import { useDismissableLayer } from '@/src/shared/hooks/useDismissableLayer'
import { cn } from './utils'
import {
  WifiIcon,
  WifiOffIcon,
  RefreshIcon,
  ShieldIcon,
  UserIcon,
  CheckIcon,
  AlertTriangleIcon,
  CloseIcon,
} from '@/components/icons/TradeliaIcons'

type StatusType = 'success' | 'warning' | 'error' | 'info'

interface StatusRowProps {
  icon: React.ReactNode
  label: string
  value: string
  status: StatusType
}

function StatusRow({ icon, label, value, status }: StatusRowProps) {
  const statusColors: Record<StatusType, string> = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-muted-foreground',
  }

  const bgColors: Record<StatusType, string> = {
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
    info: 'bg-muted/50',
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bgColors[status])}>
        <span className={statusColors[status]}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn('text-sm font-medium', statusColors[status])}>{value}</p>
      </div>
    </div>
  )
}

interface StatusCenterProps {
  isOpen: boolean
  onClose: () => void
  /** Whether user is in guest mode */
  isGuestMode?: boolean
  /** Anchor element for positioning */
  anchorRef?: React.RefObject<HTMLElement | null>
}

export function StatusCenter({ isOpen, onClose, isGuestMode = false, anchorRef }: StatusCenterProps) {
  const t = useTranslations('statusCenter')
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const layerRef = useDismissableLayer<HTMLDivElement>(isOpen, onClose)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Position popover relative to anchor
  useEffect(() => {
    if (!isOpen || !anchorRef?.current || !popoverRef.current) return

    const anchor = anchorRef.current
    const popover = popoverRef.current
    const anchorRect = anchor.getBoundingClientRect()
    
    // Position below anchor, aligned to right edge
    const top = anchorRect.bottom + 8
    const right = window.innerWidth - anchorRect.right
    
    popover.style.top = `${top}px`
    popover.style.right = `${right}px`
  }, [isOpen, anchorRef])

  if (!isOpen) return null

  // Determine connection status
  const getConnectionStatus = (): { value: string; status: StatusType } => {
    if (!isOnline) {
      return { value: t('offline'), status: 'error' }
    }
    if (isSlowConnection) {
      return { value: t('slow'), status: 'warning' }
    }
    return { value: t('online'), status: 'success' }
  }

  // Determine sync status
  const getSyncStatus = (): { value: string; status: StatusType } => {
    if (isGuestMode) {
      return { value: t('localOnly'), status: 'warning' }
    }
    if (!isOnline) {
      return { value: t('paused'), status: 'warning' }
    }
    return { value: t('synced'), status: 'success' }
  }

  // Determine privacy status
  const getPrivacyStatus = (): { value: string; status: StatusType } => {
    if (isGuestMode) {
      return { value: t('localStorage'), status: 'info' }
    }
    return { value: t('cloudSync'), status: 'success' }
  }

  const connectionStatus = getConnectionStatus()
  const syncStatus = getSyncStatus()
  const privacyStatus = getPrivacyStatus()

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div
        ref={layerRef}
        className={cn(
          'w-72 bg-background border border-border rounded-lg shadow-lg',
          'overflow-hidden'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-center-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <h3 id="status-center-title" className="text-sm font-semibold">
            {t('title')}
          </h3>
          <button
            onClick={onClose}
            className="tap-target p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={t('close')}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Status Items */}
        <div className="p-2 space-y-1">
          {/* Connection Status */}
          <StatusRow
            icon={isOnline ? <WifiIcon className="w-4 h-4" /> : <WifiOffIcon className="w-4 h-4" />}
            label={t('connection')}
            value={connectionStatus.value}
            status={connectionStatus.status}
          />

          {/* Sync Status */}
          <StatusRow
            icon={
              syncStatus.status === 'success' ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <RefreshIcon className="w-4 h-4" />
              )
            }
            label={t('sync')}
            value={syncStatus.value}
            status={syncStatus.status}
          />

          {/* Guest Mode */}
          {isGuestMode && (
            <StatusRow
              icon={<UserIcon className="w-4 h-4" />}
              label={t('mode')}
              value={t('guestMode')}
              status="warning"
            />
          )}

          {/* Privacy Status */}
          <StatusRow
            icon={<ShieldIcon className="w-4 h-4" />}
            label={t('privacy')}
            value={privacyStatus.value}
            status={privacyStatus.status}
          />

          {/* Slow Connection Warning */}
          {isSlowConnection && isOnline && (
            <div className="mt-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-2">
                <AlertTriangleIcon className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning">{t('slowConnectionHint')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Last updated */}
        <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            {t('lastUpdated', { time: new Date().toLocaleTimeString() })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatusCenter
