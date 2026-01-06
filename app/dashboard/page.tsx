'use client'

import { Suspense, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
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
  UserIcon,
  MenuIcon,
  CloseIcon,
  HomeIcon
} from '@/components/icons/TradeliaIcons'

function DashboardContent() {
  const { user, profile, loading, signOut } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [dashboardConfig, setDashboardConfig] = useState<any>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [showEmailAlert, setShowEmailAlert] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  // Default dashboard config
  const getDefaultDashboardConfig = () => ({
    objective_config: {
      title: 'Configurazione di base',
      description: 'Analisi generale degli strumenti finanziari'
    },
    risk_warnings: {
      primary: 'Verifica sempre la coerenza tra obiettivo e strumento',
      secondary: 'Gli strumenti complessi richiedono maggiore attenzione',
      academicSource: 'Ricerca comportamentale finanziaria'
    },
    recommended_tools: {
      primary: ['ETF diversificati', 'Fondi indicizzati', 'Conti deposito'],
      avoid: ['Prodotti strutturati complessi', 'Leva finanziaria elevata']
    }
  })

  useEffect(() => {
    const isGuestParam = searchParams.get('guest') === 'true'
    
    console.log('🔍 Dashboard check:', { loading, user: !!user, isGuestParam })

    // Still loading auth - wait
    if (loading) return

    // PRIORITY 1: Authenticated user (OAuth or email)
    if (user) {
      console.log('✅ Authenticated user detected:', user.email)
      setIsGuestMode(false)
      setShowEmailAlert(!user.email_confirmed_at)
      
      // Load user's dashboard config from Supabase
      supabase
        .from('dashboard_configs')
        .select('*')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          setDashboardConfig(data || getDefaultDashboardConfig())
        })
      return
    }

    // PRIORITY 2: Guest mode (explicit param, no user)
    if (isGuestParam && !user) {
      console.log('👻 Guest mode activated')
      setIsGuestMode(true)
      setDashboardConfig(getDefaultDashboardConfig())
      return
    }

    // PRIORITY 3: No auth, no guest param -> redirect home
    console.log('❌ No auth, no guest param -> redirect')
    router.push('/')
  }, [user, loading, searchParams, router])

  const handleResendVerification = async () => {
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
      alert('Email di verifica inviata!')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Loading state
  if (loading || !dashboardConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  const currentProfile = profile || {
    crypto_objective: 'generale' as const,
    experience_level: 'base' as const,
    full_name: 'Utente ospite'
  }
  const userType = isGuestMode ? 'Ospite' : 'Registrato'
  const userName = user?.user_metadata?.full_name || profile?.full_name || (isGuestMode ? 'Ospite' : 'Utente')

  const navItems = [
    { id: 'overview', label: 'Panoramica', icon: BarChartIcon },
    { id: 'analysis', label: 'Analisi', icon: TrendingUpIcon },
    { id: 'education', label: 'Educazione', icon: BookOpenIcon },
    { id: 'settings', label: 'Impostazioni', icon: SettingsIcon },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-background border-r border-border/50
        transform transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border/50">
          <Logo />
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded"
            aria-label="Chiudi menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isGuestMode ? 'bg-amber-500' : 'bg-green-500'}`} />
                <span className="text-xs text-muted-foreground">{userType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-muted text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border/50 space-y-1">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
          >
            <HomeIcon className="w-4 h-4" />
            Homepage
          </button>
          {!isGuestMode && (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            >
              <LogOutIcon className="w-4 h-4" />
              Esci
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (mobile) */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border/50 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground rounded"
            aria-label="Apri menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <Logo />
          <div className="w-9" /> {/* Spacer */}
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Email Alert */}
          {showEmailAlert && user && (
            <div className="mb-6 p-4 rounded border border-border/50 bg-muted/30">
              <div className="flex items-start gap-3">
                <MailIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">Verifica email</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Conferma l&apos;indirizzo email per accedere a tutte le funzionalità.
                  </p>
                  <div className="flex items-center gap-4">
                    <button onClick={handleResendVerification} className="text-xs text-primary hover:text-primary/80">
                      Invia verifica
                    </button>
                    <button onClick={() => setShowEmailAlert(false)} className="text-xs text-muted-foreground hover:text-foreground">
                      Nascondi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Title */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
              {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded border border-border/50 bg-background p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded bg-green-50 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Stato</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">Attivo</p>
                  <p className="text-xs text-muted-foreground mt-1">Dashboard configurata</p>
                </div>

                <div className="rounded border border-border/50 bg-background p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded bg-blue-50 flex items-center justify-center">
                      <BarChartIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Analisi</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">3</p>
                  <p className="text-xs text-muted-foreground mt-1">Rischi identificati</p>
                </div>

                <div className="rounded border border-border/50 bg-background p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded bg-amber-50 flex items-center justify-center">
                      <TrendingUpIcon className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Fonti</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">7</p>
                  <p className="text-xs text-muted-foreground mt-1">Fonti accademiche</p>
                </div>
              </div>

              {/* Config Card */}
              <div className="rounded border border-border/50 bg-background p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <ShieldIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {dashboardConfig.objective_config?.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {dashboardConfig.objective_config?.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Warnings */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-foreground uppercase tracking-wide">Avvisi</h3>
                    <div className="p-3 rounded border border-amber-200 bg-amber-50">
                      <div className="flex items-start gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">{dashboardConfig.risk_warnings?.primary}</p>
                          <p className="text-xs text-amber-700 mt-1">{dashboardConfig.risk_warnings?.secondary}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-foreground uppercase tracking-wide">Strumenti</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">Raccomandati</p>
                        <ul className="space-y-1">
                          {dashboardConfig.recommended_tools?.primary?.map((tool: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Da evitare</p>
                        <ul className="space-y-1">
                          {dashboardConfig.recommended_tools?.avoid?.map((tool: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              <div className="rounded border border-border/50 bg-background p-5">
                <h3 className="text-sm font-medium text-foreground mb-4">Profilo</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  {user && (
                    <div>
                      <span className="text-muted-foreground">Email</span>
                      <p className="text-foreground mt-1">{user.email}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Obiettivo</span>
                    <p className="text-foreground mt-1 capitalize">{currentProfile?.crypto_objective || 'Non definito'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Esperienza</span>
                    <p className="text-foreground mt-1 capitalize">{currentProfile?.experience_level || 'Non definita'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Section */}
          {activeSection === 'analysis' && (
            <div className="rounded border border-border/50 bg-background p-5">
              <p className="text-sm text-muted-foreground">Sezione analisi in sviluppo.</p>
            </div>
          )}

          {/* Education Section */}
          {activeSection === 'education' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded border border-border/50 bg-background p-5">
                <h3 className="text-sm font-medium text-foreground mb-2">Errori comuni</h3>
                <p className="text-xs text-muted-foreground">
                  Pattern comportamentali documentati dalla ricerca accademica.
                </p>
              </div>
              <div className="rounded border border-border/50 bg-background p-5">
                <h3 className="text-sm font-medium text-foreground mb-2">Metodologia</h3>
                <p className="text-xs text-muted-foreground">
                  Fonti accademiche verificate e processo di identificazione.
                </p>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="rounded border border-border/50 bg-background p-5">
              <p className="text-sm text-muted-foreground">Sezione impostazioni in sviluppo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
