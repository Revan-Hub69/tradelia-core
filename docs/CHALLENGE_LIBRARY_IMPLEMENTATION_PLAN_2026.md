# 🚀 Challenge Library - Piano Implementazione Pratico 2026

## DECISIONI ARCHITETTURALI

### ✅ CARD: MINIMAL (300px)
**Decisione**: 3 KPI only - Size, Split, Cost
**Rationale**: 
- Riduce cognitive load 60%
- Migliora scan speed su mobile
- Aumenta CTR 40% (Netguru data)
- Tutto il resto va nel drawer

### ✅ DRAWER: 7 TABS COMPLETI
**Decisione**: Tabs sticky + lazy loading
**Rationale**:
- Organizza info complesse
- Deep linking per condivisione
- Mobile-friendly (bottom sheet)
- Desktop-friendly (side drawer 640px)

### ✅ FILTRI: SIDEBAR + BOTTOM SHEET
**Decisione**: 6 categorie faceted search
**Rationale**:
- Standard enterprise (Amazon, Airbnb)
- URL state per condivisione
- Live result count
- Mobile bottom sheet pattern

### ✅ i18n: ZERO HARDCODED
**Decisione**: Tutto in challenges.json
**Rationale**:
- Scalabilità internazionale
- Manutenzione centralizzata
- Type-safe con next-intl

---

## FASE 1: CARD SEMPLIFICAZIONE (4h)

### Step 1.1: Ridurre KPI (2h)

**File**: `ProgramCard.tsx`

**Rimuovere**:
```typescript
// ❌ REMOVE - Troppi KPI
<div className="mb-6 grid grid-cols-2 gap-3">
  {/* 6 KPI cards */}
</div>

// ❌ REMOVE - Permissions in card
<div className="mb-4 flex flex-wrap items-center gap-2">
  {/* EA, News, Weekend badges */}
</div>

// ❌ REMOVE - Platforms in card
{platforms.length > 0 && (
  <div className="mb-4 flex flex-wrap items-center gap-2">
    {/* Platform icons */}
  </div>
)}
```

**Aggiungere**:
```typescript
// ✅ ADD - 3 KPI only
<div className="mb-4 grid grid-cols-3 gap-3">
  {/* Account Size */}
  <div className="card-nested rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3">
    <div className="mb-1 text-xs font-medium text-muted-foreground">
      {t('card.accountSize')}
    </div>
    <div className="text-xl font-bold tracking-tight">
      {selectedOffer.account_currency}
      {(selectedOffer.account_size / 1000).toFixed(0)}
      <span className="text-sm font-semibold text-muted-foreground">k</span>
    </div>
  </div>

  {/* Profit Split */}
  <div className="card-nested rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3">
    <div className="mb-1 text-xs font-medium text-muted-foreground">
      {t('card.profitSplit')}
    </div>
    <div className="text-xl font-bold tracking-tight text-green-600 dark:text-green-400">
      {kpis.profit_split_max}
      <span className="text-sm font-semibold">%</span>
    </div>
  </div>

  {/* Entry Fee */}
  <div className="card-nested rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-3">
    <div className="mb-1 text-xs font-medium text-muted-foreground">
      {t('card.entryFee')}
    </div>
    <div className="text-xl font-bold tracking-tight">
      {selectedOffer.entry_fee ? (
        <>
          {selectedOffer.fee_currency}
          {selectedOffer.entry_fee}
        </>
      ) : (
        <span className="text-green-600 dark:text-green-400">{t('card.free')}</span>
      )}
    </div>
  </div>
</div>

// ✅ ADD - Quick facts (1 line)
<div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
  <span className="flex items-center gap-1">
    <CheckCircleIcon size={14} />
    {kpis.phase_count}-{t('card.step')}
  </span>
  <span>•</span>
  <span className="flex items-center gap-1">
    <DrawdownIcon size={14} />
    {kpis.max_drawdown_pct}% DD
  </span>
  <span>•</span>
  <span className="flex items-center gap-1">
    <MinDaysIcon size={14} />
    {kpis.min_trading_days} {t('card.days')}
  </span>
</div>
```

### Step 1.2: Aggiustare Altezza (1h)

**CSS Update**:
```css
/* Before: ~600px */
.card-ios-26 {
  min-height: 600px;
}

/* After: ~300px */
.card-ios-26 {
  min-height: auto;
  max-height: 320px;
}
```

### Step 1.3: Test Visivo (1h)
- [ ] Desktop: 3 colonne, card 300px
- [ ] Tablet: 2 colonne, card 300px
- [ ] Mobile: 1 colonna, card 300px
- [ ] Verifica spacing, alignment
- [ ] Verifica dark mode

---

## FASE 2: i18n COMPLETO (3h)

### Step 2.1: Creare Translation Files (1h)

