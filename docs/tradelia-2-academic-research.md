# Tradelia 2.0 - Ricerca Accademica Approfondita

> Documento di ricerca accademica completo - 14 Gennaio 2026
> Come costruire una piattaforma web educativa gamificata: approccio scientifico fase per fase

---

## Executive Summary

Questo documento fornisce una guida accademica completa per costruire Tradelia 2.0, basata su:
- **Customer Development** (Steve Blank) per la validazione
- **Lean Startup** (Eric Ries) per l'iterazione rapida
- **User-Centered Design** (ISO 9241-210) per il design
- **SDLC Best Practices** per lo sviluppo
- **APAR Framework** per la gamification

---

## FASE 0: PRE-SVILUPPO - Definizione del Problema e Validazione Idea

### 0.1 Problem Definition (Design Thinking)

**Cos'è un Problem Statement?**
Un problem statement è una descrizione chiara dell'issue da risolvere. Identifica il gap tra lo stato attuale e l'obiettivo desiderato.

**Framework per definire il problema:**

```
[UTENTE TARGET] ha bisogno di [BISOGNO/OBIETTIVO]
perché [INSIGHT/MOTIVAZIONE]
ma attualmente [BARRIERA/PROBLEMA]
```

**Esempio Tradelia:**
```
Persone normali interessate alle crypto hanno bisogno di
capire le basi delle criptovalute in modo semplice
perché vogliono partecipare all'economia digitale senza rischiare
ma attualmente le risorse sono troppo tecniche, frammentate o noiose
```

### 0.2 Empathy Mapping (Nielsen Norman Group)

**Cos'è un Empathy Map?**
Una visualizzazione collaborativa che articola cosa sappiamo di un tipo specifico di utente. Esternalizza la conoscenza per creare comprensione condivisa.

**I 4 Quadranti dell'Empathy Map:**

```
┌─────────────────────────────────────────────────────────┐
│                    SAYS (Dice)                          │
│  "Le crypto sono troppo complicate"                     │
│  "Non so da dove iniziare"                              │
│  "Ho paura di perdere soldi"                            │
├─────────────────────────────────────────────────────────┤
│                    THINKS (Pensa)                       │
│  "Tutti ne parlano, dovrei capirci qualcosa"            │
│  "È troppo tardi per entrare?"                          │
│  "Non voglio sembrare ignorante"                        │
├─────────────────────────────────────────────────────────┤
│                    DOES (Fa)                            │
│  Guarda video YouTube casuali                           │
│  Chiede ad amici "esperti"                              │
│  Rimanda l'apprendimento                                │
├─────────────────────────────────────────────────────────┤
│                    FEELS (Sente)                        │
│  FOMO (Fear of Missing Out)                             │
│  Confusione e overwhelm                                 │
│  Frustrazione per la complessità                        │
└─────────────────────────────────────────────────────────┘
```

**Pain Points identificati:**
1. Overload informativo
2. Linguaggio troppo tecnico
3. Mancanza di percorso strutturato
4. Paura di fare errori irreversibili

**Gains desiderati:**
1. Capire le basi in poco tempo
2. Sentirsi sicuri nelle decisioni
3. Progressione chiara e misurabile
4. Apprendimento senza stress

### 0.3 Customer Discovery (Steve Blank)

**Il Metodo Customer Development:**

Steve Blank ha creato il metodo Customer Development basato su un principio fondamentale: "Non ci sono fatti dentro il tuo edificio, quindi esci a testarli."

**I 4 Step del Customer Development:**

```
┌──────────────────┐    ┌──────────────────┐
│    CUSTOMER      │    │    CUSTOMER      │
│    DISCOVERY     │───▶│    VALIDATION    │
│  (Trova il fit)  │    │ (Testa il model) │
└──────────────────┘    └──────────────────┘
         │                       │
         │    PIVOT se serve     │
         │◀──────────────────────│
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│    CUSTOMER      │    │    COMPANY       │
│    CREATION      │───▶│    BUILDING      │
│   (Scala)        │    │   (Esegui)       │
└──────────────────┘    └──────────────────┘
```

**Step 1: Customer Discovery**
- Trasforma la visione in ipotesi di business model
- Sviluppa un piano per testare le reazioni dei clienti
- Esci dall'edificio e parla con potenziali utenti

**Domande da fare nelle interviste:**
1. "Come impari attualmente sulle crypto?"
2. "Qual è la cosa più frustrante di questo processo?"
3. "Quanto tempo dedichi all'apprendimento?"
4. "Cosa ti farebbe continuare a imparare ogni giorno?"
5. "Hai mai abbandonato un corso? Perché?"

**Output atteso:**
- 10-20 interviste con target users
- Pattern comuni identificati
- Ipotesi validate o invalidate
- Pivot points se necessario

### 0.4 Idea Validation Techniques

**Metodi di validazione pre-sviluppo:**

| Metodo | Effort | Tempo | Affidabilità |
|--------|--------|-------|--------------|
| Landing Page Test | Basso | 1-2 giorni | Media |
| Smoke Test (Fake Door) | Basso | 1 giorno | Media |
| Concierge MVP | Medio | 1-2 settimane | Alta |
| Wizard of Oz | Medio | 2-4 settimane | Alta |
| Crowdfunding | Alto | 4-8 settimane | Molto Alta |

