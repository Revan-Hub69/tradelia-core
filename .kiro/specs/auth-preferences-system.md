# Sistema di Autenticazione e Preferenze - Tradelia

## Introduzione

Implementazione completa del sistema di autenticazione opzionale e gestione delle preferenze per Tradelia. Il sistema deve essere **non invasivo** e **educativo**, seguendo i principi anti-hype della piattaforma.

## Glossary

- **Auth_System**: Sistema di autenticazione Supabase completo
- **Guest_Mode**: Modalità ospite con salvataggio temporaneo
- **Preferences_System**: Sistema di gestione preferenze utente
- **Cookie_Consent**: Sistema di consenso cookie GDPR-compliant
- **Progressive_Auth**: Suggerimento graduale di registrazione
- **Session_Persistence**: Persistenza sessione senza localStorage
- **IndexedDB_Storage**: Database locale per dati temporanei

## Requirements

### Requirement 1: Sistema di Autenticazione Completo

**User Story:** Come utente, voglio poter creare un account per salvare il mio progresso e le mie preferenze in modo permanente.

#### Acceptance Criteria

1. WHEN un utente clicca "Accedi", THE System SHALL mostrare modal con opzioni Login/Registrazione
2. WHEN un utente si registra, THE System SHALL richiedere solo email e password
3. WHEN un utente fa login, THE System SHALL recuperare progresso e preferenze salvate
4. WHEN un utente dimentica la password, THE System SHALL fornire reset via email
5. THE System SHALL supportare autenticazione via Google (opzionale)
6. THE System SHALL implementare email verification per nuovi account

### Requirement 2: Modalità Ospite con Persistenza Locale

**User Story:** Come utente, voglio utilizzare Tradelia senza registrarmi, mantenendo comunque il mio progresso durante la sessione.

#### Acceptance Criteria

1. WHEN un utente usa Tradelia senza account, THE System SHALL salvare dati in IndexedDB
2. WHEN un utente chiude e riapre il browser, THE System SHALL recuperare i dati temporanei
3. WHEN i dati temporanei superano 30 giorni, THE System SHALL eliminarli automaticamente
4. THE System SHALL mostrare chiaramente che i dati sono temporanei
5. THE System SHALL offrire migrazione a account permanente

### Requirement 3: Progressive Authentication Popup

**User Story:** Come sistema, voglio suggerire la registrazione in momenti appropriati senza essere invasivo.

#### Acceptance Criteria

1. WHEN un utente completa il Start Flow, THE System SHALL mostrare popup suggerimento registrazione
2. WHEN un utente usa 3+ sezioni diverse, THE System SHALL suggerire account per sincronizzazione
3. WHEN un utente ha dati da 7+ giorni, THE System SHALL suggerire salvataggio permanente
4. THE System SHALL permettere di rimandare o disabilitare i suggerimenti
5. THE System SHALL usare linguaggio educativo, non commerciale

### Requirement 4: Cookie Consent e Preferenze Privacy

**User Story:** Come utente, voglio controllare quali cookie e dati vengono salvati, in conformità GDPR.

#### Acceptance Criteria

1. WHEN un utente visita per la prima volta, THE System SHALL mostrare banner cookie discreto
2. WHEN un utente clicca "Gestisci Preferenze", THE System SHALL mostrare pannello dettagliato
3. THE System SHALL categorizzare cookie: Essenziali, Funzionali, Analitici
4. THE System SHALL permettere opt-out granulare per categorie non essenziali
5. THE System SHALL salvare preferenze senza cookie se rifiutati

### Requirement 5: Sistema di Preferenze Utente

**User Story:** Come utente, voglio personalizzare la mia esperienza educativa secondo le mie preferenze.

#### Acceptance Criteria

1. WHEN un utente accede alle preferenze, THE System SHALL mostrare categorie: UI, Notifiche, Privacy, Dati
2. WHEN un utente modifica preferenze UI, THE System SHALL applicarle immediatamente
3. THE System SHALL permettere export/import delle preferenze
4. THE System SHALL sincronizzare preferenze tra dispositivi per utenti registrati
5. THE System SHALL mantenere preferenze locali per utenti ospiti

### Requirement 6: Migrazione Dati Guest → Account

**User Story:** Come utente ospite, voglio poter salvare permanentemente il mio progresso creando un account.

#### Acceptance Criteria

1. WHEN un utente ospite crea account, THE System SHALL migrare tutti i dati locali
2. WHEN la migrazione è completa, THE System SHALL eliminare dati locali temporanei
3. THE System SHALL mostrare conferma di migrazione riuscita
4. WHEN la migrazione fallisce, THE System SHALL mantenere dati locali intatti
5. THE System SHALL permettere migrazione manuale via export/import

### Requirement 7: Gestione Sessioni e Sicurezza

**User Story:** Come sistema, voglio gestire le sessioni utente in modo sicuro e user-friendly.

#### Acceptance Criteria

1. THE System SHALL implementare refresh token automatico
2. THE System SHALL gestire logout automatico dopo inattività (opzionale)
3. THE System SHALL mostrare dispositivi attivi e permettere logout remoto
4. THE System SHALL implementare rate limiting per login attempts
5. THE System SHALL loggare eventi di sicurezza senza dati sensibili

### Requirement 8: UI/UX Non Invasiva

**User Story:** Come utente, voglio che il sistema di autenticazione sia discreto e non interferisca con l'esperienza educativa.

#### Acceptance Criteria

