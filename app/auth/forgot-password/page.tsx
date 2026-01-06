'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  MailIcon, 
  ArrowRightIcon,
  CheckIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Inserisci il tuo indirizzo email')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Inserisci un indirizzo email valido')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError('Errore durante l\'invio dell\'email di reset')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo />
            <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
              Email inviata
            </h1>
            <p className="text-sm text-muted-foreground">
              Controlla la tua casella email per il link di reset password.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium mb-1">
                  Email di reset inviata
                </p>
                <p className="text-xs text-green-700">
                  Abbiamo inviato un link per reimpostare la password a <strong>{email}</strong>. 
                  Il link scadrà tra 1 ora.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-subtle border border-border/50 rounded py-2"
            >
              Non hai ricevuto l'email? Riprova
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
            Reset password
          </h1>
          <p className="text-sm text-muted-foreground">
            Inserisci il tuo indirizzo email per ricevere il link di reset.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Indirizzo email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
                placeholder="mario@esempio.it"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Invio in corso...'
            ) : (
              <>
                Invia link di reset
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-subtle"
          >
            ← Torna alla homepage
          </button>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded text-xs text-muted-foreground">
          <p>
            <strong>Nota:</strong> Se non ricevi l'email entro qualche minuto, 
            controlla la cartella spam o riprova con un altro indirizzo.
          </p>
        </div>
      </div>
    </div>
  )
}