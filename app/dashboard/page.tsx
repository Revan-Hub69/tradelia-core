'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { GuestSessionManager } from '@/lib/guestSession'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, profile, loading } = useAuth()
  const [dashboardConfig, setDashboardConfig] = useState<any>(null)
  const [guestProfile, setGuestProfile] = useState<any>(null)
  const [showEmailAlert, setShowEmailAlert] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user && profile) {
        // Check if email is verified
        setShowEmailAlert(!user.email_confirmed_at)
        
        // Registered user - load from database
        const { data, error } = await supabase
          .from('dashboard_configs')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) {
          setDashboardConfig(data)
        }
      } else {
        // Guest user - load from encrypted session
        const guestManager = new GuestSessionManager()
        const guestData = await guestManager.loadProfile()
        const guestConfig = await guestManager.loadDashboardConfig()
        
        if (guestData) {
          setGuestProfile(guestData)
          setDashboardConfig(guestConfig)
        } else {
          // No data found, redirect to home
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  const currentProfile = profile || guestProfile
  const userType = user ? 'Utente registrato' : 'Modalità guest'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Email Verification Alert */}
        {showEmailAlert && user && (
          <div className="mb-6 p-4 bg-muted/30 border border-border/50 rounded">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground mb-2">
                  <strong>Verifica email</strong>
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Conferma il tuo indirizzo email per accedere a tutte le funzionalità. 
                  Non è obbligatorio per utilizzare la dashboard.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResendVerification}
                    className="text-xs text-primary hover:text-primary/80 transition-subtle"
                  >
                    Invia email di verifica
                  </button>
                  <button
                    onClick={() => setShowEmailAlert(false)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-subtle"
                  >
                    Nascondi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Tradelia
          </h1>
          <p className="text-muted-foreground">
            {userType} • {currentProfile?.objective || 'Obiettivo non definito'}
          </p>
        </div>

        {/* User Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background border border-border/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Profilo Utente
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span> {userType}
              </div>
              {user && (
                <>
                  <div>
                    <span className="text-muted-foreground">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nome:</span> {profile?.full_name || 'Non specificato'}
                  </div>
                </>
              )}
              <div>
                <span className="text-muted-foreground">Obiettivo:</span> {currentProfile?.objective || 'Non definito'}
              </div>
              <div>
                <span className="text-muted-foreground">Esperienza:</span> {currentProfile?.experience || 'Non definita'}
              </div>
              <div>
                <span className="text-muted-foreground">Altri strumenti:</span> {currentProfile?.otherTools || 'Non specificati'}
              </div>
            </div>
          </div>

          <div className="bg-background border border-border/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Configurazione Dashboard
            </h2>
            {dashboardConfig ? (
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-foreground">
                    {dashboardConfig.objective_config?.title}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {dashboardConfig.objective_config?.description}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs uppercase tracking-wide">
                    Avviso principale
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {dashboardConfig.risk_warnings?.primary}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground text-xs uppercase tracking-wide">
                    Fonte accademica
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {dashboardConfig.risk_warnings?.academicSource}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Configurazione non trovata
              </p>
            )}
          </div>
        </div>

        {/* Recommended Tools */}
        {dashboardConfig?.recommended_tools && (
          <div className="bg-background border border-border/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Strumenti Raccomandati
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-foreground mb-2 text-sm">
                  Raccomandati
                </h3>
                <ul className="space-y-1">
                  {dashboardConfig.recommended_tools.primary?.map((tool: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-muted-foreground">{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2 text-sm">
                  Da evitare
                </h3>
                <ul className="space-y-1">
                  {dashboardConfig.recommended_tools.avoid?.map((tool: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span className="text-muted-foreground">{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:text-primary/80 text-sm"
          >
            ← Torna alla homepage
          </button>
        </div>
      </div>
    </div>
  )
}