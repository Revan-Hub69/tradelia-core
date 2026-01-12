/**
 * Settings Page Translations - Tradelia 2026
 * 
 * Modular translation system for settings page.
 * Follows i18n best practices with type safety.
 */

export const settingsTranslations = {
  it: {
    page: {
      title: 'Impostazioni',
      subtitle: 'Gestisci il tuo profilo e le preferenze',
      guestSubtitle: 'Gestisci il tuo profilo'
    },
    guest: {
      title: 'Accedi per gestire il profilo',
      description: 'Registrati o accedi per modificare le impostazioni del tuo account.',
      cta: 'Accedi o Registrati'
    },
    profile: {
      title: 'Profilo'
    },
    nickname: {
      title: 'Nickname',
      placeholder: 'Il tuo nickname',
      hint: '3-20 caratteri, lettere, numeri e _',
      success: 'Nickname aggiornato!',
      error: 'Nickname non valido (3-20 caratteri, solo lettere/numeri/_)',
      saveError: 'Errore nel salvataggio'
    },
    country: {
      title: 'Paese',
      placeholder: 'Seleziona...',
      search: 'Cerca...',
      success: 'Paese aggiornato!',
      error: 'Seleziona un paese',
      saveError: 'Errore nel salvataggio'
    },
    email: {
      title: 'Cambia Email',
      currentLabel: 'Email attuale: ',
      placeholder: 'Nuova email',
      hint: 'Riceverai un\'email di conferma al nuovo indirizzo.',
      success: 'Email di conferma inviata al nuovo indirizzo!',
      invalidError: 'Inserisci un\'email valida',
      sameError: 'La nuova email è uguale a quella attuale',
      saveError: 'Errore nel cambio email',
      change: 'Cambia'
    },
    security: {
      title: 'Sicurezza',
      description: 'Riceverai un link via email per reimpostare la password.',
      resetButton: 'Reimposta password',
      success: 'Email di reset inviata!',
      error: 'Errore'
    },
    common: {
      save: 'Salva',
      saving: '...'
    }
  },
  en: {
    page: {
      title: 'Settings',
      subtitle: 'Manage your profile and preferences',
      guestSubtitle: 'Manage your profile'
    },
    guest: {
      title: 'Sign in to manage profile',
      description: 'Register or sign in to edit your account settings.',
      cta: 'Sign in or Register'
    },
    profile: {
      title: 'Profile'
    },
    nickname: {
      title: 'Nickname',
      placeholder: 'Your nickname',
      hint: '3-20 chars, letters, numbers, _',
      success: 'Nickname updated!',
      error: 'Invalid nickname',
      saveError: 'Error saving'
    },
    country: {
      title: 'Country',
      placeholder: 'Select...',
      search: 'Search...',
      success: 'Country updated!',
      error: 'Select a country',
      saveError: 'Error saving'
    },
    email: {
      title: 'Change Email',
      currentLabel: 'Current email: ',
      placeholder: 'New email',
      hint: 'You will receive a confirmation email at the new address.',
      success: 'Confirmation email sent to new address!',
      invalidError: 'Enter a valid email',
      sameError: 'New email is the same as current',
      saveError: 'Error changing email',
      change: 'Change'
    },
    security: {
      title: 'Security',
      description: 'You will receive an email link to reset your password.',
      resetButton: 'Reset password',
      success: 'Reset email sent!',
      error: 'Error'
    },
    common: {
      save: 'Save',
      saving: '...'
    }
  }
} as const

export type SettingsLocale = keyof typeof settingsTranslations
export type SettingsTranslation = typeof settingsTranslations.it

export function getSettingsTranslations(locale: string): SettingsTranslation {
  return settingsTranslations[locale as SettingsLocale] ?? settingsTranslations.it
}
