# Requirements Document - Sistema Autenticazione Integrato

## Introduction

Sistema di autenticazione unificato che integra onboarding, registrazione e login in un'esperienza fluida e coerente, seguendo i principi Tradelia 2026 di chiarezza e neutralità.

## Glossary

- **Auth_Modal**: Modal unificato per tutte le operazioni di autenticazione
- **Onboarding_Flow**: Processo di raccolta preferenze utente (5 step)
- **Auth_State**: Stato corrente dell'autenticazione (guest, login, register, reset)
- **User_Journey**: Percorso completo dall'arrivo alla dashboard personalizzata

## Requirements

### Requirement 1: Auth Gateway Intelligente

**User Story:** Come utente, voglio che il sistema riconosca se sono nuovo o esistente, così da non dover rifare processi inutili.

#### Acceptance Criteria

1. WHEN un utente clicca "Avvia verifica", THE Auth_Modal SHALL aprire con scelta immediata: Nuovo utente / Hai già un account? / Google
2. WHEN un utente sceglie "Nuovo utente", THE Auth_Modal SHALL iniziare l'onboarding (Steps 1-5)
3. WHEN un utente sceglie "Hai già un account?", THE Auth_Modal SHALL mostrare direttamente il form di login
4. WHEN un utente fa login con successo, THE System SHALL reindirizzare direttamente alla dashboard esistente
5. THE Auth_Modal SHALL mantenere design coerente in tutti gli stati

### Requirement 2: Onboarding Solo per Nuovi Utenti

**User Story:** Come utente esistente, voglio accedere direttamente alla mia dashboard senza rifare l'onboarding.

#### Acceptance Criteria

1. WHEN un utente esistente fa login, THE System SHALL caricare la dashboard con le preferenze salvate
2. WHEN un utente esistente non ha preferenze salvate, THE System SHALL offrire di completare l'onboarding opzionale
3. WHEN un nuovo utente completa l'onboarding, THE System SHALL salvare le preferenze prima del login/registrazione
4. THE System SHALL distinguere chiaramente tra utenti nuovi ed esistenti
5. THE System SHALL preservare i dati di onboarding durante il processo di registrazione

### Requirement 3: Flusso Reset Password Integrato

**User Story:** Come utente, voglio recuperare la password senza lasciare il contesto dell'applicazione.

#### Acceptance Criteria

1. WHEN un utente richiede reset password, THE Auth_Modal SHALL mostrare form email integrato
2. WHEN l'email è inviata, THE Auth_Modal SHALL mostrare conferma con opzione di tornare al login
3. WHEN un utente clicca link email, THE System SHALL aprire modal reset password
4. WHEN la password è aggiornata, THE System SHALL reindirizzare alla dashboard
5. THE Auth_Modal SHALL mantenere design coerente in tutti gli stati

### Requirement 4: Ottimizzazione Performance e UX

**User Story:** Come utente, voglio un'esperienza veloce e fluida senza interruzioni o caricamenti lunghi.

#### Acceptance Criteria

1. THE Auth_Modal SHALL caricare tutti gli stati senza refresh della pagina
2. THE Auth_Modal SHALL validare i form in tempo reale
3. THE Auth_Modal SHALL mostrare loading states appropriati
4. THE Auth_Modal SHALL preservare i dati inseriti durante i cambi di stato
5. THE Auth_Modal SHALL supportare navigazione keyboard completa

### Requirement 5: Sicurezza e Validazione

**User Story:** Come utente, voglio che i miei dati siano sicuri e che riceva feedback chiari su eventuali errori.

#### Acceptance Criteria

1. THE Auth_Modal SHALL validare email format in tempo reale
2. THE Auth_Modal SHALL richiedere password minimo 8 caratteri
3. THE Auth_Modal SHALL mostrare strength indicator per password
4. THE Auth_Modal SHALL sanitizzare tutti gli input
5. THE Auth_Modal SHALL gestire errori di rete con retry automatico

### Requirement 6: Accessibilità e Responsive Design

**User Story:** Come utente con diverse abilità e dispositivi, voglio poter utilizzare il sistema di autenticazione senza barriere.

#### Acceptance Criteria

1. THE Auth_Modal SHALL supportare navigazione completa da tastiera
2. THE Auth_Modal SHALL avere focus management appropriato tra gli stati
3. THE Auth_Modal SHALL essere completamente responsive su tutti i dispositivi
4. THE Auth_Modal SHALL supportare screen readers con ARIA labels appropriati
5. THE Auth_Modal SHALL rispettare prefers-reduced-motion per le animazioni

### Requirement 7: Integrazione Google OAuth

**User Story:** Come utente, voglio poter utilizzare il mio account Google per accedere rapidamente.

#### Acceptance Criteria

1. THE Auth_Modal SHALL mostrare pulsante Google OAuth in tutti gli stati appropriati
2. WHEN un utente usa Google OAuth, THE System SHALL preservare i dati di onboarding
3. WHEN Google OAuth fallisce, THE Auth_Modal SHALL mostrare fallback al form email
4. THE Auth_Modal SHALL gestire utenti Google esistenti vs nuovi
5. THE System SHALL sincronizzare dati onboarding con profilo Google

### Requirement 8: Modularità e Manutenibilità

**User Story:** Come sviluppatore, voglio un sistema modulare e facilmente manutenibile.

#### Acceptance Criteria

1. THE Auth_Modal SHALL essere composto da componenti riutilizzabili
2. THE Auth_Modal SHALL utilizzare un state manager centralizzato
3. THE Auth_Modal SHALL separare logica di business da presentazione
4. THE Auth_Modal SHALL avere test unitari per ogni componente
5. THE Auth_Modal SHALL seguire pattern di design consistenti

### Requirement 9: Analytics e Monitoraggio

**User Story:** Come product owner, voglio monitorare l'efficacia del flusso di autenticazione.

#### Acceptance Criteria

1. THE Auth_Modal SHALL tracciare conversioni per ogni step
2. THE Auth_Modal SHALL monitorare errori e fallimenti
3. THE Auth_Modal SHALL tracciare tempo di completamento
4. THE Auth_Modal SHALL identificare punti di abbandono
5. THE System SHALL rispettare privacy utente nel tracking