# 🎯 ONBOARDING PREFERENCES - BEST PRACTICES 2026

> **Ricerca approfondita su country + technical level selection durante onboarding**

---

## 📊 ANALISI BEST PRACTICES

### 1. Google Account Setup
**Pattern:** Progressive disclosure durante signup

**Flow:**
1. Email + password (step 1)
2. Name + birthday (step 2)
3. **Country selection** (step 3) - Dropdown searchable
4. Phone verification (step 4)
5. Preferences DOPO login (optional)

**Insights:**
- ✅ Country selection DURANTE signup (per compliance legale)
- ✅ Preferences tecniche DOPO login (non blocking)
- ✅ Searchable dropdown per country
- ✅ Auto-detect country da IP (pre-filled)

---

### 2. Duolingo Onboarding
**Pattern:** Gamified progressive profiling

**Flow:**
1. "Why are you learning?" (motivation)
2. **"What's your level?"** (Beginner/Intermediate/Advanced)
3. Daily goal selection
4. Account creation (email/Google/Apple)
5. **Country auto-detected** (no explicit selection)

**Insights:**
- ✅ Technical level PRIMA di signup (personalizza esperienza)
- ✅ 3 livelli chiari (Beginner/Intermediate/Advanced)
- ✅ Visual cards con esempi per ogni livello
- ✅ Country auto-detect (no friction)

---

### 3. Stripe Dashboard
**Pattern:** Business context first

**Flow:**
1. Email + password
2. **Business country** (required, searchable dropdown)
3. Business type
4. Dashboard access
5. Technical preferences in settings (optional)

**Insights:**
- ✅ Country DURANTE signup (critical per tax/compliance)
- ✅ Searchable dropdown con flags
- ✅ No technical level (assume professional)
- ✅ Settings accessibili sempre da header

---

### 4. Netflix Onboarding
**Pattern:** Minimal friction, preferences later

**Flow:**
1. Email only
2. Password
3. Payment
4. **Preferences DOPO** (language, profiles, maturity level)
5. Country auto-detected da payment

**Insights:**
- ✅ Country implicito da payment method
- ✅ Preferences non-blocking
- ✅ Profili multipli con livelli diversi
- ✅ Cambio preferences sempre disponibile

---

### 5. Coinbase Onboarding
**Pattern:** Compliance-first

**Flow:**
1. Email + password
2. **Country selection** (required, legal compliance)
3. Identity verification
4. Dashboard access
5. No technical level (assume beginner)

**Insights:**
- ✅ Country OBBLIGATORIO per compliance crypto
- ✅ Dropdown con search + flags
- ✅ Blocca signup se country non supportato
- ✅ No technical level selection

---

## 🎯 RACCOMANDAZIONE PER TRADELIA

### Pattern Ottimale: **Hybrid Progressive**



## 🏆 SOLUZIONE RACCOMANDATA

### A. DURANTE SIGNUP/LOGIN (Modal)

**Step 1: Authentication**
```
┌─────────────────────────────────────┐
│  Benvenuto su Tradelia              │
│                                     │
│  [Email]                            │
│  [Password]                         │
│                                     │
│  ○ Continua con Email               │
│  ○ Continua con Google              │
│  ○ Continua con Apple               │
│                                     │
│  ○ Continua come Guest              │
└─────────────────────────────────────┘
```

**Step 2: Essential Preferences (NUOVO)**
```
┌─────────────────────────────────────┐
│  Personalizza la tua esperienza     │
│                                     │
│  🌍 Il tuo paese                    │
│  [🇮🇹 Italia ▼] (searchable)        │
│  ↳ Per contenuti fiscali/legali     │
│                                     │
│  🎓 Il tuo livello tecnico          │
│  ┌─────────────────────────────┐   │
│  │ ○ Noob                      │   │
│  │   Inizio da zero            │   │
│  ├─────────────────────────────┤   │
│  │ ● Informato                 │   │
│  │   Conosco le basi           │   │
│  ├─────────────────────────────┤   │
│  │ ○ Smart                     │   │
│  │   Sono esperto              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Continua →]                       │
│                                     │
│  Puoi cambiare in qualsiasi momento │
└─────────────────────────────────────┘
```

