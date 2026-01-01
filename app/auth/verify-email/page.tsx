'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/browser-client'
import Link from 'next/link'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!supabase) {
          setStatus('error')
          setMessage('Servizio di autenticazione non disponibile')
          return
        }

        // Get token from URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'email') {
          setStatus('error')
          setMessage('Link di verifica non valido')
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        })

        if (error) {
          if (error.message.includes('expired')) {
            setStatus('expired')
            setMessage('Il link di verifica è scaduto')
          } else {
            setStatus('error')
            setMessage('Verifica email fallita: ' + error.message)
          }
        } else {
          setStatus('success')
          setMessage('Email verificata con successo!')
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard?success=email_verified')
          }, 3000)
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setMessage('Si è verificato un errore durante la verifica')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const handleResendVerification = async () => {
    // This would need to be implemented with user email
    // For now, redirect to login
    router.push('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Torna alla Dashboard
          </Link>
        </Button>

        <UnifiedCard>
          <CardContent className="p-8 text-center">
            
            {status === 'loading' && (
              <div className="space-y-4">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                <div>
                  <h1 className="text-xl font-semibold mb-2">Verifica Email</h1>
                  <p className="text-muted-foreground">
                    Stiamo verificando la tua email...
                  </p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                    Email Verificata!
                  </h1>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    {message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verrai reindirizzato alla dashboard tra pochi secondi...
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard">
                    Vai alla Dashboard
                  </Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                    Verifica Fallita
                  </h1>
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    {message}
                  </p>
                </div>
                <div className="space-y-2">
                  <Button onClick={handleResendVerification} className="w-full">
                    Richiedi Nuovo Link
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">
                      Torna alla Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'expired' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Link Scaduto
                  </h1>
                  <p className="text-orange-700 dark:text-orange-300 mb-4">
                    {message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Richiedi un nuovo link di verifica per completare la procedura.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button onClick={handleResendVerification} className="w-full">
                    Invia Nuovo Link
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">
                      Torna alla Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </UnifiedCard>

        {/* Educational Note */}
        <div className="text-xs text-muted-foreground text-center p-4 bg-muted/20 rounded-lg">
          <strong>Nota:</strong> La verifica email è importante per la sicurezza del tuo account educativo 
          e per ricevere aggiornamenti sui tuoi progressi.
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Caricamento...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
