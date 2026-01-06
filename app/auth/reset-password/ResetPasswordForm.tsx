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

export default function ResetPasswordForm() {
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
    } catch (err: unknown) {
      setError('Errore durante il reset della password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Logo />
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                Password aggiornata
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La password è stata modificata. Reindirizzamento alla homepage.
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded border border-green-200 bg-green-50 text-center">
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
    <div className="min-h-screen bg-background flex items-center justify-center px-6 sm:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Logo />
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
              Nuova password
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Inserisci la nuova password per completare il reset.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded border border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium text-foreground">
              Nuova password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder="Minimo 8 caratteri"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground">
              Conferma password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all duration-150 placeholder:text-muted-foreground/60"
                placeholder="Ripeti la password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-foreground text-background text-sm font-medium rounded hover:bg-foreground/90 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
          >
            {loading ? 'Aggiornamento...' : 'Aggiorna password'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            ← Torna alla homepage
          </button>
        </div>
      </div>
    </div>
  )
}