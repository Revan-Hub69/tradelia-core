/**
 * BottomNav - Tradelia 2026
 * 
 * Bottom navigation mobile per i 4 journey + Home.
 * Seguendo dashboard-design-contract.md:
 * - Home + 4 journey tabs
 * - Icona + label sempre
 * - Active state forte
 * - Visibile SOLO su mobile (<1024px)
 * - Scrollabile orizzontalmente se necessario
 */

'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { JOURNEY_ORDER, JOURNEYS, type JourneyId } from '@/src/shared/config/journeys'
import {
  ShieldIcon,
  TrendingUpIcon,
  BoltIcon,
  RefreshIcon,
  HomeIcon
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
  
  // Check if we're on dashboard home (not a specific journey)
  const isOnDashboard = pathname.includes('/dashboard')
  const isOnHome = pathname === `/${locale}/dashboard` || pathname === `/${locale}/dashboard/`
  
  // Determine active journey (only if not on home)
  const getActiveJourney = (): JourneyId | null => {
    if (isOnHome) return null
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
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden"
      aria-label="Navigazione principale"
    >
      <div className="flex items-center h-16 px-1 safe-area-bottom overflow-x-auto scrollbar-hide">
        {/* Home Tab */}
        <Link
          href={`/${locale}/dashboard`}
          className={`
            flex flex-col items-center justify-center min-w-[64px] flex-1 h-full px-1 py-1
            transition-colors duration-150 active:scale-95
            ${isOnHome 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          aria-current={isOnHome ? 'page' : undefined}
        >
          <div className={`
            p-1.5 rounded-lg transition-colors duration-150
            ${isOnHome ? 'bg-primary/10' : ''}
          `}>
            <HomeIcon className="w-5 h-5" />
          </div>
          <span className={`
            text-[10px] mt-0.5 font-medium truncate
            ${isOnHome ? 'text-primary' : ''}
          `}>
            Home
          </span>
        </Link>

        {/* Journey Tabs */}
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
                flex flex-col items-center justify-center min-w-[64px] flex-1 h-full px-1 py-1
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
                text-[10px] mt-0.5 font-medium truncate
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