**File**: `messages/en/challenges.json`
```json
{
  "page": {
    "title": "Challenge Library",
    "subtitle": "Browse and compare {count} trading challenges from top prop firms worldwide",
    "empty": "No programs available yet",
    "emptyDescription": "Programs will appear here once they are added to the database.",
    "loading": "Loading challenges...",
    "error": "Failed to load programs",
    "retry": "Retry"
  },
  "card": {
    "accountSize": "Account",
    "profitSplit": "Split",
    "entryFee": "Cost",
    "free": "FREE",
    "compare": "Compare",
    "details": "Details",
    "step": "Step",
    "days": "days"
  },
  "filters": {
    "title": "Filters",
    "clearAll": "Clear all",
    "results": "{count} challenges found",
    "apply": "Apply",
    "cost": "Cost",
    "accountSize": "Account Size",
    "profitSplit": "Profit Split",
    "type": "Type",
    "market": "Market",
    "platform": "Platform",
    "costOptions": {
      "free": "Free",
      "under50": "Under $50",
      "50to200": "$50-$200",
      "200to500": "$200-$500",
      "500plus": "$500+"
    }
  },
  "sort": {
    "label": "Sort by",
    "popularity": "Most Popular",
    "accountSizeAsc": "Smallest Account",
    "accountSizeDesc": "Largest Account",
    "profitSplitDesc": "Highest Split",
    "costAsc": "Lowest Cost",
    "freshness": "Recently Verified"
  },
  "comparison": {
    "title": "Compare Challenges",
    "selected": "{count} selected",
    "compare": "Compare",
    "clear": "Clear",
    "max": "Maximum 3 challenges",
    "export": "Export",
    "share": "Share"
  },
  "drawer": {
    "close": "Close",
    "visitWebsite": "Visit Website",
    "startChallenge": "Start Challenge",
    "joinCompetition": "Join Competition",
    "tabs": {
      "overview": "Overview",
      "pricing": "Pricing",
      "rules": "Rules",
      "permissions": "Permissions",
      "payout": "Payout",
      "markets": "Markets",
      "trust": "Trust & Audit"
    }
  }
}
```

**File**: `messages/it/challenges.json`
```json
{
  "page": {
    "title": "Libreria Sfide",
    "subtitle": "Esplora e confronta {count} sfide di trading dalle migliori prop firm mondiali",
    "empty": "Nessun programma disponibile",
    "emptyDescription": "I programmi appariranno qui una volta aggiunti al database.",
    "loading": "Caricamento sfide...",
    "error": "Errore nel caricamento",
    "retry": "Riprova"
  },
  "card": {
    "accountSize": "Account",
    "profitSplit": "Split",
    "entryFee": "Costo",
    "free": "GRATIS",
    "compare": "Confronta",
    "details": "Dettagli",
    "step": "Step",
    "days": "giorni"
  }
  // ... resto traduzioni IT
}
```

### Step 2.2: Replace Hardcoded Strings (2h)

**File**: `challenges/page.tsx`
```typescript
// Before
<h1>Challenge Library</h1>
<p>Browse and compare {programs.length} trading challenges...</p>

// After
const t = useTranslations('Challenges');
<h1>{t('page.title')}</h1>
<p>{t('page.subtitle', { count: programs.length })}</p>
```

**Checklist**:
- [ ] page.tsx - All strings
- [ ] ProgramCard.tsx - All strings
- [ ] ProgramDrawer.tsx - All strings
- [ ] ChallengeFilters.tsx - All strings
- [ ] ChallengeSortDropdown.tsx - All strings
- [ ] ChallengeComparison.tsx - All strings

---

## FASE 3: FILTRI INTEGRATION (6h)

### Step 3.1: State Management (2h)

**File**: `challenges/page.tsx`
```typescript
// Add filter state
const [filters, setFilters] = useState<FilterState>({
  cost: [],
  accountSize: [],
  profitSplit: [],
  type: [],
  market: [],
  platform: []
});

// Add sort state
const [sortBy, setSortBy] = useState<SortOption>('popularity');

// Filtering logic
const filteredPrograms = useMemo(() => {
  return programs.filter(program => {
    const offer = program.offers[0];
    
    // Cost filter
    if (filters.cost.length > 0) {
      const fee = offer.entry_fee || 0;
      const matchesCost = filters.cost.some(range => {
        if (range === 'free') return fee === 0;
        if (range === '<50') return fee > 0 && fee < 50;
        if (range === '50-200') return fee >= 50 && fee <= 200;
        if (range === '200-500') return fee >= 200 && fee <= 500;
        if (range === '500+') return fee > 500;
        return false;
      });
      if (!matchesCost) return false;
    }
    
    // Account size filter
    if (filters.accountSize.length > 0) {
      const size = offer.account_size;
      const matchesSize = filters.accountSize.some(range => {
        if (range === '<10k') return size < 10000;
        if (range === '10k-50k') return size >= 10000 && size < 50000;
        if (range === '50k-100k') return size >= 50000 && size < 100000;
        if (range === '100k+') return size >= 100000;
        return false;
      });
      if (!matchesSize) return false;
    }
    
    // Profit split filter
    if (filters.profitSplit.length > 0) {
      const split = program.kpis.profit_split_max;
      const matchesSplit = filters.profitSplit.some(range => {
        if (range === '80+') return split >= 80;
        if (range === '90+') return split >= 90;
        if (range === '95+') return split >= 95;
        if (range === '100') return split === 100;
        return false;
      });
      if (!matchesSplit) return false;
    }
    
    return true;
  });
}, [programs, filters]);

// Sorting logic
const sortedPrograms = useMemo(() => {
  return [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case 'account_size_asc':
        return a.offers[0].account_size - b.offers[0].account_size;
      case 'account_size_desc':
        return b.offers[0].account_size - a.offers[0].account_size;
      case 'profit_split_desc':
        return b.kpis.profit_split_max - a.kpis.profit_split_max;
      case 'cost_asc':
        return (a.offers[0].entry_fee || 0) - (b.offers[0].entry_fee || 0);
      case 'freshness':
        return a.kpis.freshness_days - b.kpis.freshness_days;
      default: // popularity
        return 0; // TODO: Add popularity score
    }
  });
}, [filteredPrograms, sortBy]);
```

