'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  MailIcon, 
  CheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function VerifyEmail() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get tokens from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            setError('Errore durante la verifica email: ' + error.message)
          } else {
            setSuccess(true)
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 3000)
          }
        } else {
          setError('Link di verifica non valido o scaduto')
        }
      } catch (err: any) {
        setError('Errore durante la verifica email')
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [router])

  const handleResendVerification = async () => {
    setResending(true)
    
    try {
      // Get current user email from URL params or ask user to enter it
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email')
      
      if (email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        })
        
        if (error) {
          setError('Errore durante l\'invio: ' + error.message)
        } else {
          alert('Email di verifica inviata!')
        }
      } else {
        setError('Email non trovata. Torna alla registrazione.')
      }
    } catch (err: any) {
      setError('Errore durante l\'invio dell\'email')
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifica email in corso...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo />
            <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
              Email verificata
            </h1>
            <p className="text-sm text-muted-foreground">
              La tua email è stata verificata con successo. 
              Verrai reindirizzato alla dashboard.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
            <CheckIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">
              Reindirizzamento alla dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
            Verifica email
          </h1>
          <p className="text-sm text-muted-foreground">
            Si è verificato un problema durante la verifica della tua email.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              'Invio in corso...'
            ) : (
              <>
                <MailIcon className="w-4 h-4 mr-2" />
                Invia nuova email di verifica
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-subtle"
            >
              ← Torna alla homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}