1. THE System SHALL usare modals invece di redirect per auth
2. THE System SHALL mantenere contesto della pagina durante auth
3. THE System SHALL usare animazioni smooth e non aggressive
4. THE System SHALL mostrare benefici educativi, non commerciali
5. THE System SHALL permettere dismissal permanente dei suggerimenti

### Requirement 9: Compliance e Trasparenza

**User Story:** Come utente, voglio capire chiaramente come vengono usati i miei dati.

#### Acceptance Criteria

1. THE System SHALL fornire privacy policy chiara e accessibile
2. THE System SHALL spiegare ogni tipo di dato raccolto e perché
3. THE System SHALL permettere download di tutti i dati utente
4. THE System SHALL implementare right to be forgotten (GDPR)
5. THE System SHALL mostrare data retention policies chiaramente

### Requirement 10: Fallback e Resilienza

**User Story:** Come sistema, voglio funzionare correttamente anche quando i servizi di auth sono non disponibili.

#### Acceptance Criteria

1. WHEN Supabase auth è down, THE System SHALL continuare in modalità ospite
2. WHEN IndexedDB non è supportato, THE System SHALL usare fallback in-memory
3. THE System SHALL mostrare status dei servizi quando rilevanti
4. THE System SHALL implementare retry automatico per operazioni fallite
5. THE System SHALL mantenere UX fluida durante problemi temporanei

## Struttura Tecnica Proposta

### Database Schema Aggiornato (Supabase)

```sql
-- Estendere user_profiles esistente
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS
  email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_via TEXT DEFAULT 'email',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_retention_days INTEGER DEFAULT 365;

-- Tabella per gestione sessioni
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabella per audit log (privacy-compliant)
CREATE TABLE auth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per cookie preferences
CREATE TABLE cookie_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT, -- Per utenti non registrati
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  essential BOOLEAN DEFAULT TRUE,
  functional BOOLEAN DEFAULT FALSE,
  analytics BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Component Architecture

```
components/auth/
├── AuthModal.tsx              # Modal principale login/register
├── LoginForm.tsx              # Form di login
├── RegisterForm.tsx           # Form di registrazione
├── ForgotPasswordForm.tsx     # Form reset password
├── AuthProvider.tsx           # Context provider per auth state
├── ProtectedRoute.tsx         # Wrapper per route protette
└── AuthButton.tsx             # Bottone accedi/profilo

components/preferences/
├── PreferencesModal.tsx       # Modal gestione preferenze
├── CookieConsentBanner.tsx    # Banner consenso cookie
├── CookiePreferences.tsx      # Pannello dettagliato cookie
├── UserPreferences.tsx        # Preferenze utente generali
├── DataExportImport.tsx       # Export/import dati
└── PreferencesProvider.tsx    # Context provider preferenze

components/progressive-auth/
├── AuthSuggestionPopup.tsx    # Popup suggerimento registrazione
├── GuestDataWarning.tsx       # Avviso dati temporanei
├── MigrationPrompt.tsx        # Prompt migrazione dati
└── AuthTriggers.tsx           # Logic per trigger suggerimenti

lib/auth/
├── supabase-auth.ts           # Wrapper Supabase auth
├── guest-storage.ts           # Gestione IndexedDB per ospiti
├── auth-utils.ts              # Utility funzioni auth
├── session-manager.ts         # Gestione sessioni
└── data-migration.ts          # Migrazione guest → account

lib/storage/
├── indexed-db.ts              # Wrapper IndexedDB
├── storage-manager.ts         # Manager unificato storage
├── data-sync.ts               # Sincronizzazione dati
└── cleanup-service.ts         # Pulizia dati scaduti
```

### Routing Structure Aggiornato

```
/auth
├── /login                     # Redirect a modal (SEO)
├── /register                  # Redirect a modal (SEO)
├── /forgot-password           # Redirect a modal (SEO)
├── /verify-email              # Pagina verifica email
└── /reset-password            # Pagina reset password

/account
├── /profile                   # Profilo utente
├── /preferences               # Preferenze dettagliate
├── /data                      # Export/import dati
├── /sessions                  # Gestione sessioni attive
└── /delete                    # Eliminazione account
```

## Flussi di Interazione

### Flusso Nuovo Utente
1. Visita sito → Cookie banner discreto
2. Usa dashboard → Dati salvati in IndexedDB
3. Completa Start Flow → Popup suggerimento account (dismissible)
4. Continua come ospite O crea account
5. Se crea account → Migrazione automatica dati

### Flusso Utente Registrato
1. Login → Recupero preferenze e progresso
2. Sincronizzazione cross-device
3. Gestione preferenze avanzate
4. Export dati quando richiesto

### Flusso Cookie Consent
1. Banner discreto in basso
2. "Accetta tutti" O "Gestisci preferenze"
3. Pannello granulare per categorie
4. Salvataggio preferenze (anche senza cookie se rifiutati)

## Principi di Design

### Non Invasività
- Modal invece di redirect
- Suggerimenti educativi, non commerciali
- Dismissal permanente disponibile
- Funzionalità completa senza account

### Trasparenza
- Spiegazione chiara di ogni dato raccolto
- Privacy policy accessibile
- Controllo granulare su cookie e dati
- Audit trail per utente

### Resilienza
- Fallback graceful quando servizi down
- Dati locali come backup
- Retry automatico per operazioni critiche
- UX fluida durante problemi

### Compliance
- GDPR compliant by design
- Right to be forgotten
- Data portability
- Consent management

Questa spec fornisce la base completa per implementare un sistema di autenticazione moderno, user-friendly e compliant che rispetta i principi educativi di Tradelia.