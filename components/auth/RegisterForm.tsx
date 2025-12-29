'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User, Chrome, CheckCircle } from 'lucide-react'
import { authManager } from '@/lib/auth/supabase-auth'

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri')
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Devi accettare i termini di servizio per continuare')
      setIsLoading(false)
      return
    }

    try {
      const result = await authManager.register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName || undefined
      })
      
      if (result.error) {
        if (result.error.includes('check your email')) {
          setSuccess('Registrazione completata! Controlla la tua email per verificare l\'account.')
        } else {
          setError(result.error)
        }
      } else {
        onSuccess()
      }
    } catch (error) {
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    if (!acceptTerms) {
      setError('Devi accettare i termini di servizio per continuare')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await authManager.loginWithGoogle()
      
      if (result.error) {
        setError(result.error)
      }
      // Google OAuth will redirect, so no need to call onSuccess here
    } catch (error) {
      setError('Registrazione con Google non riuscita. Riprova.')
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' }
    if (password.length < 6) return { strength: 1, label: 'Debole' }
    if (password.length < 8) return { strength: 2, label: 'Media' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: 'Forte' }
    }
    return { strength: 3, label: 'Buona' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="space-y-4">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Nome (opzionale)</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Come vuoi essere chiamato"
              value={formData.displayName}
              onChange={handleChange}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

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
              placeholder="Almeno 8 caratteri"
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
          
          {formData.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level <= passwordStrength.strength
                        ? passwordStrength.strength === 1
                          ? 'bg-red-500'
                          : passwordStrength.strength === 2
                          ? 'bg-orange-500'
                          : passwordStrength.strength === 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Sicurezza: {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Conferma Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ripeti la password"
              value={formData.confirmPassword}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">
              Le password non corrispondono
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
            Accetto i{' '}
            <a href="/privacy" className="underline hover:text-foreground" target="_blank">
              Termini di Servizio
            </a>{' '}
            e la{' '}
            <a href="/privacy" className="underline hover:text-foreground" target="_blank">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            isLoading || 
            !formData.email || 
            !formData.password || 
            !formData.confirmPassword ||
            !acceptTerms ||
            formData.password !== formData.confirmPassword
          }
        >
          {isLoading ? 'Registrazione in corso...' : 'Crea Account'}
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
        onClick={handleGoogleRegister}
        disabled={isLoading || !acceptTerms}
        className="w-full"
      >
        <Chrome className="mr-2 h-4 w-4" />
        Registrati con Google
      </Button>
    </div>
  )
}