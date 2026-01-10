# 🎯 TRADELIA DESIGN GUIDELINES 2026

> **Linee guida definitive per il sistema di navigazione e UX di Tradelia**

---

## 🏛️ PRINCIPI FONDAMENTALI

### 1. **Architettura Immutabile**
- **5 contesti fissi**: Home, Emergency, Longterm, Speculation, Passive
- **Mai aggiungere/rimuovere contesti** - Solo contenuti interni scalabili
- **Sub-navigazione identica**: Introduzione, Errori, Educativo, Tool, Piattaforme
- **Struttura max 3 livelli**: Home → Contesto → Tab

### 2. **Mobile-First & Accessibility**
- **Bottom navigation mobile** con touch targets ≥44px
- **Desktop sidebar** fissa con breadcrumb
- **WCAG 2.2 AA compliance** obbligatoria
- **Focus trap** per overlay e sidebar mobile
- **Keyboard navigation** completa (Tab, Arrow keys, ESC)

### 3. **Educational Brand**
- **Anti-errore by design** - Prevenzione sempre prima di correzione
- **Risk-first communication** - Rischi chiari prima di benefici
- **Educational empty states** - Ogni vuoto è un'opportunità di insegnare
- **Progressive disclosure** - Informazioni graduate per complessità

### 4. **Performance & Scalability**
- **Layout-stable loading** - Zero CLS (Cumulative Layout Shift)
- **Skeleton loading** per tutti i contenuti dinamici
- **Code splitting** a livello di route e componenti
- **Infinite scalability** - Tool section può contenere 1000+ tool

---

## 🎨 UX PATTERNS OBBLIGATORI

### Navigation Patterns
```tsx
// ✅ CORRETTO - Breadcrumb desktop only
<Breadcrumb items={[
  { label: 'Home', href: '/dashboard' },
  { label: 'Asset Rifugio', href: '/dashboard/emergency' },
  { label: 'Tool' } // Max 3 livelli
]} />

// ❌ SBAGLIATO - Breadcrumb su mobile
<div className="md:block"> {/* Solo desktop */}
  <Breadcrumb />
</div>
```

### Risk Communication
```tsx
// ✅ CORRETTO - Risk-first
<RiskBadge level="alto" showExplanation />
<p>Questo strumento può causare perdite significative...</p>
<Button>Procedi consapevolmente</Button>

// ❌ SBAGLIATO - Benefit-first
<Button>Guadagna subito!</Button>
<small>Rischi: perdite possibili</small>
```

### Empty States
```tsx
// ✅ CORRETTO - Educational
<EmptyState
  title="Prima di usare strumenti"
  description="Leggi 'Errori da evitare' per utilizzare i tool in sicurezza"
  action={{ label: "Vai a Errori (2 min)", onClick: goToErrors }}
/>

// ❌ SBAGLIATO - Generic
<EmptyState title="Nessun contenuto" />
```

---

## 🔒 SECURITY UX REQUIREMENTS

### Dangerous Actions
```tsx
// ✅ OBBLIGATORIO per azioni irreversibili
<DangerousAction
  title="Elimina Portfolio"
  confirmText="ELIMINA"
  warningText="Questa azione non può essere annullata"
  onConfirm={deletePortfolio}
>
  <Button variant="destructive">Elimina</Button>
</DangerousAction>
```

### Privacy-First Analytics
```tsx
// ✅ CORRETTO - Granular consent
<PrivacyConsentModal
  categories={['essential', 'analytics', 'performance']}
  onConsent={handleConsent}
/>

// ❌ VIETATO - Tracking senza consenso
trackEvent('user_action') // Solo dopo consenso esplicito
```

---

## 📱 RESPONSIVE DESIGN RULES

### Breakpoints Standard
```css
/* Mobile First */
.component { /* Mobile: <768px */ }
@media (min-width: 768px) { /* Tablet+ */ }
@media (min-width: 1024px) { /* Desktop+ */ }
@media (min-width: 1280px) { /* Large+ */ }
```

