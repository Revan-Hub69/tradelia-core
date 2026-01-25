# REACT ANTI-PATTERNS - FIX IMPLEMENTATION PLAN 2026

**Data**: 25 Gennaio 2026  
**Status**: 🚀 In Progress  
**Priority**: P1 - CRITICAL

---

## PHASE 1: UNSTABLE DEFAULT PROPS (15 min)

### Files to Fix:
1. `src/components/learning/TradeliaCoinDisplay.tsx` (2 instances)
2. `src/components/learning/CryptoLesson0Clean.tsx` (1 instance)

### Pattern:
```tsx
// ❌ BAD: Array literal as default prop
const Component = ({ items = [] }) => { ... }

// ✅ GOOD: Constant reference
const DEFAULT_ITEMS = [];
const Component = ({ items = DEFAULT_ITEMS }) => { ... }
```

---

## PHASE 2: ARRAY INDEX AS KEY (1-2 hours)

### Strategy:
1. **Static Lists** (OK to keep index): Skeleton loaders, fixed UI elements
2. **Dynamic Lists** (MUST fix): User data, API responses, reorderable items

### Files Priority:
- **HIGH**: `TradeliaCoinDisplay.tsx`, `CryptoLesson0*.tsx` (user data)
- **MEDIUM**: `ContextMenu.tsx`, `password-strength.tsx` (suggestions)
- **LOW**: `skeleton.tsx`, `MotionSystemExample.tsx` (static UI)

### Pattern:
```tsx
// ❌ BAD: Index as key
items.map((item, index) => <div key={index}>{item}</div>)

// ✅ GOOD: Unique ID as key
items.map((item, idx) => <div key={`${item.id}-${idx}`}>{item}</div>)
// OR add stable IDs to data
```

---

## PHASE 3: TYPESCRIPT ISSUES (30 min)

### 1. Verify Strict Mode (5 min)
- Check `tsconfig.json` for `strict: true`

### 2. Fix @ts-ignore → @ts-expect-error (5 min)
- File: `src/hooks/useMemoryLeakDetection.ts`

### 3. Fix Function Type (10 min)
- File: `src/libs/api/errorHandler.ts`

### 4. Fix interface → type (10 min)
- File: `src/types/browser.d.ts` (3 interfaces)

---

## EXECUTION ORDER

1. ✅ Unstable Default Props (quick win)
2. ⏳ Array Index Keys (high-impact files first)
3. ⏳ TypeScript Issues (final cleanup)

**Estimated Total Time**: 2-3 hours

