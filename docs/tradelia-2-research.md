# Tradelia 2.0 - Ricerca e Piano di Sviluppo

> Documento di ricerca creato il 14 Gennaio 2026

---

## 1. Cosa Rende Duolingo Efficace

### Meccaniche di Gamification Chiave

Basato su ricerca da [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets) e [StriveCloud](https://strivecloud.io/play/duolingo):

#### 1.1 Sistema Streak (+60% retention)
- **Principio psicologico**: Loss aversion - le persone sono più motivate a non perdere progressi che a guadagnare ricompense
- **Implementazione**: Contatore visibile, reminder push, "Streak Freeze" per recuperare
- **Risultato**: +60% retention quando implementato correttamente

#### 1.2 Sistema XP e Livelli (+40% engagement)
- **Principio**: Progressione visibile e competizione
- **Implementazione**: XP per ogni azione, livelli, leaderboard settimanali
- **Risultato**: +40% engagement, utenti "salgono di livello" invece di "studiare"

#### 1.3 Badge e Ricompense (+30% completion)
- **Principio**: Dopamina e senso di achievement
- **Implementazione**: Badge tiered, sfide con ricompense, "treasure chest" casuali
- **Risultato**: +30% course completion rate

### Il Modello Scientifico di Duolingo

Dal [blog ufficiale Duolingo](https://blog.duolingo.com/how-we-learn-how-you-learn/):

- **Student Model**: Database che traccia statistiche per ogni parola insegnata
- **Forgetting Curve**: Probabilità di ricordare decresce esponenzialmente nel tempo
- **Half-Life Regression (HLR)**: Algoritmo ML che predice quando ripassare
- **Spacing Effect**: Pratica breve e distribuita > cramming
- **Risultato A/B test**: +12% overall activity, +9.5% retention practice sessions

---

## 2. Struttura Database per App Tipo Duolingo

Basato su [Adalo tutorial](https://www.adalo.com/posts/step-by-step-guide-building-a-duolingo-clone-with-adalo):

### Collezioni Necessarie

```
1. Users
   - id, email, name
   - current_streak, longest_streak
   - total_xp, level
   - daily_goal (5/10/15/20 min)
   - last_activity_date
   - selected_path_id

2. Paths (ex: "Crypto Basics", "Wallet Security")
   - id, name, description
   - icon, color
   - order, is_locked
   - estimated_hours

3. Units (gruppi di lezioni dentro un Path)
   - id, path_id
   - name, order
   - is_locked

4. Lessons
   - id, unit_id
   - title, content (JSON)
   - order, estimated_minutes
   - xp_reward

5. Questions
   - id, lesson_id
   - type (multiple_choice, true_false, fill_blank)
   - question_text
   - options (JSON array)
   - correct_answer
   - explanation
   - order

6. UserProgress
   - id, user_id
   - lesson_id
   - completed_at
   - score (0-100)
   - xp_earned

7. Achievements/Badges
   - id, name, description
   - icon, requirement_type
   - requirement_value

8. UserAchievements
   - id, user_id, achievement_id
   - earned_at
```

---

## 3. Fasi di Sviluppo MVP

### Fase 1: Foundation (Settimana 1-2)
1. **Setup progetto**
   - Pulire codebase esistente o nuovo progetto Next.js
   - Configurare Supabase schema
   - Setup autenticazione base

2. **Database schema**
   - Creare tabelle su Supabase
   - Definire RLS policies
   - Seed data iniziale (1 path, 1 unit, 3-5 lessons)

### Fase 2: Core Learning Flow (Settimana 3-4)
3. **Home screen semplice**
   - Mostra streak, XP, prossima lezione
   - Max 3 azioni visibili
   - CTA chiaro "Continua"

4. **Lesson viewer**
   - Rendering contenuto lezione (testo breve)
   - Progress indicator
   - Navigazione avanti/indietro

5. **Quiz system**
   - Multiple choice
   - True/false
   - Feedback immediato
   - Calcolo score

### Fase 3: Gamification (Settimana 5-6)
6. **Sistema XP**
   - Award XP per lezioni/quiz
   - Mostra XP guadagnati
   - Calcolo livello

7. **Sistema Streak**
   - Traccia giorni consecutivi
   - Reset a mezzanotte
   - Mostra streak prominente

8. **Badge base**
   - "First Lesson" badge
   - Milestone XP badges
   - Streak badges (7, 30 giorni)

### Fase 4: Polish (Settimana 7-8)
9. **Onboarding**
   - Welcome screen
   - Scelta path iniziale
   - Placement quiz (opzionale)

10. **Persistenza e sync**
    - Salvataggio progress real-time
    - Offline queue (opzionale)
    - Cross-device sync

11. **Notifiche**
    - Reminder giornaliero
    - Streak a rischio
    - Achievement sbloccato

---

## 4. Stack Tecnologico Consigliato

### Mantenere da V1:
- **Next.js 14+** - Framework React
- **Supabase** - Database, Auth, Realtime
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Aggiungere:
- **Framer Motion** - Animazioni celebrative
- **React Query** - Data fetching/caching
- **Zustand** - State management leggero

### Rimuovere:
- Drawer complessi
- Sistema pillars/groups/modules
- Navigazione multi-livello

---

## 5. Principi di Design UX

### Da Duolingo:
1. **Una cosa alla volta** - Mai più di 3 opzioni visibili
2. **Progress sempre visibile** - Streak, XP, % completamento
3. **Feedback immediato** - Ogni azione ha risposta
4. **Celebrazioni** - Confetti, suoni, animazioni per successi
5. **Micro-sessioni** - 5 minuti = una sessione completa

### Anti-pattern da evitare:
- ❌ Menu hamburger con 10+ voci
- ❌ Drawer con navigazione annidata
- ❌ Testi lunghi senza interazione
- ❌ Troppi click per arrivare al contenuto
- ❌ Carico cognitivo alto (troppe scelte)

---

## 6. Metriche di Successo

### KPI Primari:
- **DAU/MAU ratio** - Target: >20%
- **Lesson completion rate** - Target: >70%
- **7-day retention** - Target: >40%
- **Average streak length** - Target: >5 giorni

### KPI Secondari:
- Time to first lesson < 60 secondi
- Quiz accuracy rate
- XP earned per session
- Badge unlock rate

---

## 7. Contenuto Minimo per MVP

### Path 1: "Crypto Basics" (da legacy content)
- **Unit 1: Cosa sono le crypto** (3 lezioni)
  - Lezione 1.1: Soldi digitali senza banche
  - Lezione 1.2: Differenze con soldi normali
  - Lezione 1.3: Responsabilità = Libertà

- **Unit 2: Come funzionano** (3 lezioni)
  - Lezione 2.1: Blockchain in 2 minuti
  - Lezione 2.2: Bitcoin vs Ethereum
  - Lezione 2.3: Altcoin e ecosistema

- **Unit 3: Sicurezza base** (3 lezioni)
  - Lezione 3.1: Wallet e chiavi
  - Lezione 3.2: Errori irreversibili
  - Lezione 3.3: Exchange vs Self-custody

**Totale MVP**: 1 Path, 3 Units, 9 Lessons, ~27 Quiz questions

---

## 8. Prossimi Passi

1. ✅ Ricerca completata
2. ⏳ Validare requirements con utente
3. ⏳ Definire schema database Supabase
4. ⏳ Creare wireframe/mockup UI
5. ⏳ Sviluppare MVP Fase 1

---

## Fonti

- [Orizon - Duolingo Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [StriveCloud - Duolingo Playbook](https://strivecloud.io/play/duolingo)
- [Duolingo Blog - How We Learn How You Learn](https://blog.duolingo.com/how-we-learn-how-you-learn/)
- [Adalo - Building a Duolingo Clone](https://www.adalo.com/posts/step-by-step-guide-building-a-duolingo-clone-with-adalo)

*Content was rephrased for compliance with licensing restrictions*
