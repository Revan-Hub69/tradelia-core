'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'
import { useDashboardModal } from '@/contexts/DashboardModalContext'
import { validateNickname } from '@/src/shared/lib/validation'
import { getCountriesSortedByLocale } from '@/lib/countries'
import { 
  UserIcon, 
  GlobeIcon, 
  LockIcon,
  SearchIcon,
  CheckIcon
} from '@/components/icons/TradeliaIcons'

function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/[\s_-]+/)
  if (parts.length >= 2) {
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600', 
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length] ?? 'from-blue-500 to-blue-600'
}

export function SettingsContent() {
  const locale = useLocale()
  const { state, actions } = useDashboardAuth()
  const { openModal } = useDashboardModal()
  const isIt = locale === 'it'
  
  const [nickname, setNickname] = useState('')
  const [country, setCountry] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const countryRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (state.profile) {
      setNickname(state.profile.nickname || '')
      setCountry(state.profile.country_code || '')
    }
  }, [state.profile])

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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSaveNickname = async () => {
    const result = validateNickname(nickname)
    if (!result.success) {
      showMessage('error', isIt ? 'Nickname non valido (3-20 caratteri, solo lettere/numeri/_)' : 'Invalid nickname')
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

  const handleSaveCountry = async () => {
    if (!country) {
      showMessage('error', isIt ? 'Seleziona un paese' : 'Select a country')
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

  const handleResetPassword = async () => {
    const email = state.user?.email
    if (!email) return
    setSaving('password')
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      showMessage('success', isIt ? 'Email di reset inviata!' : 'Reset email sent!')
    } catch {
      showMessage('error', isIt ? 'Errore' : 'Error')
    } finally {
      setSaving(null)
    }
  }

  // Guest view
  if (state.isGuestMode) {
    return (
      <DashboardAuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="section-frame p-6">
              <h1 className="text-2xl font-bold text-foreground">{isIt ? 'Impostazioni' : 'Settings'}</h1>
              <p className="text-muted-foreground mt-1">{isIt ? 'Gestisci il tuo profilo' : 'Manage your profile'}</p>
            </div>
            <div className="section-frame p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                {isIt ? 'Accedi per gestire il profilo' : 'Sign in to manage profile'}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {isIt ? 'Registrati o accedi per modificare le impostazioni del tuo account.' : 'Register or sign in to edit your account settings.'}
              </p>
              <button
                onClick={() => openModal('gateway')}
                className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
              >
                {isIt ? 'Accedi o Registrati' : 'Sign in or Register'}
              </button>
            </div>
          </div>
        </DashboardLayout>
      </DashboardAuthGuard>
    )
  }

  const avatarUrl = state.profile?.avatar_url
  const displayName = state.profile?.nickname || state.profile?.full_name || 'User'

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-6 max-w-2xl">
          {/* Header */}
          <div className="section-frame p-6">
            <h1 className="text-2xl font-bold text-foreground">{isIt ? 'Impostazioni' : 'Settings'}</h1>
            <p className="text-muted-foreground mt-1">{isIt ? 'Gestisci il tuo profilo e le preferenze' : 'Manage your profile and preferences'}</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`section-frame p-4 ${message.type === 'success' ? 'border-green-500/30 bg-green-500/5' : 'border-error/30 bg-error/5'}`}>
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-error'}`}>{message.text}</p>
            </div>
          )}

          {/* Avatar */}
          <div className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{isIt ? 'Profilo' : 'Profile'}</h2>
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover border-2 border-border" />
              ) : (
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(displayName)} flex items-center justify-center border-2 border-white/20`}>
                  <span className="text-xl font-bold text-white">{getInitials(displayName)}</span>
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{displayName}</p>
                <p className="text-sm text-muted-foreground">{state.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nickname */}
          <div className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{isIt ? 'Nickname' : 'Nickname'}</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={isIt ? 'Il tuo nickname' : 'Your nickname'}
                />
              </div>
              <button
                onClick={handleSaveNickname}
                disabled={saving === 'nickname'}
                className="px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {saving === 'nickname' ? '...' : (isIt ? 'Salva' : 'Save')}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{isIt ? '3-20 caratteri, lettere, numeri e _' : '3-20 chars, letters, numbers, _'}</p>
          </div>

          {/* Country */}
          <div className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{isIt ? 'Paese' : 'Country'}</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative" ref={countryRef}>
                <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <button
                  type="button"
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  className="w-full h-10 pl-10 pr-10 text-sm bg-background border border-border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {selectedCountry ? (locale === 'it' ? selectedCountry.nameIt : selectedCountry.name) : (isIt ? 'Seleziona...' : 'Select...')}
                </button>
                {isCountryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-border/50">
                      <div className="relative">
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder={isIt ? 'Cerca...' : 'Search...'}
                          className="w-full h-8 pl-8 pr-3 text-sm bg-muted/30 border-0 rounded focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCountry(c.code); setIsCountryOpen(false); setCountrySearch('') }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2 ${country === c.code ? 'bg-primary/10 text-primary' : ''}`}
                        >
                          <span className="text-xs text-muted-foreground w-6">{c.code}</span>
                          <span>{locale === 'it' ? c.nameIt : c.name}</span>
                          {country === c.code && <CheckIcon className="w-4 h-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveCountry}
                disabled={saving === 'country'}
                className="px-4 h-10 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {saving === 'country' ? '...' : (isIt ? 'Salva' : 'Save')}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="section-frame p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{isIt ? 'Sicurezza' : 'Security'}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {isIt ? 'Riceverai un link via email per reimpostare la password.' : 'You will receive an email link to reset your password.'}
            </p>
            <button
              onClick={handleResetPassword}
              disabled={saving === 'password'}
              className="px-4 h-10 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted/50 disabled:opacity-50 flex items-center gap-2"
            >
              <LockIcon className="w-4 h-4" />
              {saving === 'password' ? '...' : (isIt ? 'Reimposta password' : 'Reset password')}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}
