# 🚀 PIANO IMPLEMENTAZIONE EXECUTIVE

> **Sintesi esecutiva per implementazione preferences + drawer cleanup**

---

## 📋 DECISIONI CHIAVE

### ✅ 1. Preferences NEL MODAL DI LOGIN/REGISTRAZIONE
**Decisione:** Sì, è la best practice enterprise

**Rationale:**
- Google, Stripe, Coinbase lo fanno tutti
- Country è CRITICO per compliance (tax/legal)
- Technical level personalizza da subito l'esperienza
- 2 step totali: Auth → Preferences → Dashboard

**Flow:**
```
Step 1: Email/Google/Apple/Guest
   ↓
Step 2: Country + Technical Level (NUOVO)
   ↓
Dashboard (già personalizzata)
```

---

### ✅ 2. DRAWER PULITI - Solo Toggle in Header
**Decisione:** Sì, rimuovere setup screen dal drawer

**Rationale:**
- Drawer passa da 4 a 3 livelli (più pulito)
- Preferences sempre accessibili in header
- Cambio livello immediato (no navigation)
- Pattern usato da Duolingo, Netflix, Spotify

**Header:**
```
[Logo] Dashboard  [🌍 IT] [🎓 Informato] [⚙️]
                    ↑         ↑          ↑
                 Country   Level    Settings
```

---

### ✅ 3. TUTTE LE 30 NAZIONI SELEZIONABILI
**Decisione:** Sì, ma contenuto dinamico solo Tier 1+2 (15 nazioni)

**Implementazione:**
- Dropdown: Tutte le 30+ nazioni
- Contenuto dinamico: Solo 15 nazioni (Tier 1+2)
- Altre nazioni: Contenuto generico globale

**Vantaggi:**
- User può sempre selezionare il suo paese
- No frustrazione "paese non supportato"
- Espandibile in futuro senza breaking changes

---

## 🎯 ARCHITETTURA FINALE

### A. Onboarding Flow

```typescript
// 1. User arriva su landing
Landing Page
   ↓ Click "Inizia gratis"

// 2. Modal: Authentication
┌─────────────────────────────────┐
│  Benvenuto su Tradelia          │
│  [Email + Password]             │
│  [Continua con Google]          │
│  [Continua con Apple]           │
│  [Continua come Guest]          │
└─────────────────────────────────┘
   ↓ Submit

// 3. Modal: Preferences (NUOVO)
┌─────────────────────────────────┐
│  Personalizza esperienza        │
│  🌍 [🇮🇹 Italia ▼] Searchable   │
│  🎓 ○ Noob ● Informato ○ Smart │
│  [Continua →]                   │
└─────────────────────────────────┘
   ↓ Submit

// 4. Dashboard (personalizzata)
Dashboard con contenuti adattati
```

---

### B. Dashboard Header

```typescript
// Desktop
┌────────────────────────────────────────────────┐
│ [Logo] Dashboard  [🌍 Italia ▼] [🎓 Informato ▼] [⚙️] │
└────────────────────────────────────────────────┘

// Mobile
┌──────────────────────────────┐
│ [☰] Tradelia  [🌍] [🎓] [⚙️] │
└──────────────────────────────┘
```

**Interactions:**
- Click 🌍 → Dropdown con searchable country selector
- Click 🎓 → Dropdown con 3 livelli (cambio immediato)
- Click ⚙️ → Modal settings completo

---

### C. Learning Path Drawer (PULITO)

```typescript
// PRIMA (4 livelli)
Drawer:
├── Level 1: Setup (Country + Level) ❌ RIMOSSO
├── Level 2: Groups
├── Level 3: Modules
└── Level 4: Content

// DOPO (3 livelli)
Drawer:
├── Level 1: Groups
├── Level 2: Modules
└── Level 3: Content

Header (sempre visibile):
├── [🌍 IT] Country
├── [🎓 Informato] Level
└── [⚙️] Settings
```

---

## 📦 COMPONENTI DA CREARE

### 1. OnboardingPreferencesModal
```tsx
// src/shared/components/OnboardingPreferencesModal.tsx
interface Props {
  isOpen: boolean
  onComplete: (prefs: UserPreferences) => void
  userType: 'email' | 'google' | 'apple' | 'guest'
}

export function OnboardingPreferencesModal({ isOpen, onComplete, userType }: Props) {
  const [country, setCountry] = useState('')
  const [level, setLevel] = useState<'noob' | 'informato' | 'smart'>('informato')
  
  const handleSubmit = async () => {
    // Save to IndexedDB
    await savePreferences({ country, technicalLevel: level })
    
    // If authenticated, sync to backend
    if (userType !== 'guest') {
      await syncToBackend({ country, technicalLevel: level })
    }
    
    onComplete({ country, technicalLevel: level })
  }
  
  return (
    <Modal isOpen={isOpen}>
      <h2>Personalizza la tua esperienza</h2>
      
      <SearchableCountrySelector 
        value={country}
        onChange={setCountry}
      />
      
      <TechnicalLevelSelector
        value={level}
        onChange={setLevel}
      />
      
      <button onClick={handleSubmit}>Continua</button>
    </Modal>
  )
}
```

