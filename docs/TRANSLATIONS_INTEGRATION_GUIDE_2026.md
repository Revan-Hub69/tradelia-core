# Translations Integration Guide - Challenge Components 2026

**Date**: 2026-01-26  
**Status**: ✅ READY TO IMPLEMENT  
**System**: next-intl (namespace-based)

---

## 🎯 SISTEMA TRADUZIONI TRADELIA

### Struttura

Tradelia usa **next-intl** con namespace separati in `messages/`:

```
messages/
├── en/
│   ├── challenges.json  ✅ GIÀ AGGIORNATO (100+ keys)
│   ├── dashboard.json
│   └── common.json
└── it/
    ├── challenges.json  ✅ GIÀ AGGIORNATO (100+ keys)
    ├── dashboard.json
    └── common.json
```

### Come Funziona

```tsx
// Nel component
const t = useTranslations('challenges'); // Carica messages/[locale]/challenges.json

// Uso
t('availability.alwaysOpen') // → "Always Open" (EN) / "Sempre Aperto" (IT)
```

**✅ BUONA NOTIZIA**: Le traduzioni sono già nei file corretti! Non serve merge.

---

## ✅ TRADUZIONI GIÀ PRONTE

### File Aggiornati
- ✅ `messages/en/challenges.json` (100+ chiavi)
- ✅ `messages/it/challenges.json` (100+ chiavi)

### Namespace: `challenges`

**Sezioni disponibili**:
- `availability` - Always Open, Next, Deadline
- `competition` - Target-Based, Ranking, vs Traders
- `accountType` - Paper, Demo, Live, Hybrid
- `permissions` - EA, News, Weekend
- `tabs` - 7 tab names
- `sections` - Section titles
- `metrics` - KPI labels
- `pricing` - Pricing table
- `rules` - Rules details
- `payout` - Payout details
- `markets` - Markets & leverage
- `trust` - Data quality
- `actions` - Buttons
- `badges` - Badges

---

## 🔧 IMPLEMENTAZIONE

### Step 1: Importare useTranslations

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ProgramCard({ ... }: ProgramCardProps) {
  const t = useTranslations('challenges');
  
  // Ora puoi usare t() per tutte le traduzioni
}
```

### Step 2: Sostituire Hardcoded Strings

**Esempi ProgramCard**:

```tsx
// ❌ BEFORE
<span>Always Open</span>

// ✅ AFTER
<span>{t('availability.alwaysOpen')}</span>

// ❌ BEFORE
<span>vs {maxParticipants} Traders</span>

// ✅ AFTER
<span>{t('competition.vsTraders', { count: maxParticipants })}</span>

// ❌ BEFORE
<span>EA Allowed</span>

// ✅ AFTER
<span>{t('permissions.eaAllowed')}</span>
```

**Esempi ProgramDrawer**:

```tsx
// ❌ BEFORE
<TabsTrigger value="overview">Overview</TabsTrigger>

// ✅ AFTER
<TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>

// ❌ BEFORE
<h3>Trading Permissions</h3>

// ✅ AFTER
<h3>{t('sections.tradingPermissions')}</h3>
```

---

## 📋 CHECKLIST COMPLETA

### ProgramCard.tsx (16 sostituzioni)
- [ ] Import `useTranslations`
- [ ] Add `const t = useTranslations('challenges')`
- [ ] "Always Open" → `t('availability.alwaysOpen')`
- [ ] "Next:" → `t('availability.next')`
- [ ] "Target-Based" → `t('competition.targetBased')`
- [ ] "vs X Traders" → `t('competition.vsTraders', { count })`
- [ ] "Paper Trading" → `t('accountType.paper')`
- [ ] "Live Account" → `t('accountType.live')`
- [ ] "EA Allowed" → `t('permissions.eaAllowed')`
- [ ] "No EA" → `t('permissions.noEa')`
- [ ] "News OK" → `t('permissions.newsOk')`
- [ ] "No News" → `t('permissions.noNews')`
- [ ] "Weekend OK" → `t('permissions.weekendOk')`
- [ ] "No Weekend" → `t('permissions.noWeekend')`
- [ ] "Compare" → `t('actions.compare')`
- [ ] "Details" → `t('actions.details')`

### ProgramDrawer.tsx (~50 sostituzioni)
- [ ] Import `useTranslations`
- [ ] Add `const t = useTranslations('challenges')`
- [ ] 7 tab names
- [ ] ~10 section titles
- [ ] ~15 metric labels
- [ ] ~5 action buttons
- [ ] ~5 badge labels
- [ ] Various other strings

---

## ⚠️ ERRORI COMUNI DA EVITARE

### 1. Namespace Sbagliato
```tsx
// ❌ WRONG
const t = useTranslations('Dashboard'); // Wrong namespace!

