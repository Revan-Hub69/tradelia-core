'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GuestSessionManager } from '@/lib/guestSession'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  ShieldIcon,
  AlertTriangleIcon,
  CheckIcon,
  TrendingUpIcon,
  BarChartIcon,
  BookOpenIcon,
  SettingsIcon,
  LogOutIcon,
  MailIcon,
  UserIcon
} from '@/components/icons/TradeliaIcons'

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const [dashboardConfig, setDashboardConfig] = useState<any>(null)
  const [guestProfile, setGuestProfile] = useState<any>(null)
  const [showEmailAlert, setShowEmailAlert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user && profile) {
        setShowEmailAlert(!user.email_confirmed_at)
        
        const { data, error } = await supabase
          .from('dashboard_configs')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setDashboardConfig(data)
        }
      } else {
        const guestManager = new GuestSessionManager()
        const guestData = await guestManager.loadProfile()
        const guestConfig = await guestManager.loadDashboardConfig()
        
        if (guestData) {
          setGuestProfile(guestData)
          setDashboardConfig(guestConfig)
        } else {
          router.push('/')
        }
      }
    }

    if (!loading) {
      loadDashboardData()
    }
  }, [user, profile, loading, router])

  const handleResendVerification = async () => {
    if (user?.email) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      })
      
      if (!error) {
        alert('Email di verifica inviata!')
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  const currentProfile = profile || guestProfile
  const userType = user ? 'Registrato' : 'Ospite'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{userType}</span>
              </div>
              
              {user && (
                <button
                  onClick={handleSignOut}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-150 rounded focus:outline-none focus:ring-2 focus:ring-primary/60"
                  aria-label="Esci"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {/* Email Verification Alert */}
        {showEmailAlert && user && (
          <div className="mb-8 p-4 rounded border border-border/50 bg-muted/30">
            <div className="flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  Verifica email
                </p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Conferma l&apos;indirizzo email per accedere a tutte le funzionalità. 
                  Non obbligatorio per utilizzare la dashboard.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleResendVerification}
                    className="text-xs text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    Invia verifica
                  </button>
                  <button
                    onClick={() => setShowEmailAlert(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    Nascondi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="rounded border border-border/50 bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || profile?.full_name || 'Utente'}
                  </p>
                  <p className="text-xs text-muted-foreground">{userType}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-xs">
                {user && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground">{user.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Obiettivo</span>
                  <span className="text-foreground capitalize">
                    {currentProfile?.objective || 'Non definito'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Esperienza</span>
                  <span className="text-foreground capitalize">
                    {currentProfile?.experience || 'Non definita'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded border border-border/50 bg-background p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Azioni rapide</h3>
              <div className="space-y-2">
                <button className="w-full p-3 text-left rounded border border-border/50 hover:bg-muted/30 transition-all duration-150 group">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Impostazioni</span>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full p-3 text-left rounded border border-border/50 hover:bg-muted/30 transition-all duration-150 group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Torna alla homepage</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Overview Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded border border-border/50 bg-background p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Stato</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">Attivo</p>
                  <p className="text-xs text-muted-foreground">Dashboard configurata</p>
                </div>
              </div>

              <div className="rounded border border-border/50 bg-background p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                    <BarChartIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Analisi</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground">Rischi identificati</p>
                </div>
              </div>

              <div className="rounded border border-border/50 bg-background p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center">
                    <TrendingUpIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Educazione</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">7</p>
                  <p className="text-xs text-muted-foreground">Fonti accademiche</p>
                </div>
              </div>
            </div>

            {/* Configuration Card */}
            {dashboardConfig && (
              <div className="rounded border border-border/50 bg-background p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <ShieldIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {dashboardConfig.objective_config?.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {dashboardConfig.objective_config?.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Risk Warnings */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Avvisi principali
                    </h3>
                    <div className="p-4 rounded border border-amber-200 bg-amber-50">
                      <div className="flex items-start gap-3">
                        <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800 mb-1">
                            {dashboardConfig.risk_warnings?.primary}
                          </p>
                          <p className="text-xs text-amber-700">
                            {dashboardConfig.risk_warnings?.secondary}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fonte: {dashboardConfig.risk_warnings?.academicSource}
                    </p>
                  </div>

                  {/* Recommended Tools */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                      Strumenti coerenti
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-2">Raccomandati</p>
                        <ul className="space-y-1">
                          {dashboardConfig.recommended_tools?.primary?.map((tool: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                              <span className="text-muted-foreground">{tool}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-2">Da evitare</p>
                        <ul className="space-y-1">
                          {dashboardConfig.recommended_tools?.avoid?.map((tool: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                              <span className="text-muted-foreground">{tool}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Educational Content */}
            <div className="rounded border border-border/50 bg-background p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Contenuti educativi</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded border border-border/50 bg-muted/30">
                  <h3 className="text-sm font-medium text-foreground mb-2">Errori comuni</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pattern comportamentali documentati dalla ricerca accademica per la tua categoria di obiettivo.
                  </p>
                </div>
                <div className="p-4 rounded border border-border/50 bg-muted/30">
                  <h3 className="text-sm font-medium text-foreground mb-2">Metodologia</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Fonti accademiche verificate e processo di identificazione delle incompatibilità.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}