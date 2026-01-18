# Lezione 0: Wireframe & UX Flow

## 📱 LAYOUT OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
│  [Badge: Lezione 0 • 5 min • 50 XP]                       │
│                                                             │
│              Cosa sono le Criptovalute                     │
│   La stessa verità, tre modi di capirla. Esplorarli       │
│        tutti sblocca la flessibilità cognitiva.           │
│                                                             │
│              [Progress Bar: ██████░░░░ 60%]                │
│                    2/3 approcci esplorati                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   FEEDBACK CARDS                           │
│  [🧠] Ottimo! Stai sviluppando flessibilità cognitiva     │
│       Integrare rappresentazioni multiple costruisce...    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   APPROACH TABS                            │
│ ┌─────────────┬─────────────┬─────────────────────────────┐ │
│ │🎭 Analogico │🔧 Procedurale│📚 Concettuale              │ │
│ │   ATTIVO    │      ✓      │                             │ │
│ │Metafore     │Guide        │Definizioni                  │ │
│ │familiari    │pratiche     │formali                      │ │
│ └─────────────┴─────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CONTENT AREA                             │
│                                                             │
│  📔 Immagina un quaderno magico condiviso tra migliaia    │
│      di persone in tutto il mondo.                        │
│                                                             │
│  Ogni volta che qualcuno vuole scrivere qualcosa...       │
│                                                             │
│  🔗 Come funziona l'analogia:                             │
│  • Quaderno = Blockchain (registro delle transazioni)      │
│  • Pagine = Blocchi (gruppi di transazioni)               │
│  • Persone = Computer della rete                          │
│                                                             │
│  ⚠️ Dove l'analogia si rompe:                             │
│  • Il quaderno vero ha pagine limitate...                 │
│                                                             │
│  🎯 Punti Chiave:                                         │
│  • Le crypto sono come un quaderno condiviso...           │
│  • Tutti possono verificare, nessuno può imbrogliare     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ACTION AREA                              │
│                                                             │
│        [Inizia il Quiz Finale 🎯]                         │
│   (attivo solo dopo aver esplorato tutti e 3 approcci)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎮 INTERACTION FLOW

### **1. Initial State**
```
User lands on page
↓
Shows Analogical approach by default
↓
Progress: 1/3 approaches explored
↓
Action button: "Esplora tutti e 3 gli approcci per sbloccare il quiz"
```

### **2. Approach Switching**
```
User clicks Procedural tab
↓
Smooth transition animation (300ms)
↓
Content updates with step-by-step guide
↓
Progress: 2/3 approaches explored
↓
Feedback card appears: "🧠 Ottimo! Stai sviluppando flessibilità cognitiva"
```

### **3. Mastery Achievement**
```
User clicks Conceptual tab
↓
Content updates with formal definitions
↓
Progress: 3/3 approaches explored (100%)
↓
Achievement card: "🎉 Rappresentazioni Integrate!"
↓
Action button becomes active: "Inizia il Quiz Finale 🎯"
```

### **4. Quiz Flow**
```
User clicks "Inizia il Quiz Finale"
↓
Transition to quiz interface
↓
Question 1/3 with multiple choice
↓
User selects answer → Immediate feedback + explanation
↓
Auto-advance to next question
↓
After 3 questions → Results screen with score
↓
XP reward + badges + "Continua il Percorso" button
```

## 📱 RESPONSIVE BREAKPOINTS

### **Mobile (< 640px)**
```
┌─────────────────────┐
│      HEADER         │
│   [Badge: L0 • 5m]  │
│                     │
│  Cosa sono le Crypto│
│                     │
│  [Progress ████░░]  │
│     2/3 esplorati   │
├─────────────────────┤
│   FEEDBACK CARD     │
│ [🧠] Flessibilità   │
│     cognitiva...    │
├─────────────────────┤
│   TABS (Vertical)   │
│ ┌─────────────────┐ │
│ │🎭 Analogico  ✓ │ │
│ ├─────────────────┤ │
│ │🔧 Procedurale   │ │
│ ├─────────────────┤ │
│ │📚 Concettuale   │ │
│ └─────────────────┘ │
├─────────────────────┤
│    CONTENT AREA     │
│                     │
│ 📔 Immagina un     │
│    quaderno...      │
│                     │
├─────────────────────┤
│   ACTION BUTTON     │
│ [Inizia Quiz 🎯]   │
└─────────────────────┘
```

### **Tablet (640px - 1024px)**
```
┌─────────────────────────────────────────┐
│                HEADER                   │
│        [Badge: Lezione 0 • 5 min]      │
│                                         │
│         Cosa sono le Criptovalute       │
│                                         │
│        [Progress ████████░░ 80%]        │
├─────────────────────────────────────────┤
│            FEEDBACK CARD                │
│  [🧠] Ottimo! Stai sviluppando...      │
├─────────────────────────────────────────┤
│              APPROACH TABS              │
│ ┌───────────┬───────────┬─────────────┐ │
│ │🎭Analogico│🔧Procedurale│📚Concettuale│ │
│ │   ATTIVO  │     ✓     │             │ │
│ └───────────┴───────────┴─────────────┘ │
├─────────────────────────────────────────┤
│             CONTENT AREA                │
│                                         │
│  📔 Immagina un quaderno magico...     │
│                                         │
│  🔗 Come funziona l'analogia:          │
│  • Quaderno = Blockchain               │
│  • Pagine = Blocchi                    │
│                                         │
├─────────────────────────────────────────┤
│            ACTION BUTTON                │
│        [Inizia il Quiz Finale 🎯]      │
└─────────────────────────────────────────┘
```

