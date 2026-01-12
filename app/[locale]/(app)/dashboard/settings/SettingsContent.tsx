'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { validateNickname } from '@/src/shared/lib/validation'
import { getCountriesSortedByLocale } from '@/lib/countries'
import { 
  UserIcon, 
  MailIcon, 
  GlobeIcon, 
  LockIcon,
  SearchIcon,
  CheckIcon
} from '@/components/icons/TradeliaIcons'

// Generate initials from nickname
function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/[\s_-]+/)
  if (parts.length >= 2) {
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Generate consistent color from string
function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-rose-500 to-rose-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % colors.length
  return colors[idx] ?? 'from-blue-500 to-blue-600'
}

export function SettingsContent() {
  const locale = useLocale()
  const { state, actions } = useDashboardAuth()
  const isIt = locale === 'it'
  
  // Form state
  const [nickname, setNickname] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  
  // UI state
  const [saving, setSaving] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Country dropdown
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const countryRef = useRef<HTMLDivElement>(null)
  const countryInputRef = useRef<HTMLInputElement>(null)

  const countries = useMemo(() => getCountriesSortedByLocale(locale === 'it' ? 'it' : 'en'), [locale])
  
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries
    const q = countrySearch.toLowerCase()
    return countries.filter(c => {
      const name = locale === 'it' ? c.nameIt : c.name
      return name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    })
  }, [countries, countrySearch, locale])

  const selectedCountry = countries.find(c => c.code === country)

  // Load current values
  useEffect(() => {
    if (state.profile) {
      setNickname(state.profile.nickname || '')
      setCountry(state.profile.country_code || '')
    }
    if (state.user) {
      setEmail(state.user.email || '')
    }
  }, [state.profile, state.user])

  // Close country dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false)
      }
    }
    if (isCountryOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCountryOpen])

  useEffect(() => {
    if (isCountryOpen && countryInputRef.current) {
      countryInputRef.current.focus()
    }
  }, [isCountryOpen])

  const showMessage = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      setSuccess(msg)
      setError(null)
    } else {
      setError(msg)
      setSuccess(null)
    }
    setTimeout(() => { setSuccess(null); setError(null) }, 4000)
  }

  // Save nickname
  const handleSaveNickname = async () => {
    const result = validateNickname(nickname)
    if (!result.success) {
      const msgs: Record<string, string> = {
        minLength: isIt ? 'Minimo 3 caratteri' : 'Minimum 3 characters',
        maxLength: isIt ? 'Massimo 20 caratteri' : 'Maximum 20 characters',
        invalid: isIt ? 'Solo lettere, numeri e _' : 'Only letters, numbers and _'
      }
      showMessage('error', msgs[result.error] || 'Invalid')
      return
    }

    setSaving('nickname')
    try {
      await actions.updateProfile({ nickname })
      showMessage('success', isIt ? 'Nickname aggiornato!' : 'Nickname updated!')
    } catch {
      showMessage('error', isIt ? 'Errore nel salvataggio' : 'Error saving')
    } finally {
      setSaving(null)
    }
  }

  // Save country
  const handleSaveCountry = async () => {
    if (!country || !/^[A-Z]{2}$/.test(country)) {
      showMessage('error', isIt ? 'Seleziona un paese valido' : 'Select a valid country')
      return
    }

    setSaving('country')
    try {
      await actions.updateProfile({ country_code: country })
      showMessage('success', isIt ? 'Paese aggiornato!' : 'Country updated!')
    } catch {
      showMessage('error', isIt ? 'Errore nel salvataggio' : 'Error saving')
    } finally {
      setSaving(null)
    }
  }

  // Change email
  const handleChangeEmail = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage('error', isIt ? 'Email non valida' : 'Invalid email')
      return
    }

    setSaving('email')
    try {
      const { error } = await supabase.auth.updateUser({ email })
      if (error) throw error
      showMessage('success', isIt ? 'Email di conferma inviata!' : 'Confirmation email sent!')
    } catch {
      showMessage('error', isIt ? 'Errore nel cambio email' : 'Error changing email')
    } finally {
      setSaving(null)
    }
  }

  // Reset password
  const handleResetPassword = async () => {
    const userEmail = state.user?.email
    if (!userEmail) {
      showMessage('error', isIt ? 'Email non disponibile' : 'Email not available')
      return
    }

    setSaving('password')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      showMessage('success', isIt ? 'Email di reset inviata!' : 'Reset email sent!')
    } catch {
      showMessage('error', isIt ? 'Errore nell\'invio' : 'Error sending')
    } finally {
      setSaving(null)
    }
  }

  // Guest mode check
  if (state.isGuestMode) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isIt ? 'Impostazioni' : 'Settings'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isIt ? 'Configura le tue preferenze' : 'Configure your preferences'}
          </p>
        </div>
        <div className="rounded border border-border/50 bg-background p-6 text-center">
          <p className="text-muted-foreground">
            {isIt ? 'Registrati per accedere alle impostazioni del profilo.' : 'Register to access profile settings.'}
          </p>
        </div>
      </div>
    )
  }

  const avatarUrl = state.profile?.avatar_url
  const displayName = state.profile?.nickname || state.profile?.full_name || 'User'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {isIt ? 'Impostazioni' : 'Settings'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isIt ? 'Gestisci il tuo profilo e le preferenze' : 'Manage your profile and preferences'}
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-3 rounded border border-green-500/20 bg-green-500/10 text-sm text-green-600 flex items-center gap-2">
          <CheckIcon className="w-4 h-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded border border-error/20 bg-error/5 text-sm text-error">
          {error}
        </div>
      )}

      {/* Avatar Section */}
      <div className="rounded border border-border/50 bg-background p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isIt ? 'Avatar' : 'Avatar'}
        </h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(displayName)} flex items-center justify-center`}>
              <span className="text-xl font-semibold text-white">{getInitials(displayName)}</span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {avatarUrl 
                ? (isIt ? 'Avatar da Google' : 'Avatar from Google')
                : (isIt ? 'Avatar generato dalle iniziali' : 'Avatar generated from initials')
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isIt ? 'L\'avatar viene generato automaticamente dal tuo nickname' : 'Avatar is automatically generated from your nickname'}
            </p>
          </div>
        </div>
      </div>

      {/* Nickname Section */}
      <div className="rounded border border-border/50 bg-background p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isIt ? 'Nickname' : 'Nickname'}
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={isIt ? 'Il tuo nickname' : 'Your nickname'}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isIt ? '3-20 caratteri, solo lettere, numeri e _' : '3-20 characters, letters, numbers and _ only'}
          </p>
          <button
            onClick={handleSaveNickname}
            disabled={saving === 'nickname'}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === 'nickname' ? (isIt ? 'Salvataggio...' : 'Saving...') : (isIt ? 'Salva nickname' : 'Save nickname')}
          </button>
        </div>
      </div>

      {/* Country Section */}
      <div className="rounded border border-border/50 bg-background p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isIt ? 'Paese di residenza' : 'Country of residence'}
        </h2>
        <div className="space-y-3" ref={countryRef}>
          <div className="relative">
            <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80 z-10" />
            <button
              type="button"
              onClick={() => { setIsCountryOpen(!isCountryOpen); setCountrySearch('') }}
              className={`w-full h-11 pl-10 pr-10 text-sm bg-background border border-border rounded text-left ${!country ? 'text-muted-foreground' : 'text-foreground'} focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              {selectedCountry 
                ? (locale === 'it' ? selectedCountry.nameIt : selectedCountry.name)
                : (isIt ? 'Seleziona paese' : 'Select country')}
            </button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isCountryOpen && (
              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-hidden">
                <div className="p-2 border-b border-border/50">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      ref={countryInputRef}
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder={isIt ? 'Cerca paese...' : 'Search country...'}
                      className="w-full h-9 pl-8 pr-3 text-sm bg-muted/30 border-0 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                      {isIt ? 'Nessun paese trovato' : 'No country found'}
                    </div>
                  ) : (
                    filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountry(c.code)
                          setIsCountryOpen(false)
                          setCountrySearch('')
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2 ${country === c.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      >
                        <span className="text-xs text-muted-foreground w-6">{c.code}</span>
                        <span>{locale === 'it' ? c.nameIt : c.name}</span>
                        {country === c.code && <CheckIcon className="w-4 h-4 ml-auto" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSaveCountry}
            disabled={saving === 'country'}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === 'country' ? (isIt ? 'Salvataggio...' : 'Saving...') : (isIt ? 'Salva paese' : 'Save country')}
          </button>
        </div>
      </div>

      {/* Email Section */}
      <div className="rounded border border-border/50 bg-background p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isIt ? 'Email' : 'Email'}
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@esempio.com"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isIt ? 'Riceverai un\'email di conferma al nuovo indirizzo' : 'You will receive a confirmation email at the new address'}
          </p>
          <button
            onClick={handleChangeEmail}
            disabled={saving === 'email'}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === 'email' ? (isIt ? 'Invio...' : 'Sending...') : (isIt ? 'Cambia email' : 'Change email')}
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="rounded border border-border/50 bg-background p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">
          {isIt ? 'Password' : 'Password'}
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {isIt 
              ? 'Per cambiare la password, ti invieremo un link di reset via email.' 
              : 'To change your password, we will send you a reset link via email.'}
          </p>
          <button
            onClick={handleResetPassword}
            disabled={saving === 'password'}
            className="px-4 py-2 text-sm font-medium border border-border text-foreground rounded hover:bg-muted/50 disabled:opacity-50 flex items-center gap-2"
          >
            <LockIcon className="w-4 h-4" />
            {saving === 'password' ? (isIt ? 'Invio...' : 'Sending...') : (isIt ? 'Reimposta password' : 'Reset password')}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded border border-error/30 bg-error/5 p-6">
        <h2 className="text-lg font-medium text-error mb-4">
          {isIt ? 'Zona pericolosa' : 'Danger zone'}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isIt 
            ? 'Queste azioni sono irreversibili. Procedi con cautela.' 
            : 'These actions are irreversible. Proceed with caution.'}
        </p>
        <button
          onClick={() => {
            if (confirm(isIt ? 'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.' : 'Are you sure you want to delete your account? This action is irreversible.')) {
              // TODO: Implement account deletion
              showMessage('error', isIt ? 'Funzione non ancora disponibile' : 'Feature not yet available')
            }
          }}
          className="px-4 py-2 text-sm font-medium border border-error text-error rounded hover:bg-error/10"
        >
          {isIt ? 'Elimina account' : 'Delete account'}
        </button>
      </div>
    </div>
  )
}
