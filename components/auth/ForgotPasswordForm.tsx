'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authManager } from '@/lib/auth/supabase-auth'

interface ForgotPasswordFormProps {
  onSuccess: () => void
  onBack: () => void
}

export function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await authManager.resetPassword(email)
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Ti abbiamo inviato un link per reimpostare la password. Controlla la tua email.')
      }
    } catch (error) {
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-semibold">Password Dimenticata</h3>
          <p className="text-sm text-muted-foreground">
            Inserisci la tua email per ricevere il link di reset
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          {success}
        </Alert>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                name="email"
                type="email"
                placeholder="la-tua-email@esempio.com"
                value={email}
                onChange={handleChange}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Invio in corso...' : 'Invia Link di Reset'}
          </Button>
        </form>
      )}

      {success && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
            <p className="mb-2">
              <strong>Cosa fare ora:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Controlla la tua casella email (anche spam/promozioni)</li>
              <li>Clicca sul link ricevuto</li>
              <li>Imposta una nuova password</li>
              <li>Torna qui per accedere</li>
            </ol>
          </div>

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Torna al Login
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Non hai ricevuto l'email? Controlla la cartella spam o{' '}
        <button
          type="button"
          onClick={() => {
            setSuccess('')
            setError('')
          }}
          className="underline hover:text-foreground"
          disabled={isLoading}
        >
          riprova
        </button>
      </div>
    </div>
  )
}