**Step 3: Dashboard Access**
- Utente entra direttamente nella dashboard
- Contenuti già personalizzati
- No friction aggiuntiva

---

### B. CAMBIO PREFERENCES (Settings Icon)

**Posizione:** Header dashboard (sempre visibile)

```
Header:
┌────────────────────────────────────────────┐
│ [Logo] Dashboard    [🌍 IT] [🎓 Informato] [⚙️] │
└────────────────────────────────────────────┘
                                              ↑
                                         Click qui
```

**Modal Settings:**
```
┌─────────────────────────────────────┐
│  ⚙️ Impostazioni                     │
│  ─────────────────────────────────  │
│                                     │
│  🌍 Paese                           │
│  [🇮🇹 Italia ▼]                     │
│                                     │
│  🎓 Livello tecnico                 │
│  ○ Noob  ● Informato  ○ Smart      │
│                                     │
│  🌐 Lingua                          │
│  ○ Italiano  ○ English              │
│                                     │
│  [Salva modifiche]                  │
└─────────────────────────────────────┘
```

---

## 📐 DESIGN SPECIFICATIONS

### 1. Country Selector Component

**Visual Design:**
```tsx
// Compact display in header
<button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
  <span className="text-xl">🇮🇹</span>
  <span className="text-sm font-medium hidden sm:inline">Italia</span>
  <ChevronDownIcon className="w-3 h-3" />
</button>

// Expanded in modal
<div className="space-y-2">
  <label className="text-sm font-semibold text-foreground">
    🌍 Il tuo paese
  </label>
  <SearchableCountrySelector 
    value={country}
    onChange={setCountry}
  />
  <p className="text-xs text-muted-foreground">
    Useremo questa informazione per mostrarti contenuti fiscali e legali specifici
  </p>
</div>
```

**Interaction:**
- Click → Opens searchable dropdown
- Type → Filters countries in real-time
- Arrow keys → Navigate results
- Enter → Select country
- Esc → Close dropdown

**Accessibility:**
- ARIA role="combobox"
- aria-expanded state
- aria-activedescendant for keyboard nav
- Screen reader announces country changes

---

### 2. Technical Level Selector

**Visual Design:**
```tsx
// Compact display in header
<button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
  <span className="text-sm">🎓</span>
  <span className="text-sm font-medium hidden sm:inline">Informato</span>
</button>

// Expanded in modal (Radio cards)
<div className="space-y-2">
  <label className="text-sm font-semibold text-foreground">
    🎓 Il tuo livello tecnico
  </label>
  
  <div className="space-y-2">
    {/* Noob */}
    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 cursor-pointer transition-all">
      <input type="radio" name="level" value="noob" className="mt-1" />
      <div className="flex-1">
        <div className="font-semibold text-foreground">Noob</div>
        <div className="text-sm text-muted-foreground">
          Inizio da zero, spiegami tutto con parole semplici
        </div>
      </div>
    </label>
    
    {/* Informato */}
    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
      <input type="radio" name="level" value="informato" checked className="mt-1" />
      <div className="flex-1">
        <div className="font-semibold text-foreground">Informato</div>
        <div className="text-sm text-muted-foreground">
          Conosco le basi, voglio approfondire
        </div>
      </div>
    </label>
    
    {/* Smart */}
    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 cursor-pointer transition-all">
      <input type="radio" name="level" value="smart" className="mt-1" />
      <div className="flex-1">
        <div className="font-semibold text-foreground">Smart</div>
        <div className="text-sm text-muted-foreground">
          Sono esperto, dammi contenuti avanzati
        </div>
      </div>
    </label>
  </div>
  
  <p className="text-xs text-muted-foreground">
    Adatteremo la complessità dei contenuti al tuo livello
  </p>
</div>
```

**Interaction:**
- Click card → Select level
- Visual feedback immediato (border + background)
- No submit button needed (auto-save)

**Accessibility:**
- Native radio inputs
- Label wraps entire card
- Keyboard navigation (Tab + Arrow keys)
- Screen reader announces level changes

---

## 🔄 USER FLOWS

### Flow 1: New User (Email Signup)

```
1. Landing page
   ↓ Click "Inizia gratis"
   
2. Modal: Email + Password
   ↓ Submit
   
3. Modal: Country + Technical Level
   ↓ Submit
   
4. Dashboard (personalized)
   ✓ Country: IT
   ✓ Level: Informato
   ✓ Content: Adapted
```

