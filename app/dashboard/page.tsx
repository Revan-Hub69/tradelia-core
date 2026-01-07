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
  BookOpenIcon,
  MailIcon,
  UserIcon
} from '@/components/icons/TradeliaIcons'

function DashboardContent() {
  const { user, profile, loading } = useAuth()
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
    
    if (loading) return

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

    if (isGuestParam && !user) {
      setIsGuestMode(true)
      setDashboardConfig(getDefaultDashboardConfig())
      return
    }

    router.push('/')
  }, [user, loading, searchParams, router])

  const handleResendVerification = async () => {
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
      alert('Email di verifica inviata!')
    }
  }

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
      <div className="space-y-4 max-w-4xl">
        {/* Email Alert */}
        {showEmailAlert && user && (
          <div className="p-4 rounded border border-border bg-muted/50 shadow-sm">
            <div className="flex items-start gap-3">
              <MailIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Verifica email</p>
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Conferma l&apos;indirizzo email per accedere a tutte le funzionalità.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleResendVerification} 
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    Invia verifica
                  </button>
                  <button 
                    onClick={() => setShowEmailAlert(false)} 
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    Nascondi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div className="rounded border border-border/50 bg-background p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Profilo</p>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
              <UserIcon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{userName}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isGuestMode ? 'bg-amber-600' : 'bg-green-700'}`} />
                <span className="text-xs font-medium text-muted-foreground">{userType}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {user && (
              <div>
                <span className="text-muted-foreground font-medium block mb-1">Email</span>
                <p className="text-foreground font-medium truncate">{user.email}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground font-medium block mb-1">Obiettivo</span>
              <p className="text-foreground font-medium capitalize">{currentProfile?.crypto_objective || 'Non definito'}</p>
            </div>
            <div>
              <span className="text-muted-foreground font-medium block mb-1">Esperienza</span>
              <p className="text-foreground font-medium capitalize">{currentProfile?.experience_level || 'Non definita'}</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded border border-border/50 bg-background p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Stato</p>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center border border-border">
              <CheckIcon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard attiva</p>
              <p className="text-xs font-medium text-muted-foreground">Configurazione completata</p>
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="rounded border border-border/50 bg-background p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded bg-primary/15 flex items-center justify-center border border-primary/20">
              <ShieldIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {dashboardConfig.objective_config?.title}
              </h2>
              <p className="text-xs font-medium text-muted-foreground">
                {dashboardConfig.objective_config?.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Warnings */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avvisi</p>
              <div className="p-4 rounded border border-amber-300 bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">{dashboardConfig.risk_warnings?.primary}</p>
                    <p className="text-xs font-medium text-amber-800 mt-1">{dashboardConfig.risk_warnings?.secondary}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Fonte: {dashboardConfig.risk_warnings?.academicSource}
              </p>
            </div>

            {/* Tools */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Strumenti</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Coerenti con obiettivi generali</p>
                  <ul className="space-y-1.5">
                    {dashboardConfig.recommended_tools?.primary?.map((tool: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                        <span className="text-xs font-medium text-muted-foreground">{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Richiedono attenzione</p>
                  <ul className="space-y-1.5">
                    {dashboardConfig.recommended_tools?.avoid?.map((tool: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                        <span className="text-xs font-medium text-muted-foreground">{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded border border-border/50 bg-background p-5 shadow-sm card-interactive">
            <div className="flex items-center gap-2 mb-3">
              <BookOpenIcon className="w-4 h-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Errori comuni</h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Pattern comportamentali documentati dalla ricerca accademica nel campo della finanza comportamentale.
            </p>
          </div>
          <div className="rounded border border-border/50 bg-background p-5 shadow-sm card-interactive">
            <div className="flex items-center gap-2 mb-3">
              <BookOpenIcon className="w-4 h-4 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Metodologia</h3>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              Fonti accademiche peer-reviewed e processo di identificazione delle incompatibilità.
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