### Touch Targets
```tsx
// ✅ CORRETTO - Minimum 44px
<button className="min-w-[44px] min-h-[44px] p-2">
  <Icon className="w-6 h-6" />
</button>

// ❌ SBAGLIATO - Too small
<button className="p-1">
  <Icon className="w-4 h-4" />
</button>
```

### Navigation Hierarchy
```tsx
// Mobile: Bottom Nav (5 items max)
<BottomNav items={['Home', 'Emergency', 'Longterm', 'Speculation', 'Passive']} />

// Desktop: Sidebar + Breadcrumb
<Sidebar />
<Breadcrumb />
<SubNavigation />
```

---

## 🎯 COMPONENT STANDARDS

### Loading States
```tsx
// ✅ Layout-stable skeleton
<SkeletonCard className="h-32" /> // Fixed height

// ❌ Generic spinner
<Spinner /> // Causes layout shift
```

### Error Handling
```tsx
// ✅ Graceful degradation
<ErrorBoundary fallback={<ErrorState />}>
  <ComplexComponent />
</ErrorBoundary>

// ❌ Crash without fallback
<ComplexComponent /> // Can break entire page
```

### Accessibility
```tsx
// ✅ ARIA compliant
<nav role="tablist" aria-label="Navigazione sezione">
  <button role="tab" aria-selected={isActive} aria-controls="panel-1">
    Tab 1
  </button>
</nav>

// ❌ Missing ARIA
<div>
  <button onClick={switchTab}>Tab 1</button>
</div>
```

---

## 🚫 ANTI-PATTERNS DA EVITARE

### Navigation
- ❌ **Breadcrumb su mobile** (spreco di spazio)
- ❌ **Più di 3 livelli** di navigazione
- ❌ **Modificare i 5 contesti** fissi
- ❌ **Sub-nav diversa** tra sezioni

### UX
- ❌ **Dark patterns** (trick per far cliccare)
- ❌ **Benefit-first** communication (rischi nascosti)
- ❌ **Generic empty states** (opportunità persa)
- ❌ **Azioni pericolose** senza conferma

### Performance
- ❌ **Layout shift** durante il loading
- ❌ **Blocking JavaScript** per UI critica
- ❌ **Bundle monolitico** senza code splitting
- ❌ **Tracking invasivo** senza consenso

### Accessibility
- ❌ **Touch target < 44px** su mobile
- ❌ **Focus trap mancante** su overlay
- ❌ **Keyboard navigation** incompleta
- ❌ **Contrast ratio < 4.5:1**

---

## 📊 QUALITY GATES

### Performance Thresholds
- **First Paint**: < 1.0s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Accessibility Requirements
- **WCAG 2.2 AA**: 100% compliance
- **Keyboard Navigation**: Tutti gli elementi interattivi
- **Screen Reader**: Compatibilità NVDA/JAWS
- **Color Contrast**: Minimum 4.5:1

### Code Quality
- **TypeScript**: Zero compilation errors
- **ESLint**: Zero warnings in production
- **Test Coverage**: >80% per componenti critici
- **Bundle Size**: <500KB initial load

---

## 🔄 MAINTENANCE PROTOCOLS

### Monthly Reviews
- [ ] Accessibility audit con screen reader
- [ ] Performance metrics review
- [ ] User feedback analysis
- [ ] Component library updates

### Quarterly Updates
- [ ] Design system evolution
- [ ] New pattern documentation
- [ ] Breaking changes assessment
- [ ] Training team updates

### Annual Overhauls
- [ ] Complete UX audit
- [ ] Technology stack review
- [ ] Competitor analysis
- [ ] Strategic roadmap update

---

## 🧬 ULTRA-CHICCHE PATTERNS (Elite Level)

### Misclick Prevention
```tsx
// ✅ OBBLIGATORIO per azioni critiche su mobile
<SafeButton variant="critical" delayMs={150}>
  Apri Strumento Avanzato
</SafeButton>

// ❌ VIETATO - Azioni critiche senza protezione
<Button onClick={riskyAction}>Elimina Portfolio</Button>
```