// ✅ CORRECT
const t = useTranslations('challenges');
```

### 2. Key Path Sbagliato
```tsx
// ❌ WRONG
t('alwaysOpen') // Missing parent key

// ✅ CORRECT
t('availability.alwaysOpen')
```

### 3. Parametri Mancanti
```tsx
// ❌ WRONG
t('competition.vsTraders') // Missing {count}

// ✅ CORRECT
t('competition.vsTraders', { count: maxParticipants })
```

### 4. Client Component Required
```tsx
// ❌ WRONG (Server Component)
export function ProgramCard() {
  const t = useTranslations('challenges'); // Error!
}

// ✅ CORRECT (Client Component)
'use client';

export function ProgramCard() {
  const t = useTranslations('challenges'); // OK!
}
```

---

## 🧪 TESTING

### Validazione Traduzioni

```bash
# Verifica che tutte le keys esistano
npm run i18n:validate
```

Questo script:
- ✅ Verifica che tutte le keys esistano in EN e IT
- ✅ Valida sintassi ICU (parametri)
- ✅ Trova keys non tradotte
- ✅ Trova errori di formato

### Test Manuale

1. **Test EN** (default):
   - Avvia app: `npm run dev`
   - Verifica tutti i testi in inglese

2. **Test IT** (switch language):
   - Switch to Italian in UI
   - Verifica tutti i testi in italiano

3. **Test Parametri**:
   - Verifica `{count}` in "vs X Traders"
   - Verifica `{percent}` in consistency rule

---

## 📝 ESEMPIO COMPLETO

### Prima (Hardcoded)
```tsx
'use client';

export function ProgramCard({ program, offers }: Props) {
  const isRanking = program.ruleset_mode === 'ranking_based';
  const maxParticipants = offers[0]?.max_participants;
  
  return (
    <div>
      <span>Always Open</span>
      {isRanking ? (
        <span>vs {maxParticipants} Traders</span>
      ) : (
        <span>Target-Based</span>
      )}
      <span>EA Allowed</span>
      <button>Details</button>
    </div>
  );
}
```

### Dopo (Tradotto)
```tsx
'use client';

import { useTranslations } from 'next-intl';

export function ProgramCard({ program, offers }: Props) {
  const t = useTranslations('challenges');
  const isRanking = program.ruleset_mode === 'ranking_based';
  const maxParticipants = offers[0]?.max_participants;
  
  return (
    <div>
      <span>{t('availability.alwaysOpen')}</span>
      {isRanking ? (
        <span>{t('competition.vsTraders', { count: maxParticipants })}</span>
      ) : (
        <span>{t('competition.targetBased')}</span>
      )}
      <span>{t('permissions.eaAllowed')}</span>
      <button>{t('actions.details')}</button>
    </div>
  );
}
```

---

## ✅ SUCCESS CRITERIA

- [ ] Nessun hardcoded string nei components
- [ ] `npm run i18n:validate` passa senza errori
- [ ] Switch EN/IT funziona correttamente
- [ ] Parametri dinamici funzionano ({count}, {percent})
- [ ] No console errors per missing keys
- [ ] Mobile responsive mantiene traduzioni
- [ ] Dark mode mantiene traduzioni

---

## 🎯 PROSSIMI PASSI

1. **Integrare ProgramCard** (15-20 min)
2. **Integrare ProgramDrawer** (30-40 min)
3. **Run validation** (`npm run i18n:validate`)
4. **Test EN + IT** (10 min)
5. **Fix eventuali issues** (10 min)

**Total ETA**: ~1.5 ore

---

**Status**: Traduzioni pronte, guida completa ✅  
**Next**: Implementare useTranslations nei components  
**System**: next-intl namespace-based (no merge needed)

---

**Prepared by**: Kiro AI  
**Guide Type**: Translations Integration  
**Date**: 2026-01-26