### 2. HeaderPreferencesBar
```tsx
// src/shared/components/HeaderPreferencesBar.tsx
export function HeaderPreferencesBar() {
  const { country, technicalLevel } = useUserPreferences()
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showLevelDropdown, setShowLevelDropdown] = useState(false)
  
  return (
    <div className="flex items-center gap-2">
      {/* Country selector */}
      <CountryDropdown 
        value={country}
        isOpen={showCountryDropdown}
        onToggle={setShowCountryDropdown}
      />
      
      {/* Technical level toggle */}
      <TechnicalLevelDropdown
        value={technicalLevel}
        isOpen={showLevelDropdown}
        onToggle={setShowLevelDropdown}
      />
      
      {/* Settings button */}
      <SettingsButton />
    </div>
  )
}
```

### 3. TechnicalLevelSelector (Radio Cards)
```tsx
// src/shared/components/TechnicalLevelSelector.tsx
interface Props {
  value: 'noob' | 'informato' | 'smart'
  onChange: (level: 'noob' | 'informato' | 'smart') => void
}

export function TechnicalLevelSelector({ value, onChange }: Props) {
  const levels = [
    {
      id: 'noob',
      title: 'Noob',
      description: 'Inizio da zero, spiegami tutto'
    },
    {
      id: 'informato',
      title: 'Informato',
      description: 'Conosco le basi, voglio approfondire'
    },
    {
      id: 'smart',
      title: 'Smart',
      description: 'Sono esperto, dammi contenuti avanzati'
    }
  ]
  
  return (
    <div className="space-y-2">
      {levels.map(level => (
        <label 
          key={level.id}
          className={`
            flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${value === level.id 
              ? 'border-primary bg-primary/5' 
              : 'border-border/50 hover:border-primary/50'
            }
          `}
        >
          <input 
            type="radio"
            name="level"
            value={level.id}
            checked={value === level.id}
            onChange={() => onChange(level.id as any)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-semibold text-foreground">{level.title}</div>
            <div className="text-sm text-muted-foreground">{level.description}</div>
          </div>
        </label>
      ))}
    </div>
  )
}
```

---

## 🔄 INTEGRATION POINTS

### 1. Auth Flow Integration
```tsx
// app/auth/login/page.tsx
export default function LoginPage() {
  const [showPreferences, setShowPreferences] = useState(false)
  const [authData, setAuthData] = useState(null)
  
  const handleAuthSuccess = (data) => {
    setAuthData(data)
    setShowPreferences(true) // Show preferences modal
  }
  
  const handlePreferencesComplete = async (prefs) => {
    // Save preferences
    await saveUserPreferences(prefs)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }
  
  return (
    <>
      <LoginForm onSuccess={handleAuthSuccess} />
      
      <OnboardingPreferencesModal
        isOpen={showPreferences}
        onComplete={handlePreferencesComplete}
        userType={authData?.type}
      />
    </>
  )
}
```

### 2. Dashboard Header Integration
```tsx
// app/[locale]/(app)/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <header className="border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <HeaderPreferencesBar /> {/* NUOVO */}
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  )
}
```

### 3. Learning Path Drawer Cleanup
```tsx
// src/widgets/learning-path-drawer/index.tsx
export function LearningPathDrawer() {
  // RIMUOVERE: const [view, setView] = useState<'setup' | 'groups' | 'modules' | 'content'>('setup')
  // NUOVO: Start directly at groups
  const [view, setView] = useState<'groups' | 'modules' | 'content'>('groups')
  
  return (
    <PremiumDrawer isOpen={isOpen} onClose={onClose}>
      {view === 'groups' && <GroupsView onSelectGroup={...} />}
      {view === 'modules' && <ModulesListView onSelectModule={...} />}
      {view === 'content' && <ModuleContentView module={...} />}
    </PremiumDrawer>
  )
}
```

---

## ⏱️ TIMELINE

### Week 1: Core Components
- Day 1-2: OnboardingPreferencesModal
- Day 3: HeaderPreferencesBar
- Day 4: TechnicalLevelSelector
- Day 5: Integration + testing

### Week 2: Drawer Cleanup
- Day 1-2: Remove SetupView
- Day 3: Update navigation logic
- Day 4-5: Testing + polish

### Week 3: Content Adaptation
- Day 1-2: adaptModuleContent function
- Day 3-4: Country-specific examples
- Day 5: Testing all levels

---

## ✅ READY TO START

Tutti i documenti sono pronti:
1. ✅ `enterprise-ux-guidelines-2026.md` - Chicche complete
2. ✅ `onboarding-preferences-best-practices.md` - Best practices + specs
3. ✅ `IMPLEMENTATION-PLAN-EXECUTIVE.md` - Piano esecutivo (questo)

**Prossimo step:** Iniziare implementazione Week 1 - Core Components