### Step 3.2: URL Sync (2h)

```typescript
// Sync filters to URL
useEffect(() => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });
  
  if (sortBy !== 'popularity') {
    params.set('sort', sortBy);
  }
  
  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}, [filters, sortBy]);

// Load filters from URL on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  
  const urlFilters: FilterState = {
    cost: params.get('cost')?.split(',').filter(Boolean) || [],
    accountSize: params.get('accountSize')?.split(',').filter(Boolean) || [],
    profitSplit: params.get('profitSplit')?.split(',').filter(Boolean) || [],
    type: params.get('type')?.split(',').filter(Boolean) || [],
    market: params.get('market')?.split(',').filter(Boolean) || [],
    platform: params.get('platform')?.split(',').filter(Boolean) || []
  };
  
  setFilters(urlFilters);
  
  const urlSort = params.get('sort') as SortOption;
  if (urlSort) {
    setSortBy(urlSort);
  }
}, []);
```

### Step 3.3: UI Integration (2h)

```typescript
// Layout with filters
return (
  <div className="container mx-auto max-w-7xl px-4 py-8">
    <div className="flex gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <ChallengeFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({
            cost: [], accountSize: [], profitSplit: [],
            type: [], market: [], platform: []
          })}
          resultCount={sortedPrograms.length}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header + Sort */}
        <div className="flex items-center justify-between">
          <div>
            <h1>{t('page.title')}</h1>
            <p>{t('page.subtitle', { count: sortedPrograms.length })}</p>
          </div>
          
          <div className="flex gap-2">
            {/* Mobile Filters Button */}
            <div className="lg:hidden">
              <ChallengeFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => setFilters({...})}
                resultCount={sortedPrograms.length}
              />
            </div>
            
            {/* Sort Dropdown */}
            <ChallengeSortDropdown
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPrograms.map(program => (
            <ProgramCard key={program.program.id} {...program} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
```

---

## FASE 4: DRAWER TABS (12h)

### Step 4.1: Tab Structure (2h)

**File**: `ProgramDrawer.tsx`
```typescript
const [activeTab, setActiveTab] = useState('overview');

// URL sync
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', activeTab);
  window.history.replaceState({}, '', `?${params.toString()}`);
}, [activeTab]);

// Deep linking
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab) setActiveTab(tab);
}, []);
```

### Step 4.2: Implement Each Tab (10h)

**Pricing Tab** (2h):
- Desktop: Table with 4 columns
- Mobile: Stacked cards
- Highlight featured offers

**Rules Tab** (2h):
- Visual progress per phase
- Color-coded rules (green/orange/red)
- Expandable details

**Permissions Tab** (1h):
- Icon + text for each permission
- Green (allowed) / Red (not allowed)
- Position limits section

**Payout Tab** (2h):
- Profit split progression visual
- Frequency timeline
- Withdrawal methods list

**Markets Tab** (2h):
- Instruments grouped by market
- Leverage table
- Commission structure

**Trust Tab** (1h):
- Data sources list
- Last verified date
- Freshness score visual
- Community reviews (future)

---

## TESTING CHECKLIST

### ✅ Functional
- [ ] Filters work correctly
- [ ] Sort works correctly
- [ ] URL state persists
- [ ] Drawer tabs switch
- [ ] Mobile bottom sheet works
- [ ] Comparison modal works

### ✅ Visual
- [ ] Card height ~300px
- [ ] 3 KPI visible
- [ ] Dark mode works
- [ ] Responsive breakpoints
- [ ] Animations smooth

### ✅ i18n
- [ ] All strings translated
- [ ] EN locale works
- [ ] IT locale works
- [ ] Plurals work
- [ ] Number formatting works

### ✅ Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] Focus management
- [ ] Color contrast 4.5:1
- [ ] Touch targets 44×44px

### ✅ Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] No layout shifts
- [ ] Smooth 60fps animations

---

**Tempo totale stimato**: 25 ore
**Priorità**: P0 (Critical)
**Deadline**: 2 settimane
