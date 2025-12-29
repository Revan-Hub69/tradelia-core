# Dashboard Completa - Implementazione Definitiva

## Introduzione

Implementazione completa della dashboard Tradelia basata sulla struttura semantica definitiva fornita da ChatGPT. La dashboard segue il principio fondamentale: **"Tradelia non dice cosa fare. Dice cosa stai guardando."**

## Glossary

- **Dashboard**: Area privata dell'utente per navigazione educativa
- **Start_Flow**: Percorso di orientamento iniziale (3 step)
- **Microlearning**: Sezione con brevi lezioni educative
- **Misuratori_Contesto**: Indicatori per orientamento (ex "indicatori")
- **Libreria_Truffe**: Raccolta educativa di schemi ricorrenti
- **Check_Piattaforme**: Checklist per valutazione piattaforme
- **Supabase_Integration**: Database per persistenza dati utente
- **User_Session**: Sessione utente per tracking progresso

## Requirements

### Requirement 1: Dashboard Start Flow (Orientamento)

**User Story:** Come utente nuovo, voglio un percorso di orientamento che mi aiuti a capire da dove iniziare, senza dover prendere decisioni immediate.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/start`, THE System SHALL mostrare la pagina "Prima di iniziare"
2. WHEN un utente completa lo Step 1 (stato mentale), THE System SHALL salvare la risposta e mostrare lo Step 2
3. WHEN un utente completa lo Step 2 (bisogno cognitivo), THE System SHALL salvare la risposta e mostrare lo Step 3
4. WHEN un utente completa tutti gli step, THE System SHALL suggerire il percorso più appropriato
5. THE System SHALL permettere di modificare le risposte precedenti
6. THE System SHALL persistere il progresso in Supabase per sessioni future

### Requirement 2: Sezione Microlearning

**User Story:** Come utente, voglio accedere a brevi lezioni educative per capire concetti crypto senza promesse o segnali operativi.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/microlearning`, THE System SHALL mostrare l'elenco delle lezioni disponibili
2. WHEN un utente seleziona una lezione, THE System SHALL mostrare la struttura: Concetto → Esempio Reale → Errore Comune → Regola di Sicurezza
3. THE System SHALL tracciare il progresso delle lezioni completate
4. THE System SHALL mostrare copy di sicurezza: "Serve a capire, non a decidere"
5. THE System SHALL permettere navigazione tra lezioni senza perdere progresso

### Requirement 3: Misuratori di Contesto (ex Indicatori)

**User Story:** Come utente, voglio accedere a strumenti per orientarmi nel contesto di mercato, senza ricevere segnali operativi.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/misuratori`, THE System SHALL mostrare il disclaimer: "Nessun misuratore indica cosa comprare o vendere"
2. WHEN un utente seleziona un misuratore, THE System SHALL mostrare: Cosa misura, Cosa NON dice, Errore comune di lettura
3. THE System SHALL integrare Fear & Greed Index con analisi AI educativa
4. THE System SHALL mostrare dati in tempo reale da API esterne
5. THE System SHALL mantenere il focus educativo senza suggerimenti operativi

### Requirement 4: Libreria Truffe

**User Story:** Come utente, voglio una raccolta educativa di schemi ricorrenti per riconoscere truffe prima di cadere.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/truffe`, THE System SHALL mostrare la raccolta di schemi ricorrenti
2. WHEN un utente seleziona uno schema, THE System SHALL mostrare: Schema ricorrente, Perché funziona, Segnale d'allarme, Come evitarlo
3. THE System SHALL includere disclaimer: "Gli esempi servono a riconoscere pattern, non a creare allarmismo"
4. THE System SHALL permettere ricerca per tipo di truffa o parole chiave
5. THE System SHALL aggiornare contenuti basandosi su nuovi pattern identificati

### Requirement 5: Check Piattaforme

