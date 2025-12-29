'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react'
import { authManager } from '@/lib/auth/supabase-auth'

interface LoginFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await authManager.login(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch (error) {
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await authManager.loginWithGoogle()
      
      if (result.error) {
        setError(result.error)
      }
      // Google OAuth will redirect, so no need to call onSuccess here
    } catch (error) {
      setError('Login con Google non riuscito. Riprova.')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="la-tua-email@esempio.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="La tua password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="px-0"
          >
            Password dimenticata?
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Oppure
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full"
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continua con Google
      </Button>

      <div className="text-xs text-muted-foreground text-center">
        Accedendo accetti i nostri{' '}
        <a href="/privacy" className="underline hover:text-foreground">
          Termini di Servizio
        </a>{' '}
        e{' '}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}