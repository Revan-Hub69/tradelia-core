'use client'

import { Suspense, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/layout'
import { 
  ShieldIcon,
  AlertTriangleIcon,
  CheckIcon,
  TrendingUpIcon,
  BarChartIcon,
  MailIcon,
  UserIcon
} from '@/components/icons/TradeliaIcons'

function DashboardContent() {
  const { user, profile, loading, signOut } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [dashboardConfig, setDashboardConfig] = useState<any>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [showEmailAlert, setShowEmailAlert] = useState(false)

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
    
    // Still loading auth - wait
    if (loading) return

    // PRIORITY 1: Authenticated user (OAuth or email)
    if (user) {
      setIsGuestMode(false)
      setShowEmailAlert(!user.email_confirmed_at)
      
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
      setIsGuestMode(true)
      setDashboardConfig(getDefaultDashboardConfig())
      return
    }

    // PRIORITY 3: No auth, no guest param -> redirect home
    router.push('/')
  }, [user, loading, searchParams, router])

  const handleResendVerification = async () => {
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
      alert('Email di verifica inviata!')
    }
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

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Email Alert */}
        {showEmailAlert && user && (
          <div className="p-3 rounded border border-border/50 bg-muted/30">
            <div className="flex items-start gap-3">
              <MailIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Verifica email</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Conferma l&apos;indirizzo email per accedere a tutte le funzionalità.
                </p>
                <div className="flex items-center gap-3">
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

        {/* User Info Card */}
        <div className="rounded border border-border/50 bg-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isGuestMode ? 'bg-amber-500' : 'bg-green-500'}`} />
                <span className="text-xs text-muted-foreground">{userType}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {user && (
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="text-foreground truncate">{user.email}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Obiettivo</span>
              <p className="text-foreground capitalize">{currentProfile?.crypto_objective || 'Non definito'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Esperienza</span>
              <p className="text-foreground capitalize">{currentProfile?.experience_level || 'Non definita'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded border border-border/50 bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded bg-green-500/10 flex items-center justify-center">
                <CheckIcon className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Stato</span>
            </div>
            <p className="text-lg font-bold text-foreground">Attivo</p>
            <p className="text-[10px] text-muted-foreground">Dashboard configurata</p>
          </div>

          <div className="rounded border border-border/50 bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center">
                <BarChartIcon className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Analisi</span>
            </div>
            <p className="text-lg font-bold text-foreground">3</p>
            <p className="text-[10px] text-muted-foreground">Rischi identificati</p>
          </div>

          <div className="rounded border border-border/50 bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 flex items-center justify-center">
                <TrendingUpIcon className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Fonti</span>
            </div>
            <p className="text-lg font-bold text-foreground">7</p>
            <p className="text-[10px] text-muted-foreground">Fonti accademiche</p>
          </div>
        </div>

        {/* Config Card */}
        <div className="rounded border border-border/50 bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <ShieldIcon className="w-3 h-3 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {dashboardConfig.objective_config?.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {dashboardConfig.objective_config?.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Warnings */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-medium text-foreground uppercase tracking-wide">Avvisi</h3>
              <div className="p-2.5 rounded border border-amber-200 bg-amber-50">
                <div className="flex items-start gap-2">
                  <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-800">{dashboardConfig.risk_warnings?.primary}</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">{dashboardConfig.risk_warnings?.secondary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-medium text-foreground uppercase tracking-wide">Strumenti</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-medium text-green-700 mb-1">Raccomandati</p>
                  <ul className="space-y-0.5">
                    {dashboardConfig.recommended_tools?.primary?.map((tool: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-red-700 mb-1">Da evitare</p>
                  <ul className="space-y-0.5">
                    {dashboardConfig.recommended_tools?.avoid?.map((tool: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded border border-border/50 bg-card p-3">
            <h3 className="text-xs font-medium text-foreground mb-1">Errori comuni</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Pattern comportamentali documentati dalla ricerca accademica.
            </p>
          </div>
          <div className="rounded border border-border/50 bg-card p-3">
            <h3 className="text-xs font-medium text-foreground mb-1">Metodologia</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Fonti accademiche verificate e processo di identificazione.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