### Soft Confirmation
```tsx
// ✅ CORRETTO - Non-blocking confirmation
<SoftConfirmation message="Stai per aprire uno strumento avanzato">
  <Button>Procedi</Button>
</SoftConfirmation>

// ❌ SBAGLIATO - Modal blocking per azioni non critiche
<Modal title="Conferma">Sei sicuro?</Modal>
```

### Cognitive Load Management
```tsx
// ✅ CORRETTO - Max 3 elementi principali
<ToolGrid maxVisible={3} showMoreButton />

// ❌ SBAGLIATO - Troppi elementi insieme
<ToolGrid tools={allTools} /> // 15+ tools
```

### Education Memory
```tsx
// ✅ CORRETTO - Personalizzazione basata su comportamento
const { isToolUnlocked, getPersonalizedMessage } = useEducationMemory('emergency')

if (!isToolUnlocked('risk-calculator')) {
  return <EducationalGate message="Leggi prima gli Errori da evitare" />
}

// ❌ SBAGLIATO - Stesso messaggio per tutti
<div>Leggi la documentazione prima di procedere</div>
```

### Graceful Degradation
```tsx
// ✅ CORRETTO - Sempre qualcosa da mostrare
<FeatureGate feature="advancedTool" fallback={<ToolPreview />}>
  <AdvancedTool />
</FeatureGate>

// ❌ SBAGLIATO - Buchi nell'interfaccia
{isFeatureEnabled && <AdvancedTool />}
```

### Time Awareness
```tsx
// ✅ CORRETTO - Aspettative temporali chiare
<Button>
  Calcola Rischio
  <span className="text-xs opacity-70">(~2 min)</span>
</Button>

// ❌ SBAGLIATO - Nessuna indicazione temporale
<Button>Calcola Rischio</Button>
```

### Trust Anchors
```tsx
// ✅ CORRETTO - Trust indicators discreti
<div className="flex items-center gap-2 text-xs text-muted-foreground">
  <ShieldIcon className="w-3 h-3" />
  <span>Educational Only</span>
</div>

// ❌ SBAGLIATO - Trust indicators invasivi
<Modal title="DISCLAIMER LEGALE">...</Modal>
```

---

## 🚫 ULTRA-ANTI-PATTERNS

### Cognitive Overload
- ❌ **Più di 3 CTA** nella stessa schermata
- ❌ **Tool complessi** senza progressive disclosure
- ❌ **Decisioni multiple** senza prioritizzazione
- ❌ **Informazioni dense** senza chunking

### Misclick Vulnerabilities
- ❌ **Touch target < 44px** su mobile
- ❌ **Azioni critiche** senza delay/confirmation
- ❌ **Double-tap** non gestito
- ❌ **Accidental swipe** su elementi critici

### Trust Erosion
- ❌ **Dead ends** senza next step
- ❌ **Errori brutali** senza spiegazione
- ❌ **Loading infinito** senza feedback
- ❌ **Promesse non mantenute** (coming soon eterno)

### Fatigue Amplifiers
- ❌ **Troppi stimoli** dopo uso prolungato
- ❌ **Colori saturi** in sessioni lunghe
- ❌ **Animazioni eccessive** quando l'utente è stanco
- ❌ **Decisioni forzate** senza pause

---

## 🎓 TEAM GUIDELINES

### For Developers
1. **Always use TypeScript** - No any types
2. **Component-first thinking** - Reusable, composable
3. **Accessibility by default** - Not an afterthought
4. **Performance conscious** - Measure, don't guess

### For Designers
1. **Mobile-first design** - Desktop is enhancement
2. **Educational mindset** - Every interaction teaches
3. **Risk-first communication** - Honesty over conversion
4. **Inclusive design** - Accessibility from start

### For Product
1. **User safety first** - No dark patterns
2. **Educational value** - Every feature teaches something
3. **Scalable architecture** - Think 10x growth
4. **Privacy by design** - Minimal data collection

---

*Tradelia Design Guidelines 2026*  
*Version: 1.0*  
*Last Updated: Gennaio 2026*  
*Status: ACTIVE*