**Landing Page Test:**
- Crea una landing page che descrive il prodotto
- Aggiungi CTA "Iscriviti per accesso anticipato"
- Misura: conversion rate, email raccolte
- Benchmark: >5% conversion = interesse validato

**Smoke Test (Fake Door):**
- Mostra una feature come se esistesse
- Traccia quanti utenti ci cliccano
- Misura l'interesse reale prima di costruire

**Concierge MVP:**
- Offri il servizio manualmente a pochi utenti
- Impara cosa vogliono veramente
- Automatizza solo dopo aver validato

---

## FASE 1: DISCOVERY & PLANNING - Requirements Elicitation

### 1.1 Requirements Elicitation (IEEE/ACM)

**Cos'è Requirements Elicitation?**
È il processo di ricerca, scoperta e acquisizione dei requisiti di un sistema da utenti, clienti e stakeholder. Non si "raccolgono" requisiti, si "elicitano" - perché non puoi ottenere tutti i requisiti semplicemente chiedendo.

**Tecniche di Elicitation (dalla letteratura accademica):**

| Tecnica | Quando usarla | Pro | Contro |
|---------|---------------|-----|--------|
| **Interviste** | Sempre | Profondità, flessibilità | Tempo, bias |
| **Questionari** | Molti utenti | Scalabilità | Superficialità |
| **Workshop** | Requisiti complessi | Collaborazione | Coordinamento |
| **Prototyping** | UI/UX requirements | Feedback visivo | Può limitare idee |
| **Observation** | Workflow esistenti | Realtà vs percezione | Intrusivo |
| **Document Analysis** | Domini regolamentati | Completezza | Outdated info |

**Paper Prototyping (Risultati empirici):**
Secondo ricerca ResearchGate, Paper Prototyping produce i migliori risultati per elicitare il maggior numero di requisiti possibile, anche se richiede più tempo per documentarli.

**Problemi comuni nell'elicitation (Christel & Kang, 1992):**
1. **Problems of Scope**: Confini del sistema mal definiti
2. **Problems of Understanding**: Utenti non sanno cosa vogliono
3. **Problems of Volatility**: Requisiti cambiano nel tempo

### 1.2 User Stories e Acceptance Criteria

**Formato User Story:**
```
As a [tipo di utente]
I want [obiettivo/desiderio]
So that [beneficio/valore]
```

**Acceptance Criteria (formato Given-When-Then):**
```
GIVEN [contesto iniziale]
WHEN [azione dell'utente]
THEN [risultato atteso]
```

**Esempio Tradelia:**
```
User Story:
As a crypto beginner
I want to complete short daily lessons
So that I can learn without feeling overwhelmed

Acceptance Criteria:
GIVEN I am on the home screen
WHEN I tap "Start Today's Lesson"
THEN I should see a lesson that takes less than 5 minutes
AND I should see my progress indicator
AND I should earn XP upon completion
```

### 1.3 MoSCoW Prioritization

**Framework per prioritizzare requisiti:**

| Categoria | Significato | % Budget |
|-----------|-------------|----------|
| **Must Have** | Senza questi, il prodotto non funziona | 60% |
| **Should Have** | Importanti ma non critici | 20% |
| **Could Have** | Nice to have se c'è tempo | 15% |
| **Won't Have** | Esclusi da questa release | 5% |

**MVP Tradelia - MoSCoW:**

**Must Have:**
- [ ] Auth (login/signup)
- [ ] Visualizzazione lezioni
- [ ] Quiz base
- [ ] Sistema XP
- [ ] Persistenza progresso

**Should Have:**
- [ ] Streak system
- [ ] Badge base
- [ ] Progress indicators

**Could Have:**
- [ ] Leaderboard
- [ ] Notifiche push
- [ ] Offline mode

**Won't Have (V1):**
- [ ] Social features
- [ ] Multiplayer
- [ ] Contenuti generati da utenti

---

## FASE 2: DESIGN - User-Centered Design Process

### 2.1 User-Centered Design (ISO 9241-210)

**Le 4 Fasi del UCD:**

```
┌─────────────────────────────────────────────────────────┐
│  1. SPECIFY CONTEXT OF USE                              │
│     - Chi sono gli utenti primari?                      │
│     - In che ambiente useranno il prodotto?             │
│     - Quali sono i loro obiettivi?                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  2. SPECIFY REQUIREMENTS                                │
│     - Requisiti tecnici dettagliati                     │
│     - Obiettivi di usabilità misurabili                 │
│     - Vincoli di design                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  3. CREATE DESIGN SOLUTIONS                             │
│     - Wireframes → Prototipi → Design finale            │
│     - Iterazione basata su feedback                     │
│     - Test con utenti reali                             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  4. EVALUATE AGAINST REQUIREMENTS                       │
│     - Usability testing                                 │
│     - Raccolta feedback                                 │
│     - Iterazione se necessario                          │
└─────────────────────────────────────────────────────────┘
```

**Principio chiave:** UCD è un processo iterativo dove le soluzioni di design vengono proposte e raffinate basandosi sul feedback degli utenti.

### 2.2 Wireframing (Nielsen Norman Group)

