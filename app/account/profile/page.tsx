'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AppProviders'
import { authManager } from '@/lib/auth/supabase-auth'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    redirect('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateError('')
    setUpdateSuccess('')

    try {
      const result = await authManager.updateProfile({
        displayName: displayName.trim() || undefined
      })

      if (result.error) {
        setUpdateError(result.error)
      } else {
        setUpdateSuccess('Profilo aggiornato con successo!')
      }
    } catch (error) {
      setUpdateError('Errore durante l\'aggiornamento del profilo')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Il Tuo Profilo</h1>
          <p className="text-muted-foreground mt-2">
            Gestisci le informazioni del tuo account educativo
          </p>
        </div>

        {/* Account Status */}
        <UnifiedCard>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">
                    {user.displayName || 'Utente Tradelia'}
                  </h2>
                  {user.emailVerified ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verificato
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Non Verificato
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membro dal {new Date(user.createdAt).toLocaleDateString('it-IT')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Account educativo protetto
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </UnifiedCard>

        {/* Profile Form */}
        <UnifiedCard>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informazioni Personali</h3>
            
            {updateError && (
              <Alert variant="destructive" className="mb-4">
                {updateError}
              </Alert>
            )}

            {updateSuccess && (
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                {updateSuccess}
              </Alert>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nome Visualizzato</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Come vuoi essere chiamato"
                  disabled={isUpdating}
                />
                <p className="text-xs text-muted-foreground">
                  Questo nome apparirà nel tuo profilo e nei tuoi progressi educativi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  L'email non può essere modificata. Contatta il supporto se necessario.
                </p>
              </div>

              <Separator />

              <Button
                type="submit"
                disabled={isUpdating || displayName === (user.displayName || '')}
              >
                {isUpdating ? 'Aggiornamento...' : 'Salva Modifiche'}
              </Button>
            </form>
          </CardContent>
        </UnifiedCard>

        {/* Email Verification */}
        {!user.emailVerified && (
          <UnifiedCard className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Verifica la tua Email
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                    Per garantire la sicurezza del tuo account educativo, verifica la tua email.
                    Controlla la tua casella di posta per il link di verifica.
                  </p>
                  <Button variant="outline" size="sm">
                    Invia Nuovamente Email di Verifica
                  </Button>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        )}

        {/* Educational Note */}
        <div className="text-xs text-muted-foreground text-center p-4 bg-muted/20 rounded-lg">
          <strong>Privacy:</strong> I tuoi dati personali sono utilizzati esclusivamente per 
          migliorare la tua esperienza educativa e non vengono mai condivisi con terze parti.
        </div>
      </div>
    </div>
  )
}