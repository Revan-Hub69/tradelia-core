/**
 * Sidebar Navigation Component - Tradelia 2026
 * Modular navigation component for dashboard sidebar
 */

'use client'

import Link from 'next/link'
import { JOURNEY_ORDER, type JourneyId } from '@/src/shared/config/journeys'
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

interface SidebarNavigationProps {
  isOnHome: boolean
  activeJourney: JourneyId | null
  locale: string
  t: (key: string) => string
  tJourneys: (key: string) => string
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNavigation({ 
  isOnHome, 
  activeJourney, 
  locale, 
  t, 
  tJourneys, 
  collapsed = false,
  onNavigate 
}: SidebarNavigationProps) {
  const handleClick = onNavigate ? () => onNavigate() : undefined

  return (
    <div className="space-y-2">
      {/* Home Link */}
      <Link
        href={`/${locale}/dashboard`}
        {...(handleClick && { onClick: handleClick })}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          isOnHome 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50'
        }`}
        aria-current={isOnHome ? 'page' : undefined}
        title={collapsed ? 'Home' : undefined}
      >
        <HomeIcon className={`w-5 h-5 flex-shrink-0 ${isOnHome ? 'text-primary' : ''}`} />
        {!collapsed && <span>Home</span>}
      </Link>

      {/* Journey Links */}
      <div className={`space-y-1 ${!collapsed ? 'pt-2' : ''}`}>
        {!collapsed && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('journeys')}
          </div>
        )}
        {JOURNEY_ORDER.map((journeyId) => {
          const Icon = JOURNEY_ICONS[journeyId]
          const isActive = activeJourney === journeyId
          const journeyName = tJourneys(`${journeyId}.name`)
          
          return (
            <Link
              key={journeyId}
              href={`/${locale}/dashboard/${journeyId}`}
              {...(handleClick && { onClick: handleClick })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50'
              }`}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? journeyName : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!collapsed && <span>{journeyName}</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}