**Cos'è un Wireframe?**
Un wireframe è una rappresentazione a bassa fedeltà del layout e della funzionalità di un prodotto. Permette a designer e stakeholder di concentrarsi sugli elementi core senza la distrazione di dettagli estetici.

**Statistica chiave:** Secondo Nielsen Norman Group, l'85% dei problemi di usabilità può essere ricondotto a requisiti utente non compresi adeguatamente.

**Livelli di Fedeltà:**

| Livello | Dettaglio | Quando usare |
|---------|-----------|--------------|
| **Low-Fi** | Sketch su carta, box e linee | Brainstorming iniziale |
| **Mid-Fi** | Wireframe digitali, no colori | Validazione struttura |
| **High-Fi** | Prototipi interattivi | Test usabilità |

**Processo di Wireframing:**

1. **Sketch rapidi** (5-10 varianti per schermata)
2. **Selezione** delle migliori idee
3. **Digitalizzazione** in tool (Figma, Sketch)
4. **Review** con stakeholder
5. **Test** con utenti target
6. **Iterazione** basata su feedback

**Schermate chiave per Tradelia:**
1. Onboarding (2-3 schermate)
2. Home Screen
3. Path Selection
4. Lesson View
5. Quiz View
6. Results/XP Award
7. Profile/Progress

### 2.3 Atomic Design (Brad Frost)

**Cos'è Atomic Design?**
Una metodologia per creare design system che scompone le UI in componenti riutilizzabili, ispirata alla chimica.

**I 5 Livelli:**

```
ATOMS → MOLECULES → ORGANISMS → TEMPLATES → PAGES

Atoms:      Button, Input, Label, Icon
Molecules:  Search Bar (Input + Button + Icon)
Organisms:  Header (Logo + Nav + Search Bar + User Menu)
Templates:  Page Layout (Header + Content Area + Footer)
Pages:      Home Page (Template + Real Content)
```

**Vantaggi:**
- Consistenza visiva
- Riutilizzabilità
- Manutenibilità
- Scalabilità

**Design System Tradelia (Atoms):**

```typescript
// Colors
primary: '#4F46E5'    // Indigo - azioni principali
success: '#10B981'    // Green - successo, XP
warning: '#F59E0B'    // Amber - streak
error: '#EF4444'      // Red - errori
background: '#F9FAFB' // Gray-50

// Typography
heading: 'Inter, sans-serif'
body: 'Inter, sans-serif'
sizes: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem'
}

// Spacing (8px grid)
spacing: {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem'      // 32px
}

// Border Radius
rounded: {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  full: '9999px'
}
```

---

## FASE 3: DATABASE DESIGN - Schema e Normalizzazione

### 3.1 Database Normalization (Codd's Normal Forms)

**Cos'è la Normalizzazione?**
Un processo per organizzare i dati in un database relazionale per ridurre la ridondanza e migliorare l'integrità dei dati.

**Le Normal Forms:**

| Form | Regola | Problema che risolve |
|------|--------|---------------------|
| **1NF** | Valori atomici, no gruppi ripetuti | Dati duplicati in celle |
| **2NF** | 1NF + no dipendenze parziali | Ridondanza da chiavi composite |
| **3NF** | 2NF + no dipendenze transitive | Ridondanza da attributi non-chiave |
| **BCNF** | Ogni determinante è chiave candidata | Anomalie residue |

**Best Practice:**
> "Design to at least 3NF for correctness, index the most-used join keys, and only denormalize where measured latency proves it necessary."

**Quando Denormalizzare:**
- Query frequenti che richiedono molti JOIN
- Read-heavy workloads
- Caching di dati calcolati (es. total_xp)

### 3.2 Schema Design per Tradelia

**Entity-Relationship Diagram:**

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   PATHS     │       │   UNITS     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │◄──────│ id (PK)     │
│ email       │       │ name        │       │ path_id(FK) │
│ name        │       │ description │       │ name        │
│ total_xp    │       │ icon        │       │ order       │
│ level       │       │ order       │       │ is_locked   │
│ streak      │       │ is_locked   │       └─────────────┘
│ created_at  │       └─────────────┘              │
└─────────────┘                                    │
      │                                            ▼
      │                                    ┌─────────────┐
      │                                    │  LESSONS    │
      │                                    ├─────────────┤
      │                                    │ id (PK)     │
      │                                    │ unit_id(FK) │
      │                                    │ title       │
      │                                    │ content     │
      │                                    │ order       │
      │                                    │ xp_reward   │
      │                                    └─────────────┘
      │                                           │
      │         ┌─────────────────────────────────┘
      │         │
      ▼         ▼
┌─────────────────────┐       ┌─────────────┐
│   USER_PROGRESS     │       │  QUESTIONS  │
├─────────────────────┤       ├─────────────┤
│ id (PK)             │       │ id (PK)     │
│ user_id (FK)        │       │ lesson_id   │
│ lesson_id (FK)      │       │ type        │
│ completed_at        │       │ question    │
│ score               │       │ options     │
│ xp_earned           │       │ correct     │
└─────────────────────┘       │ explanation │
                              └─────────────┘
