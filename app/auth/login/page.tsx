'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  MailIcon, 
  LockIcon,
  ArrowRightIcon,
  AlertTriangleIcon 
} from '@/components/icons/TradeliaIcons'
import Logo from '@/components/Logo'

export default function Login() {
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle, loading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Inserisci email e password')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      await signInWithEmail(formData.email, formData.password)
      // Redirect to localized dashboard
      const userLocale = navigator.language.startsWith('en') ? 'en' : 'it';
      router.push(`/${userLocale}/dashboard`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Errore durante l\'accesso';
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Errore durante l\'accesso con Google';
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-2">
            Accedi al tuo account
          </h1>
          <p className="text-sm text-muted-foreground">
            Accedi per sincronizzare le tue preferenze
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 p-3 border border-border/50 rounded hover:bg-muted/30 transition-all disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continua con Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">oppure</span>
          </div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
                placeholder="mario@esempio.it"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-border/50 rounded focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm"
                placeholder="La tua password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-tech disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              'Accesso in corso...'
            ) : (
              <>
                Accedi
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/auth/forgot-password"
            className="text-xs text-primary hover:text-primary/80 transition-subtle"
          >
            Password dimenticata?
          </a>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-subtle"
          >
            ← Torna alla homepage
          </button>
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded text-xs text-muted-foreground text-center">
          <p>
            Non hai un account? Completa il questionario sulla homepage per registrarti.
          </p>
        </div>
      </div>
    </div>
  )
}