### Flow 2: New User (Google OAuth)

```
1. Landing page
   ↓ Click "Continua con Google"
   
2. Google OAuth
   ↓ Authorize
   
3. Modal: Country + Technical Level
   ↓ Submit
   
4. Dashboard (personalized)
   ✓ Country: Auto-detected or selected
   ✓ Level: Selected
   ✓ Content: Adapted
```

### Flow 3: Guest User

```
1. Landing page
   ↓ Click "Continua come Guest"
   
2. Modal: Country + Technical Level
   ↓ Submit
   
3. Dashboard (personalized, limited)
   ✓ Country: Selected
   ✓ Level: Selected
   ✓ Content: Adapted
   ✓ Data: Saved in IndexedDB
   
   [Later: Sign up]
   ↓ Sync preferences to account
```

### Flow 4: Returning User (Change Preferences)

```
1. Dashboard
   ↓ Click settings icon (⚙️)
   
2. Modal: Settings
   ↓ Change country or level
   ↓ Click "Salva"
   
3. Dashboard (updated)
   ✓ Content: Re-adapted
   ✓ Modules: Re-filtered
   ✓ Examples: Updated
```

---

## 💾 DATA PERSISTENCE

### Guest Users (IndexedDB)
```typescript
interface GuestPreferences {
  country: string
  technicalLevel: 'noob' | 'informato' | 'smart'
  language: string
  createdAt: number
  lastUpdated: number
}

// Save on selection
await saveToIndexedDB('preferences', {
  country: 'IT',
  technicalLevel: 'informato',
  language: 'it',
  createdAt: Date.now(),
  lastUpdated: Date.now()
})
```

### Authenticated Users (Database + IndexedDB)
```typescript
// On signup/login
await syncPreferences({
  userId: user.id,
  country: 'IT',
  technicalLevel: 'informato',
  language: 'it'
})

// Also save to IndexedDB for offline access
await saveToIndexedDB('preferences', preferences)
```

### Sync Strategy
```typescript
// On login: Merge IndexedDB → Database
const localPrefs = await getFromIndexedDB('preferences')
const serverPrefs = await fetchUserPreferences(user.id)

// Server wins if conflict
const mergedPrefs = {
  ...localPrefs,
  ...serverPrefs,
  lastUpdated: Math.max(localPrefs.lastUpdated, serverPrefs.lastUpdated)
}

await saveToDatabase(user.id, mergedPrefs)
await saveToIndexedDB('preferences', mergedPrefs)
```



---

## 🎨 DRAWER CLEANUP STRATEGY

### PRIMA (Complesso)
```
Learning Path Drawer:
├── Level 1: Setup (Country + Level)
├── Level 2: Groups
├── Level 3: Modules
└── Level 4: Content
```

### DOPO (Pulito)
```
Learning Path Drawer:
├── Level 1: Groups (no setup)
├── Level 2: Modules
└── Level 3: Content

Header (sempre visibile):
├── [🌍 IT] Country selector
├── [🎓 Informato] Level toggle
└── [⚙️] Settings
```

**Vantaggi:**
- ✅ Drawer più pulito (3 livelli invece di 4)
- ✅ Preferences sempre accessibili (header)
- ✅ No setup screen nel drawer
- ✅ Cambio livello immediato (no navigation)

---

## 🔧 TECHNICAL LEVEL TOGGLE

### Posizione: Header Dashboard

**Compact Version (Mobile):**
```tsx
<button 
  onClick={toggleLevel}
  className="p-2 rounded-lg hover:bg-muted/50"
  aria-label="Cambia livello tecnico"
>
  <span className="text-sm">🎓</span>
</button>
```

**Full Version (Desktop):**
```tsx
<div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer">
  <span className="text-sm">🎓</span>
  <span className="text-sm font-medium">Informato</span>
  <ChevronDownIcon className="w-3 h-3" />
</div>
```

