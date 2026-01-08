/**
 * Dashboard Sidebar - Tradelia 2026
 * 
 * Sidebar professionale con navigazione e stato utente
 * Design glassmorphism seguendo le spec Tradelia
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { 
  DiamondIcon,
  UserIcon,
  ChartIcon,
  SettingsIcon,
  ShieldIcon,
  BookIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@/components/icons/TradeliaIcons'

const navigationItems = [
  {
    name: 'Panoramica',
    href: '/it/dashboard',
    icon: ChartIcon,
    description: 'Dashboard principale'
  },
  {
    name: 'Portafoglio',
    href: '/it/dashboard/portfolio',
    icon: DiamondIcon,
    description: 'Analisi strumenti'
  },
  {
    name: 'Verifica',
    href: '/it/dashboard/verify',
    icon: ShieldIcon,
    description: 'Controllo coerenza'
  },
  {
    name: 'Educazione',
    href: '/it/dashboard/education',
    icon: BookIcon,
    description: 'Risorse formative'
  },
  {
    name: 'Impostazioni',
    href: '/it/dashboard/settings',
    icon: SettingsIcon,
    description: 'Configurazione'
  }
]

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { state, actions } = useDashboardAuth()

  const handleSignOut = async () => {
    await actions.signOut()
  }

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      transition-all duration-300 ease-in-out
      bg-background/80 backdrop-blur-md border-r border-border/50
      flex flex-col h-[calc(100vh-4rem)]
    `}>
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-border/30">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          {!isCollapsed && (
            <span className="text-sm font-medium">Menu</span>
          )}
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
            {state.isGuestMode ? (
              <ShieldIcon className="w-5 h-5 text-primary" />
            ) : (
              <UserIcon className="w-5 h-5 text-primary" />
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {state.profile?.full_name || 'Utente Ospite'}
              </p>
              <p className="text-xs text-muted-foreground">
                {state.isGuestMode ? 'Modalità limitata' : 'Account verificato'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.name}
                  </p>
                  <p className="text-xs opacity-70 truncate">
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={handleSignOut}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-muted-foreground hover:text-red-400 hover:bg-red-500/10
            transition-all duration-150
          `}
        >
          <LogOutIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Esci</span>
          )}
        </button>
      </div>
    </aside>
  )
}