**User Story:** Come utente, voglio una checklist educativa per valutare piattaforme crypto prima di utilizzarle.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/check-piattaforme`, THE System SHALL mostrare disclaimer: "Non è una classifica. Non è una raccomandazione"
2. WHEN un utente utilizza la checklist, THE System SHALL mostrare: Domande da porsi, Cosa controllare, Errore comune, Perché è rilevante
3. THE System SHALL permettere di salvare valutazioni per riferimento futuro
4. THE System SHALL fornire template di valutazione scaricabile
5. THE System SHALL mantenere neutralità senza raccomandazioni specifiche

### Requirement 6: Integrazione Supabase

**User Story:** Come sistema, voglio persistere i dati utente e il progresso in modo sicuro e scalabile.

#### Acceptance Criteria

1. WHEN un utente completa azioni nella dashboard, THE System SHALL salvare il progresso in Supabase
2. WHEN un utente ritorna, THE System SHALL recuperare il progresso precedente
3. THE System SHALL implementare Row Level Security (RLS) per privacy utente
4. THE System SHALL gestire sessioni utente senza autenticazione complessa inizialmente
5. THE System SHALL preparare struttura per futura autenticazione completa

### Requirement 7: Header e Navigazione Dashboard

**User Story:** Come utente, voglio navigare facilmente tra le sezioni dashboard mantenendo il contesto.

#### Acceptance Criteria

1. WHEN un utente è nella dashboard, THE System SHALL mostrare header specifico dashboard
2. THE System SHALL evidenziare la sezione corrente nella navigazione
3. THE System SHALL mostrare progresso complessivo quando applicabile
4. THE System SHALL permettere accesso rapido alle sezioni principali
5. THE System SHALL mantenere coerenza visiva con il design system esistente

### Requirement 8: Design System e Best Practices

**User Story:** Come sviluppatore, voglio utilizzare componenti consistenti e best practices per la dashboard.

#### Acceptance Criteria

1. THE System SHALL utilizzare il design system unificato esistente
2. THE System SHALL implementare componenti riutilizzabili per ogni sezione
3. THE System SHALL seguire principi di accessibilità (ARIA, semantic HTML)
4. THE System SHALL essere completamente responsive (mobile-first)
5. THE System SHALL implementare loading states e error handling appropriati

### Requirement 9: Metodo & Fonti

**User Story:** Come utente, voglio capire come funziona Tradelia e quali sono le sue fonti.

#### Acceptance Criteria

1. WHEN un utente accede a `/dashboard/metodo`, THE System SHALL spiegare il metodo Tradelia
2. THE System SHALL mostrare chiaramente: "Tradelia è educativo", "Non fornisce consulenza", "Non suggerisce operazioni"
3. THE System SHALL elencare tutte le fonti utilizzate con link e credibilità
4. THE System SHALL spiegare la metodologia di analisi e interpretazione
5. THE System SHALL mantenere trasparenza completa su limitazioni e scope

### Requirement 10: Persistenza e Performance

**User Story:** Come sistema, voglio garantire performance ottimali e persistenza affidabile dei dati.

#### Acceptance Criteria

1. THE System SHALL implementare caching appropriato per dati statici
2. THE System SHALL utilizzare loading incrementale per contenuti pesanti
3. THE System SHALL implementare offline-first approach dove possibile
4. THE System SHALL ottimizzare query Supabase per performance
5. THE System SHALL implementare error recovery e retry logic

## Struttura Tecnica Proposta

### Database Schema (Supabase)

```sql
-- Tabella per tracking progresso utente
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  section TEXT NOT NULL,
  step TEXT,
  data JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per start flow responses
CREATE TABLE start_flow_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  mental_state TEXT,
  cognitive_need TEXT,
  suggested_path TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per microlearning progress
CREATE TABLE microlearning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Routing Structure

```
/dashboard
├── /start (Orientamento - 3 step flow)
├── /microlearning (Brevi lezioni educative)
├── /misuratori (Indicatori di contesto)
├── /truffe (Libreria schemi ricorrenti)
├── /check-piattaforme (Checklist valutazione)
└── /metodo (Trasparenza e fonti)
```

### Component Architecture

```
components/dashboard/
├── layout/
│   ├── DashboardHeader.tsx
│   ├── DashboardSidebar.tsx
│   └── DashboardLayout.tsx
├── start/
│   ├── StartFlow.tsx
│   ├── StepOne.tsx
│   ├── StepTwo.tsx
│   └── StepThree.tsx
├── microlearning/
│   ├── LessonList.tsx
│   ├── LessonCard.tsx
│   └── LessonContent.tsx
├── misuratori/
│   ├── MisuratoriList.tsx
│   ├── MisuratoreCard.tsx
│   └── MisuratoreDetail.tsx
├── truffe/
│   ├── TruffeLibrary.tsx
│   ├── SchemaCard.tsx
│   └── SchemaDetail.tsx
├── check-piattaforme/
│   ├── ChecklistForm.tsx
│   ├── ChecklistItem.tsx
│   └── ChecklistResults.tsx
└── shared/
    ├── ProgressTracker.tsx
    ├── SafetyDisclaimer.tsx
    └── NavigationBreadcrumb.tsx
```

## Note di Implementazione

### Priorità di Sviluppo

1. **Fase 1**: Start Flow + Database setup
2. **Fase 2**: Microlearning + Misuratori (integrazione esistente)
3. **Fase 3**: Libreria Truffe + Check Piattaforme
4. **Fase 4**: Metodo & Fonti + Ottimizzazioni

### Principi di Design

- **Mobile-first**: Ogni componente deve funzionare perfettamente su mobile
- **Accessibilità**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Lazy loading, code splitting, ottimizzazione immagini
- **Sicurezza**: RLS Supabase, sanitizzazione input, CSP compliance

### Integrazione con Esistente

- Riutilizzare componenti Fear & Greed esistenti in sezione Misuratori
- Mantenere design system unificato
- Integrare con AI Tradelia per contenuti educativi
- Preservare tutte le ottimizzazioni performance esistenti

Questa spec fornisce la base completa per implementare la dashboard definitiva seguendo la struttura semantica di ChatGPT.