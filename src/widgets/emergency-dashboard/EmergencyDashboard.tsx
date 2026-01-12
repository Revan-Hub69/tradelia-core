/**
 * Emergency Dashboard - Tradelia 2026
 * 
 * Dashboard moderna per il percorso emergenza con hero alert e 4 pilastri interattivi
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { DashboardIntroOverlay } from '@/src/widgets/dashboard-intro'
import { EmergencyHeroAlert } from './EmergencyHeroAlert'
import { EmergencyPillars } from './EmergencyPillars'
import { ShieldIcon, InfoIcon } from '@/components/icons/TradeliaIcons'

export function EmergencyDashboard() {
  const t = useTranslations()
  const [showEmergencyIntro, setShowEmergencyIntro] = useState(false)

  // Show emergency intro overlay on first visit
  useEffect(() => {
    const hasSeenEmergencyIntro = localStorage.getItem('tradelia-emergency-intro-seen-v2')
    if (!hasSeenEmergencyIntro) {
      setShowEmergencyIntro(true)
    }
  }, [])

  // Listen for intro overlay trigger from hero alert
  useEffect(() => {
    const handleOpenIntro = () => {
      setShowEmergencyIntro(true)
    }

    window.addEventListener('openEmergencyIntro', handleOpenIntro)
    return () => window.removeEventListener('openEmergencyIntro', handleOpenIntro)
  }, [])

  const handleCloseEmergencyIntro = () => {
    setShowEmergencyIntro(false)
    localStorage.setItem('tradelia-emergency-intro-seen-v2', 'true')
  }

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Emergency Consultation Button - Top of page */}
        <div className="py-3 border-b border-border/30 mb-6">
          <button
            onClick={() => setShowEmergencyIntro(true)}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-muted-foreground/20 focus:ring-offset-2 rounded-sm"
          >
            <InfoIcon className="w-4 h-4 transition-colors" />
            <span className="relative">
              {t('emergencyIntro.buttons.consultIntroduction')}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-200 group-hover:w-full"></span>
            </span>
          </button>
        </div>
        
        {/* Page Header - senza breadcrumb (ora è sticky nel layout) */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <ShieldIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('journeys.emergency.name')}
            </h1>
          </div>
        </div>
        
        {/* Main Dashboard Content */}
        <div className="space-y-8 pb-8">
          {/* Hero Alert */}
          <EmergencyHeroAlert />
          
          {/* 4 Pillars */}
          <EmergencyPillars />
        </div>
        
        {/* Emergency Introduction Overlay */}
        <DashboardIntroOverlay 
          isOpen={showEmergencyIntro}
          onClose={handleCloseEmergencyIntro}
        />
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}