### **Desktop (> 1024px)**
```
┌─────────────────────────────────────────────────────────────────────┐
│                              HEADER                                 │
│                   [Badge: Lezione 0 • 5 min • 50 XP]              │
│                                                                     │
│                    Cosa sono le Criptovalute                       │
│        La stessa verità, tre modi di capirla. Esplorarli          │
│              tutti sblocca la flessibilità cognitiva.             │
│                                                                     │
│                  [Progress ████████████░░ 90%]                     │
│                        3/3 approcci esplorati                      │
├─────────────────────────────────────────────────────────────────────┤
│                          FEEDBACK CARD                             │
│  [🎉] Rappresentazioni Integrate! Hai costruito un modello...     │
├─────────────────────────────────────────────────────────────────────┤
│                         APPROACH TABS                              │
│ ┌─────────────────┬─────────────────┬─────────────────────────────┐ │
│ │  🎭 Analogico   │  🔧 Procedurale │     📚 Concettuale         │ │
│ │      ✓          │       ✓         │        ATTIVO              │ │
│ │ Metafore        │ Guide pratiche  │ Definizioni formali        │ │
│ │ familiari       │ step-by-step    │ e proprietà tecniche       │ │
│ └─────────────────┴─────────────────┴─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                         CONTENT AREA                               │
│                                                                     │
│  📖 Definizione Formale:                                          │
│                                                                     │
│  Una criptovaluta è un asset digitale programmabile il cui        │
│  possesso e trasferimento sono regolati da protocolli             │
│  crittografici e da un ledger distribuito...                      │
│                                                                     │
│  🔧 Componenti Tecnici Fondamentali:                              │
│  • Crittografia a chiave pubblica - Sistema di firme digitali     │
│  • Funzioni hash crittografiche - Integrità e collegamento        │
│  • Consenso distribuito - Meccanismo di accordo tra nodi          │
│                                                                     │
│  🎯 Punti Chiave:                                                 │
│  • Le crypto sono sistemi crittografici distribuiti               │
│  • La sicurezza deriva da matematica e consenso                    │
│  • Ogni proprietà ha trade-off che vanno compresi                 │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                        ACTION BUTTON                               │
│                  [Inizia il Quiz Finale 🎯]                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 VISUAL DESIGN SYSTEM

### **Colors**
```css
/* Approach Colors */
--analogical: #3B82F6 (Blue)
--procedural: #10B981 (Green)  
--conceptual: #8B5CF6 (Purple)

/* Feedback Colors */
--encouragement: #3B82F6 (Blue)
--achievement: #10B981 (Green)
--warning: #F59E0B (Amber)

/* Progress Colors */
--progress-bg: #E5E7EB (Gray-200)
--progress-fill: #3B82F6 (Blue)
--progress-complete: #10B981 (Green)
```

### **Typography**
```css
/* Headers */
h1: text-3xl font-bold (Lesson title)
h2: text-2xl font-bold (Approach title)  
h3: text-lg font-semibold (Section titles)

/* Body */
p: text-base text-gray-700 (Main content)
small: text-sm text-gray-600 (Metadata)

/* Interactive */
button: text-sm font-medium (Tab labels)
badge: text-xs font-medium (Progress badge)
```

### **Spacing**
```css
/* Container */
max-width: 4xl (896px)
padding: 6 (24px)
gap: 6 (24px)

/* Cards */
padding: 4-6 (16-24px)
border-radius: lg (8px)
gap: 4 (16px)

/* Sections */
margin-bottom: 4-6 (16-24px)
```

## 🔄 ANIMATIONS & TRANSITIONS

### **Tab Switching**
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
transform: translateX(0) → translateX(100%)
opacity: 1 → 0 → 1
```

### **Progress Bar**
```css
transition: width 500ms ease-out
width: 33% → 66% → 100%
```

### **Feedback Cards**
```css
/* Entrance */
opacity: 0 → 1
transform: translateY(20px) → translateY(0)
transition: all 400ms ease-out

/* Exit (after 5 seconds for encouragement) */
opacity: 1 → 0
transform: translateY(0) → translateY(-20px)
```

### **Quiz Transitions**
```css
/* Question Change */
opacity: 1 → 0 → 1
transform: translateX(0) → translateX(-20px) → translateX(0)
transition: all 300ms ease-in-out
```

## 📊 SUCCESS METRICS

### **Engagement Metrics**
- **Tab Switch Rate**: % users who explore multiple approaches
- **Completion Rate**: % users who finish all 3 approaches + quiz
- **Time on Page**: Average session duration
- **Return Rate**: % users who come back within 24h

### **Learning Metrics**
- **Quiz Score Distribution**: Average score per approach
- **Approach Preference**: Most/least popular approaches
- **Cognitive Flexibility**: % users who use all 3 approaches
- **Knowledge Retention**: Quiz performance correlation

### **UX Metrics**
- **Mobile Completion**: Mobile vs desktop completion rates
- **Bounce Rate**: % users who leave without interaction
- **Feedback Quality**: User satisfaction scores
- **Error Rate**: Technical issues or user confusion

## 🚀 IMPLEMENTATION NOTES

### **Performance Optimizations**
- Lazy load quiz component until needed
- Preload next approach content on tab hover
- Optimize images and animations for mobile
- Use CSS transforms for smooth animations

### **Accessibility**
- ARIA labels for all interactive elements
- Keyboard navigation for tabs (arrow keys)
- Screen reader announcements for progress
- High contrast mode support

### **Analytics Tracking**
- Track approach exploration patterns
- Monitor quiz performance by approach
- Measure time spent per section
- A/B test different content variations