```

### 3.3 Supabase Schema SQL

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  daily_goal INTEGER DEFAULT 10, -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paths (learning tracks)
CREATE TABLE public.paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  estimated_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units (groups of lessons within a path)
CREATE TABLE public.units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path_id UUID REFERENCES public.paths(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- structured content
  order_index INTEGER NOT NULL,
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'true_false', 'fill_blank')),
  question_text TEXT NOT NULL,
  options JSONB, -- for multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  score INTEGER, -- 0-100
  xp_earned INTEGER,
  UNIQUE(user_id, lesson_id)
);

-- Achievements
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Indexes for performance
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON public.user_progress(lesson_id);
CREATE INDEX idx_lessons_unit ON public.lessons(unit_id);
CREATE INDEX idx_units_path ON public.units(path_id);
CREATE INDEX idx_questions_lesson ON public.questions(lesson_id);
```

### 3.4 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User Progress: users can only access their own progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read for content tables
CREATE POLICY "Anyone can read paths"
  ON public.paths FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read units"
  ON public.units FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read lessons"
  ON public.lessons FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT TO authenticated
  USING (true);
```

---

## FASE 4: DEVELOPMENT - Metodologie Agile

### 4.1 Agile Software Development (Manifesto Agile)

**I 4 Valori del Manifesto Agile:**

1. **Individui e interazioni** > processi e strumenti
2. **Software funzionante** > documentazione esaustiva
3. **Collaborazione col cliente** > negoziazione contrattuale
4. **Rispondere al cambiamento** > seguire un piano

**Principi chiave per Tradelia:**
- Rilasci frequenti (ogni 1-2 settimane)
- Feedback continuo dagli utenti
- Semplicità: massimizzare il lavoro non fatto
- Team auto-organizzato

### 4.2 Scrum Framework

**Cos'è Scrum?**
Un framework agile per la collaborazione di team che prescrive di dividere il lavoro in obiettivi da completare in iterazioni time-boxed chiamate Sprint.

**Elementi Scrum:**

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCT BACKLOG                      │
│  (Lista prioritizzata di tutto il lavoro da fare)       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SPRINT PLANNING                       │
│  - Seleziona items dal backlog                          │
│  - Definisce Sprint Goal                                │
│  - Crea Sprint Backlog                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      SPRINT                             │
│  (1-4 settimane, tipicamente 2)                         │
│                                                         │
│  Daily Standup (15 min):                                │
│  - Cosa ho fatto ieri?                                  │
│  - Cosa farò oggi?                                      │
│  - Ci sono blocchi?                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SPRINT REVIEW                         │
│  - Demo del lavoro completato                           │
│  - Feedback dagli stakeholder                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 SPRINT RETROSPECTIVE                    │
│  - Cosa è andato bene?                                  │
│  - Cosa può migliorare?                                 │
│  - Azioni per il prossimo sprint                        │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Sprint Planning per Tradelia MVP

**Sprint 1: Foundation (2 settimane)**
- [ ] Setup progetto Next.js
- [ ] Configurazione Supabase
- [ ] Schema database
- [ ] Auth base (login/signup)
- [ ] Layout base

**Sprint 2: Core Learning (2 settimane)**
- [ ] Home screen
- [ ] Path selection
- [ ] Lesson viewer
- [ ] Navigazione lezioni

**Sprint 3: Quiz System (2 settimane)**
- [ ] Quiz component
- [ ] Multiple choice
- [ ] True/false
- [ ] Feedback immediato
- [ ] Score calculation

**Sprint 4: Gamification (2 settimane)**
- [ ] Sistema XP
- [ ] Level progression
- [ ] Streak tracking
- [ ] Badge base

**Sprint 5: Polish & Launch (2 settimane)**
- [ ] Onboarding flow
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Deploy production

### 4.4 Definition of Done (DoD)

**Una feature è "Done" quando:**
- [ ] Codice scritto e funzionante
- [ ] Unit tests passano (coverage >70%)
- [ ] Code review completata
- [ ] Nessun errore TypeScript
- [ ] Responsive (mobile + desktop)
- [ ] Accessibilità base (WCAG 2.1 AA)
- [ ] Documentazione aggiornata
- [ ] Deployato in staging
- [ ] Testato manualmente

### 4.5 Development Best Practices

**Code Organization (Feature-based):**
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── lessons/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── quiz/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── gamification/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── app/ (Next.js routes)
```

**Naming Conventions:**
- Components: PascalCase (`LessonCard.tsx`)
- Hooks: camelCase con prefix `use` (`useLessons.ts`)
- Utils: camelCase (`formatXp.ts`)
- Types: PascalCase (`Lesson`, `User`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_STREAK_DAYS`)

---

## FASE 5: TESTING - Strategie e Tecniche

### 5.1 Testing Pyramid

**La Piramide dei Test:**

```
                    ┌───────────┐
                    │   E2E     │  ← Pochi, lenti, costosi
                    │  Tests    │
                    ├───────────┤
                    │Integration│  ← Alcuni, velocità media
                    │  Tests    │
                    ├───────────┤
                    │   Unit    │  ← Molti, veloci, economici
                    │   Tests   │
                    └───────────┘
```

**Distribuzione consigliata:**
- Unit Tests: 70%
- Integration Tests: 20%
- E2E Tests: 10%

### 5.2 Unit Testing

**Cos'è Unit Testing?**
Test di componenti o moduli isolati del software per validare il comportamento atteso.

**Caratteristiche:**
- Testano una singola "unità" di codice
- Nessuna dipendenza esterna (mock everything)
- Veloci da eseguire
- Facili da scrivere e mantenere

**Esempio con Vitest:**

```typescript
// formatXp.ts
export function formatXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}