**Dropdown Menu:**
```tsx
<div className="absolute top-full right-0 mt-2 w-64 bg-background border border-border/50 rounded-xl shadow-xl p-2">
  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50">
    <div className="font-semibold text-sm">Noob</div>
    <div className="text-xs text-muted-foreground">Contenuti semplificati</div>
  </button>
  
  <button className="w-full text-left px-3 py-2 rounded-lg bg-primary/10">
    <div className="font-semibold text-sm">Informato ✓</div>
    <div className="text-xs text-muted-foreground">Livello attuale</div>
  </button>
  
  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50">
    <div className="font-semibold text-sm">Smart</div>
    <div className="text-xs text-muted-foreground">Contenuti avanzati</div>
  </button>
</div>
```

**Behavior:**
- Click → Toggle dropdown
- Select level → Immediate update
- Content adapts in real-time
- No page reload needed

---

## 📱 RESPONSIVE BEHAVIOR

### Mobile (< 768px)

**Header:**
```
┌────────────────────────────────┐
│ [☰] Tradelia  [🌍] [🎓] [⚙️]  │
└────────────────────────────────┘
```

**Onboarding Modal:**
```
┌────────────────────────────────┐
│  Personalizza                  │
│                                │
│  🌍 Paese                      │
│  [🇮🇹 Italia ▼]                │
│                                │
│  🎓 Livello                    │
│  ○ Noob                        │
│  ● Informato                   │
│  ○ Smart                       │
│                                │
│  [Continua]                    │
└────────────────────────────────┘
```

### Desktop (≥ 768px)

**Header:**
```
┌──────────────────────────────────────────────┐
│ [Logo] Dashboard  [🌍 Italia] [🎓 Informato] [⚙️ Settings] │
└──────────────────────────────────────────────┘
```

**Onboarding Modal:**
```
┌─────────────────────────────────────────┐
│  Personalizza la tua esperienza         │
│                                         │
│  🌍 Il tuo paese                        │
│  [🇮🇹 Italia ▼] (searchable)            │
│  ↳ Per contenuti fiscali/legali         │
│                                         │
│  🎓 Il tuo livello tecnico              │
│  ┌───────────────────────────────────┐ │
│  │ ○ Noob    ● Informato    ○ Smart │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Continua →]                           │
└─────────────────────────────────────────┘
```

---

## 🌐 MULTILINGUAL SUPPORT

### Translation Keys

```json
// messages/it/onboarding.json
{
  "preferences": {
    "title": "Personalizza la tua esperienza",
    "country": {
      "label": "Il tuo paese",
      "placeholder": "Seleziona paese",
      "description": "Per contenuti fiscali e legali specifici"
    },
    "technicalLevel": {
      "label": "Il tuo livello tecnico",
      "description": "Adatteremo la complessità dei contenuti",
      "noob": {
        "title": "Noob",
        "description": "Inizio da zero, spiegami tutto"
      },
      "informato": {
        "title": "Informato",
        "description": "Conosco le basi, voglio approfondire"
      },
      "smart": {
        "title": "Smart",
        "description": "Sono esperto, dammi contenuti avanzati"
      }
    },
    "continue": "Continua",
    "save": "Salva modifiche",
    "canChange": "Puoi cambiare in qualsiasi momento"
  }
}

// messages/en/onboarding.json
{
  "preferences": {
    "title": "Customize your experience",
    "country": {
      "label": "Your country",
      "placeholder": "Select country",
      "description": "For specific tax and legal content"
    },
    "technicalLevel": {
      "label": "Your technical level",
      "description": "We'll adapt content complexity",
      "noob": {
        "title": "Beginner",
        "description": "Starting from scratch, explain everything"
      },
      "informato": {
        "title": "Intermediate",
        "description": "I know the basics, want to go deeper"
      },
      "smart": {
        "title": "Advanced",
        "description": "I'm experienced, give me advanced content"
      }
    },
    "continue": "Continue",
    "save": "Save changes",
    "canChange": "You can change this anytime"
  }
}
```

---

## 🎯 CONTENT ADAPTATION LOGIC

### Module Filtering by Technical Level

