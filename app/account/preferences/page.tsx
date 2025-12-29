'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Monitor, 
  Sun, 
  Moon, 
  Globe,
  CheckCircle,
  Cookie,
  Download,
  Upload
} from 'lucide-react'
import { useAuth, usePreferences, useUserPreferences } from '@/components/providers/AppProviders'
import { preferencesManager } from '@/lib/preferences/cookie-manager'
import { CookiePreferencesModal } from '@/components/preferences/CookiePreferencesModal'
import { redirect } from 'next/navigation'

export default function PreferencesPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { cookiePreferences } = usePreferences()
  const userPreferences = useUserPreferences()
  
  const [showCookieModal, setShowCookieModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    redirect('/dashboard')
  }

  if (isLoading || !userPreferences) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const handlePreferenceUpdate = async (updates: any) => {
    setIsUpdating(true)
    try {
      await preferencesManager.updatePreferences(updates)
      setUpdateSuccess('Preferenze aggiornate con successo!')
      setTimeout(() => setUpdateSuccess(''), 3000)
    } catch (error) {
      console.error('Failed to update preferences:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Preferenze</h1>
          <p className="text-muted-foreground mt-2">
            Personalizza la tua esperienza educativa su Tradelia
          </p>
        </div>

        {updateSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            {updateSuccess}
          </Alert>
        )}

        <Tabs defaultValue="ui" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ui" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Interfaccia
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifiche
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Dati
            </TabsTrigger>
          </TabsList>

          {/* UI Preferences */}
          <TabsContent value="ui" className="space-y-6">
            <UnifiedCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Aspetto e Interfaccia
                </h3>

                <div className="space-y-6">
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Tema</Label>
                      <p className="text-sm text-muted-foreground">
                        Scegli l'aspetto dell'interfaccia
                      </p>
                    </div>
                    <Select
                      value={userPreferences.theme}
                      onValueChange={(value) => handlePreferenceUpdate({ theme: value })}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Chiaro
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Scuro
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Sistema
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Lingua</Label>
                      <p className="text-sm text-muted-foreground">
                        Lingua dell'interfaccia
                      </p>
                    </div>
                    <Select
                      value={userPreferences.language}
                      onValueChange={(value) => handlePreferenceUpdate({ language: value })}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Italiano
                          </div>
                        </SelectItem>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            English
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* UI Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Modalità Compatta</Label>
                        <p className="text-sm text-muted-foreground">
                          Interfaccia più densa per schermi piccoli
                        </p>
                      </div>
                      <Switch
                        checked={userPreferences.ui.compactMode}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ 
                            ui: { ...userPreferences.ui, compactMode: checked }
                          })
                        }
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Animazioni Ridotte</Label>
                        <p className="text-sm text-muted-foreground">
                          Disabilita animazioni per migliori prestazioni
                        </p>
                      </div>
                      <Switch
                        checked={userPreferences.ui.reducedMotion}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ 
                            ui: { ...userPreferences.ui, reducedMotion: checked }
                          })
                        }
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Suggerimenti</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostra tooltip e suggerimenti educativi
                        </p>
                      </div>
                      <Switch
                        checked={userPreferences.ui.showTooltips}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ 
                            ui: { ...userPreferences.ui, showTooltips: checked }
                          })
                        }
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </UnifiedCard>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <UnifiedCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifiche
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Promemoria Progresso</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricorda di continuare il percorso educativo
                      </p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.progressReminders}
                      onCheckedChange={(checked) => 
                        handlePreferenceUpdate({ 
                          notifications: { ...userPreferences.notifications, progressReminders: checked }
                        })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Nuovi Contenuti</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifica quando sono disponibili nuove lezioni
                      </p>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.newContent}
                      onCheckedChange={(checked) => 
                        handlePreferenceUpdate({ 
                          notifications: { ...userPreferences.notifications, newContent: checked }
                        })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Avvisi di Sicurezza</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifiche importanti per la sicurezza dell'account
                      </p>
                      <Badge variant="outline" className="mt-1">Consigliato</Badge>
                    </div>
                    <Switch
                      checked={userPreferences.notifications.securityAlerts}
                      onCheckedChange={(checked) => 
                        handlePreferenceUpdate({ 
                          notifications: { ...userPreferences.notifications, securityAlerts: checked }
                        })
                      }
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </CardContent>
            </UnifiedCard>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <UnifiedCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy e Sicurezza
                </h3>

                <div className="space-y-6">
                  {/* Cookie Management */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Gestione Cookie</Label>
                      <p className="text-sm text-muted-foreground">
                        Controlla quali cookie vengono utilizzati
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={cookiePreferences?.essential ? "default" : "outline"}>
                          Essenziali: {cookiePreferences?.essential ? 'Attivi' : 'Disattivi'}
                        </Badge>
                        <Badge variant={cookiePreferences?.functional ? "default" : "outline"}>
                          Funzionali: {cookiePreferences?.functional ? 'Attivi' : 'Disattivi'}
                        </Badge>
                        <Badge variant={cookiePreferences?.analytics ? "default" : "outline"}>
                          Analitici: {cookiePreferences?.analytics ? 'Attivi' : 'Disattivi'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowCookieModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Cookie className="w-4 h-4" />
                      Gestisci
                    </Button>
                  </div>

                  <Separator />

                  {/* Privacy Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Condivisione Statistiche</Label>
                        <p className="text-sm text-muted-foreground">
                          Aiuta a migliorare Tradelia condividendo dati anonimi
                        </p>
                      </div>
                      <Switch
                        checked={userPreferences.privacy.shareUsageStats}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ 
                            privacy: { ...userPreferences.privacy, shareUsageStats: checked }
                          })
                        }
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Contenuti Personalizzati</Label>
                        <p className="text-sm text-muted-foreground">
                          Suggerimenti basati sul tuo progresso educativo
                        </p>
                      </div>
                      <Switch
                        checked={userPreferences.privacy.personalizedContent}
                        onCheckedChange={(checked) => 
                          handlePreferenceUpdate({ 
                            privacy: { ...userPreferences.privacy, personalizedContent: checked }
                          })
                        }
                        disabled={isUpdating}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Data Retention */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Conservazione Dati</Label>
                      <p className="text-sm text-muted-foreground">
                        Per quanto tempo conservare i tuoi dati educativi
                      </p>
                    </div>
                    <Select
                      value={userPreferences.privacy.dataRetentionDays.toString()}
                      onValueChange={(value) => 
                        handlePreferenceUpdate({ 
                          privacy: { ...userPreferences.privacy, dataRetentionDays: parseInt(value) }
                        })
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 giorni</SelectItem>
                        <SelectItem value="90">90 giorni</SelectItem>
                        <SelectItem value="365">1 anno</SelectItem>
                        <SelectItem value="730">2 anni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </UnifiedCard>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <UnifiedCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Gestione Dati
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Esporta Dati</Label>
                      <p className="text-sm text-muted-foreground">
                        Scarica tutti i tuoi dati educativi e preferenze
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Esporta
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Importa Dati</Label>
                      <p className="text-sm text-muted-foreground">
                        Ripristina dati da un backup precedente
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Importa
                    </Button>
                  </div>

                  <Separator />

                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                      Zona Pericolosa
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Queste azioni sono irreversibili. Procedi con cautela.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Cancella Tutti i Dati
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Elimina Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </UnifiedCard>
          </TabsContent>
        </Tabs>

        {/* Cookie Preferences Modal */}
        <CookiePreferencesModal
          open={showCookieModal}
          onClose={() => setShowCookieModal(false)}
        />
      </div>
    </div>
  )
}