// formatXp.test.ts
import { describe, it, expect } from 'vitest';
import { formatXp } from './formatXp';

describe('formatXp', () => {
  it('should return number as string for values under 1000', () => {
    expect(formatXp(500)).toBe('500');
    expect(formatXp(0)).toBe('0');
    expect(formatXp(999)).toBe('999');
  });

  it('should format values >= 1000 with k suffix', () => {
    expect(formatXp(1000)).toBe('1.0k');
    expect(formatXp(1500)).toBe('1.5k');
    expect(formatXp(10000)).toBe('10.0k');
  });
});
```

### 5.3 Integration Testing

**Cos'è Integration Testing?**
Test che verificano come diverse parti del sistema interagiscono tra loro.

**Focus:**
- Interazioni tra moduli
- API endpoints
- Database operations
- Flussi utente completi

**Esempio - Test API Route:**

```typescript
// api/lessons/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('GET /api/lessons', () => {
  it('should return lessons for authenticated user', async () => {
    const response = await fetch('/api/lessons', {
      headers: {
        Authorization: `Bearer ${testToken}`
      }
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.lessons)).toBe(true);
  });

  it('should return 401 for unauthenticated request', async () => {
    const response = await fetch('/api/lessons');
    expect(response.status).toBe(401);
  });
});
```

### 5.4 User Acceptance Testing (UAT)

**Cos'è UAT?**
Test finale nel ciclo QA, condotto prima del rilascio per valutare se il prodotto può gestire scenari reali.

**Processo UAT:**

1. **Definire scenari di test** basati su user stories
2. **Reclutare tester** dal target audience
3. **Preparare ambiente** di test (staging)
4. **Eseguire test** con osservazione
5. **Raccogliere feedback** qualitativo
6. **Documentare bug** e miglioramenti
7. **Iterare** fino all'approvazione

**Checklist UAT Tradelia:**

| Scenario | Criteri di Successo | Pass/Fail |
|----------|---------------------|-----------|
| Signup nuovo utente | < 60 secondi, no errori | |
| Completare prima lezione | Contenuto chiaro, XP assegnati | |
| Rispondere quiz | Feedback immediato, score corretto | |
| Visualizzare streak | Aggiornamento real-time | |
| Sbloccare badge | Notifica visibile, badge in profilo | |

### 5.5 Test Coverage Goals

**Metriche target:**

| Tipo | Coverage Target | Priorità |
|------|-----------------|----------|
| Unit Tests | >70% | Alta |
| Integration Tests | >50% | Media |
| E2E Tests | Critical paths | Alta |

**Critical Paths da testare E2E:**
1. Signup → First Lesson → Quiz → XP Award
2. Login → Continue Learning → Complete Unit
3. Daily Return → Streak Update → Badge Unlock

---

## FASE 6: DEPLOYMENT - CI/CD Pipeline

### 6.1 Continuous Integration (CI)

**Cos'è CI?**
Una pratica DevOps fondamentale che prevede l'integrazione regolare delle modifiche al codice in un repository condiviso, attivando build e test automatici.

**Benefici:**
- Rilevamento precoce dei bug
- Riduzione dei conflitti di merge
- Feedback rapido agli sviluppatori
- Qualità del codice consistente

**Pipeline CI per Tradelia:**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### 6.2 Continuous Deployment (CD)

**Cos'è CD?**
Pratica che automatizza il rilascio e il deployment del codice validato in ambienti di produzione.

**Pipeline CD:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Push   │───▶│  Build  │───▶│  Test   │───▶│ Deploy  │
│  Code   │    │         │    │         │    │ Staging │
└─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                  │
                                                  ▼
                                            ┌─────────┐
                                            │ Manual  │
                                            │ Approve │
                                            └────┬────┘
                                                  │
                                                  ▼
                                            ┌─────────┐
                                            │ Deploy  │
                                            │  Prod   │
                                            └─────────┘
```

### 6.3 Deployment Strategy

**Vercel Deployment (Raccomandato per Next.js):**

```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Environment Strategy:**

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | feature/* | localhost:3000 | Dev locale |
| Preview | PR branches | *.vercel.app | Review PR |
| Staging | develop | staging.tradelia.app | QA testing |
| Production | main | tradelia.app | Users |

### 6.4 Database Migrations

**Supabase Migrations:**

```bash
# Creare nuova migration
supabase migration new add_user_preferences

# Applicare migrations
supabase db push

# Reset database (dev only)
supabase db reset
```

**Migration Example:**

```sql
-- supabase/migrations/20260114_add_user_preferences.sql

-- Add preferences column to profiles
ALTER TABLE public.profiles
ADD COLUMN preferences JSONB DEFAULT '{}';

