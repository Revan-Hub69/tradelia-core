/**
 * BottomNav - Tradelia 2026
 * 
 * Bottom navigation mobile per i 4 journey.
 * Seguendo dashboard-design-contract.md:
 * - 4 tab fissi, MAI cambiano
 * - Icona + label sempre
 * - Active state forte
 * - Visibile SOLO su mobile (<1024px)
 */

'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { JOURNEY_ORDER, JOURNEYS, getJourneyFromPath, type JourneyId } from '@/src/shared/config/journeys'
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
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  
  // Check if we're on a journey page or home
  const activeJourney = getJourneyFromPath(pathname)
  const isOnDashboard = pathname.includes('/dashboard')

  // Don't show on non-dashboard pages
  if (!isOnDashboard) return null

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden"
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