```typescript
// src/shared/lib/content-adapter.ts
export function adaptModuleContent(
  module: LearningModule,
  technicalLevel: 'noob' | 'informato' | 'smart'
): LearningModule {
  
  // Filter sections based on level
  const filteredSections = module.sections.filter(section => {
    // All levels see: hook, heading, text, takeaway
    const universalTypes = ['hook', 'heading', 'text', 'takeaway']
    if (universalTypes.includes(section.type)) return true
    
    // Technical sections only for informato/smart
    if (section.type === 'technical' && technicalLevel === 'noob') return false
    
    // Advanced sections only for smart
    if (section.type === 'advanced' && technicalLevel !== 'smart') return false
    
    return true
  })
  
  // Adapt language complexity
  const adaptedSections = filteredSections.map(section => {
    if (section.type !== 'text') return section
    
    return {
      ...section,
      content: adaptTextComplexity(section.content, technicalLevel)
    }
  })
  
  return {
    ...module,
    sections: adaptedSections
  }
}

function adaptTextComplexity(
  text: string,
  level: 'noob' | 'informato' | 'smart'
): string {
  // Noob: Replace technical terms with simple explanations
  if (level === 'noob') {
    return text
      .replace(/blockchain/gi, 'blockchain (registro digitale)')
      .replace(/smart contract/gi, 'smart contract (contratto automatico)')
      .replace(/DeFi/gi, 'DeFi (finanza decentralizzata)')
  }
  
  // Informato: Keep technical terms, add context
  if (level === 'informato') {
    return text // Original text with balanced complexity
  }
  
  // Smart: Use full technical terminology
  if (level === 'smart') {
    return text // Original text, no simplification
  }
  
  return text
}
```

### Example Localization by Country

```typescript
// src/shared/lib/content-localizer.ts
export function localizeExample(
  example: string,
  country: string
): string {
  const localizations: Record<string, Record<string, string>> = {
    'IT': {
      currency: '€',
      taxRate: '26%',
      platform: 'Young Platform',
      regulation: 'MiCA'
    },
    'US': {
      currency: '$',
      taxRate: '15-37%',
      platform: 'Coinbase',
      regulation: 'SEC'
    },
    'GB': {
      currency: '£',
      taxRate: '20%',
      platform: 'Kraken',
      regulation: 'FCA'
    }
  }
  
  const config = localizations[country] || localizations['IT']
  
  return example
    .replace(/\{currency\}/g, config.currency)
    .replace(/\{taxRate\}/g, config.taxRate)
    .replace(/\{platform\}/g, config.platform)
    .replace(/\{regulation\}/g, config.regulation)
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Onboarding Modal (Week 1)
- [ ] Create OnboardingPreferencesModal component
- [ ] Integrate SearchableCountrySelector
- [ ] Create TechnicalLevelSelector (radio cards)
- [ ] Add to signup flow (email/Google/Apple)
- [ ] Add to guest flow
- [ ] Implement IndexedDB persistence
- [ ] Add translations (IT/EN)

### Phase 2: Header Integration (Week 1)
- [ ] Add country indicator to header
- [ ] Add technical level toggle to header
- [ ] Create settings dropdown
- [ ] Implement real-time content adaptation
- [ ] Test responsive behavior

### Phase 3: Drawer Cleanup (Week 2)
- [ ] Remove SetupView from Learning Path drawer
- [ ] Update drawer to 3 levels (Groups → Modules → Content)
- [ ] Move preferences to header
- [ ] Update all drawer navigation
- [ ] Test all user flows

### Phase 4: Content Adaptation (Week 2)
- [ ] Implement adaptModuleContent function
- [ ] Create content complexity variants
- [ ] Add country-specific examples
- [ ] Test all technical levels
- [ ] Test all countries (Tier 1)

### Phase 5: Testing & Polish (Week 3)
- [ ] Test guest → authenticated sync
- [ ] Test preference changes
- [ ] Test content adaptation
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] User testing

---

## 🎯 SUCCESS METRICS

### Onboarding Completion
- Target: >90% complete preferences
- Measure: % users who complete country + level selection

### Preference Changes
- Target: <5% change preferences after initial selection
- Measure: % users who modify preferences in first 30 days

### Content Relevance
- Target: >4.5/5 satisfaction with content relevance
- Measure: User feedback on adapted content

### Technical Performance
- Target: <100ms content adaptation time
- Measure: Time to re-render content after preference change

---

*Onboarding Preferences Best Practices 2026 - Tradelia*  
*Version: 1.0*  
*Last Updated: January 2026*  
*Status: READY FOR IMPLEMENTATION*