-- Add index for common queries
CREATE INDEX idx_profiles_preferences 
ON public.profiles USING GIN (preferences);
```

### 6.5 Monitoring & Observability

**Strumenti consigliati:**

| Categoria | Tool | Purpose |
|-----------|------|---------|
| Error Tracking | Sentry | Cattura errori runtime |
| Analytics | Vercel Analytics | Performance, traffic |
| Uptime | Better Uptime | Monitoring disponibilità |
| Logs | Vercel Logs | Debug, troubleshooting |

**Sentry Setup:**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

## FASE 7: MEASURE & LEARN - Feedback Loop

### 7.1 Build-Measure-Learn Cycle (Lean Startup)

**Il Ciclo Fondamentale:**

```
         ┌─────────────────────────────────────┐
         │                                     │
         ▼                                     │
    ┌─────────┐                                │
    │  IDEAS  │                                │
    └────┬────┘                                │
         │                                     │
         ▼                                     │
    ┌─────────┐     Minimize                   │
    │  BUILD  │     Total Time                 │
    │  (MVP)  │     Through Loop               │
    └────┬────┘                                │
         │                                     │
         ▼                                     │
    ┌─────────┐                                │
    │ PRODUCT │                                │
    └────┬────┘                                │
         │                                     │
         ▼                                     │
    ┌─────────┐                                │
    │ MEASURE │                                │
    │ (Data)  │                                │
    └────┬────┘                                │
         │                                     │
         ▼                                     │
    ┌─────────┐                                │
    │  DATA   │                                │
    └────┬────┘                                │
         │                                     │
         ▼                                     │
    ┌─────────┐                                │
    │  LEARN  │                                │
    │(Insight)│                                │
    └────┬────┘                                │
         │                                     │
         └─────────────────────────────────────┘
```

**Obiettivo:** Minimizzare il tempo totale attraverso il loop.

### 7.2 Metriche da Tracciare

**Metriche di Acquisizione:**
| Metrica | Formula | Target |
|---------|---------|--------|
| Signup Rate | Signups / Visitors | >5% |
| Time to First Lesson | Tempo da signup a prima lezione | <60s |
| Onboarding Completion | Utenti che completano onboarding | >80% |

**Metriche di Engagement:**
| Metrica | Formula | Target |
|---------|---------|--------|
| DAU/MAU | Daily Active / Monthly Active | >20% |
| Session Duration | Tempo medio per sessione | >5 min |
| Lessons per Session | Lezioni completate per sessione | >2 |
| Quiz Accuracy | Risposte corrette / Totale | >70% |

**Metriche di Retention:**
| Metrica | Formula | Target |
|---------|---------|--------|
| D1 Retention | Utenti tornati giorno 1 | >40% |
| D7 Retention | Utenti tornati giorno 7 | >20% |
| D30 Retention | Utenti tornati giorno 30 | >10% |
| Avg Streak Length | Media giorni consecutivi | >5 |

**Metriche di Learning:**
| Metrica | Formula | Target |
|---------|---------|--------|
| Lesson Completion Rate | Lezioni completate / Iniziate | >85% |
| Path Completion Rate | Path completati / Iniziati | >30% |
| Knowledge Retention | Score quiz ripetuti | Miglioramento |

### 7.3 Metodi di Raccolta Feedback

**Feedback Quantitativo:**

| Metodo | Quando | Cosa misura |
|--------|--------|-------------|
| In-app Analytics | Sempre | Comportamento utente |
| NPS Survey | Dopo 7 giorni | Soddisfazione generale |
| Feature Polls | Pre-sviluppo | Priorità feature |
| A/B Tests | Continuous | Efficacia varianti |

**Feedback Qualitativo:**

| Metodo | Frequenza | Insight |
|--------|-----------|---------|
| User Interviews | Settimanale | Profondità, "perché" |
| Session Recordings | Continuous | UX issues |
| Support Tickets | Continuous | Pain points |
| App Store Reviews | Continuous | Sentiment pubblico |

### 7.4 In-App Feedback Collection

**Micro-surveys (1-2 domande):**

```typescript
// Dopo completamento lezione
const lessonFeedback = {
  trigger: 'lesson_complete',
  question: 'Questa lezione è stata utile?',
  options: ['👍 Sì', '👎 No'],
  followUp: 'Cosa potremmo migliorare?'
};

