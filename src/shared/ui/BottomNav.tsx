/**
 * BottomNav - Tradelia 2026
 * 
 * Bottom navigation SOLO mobile per i 4 journey.
 * NASCOSTA su desktop (lg:hidden)
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { JOURNEY_ORDER, JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon
} from '@/components/icons/TradeliaIcons'

const JOURNEY_ICONS: Record<JourneyId, React.ComponentType<{ className?: string }>> = {
  emergency: ShieldIcon,
  longterm: TrendingUpIcon,
  speculation: BoltIcon,
  passive: RefreshIcon
}

export function BottomNav() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()
  
  // Check if we're on dashboard
  const isOnDashboard = pathname.includes('/dashboard')
  
  // Determine active journey
  const getActiveJourney = (): JourneyId | null => {
    if (pathname.includes('/emergency')) return 'emergency'
    if (pathname.includes('/longterm')) return 'longterm'
    if (pathname.includes('/speculation')) return 'speculation'
    if (pathname.includes('/passive')) return 'passive'
    return null
  }
  const activeJourney = getActiveJourney()

  // Don't show on non-dashboard pages
  if (!isOnDashboard) return null

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border block lg:hidden"
      aria-label="Navigazione principale"
    >
      <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
        {JOURNEY_ORDER.map((journeyId) => {
          const journey = JOURNEYS[journeyId]
          const Icon = JOURNEY_ICONS[journeyId]
          const isActive = activeJourney === journeyId
          const href = `/${locale}/dashboard/${journeyId}`
          
          return (
            <Link
              key={journeyId}
              href={href}
              prefetch={false}
              className={`
                flex flex-col items-center justify-center flex-1 h-full px-2 py-1
                transition-colors duration-150 active:scale-95
                ${isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`
                p-1.5 rounded-lg transition-colors duration-150
                ${isActive ? 'bg-primary/10' : ''}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`
                text-[10px] mt-0.5 font-medium truncate max-w-full
                ${isActive ? 'text-primary' : ''}
              `}>
                {t(journey.labelKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
