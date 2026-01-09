# Implementation Plan: Sistema Autenticazione Integrato

## Overview

Implementazione del sistema di autenticazione unificato che integra onboarding, registrazione, login e reset password in un modal fluido e coerente.

## Tasks

- [ ] 1. Creazione Auth Gateway (schermata iniziale)
  - Implementare componente AuthGateway con 3 opzioni principali
  - Aggiungere routing interno per gestire scelte utente
  - Integrare Google OAuth button prominente
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Refactoring flusso esistente
  - [ ] 2.1 Modificare DashboardModal per iniziare con AuthGateway
    - Cambiare entry point da onboarding a gateway
    - Aggiungere state management per userType (new/existing)
    - _Requirements: 1.1, 2.4_

  - [ ] 2.2 Separare onboarding per solo nuovi utenti
    - Attivare Steps 1-5 solo se utente sceglie "Nuovo utente"
    - Preservare dati onboarding durante registrazione
    - _Requirements: 2.1, 2.5_

- [ ] 3. Implementazione Login diretto
  - [ ] 3.1 Creare LoginForm standalone
    - Form login accessibile direttamente da gateway
    - Validazione real-time e error handling
    - Link "Password dimenticata?" integrato
    - _Requirements: 2.1, 3.1_

  - [ ] 3.2 Gestire utenti esistenti senza onboarding
    - Redirect diretto a dashboard dopo login
    - Caricare preferenze esistenti da database
    - Offrire onboarding opzionale se mancano dati
    - _Requirements: 2.1, 2.2_

- [ ] 4. Ottimizzazione entry points
  - [ ] 4.1 Migliorare link "Accedi" in header
    - Aprire modal direttamente in modalità login
    - Saltare gateway se utente clicca "Accedi"
    - _Requirements: 1.4_

  - [ ] 4.2 Gestire accesso diretto a /dashboard
    - Redirect a modal auth se non autenticato
    - Preservare intended destination dopo login
    - _Requirements: 2.1_

- [ ] 5. Ottimizzazioni performance e sicurezza
  - [ ] 5.1 Implementare code splitting per componenti auth
    - Lazy loading per GoogleOAuth
    - Dynamic imports per form components
    - Preload strategico basato su user intent
    - _Requirements: 4.1, 4.2_

  - [ ] 5.2 Aggiungere rate limiting e security measures
    - Rate limiting per tentativi login
    - Input sanitization avanzata
    - CSRF protection per form submissions
    - _Requirements: 5.4, 5.5_

- [ ] 6. Miglioramenti accessibilità e responsive
  - [ ] 6.1 Implementare keyboard navigation completa
    - Tab trapping migliorato per stati multipli
    - Shortcuts keyboard per azioni comuni
    - Focus management tra transizioni di stato
    - _Requirements: 6.1, 6.2_

  - [ ] 6.2 Ottimizzare responsive design per mobile
    - Touch-friendly form controls
    - Keyboard mobile ottimizzato
    - Gesture support per navigazione
    - _Requirements: 6.3_

  - [ ] 6.3 Aggiungere supporto screen reader avanzato
    - ARIA live regions per feedback dinamico
    - Descrizioni contestuali per ogni stato
    - Landmark navigation appropriata
    - _Requirements: 6.4_

- [ ] 7. Integrazione e testing
  - [ ] 7.1 Aggiornare routing e redirects
    - Rimuovere pagine auth separate (/auth/login, /auth/register, etc.)
    - Implementare deep linking per stati modal
    - Gestire URL parameters per reset password
    - _Requirements: 3.4_

  - [ ] 7.2 Implementare comprehensive testing
    - Unit tests per ogni componente auth
    - Integration tests per flussi completi
    - E2E tests per user journeys critici
    - _Requirements: 8.4_

- [ ] 8. Monitoraggio e analytics
  - [ ] 8.1 Aggiungere tracking eventi per ottimizzazione
    - Conversion tracking per ogni step
    - Error tracking e categorizzazione
    - Performance monitoring
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 8.2 Implementare A/B testing framework
    - Test diversi copy per CTA
    - Test posizionamento opzioni auth
    - Test flussi alternativi
    - _Requirements: 9.4_

- [ ] 9. Checkpoint finale e cleanup
  - Verificare tutti i flussi end-to-end
  - Rimuovere codice legacy delle pagine auth separate
  - Ottimizzare bundle size finale
  - Documentare API e componenti per manutenzione futura

## Notes

- Priorità: UX fluida > Performance > Features avanzate
- Ogni task deve mantenere backward compatibility durante sviluppo
- Testing continuo durante implementazione per evitare regressioni
- Focus su mobile-first approach per tutti i componenti
- Seguire rigorosamente Tradelia 2026 design guidelines