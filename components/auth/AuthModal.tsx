'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LogIn, UserPlus, Shield, BookOpen, TrendingUp } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
  title?: string
  description?: string
}

export function AuthModal({ 
  open, 
  onClose, 
  defaultTab = 'login',
  title,
  description 
}: AuthModalProps) {
  const [currentTab, setCurrentTab] = useState(defaultTab)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSuccess = () => {
    onClose()
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setCurrentTab('login')
  }

  const benefits = [
    {
      icon: BookOpen,
      title: 'Progresso Salvato',
      description: 'Il tuo percorso educativo viene salvato automaticamente'
    },
    {
      icon: TrendingUp,
      title: 'Sincronizzazione',
      description: 'Accedi da qualsiasi dispositivo e riprendi da dove hai lasciato'
    },
    {
      icon: Shield,
      title: 'Privacy Protetta',
      description: 'I tuoi dati educativi sono crittografati e mai condivisi'
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            {title || 'Accedi a Tradelia'}
          </DialogTitle>
          <DialogDescription>
            {description || 'Salva il tuo progresso educativo e sincronizza tra dispositivi'}
          </DialogDescription>
        </DialogHeader>

        {showForgotPassword ? (
          <div className="flex-1 overflow-y-auto">
            <ForgotPasswordForm 
              onSuccess={handleSuccess}
              onBack={handleBackToLogin}
            />
          </div>
        ) : (
          <>
            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'login' | 'register')} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Accedi
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Registrati
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="login" className="space-y-4 mt-4">
                  <LoginForm 
                    onSuccess={handleSuccess}
                    onForgotPassword={handleForgotPassword}
                  />
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-4">
                  <RegisterForm onSuccess={handleSuccess} />
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex-shrink-0 space-y-4 pt-4 border-t">
              {/* Benefits Section - Compact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Perché creare un account?</h4>
                  <Badge variant="outline" className="text-xs">Opzionale</Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {benefits.slice(0, 2).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <benefit.icon className="w-3 h-3 text-primary flex-shrink-0" />
                      <div className="text-xs text-muted-foreground">{benefit.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue as Guest */}
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full text-sm"
              >
                Continua come Ospite
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}