// Dopo 7 giorni di utilizzo
const npsSurvey = {
  trigger: 'day_7',
  question: 'Quanto consiglieresti Tradelia a un amico?',
  scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  followUp: {
    detractors: 'Cosa ti ha deluso?',
    passives: 'Cosa potremmo fare meglio?',
    promoters: 'Cosa ti piace di più?'
  }
};
```

### 7.5 Decision Framework

**Quando Perseverare, Pivotare o Fermarsi:**

```
┌─────────────────────────────────────────────────────────┐
│                    VALIDATE                             │
│  Ipotesi confermata dai dati?                           │
│                                                         │
│  SÌ → PERSEVERE (Scale up)                              │
│  NO → Analizza perché                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    PIVOT OPTIONS                        │
│                                                         │
│  • Zoom-in: Una feature diventa il prodotto             │
│  • Zoom-out: Il prodotto diventa una feature            │
│  • Customer Segment: Cambia target audience             │
│  • Customer Need: Stesso cliente, problema diverso      │
│  • Platform: Cambia piattaforma/tecnologia              │
│  • Business Model: Cambia come monetizzi                │
│  • Value Capture: Cambia pricing/revenue model          │
│  • Channel: Cambia come raggiungi i clienti             │
└─────────────────────────────────────────────────────────┘
```

**Segnali per Pivot:**
- Retention D7 < 10%
- NPS < 0
- Feedback consistentemente negativo
- Metriche piatte dopo 3+ iterazioni

---

## PARTE 2: GAMIFICATION FRAMEWORK (APAR)

### Framework APAR Completo

Basato su ricerca MDPI: "A Structural Design and Guidance Framework for Gamification in Education Based on Motivation Theories"

```
┌─────────────────────────────────────────────────────────┐
│                    APAR FRAMEWORK                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  A - ACTIVITIES (Cosa fa l'utente)                      │
│  ├── Stages (Unità didattiche)                          │
│  │   ├── Lezioni sequenziali                            │
│  │   ├── Quiz intermedi                                 │
│  │   └── Boss Battle (quiz finale)                      │
│  ├── Actions (Azioni tracciabili)                       │
│  │   ├── Completare lezione                             │
│  │   ├── Rispondere quiz                                │
│  │   └── Aiutare altri                                  │
│  └── States (Stati attività)                            │
│      ├── Not Started                                    │
│      ├── In Progress                                    │
│      ├── Completed                                      │
│      ├── Pass (≥60%)                                    │
│      └── Outstanding (top 25%)                          │
│                                                         │
│  P - POINTS (Feedback quantitativo)                     │
│  ├── Merit Points (MP) - Performance/voti               │
│  ├── Activity Points (AP) - Completamento/effort        │
│  ├── Karma Points (KP) - Collaborazione/aiuto           │
│  └── XP (Game Points) - Aggregazione per progressione   │
│                                                         │
│  A - ACHIEVEMENTS (Obiettivi intermedi)                 │
│  ├── Score Levels - Basati su XP totali                 │
│  └── Pathway Goals                                      │
│      ├── Completare stage                               │
│      ├── Passare quiz                                   │
│      └── Raggiungere Outstanding                        │
│                                                         │
│  R - REWARDS (Ricompense)                               │
│  ├── Status - Badge, Leaderboard position               │
│  ├── Access - Sblocco contenuti, risorse VIP            │
│  ├── Power - Ruoli speciali                             │
│  └── Stuff - Ricompense tangibili                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Risultati Empirici (Case Study Universitario)

| Metrica | Prima | Dopo Gamification | Δ |
|---------|-------|-------------------|---|
| Examination Rate | 58% | 72% | +14% |
| Success Rate | 30% | 56% | +26% |
| Performance Rate | 17% | 39% | +22% |
| Continuous Assessment | 48% | 87% | +39% |

### Implementazione per Tradelia

**Sistema XP:**
```typescript
const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 15,
  QUIZ_PERFECT: 25,      // 100% correct
  UNIT_COMPLETE: 50,
  PATH_COMPLETE: 200,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  FIRST_LESSON: 20,      // Bonus onboarding
};
```

**Sistema Livelli:**
```typescript
const LEVELS = [
  { level: 1, name: 'Crypto Curious', minXp: 0 },
  { level: 2, name: 'Blockchain Beginner', minXp: 100 },
  { level: 3, name: 'Token Trainee', minXp: 300 },
  { level: 4, name: 'Wallet Warrior', minXp: 600 },
  { level: 5, name: 'DeFi Discoverer', minXp: 1000 },
  { level: 6, name: 'Crypto Competent', minXp: 1500 },
  { level: 7, name: 'Blockchain Builder', minXp: 2500 },
  { level: 8, name: 'Token Tactician', minXp: 4000 },
  { level: 9, name: 'DeFi Developer', minXp: 6000 },
  { level: 10, name: 'Crypto Master', minXp: 10000 },
];
```

**Badge System:**
```typescript
const BADGES = [
  // Milestone badges
  { id: 'first_step', name: 'First Step', desc: 'Complete your first lesson', icon: '🎯' },
  { id: 'week_warrior', name: 'Week Warrior', desc: '7-day streak', icon: '🔥' },
  { id: 'month_master', name: 'Month Master', desc: '30-day streak', icon: '⚡' },
  
  // Path completion badges
  { id: 'crypto_basics', name: 'Crypto Graduate', desc: 'Complete Crypto Basics', icon: '🎓' },
  { id: 'wallet_pro', name: 'Wallet Pro', desc: 'Complete Wallet Security', icon: '🔐' },
  
  // XP milestones
  { id: 'xp_100', name: 'Century Club', desc: 'Earn 100 XP', icon: '💯' },
  { id: 'xp_1000', name: 'Thousand Strong', desc: 'Earn 1000 XP', icon: '🏆' },
  
  // Perfect scores
  { id: 'perfect_quiz', name: 'Perfect Score', desc: 'Get 100% on a quiz', icon: '⭐' },
  { id: 'perfect_unit', name: 'Flawless Unit', desc: 'Perfect all quizzes in a unit', icon: '💎' },
];
```

---

## PARTE 3: TEORIE DELLA MOTIVAZIONE

### Self-Determination Theory (SDT) - Ryan & Deci

**Le 3 necessità psicologiche innate:**

| Necessità | Definizione | Implementazione Tradelia |
|-----------|-------------|-------------------------|
| **Competence** | Bisogno di padronanza | XP, livelli, feedback immediato |
| **Relatedness** | Bisogno di connessione | Leaderboard, badge condivisibili |
| **Autonomy** | Bisogno di scelta | Scelta path, ordine lezioni |

### RAMP Model - Marczewski

| Motivatore | Tipo Utente | Implementazione |
|------------|-------------|-----------------|
| **Relatedness** | Socialiser | Future: forum, team challenges |
| **Autonomy** | Free Spirit | Scelta percorsi, skip opzionale |
| **Mastery** | Achiever | XP, livelli, badge competenza |
| **Purpose** | Philanthropist | Future: aiutare altri, karma |

### SAPS Model - Zichermann

**Gerarchia ricompense (dalla più alla meno valorizzata):**

1. **Status** - Posizione privilegiata, riconoscimento
2. **Access** - Accesso esclusivo a risorse/contenuti
3. **Power** - Capacità di influenzare
4. **Stuff** - Ricompense tangibili/materiali

### Goal-Setting Theory - Locke

**Obiettivi efficaci sono:**
- **Immediati** (non distanti)
- **Specifici** (non vaghi)
- **Moderatamente sfidanti** (non troppo facili né impossibili)

**Implementazione:**
- Micro-goals per ogni lezione
- Progress bar sempre visibile
- Celebrazione immediata al completamento

### Operant Conditioning - Skinner

**Rinforzi comportamentali:**
- **Rinforzo positivo**: XP, badge, celebrazioni
- **Rinforzo variabile**: Ricompense casuali (treasure chest)
- **Loss aversion**: Streak (paura di perdere)

---

## CHECKLIST OPERATIVA COMPLETA

### Fase 0: Pre-Sviluppo
- [ ] Problem statement definito
- [ ] Empathy map creata
- [ ] 10+ customer interviews completate
- [ ] Ipotesi core documentate
- [ ] Competitor analysis completata
- [ ] Landing page test (opzionale)

### Fase 1: Discovery & Planning
- [ ] User stories scritte
- [ ] Acceptance criteria definiti
- [ ] MoSCoW prioritization completata
- [ ] MVP scope definito
- [ ] Technology stack confermato
- [ ] Timeline e milestones stabiliti

### Fase 2: Design
- [ ] Information architecture definita
- [ ] User flows mappati
- [ ] Wireframes low-fi creati
- [ ] Wireframes validati con utenti
- [ ] Design system definito (Atomic Design)
- [ ] UI mockups high-fi completati
- [ ] Gamification design (APAR) documentato

### Fase 3: Database
- [ ] ER diagram creato
- [ ] Schema normalizzato (3NF)
- [ ] SQL migrations scritte
- [ ] RLS policies definite
- [ ] Seed data preparato
- [ ] Indexes ottimizzati

### Fase 4: Development
- [ ] Repository setup
- [ ] CI pipeline configurata
- [ ] Auth implementata
- [ ] Core learning flow funzionante
- [ ] Quiz system completato
- [ ] Gamification implementata
- [ ] Code review process attivo

### Fase 5: Testing
- [ ] Unit tests scritti (>70% coverage)
- [ ] Integration tests completati
- [ ] E2E tests per critical paths
- [ ] UAT con utenti reali
- [ ] Performance testing
- [ ] Accessibility audit

### Fase 6: Deployment
- [ ] Staging environment attivo
- [ ] CD pipeline configurata
- [ ] Production deploy completato
- [ ] Monitoring setup (Sentry, Analytics)
- [ ] Backup procedures verificate
- [ ] Rollback plan documentato

### Fase 7: Measure & Learn
- [ ] Analytics dashboard configurata
- [ ] Metriche chiave tracciate
- [ ] Feedback collection attivo
- [ ] Weekly review meetings
- [ ] Iteration backlog aggiornato

---

## FONTI ACCADEMICHE

1. **Customer Development**: Blank, S. (2013). "The Four Steps to the Epiphany". K&S Ranch.

2. **Lean Startup**: Ries, E. (2011). "The Lean Startup". Crown Business.

3. **APAR Framework**: López-Ardao, J.C. et al. (2026). "A Structural Design and Guidance Framework for Gamification in Education". MDPI.

4. **User-Centered Design**: ISO 9241-210:2019. "Ergonomics of human-system interaction".

5. **Requirements Elicitation**: Christel, M.G. & Kang, K.C. (1992). "Issues in Requirements Elicitation". CMU/SEI.

6. **Atomic Design**: Frost, B. (2016). "Atomic Design". Brad Frost Web.

7. **Self-Determination Theory**: Ryan, R.M. & Deci, E.L. (2000). "Self-determination theory". American Psychologist.

8. **Database Normalization**: Codd, E.F. (1970). "A Relational Model of Data for Large Shared Data Banks". CACM.

9. **Agile Manifesto**: Beck, K. et al. (2001). "Manifesto for Agile Software Development".

10. **Scrum Guide**: Schwaber, K. & Sutherland, J. (2020). "The Scrum Guide".

11. **CI/CD Best Practices**: Humble, J. & Farley, D. (2010). "Continuous Delivery". Addison-Wesley.

12. **Nielsen Norman Group**: Various articles on UX research and usability testing.

---

*Documento aggiornato: 14 Gennaio 2026*
*Content was rephrased for compliance with licensing restrictions*
