'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LockIcon, 
  ArrowRightIcon,
  CheckIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check if we have access token from email link
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    
    if (!accessToken) {
      setError('Link di reset password non valido o scaduto')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }

    if (password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (err: any) {
      setError('Errore durante il reset della password')
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
              Password aggiornata
            </h1>
            <p className="text-sm text-muted-foreground">
              La tua password è stata modificata con successo. 
              Verrai reindirizzato alla homepage.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
            <CheckIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-800">
              Reindirizzamento in corso...
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
            Nuova password
          </h1>
          <p className="text-sm text-muted-foreground">
            Inserisci la tua nuova password per completare il reset.
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
              Nuova password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
                placeholder="Minimo 8 caratteri"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Conferma password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
                placeholder="Ripeti la password"
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
              'Aggiornamento...'
            ) : (
              <>
                Aggiorna password
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
      </div>
    </div>
  )
}