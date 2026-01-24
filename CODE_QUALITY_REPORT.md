# CODE QUALITY REPORT - TRADELIA 2026

**Data**: 25 Gennaio 2026  
**Status**: 🔴 CRITICAL - 286 problemi trovati  
**Priorità**: P0 - Blocca qualità del codice

---

## 📊 SUMMARY

```
Total Problems: 286
├── Errors:   168 (CRITICAL)
└── Warnings: 118 (IMPORTANT)

Auto-fixable: 24 errors
```

---

## 🔴 CRITICAL ERRORS (168)

### 1. **Duplicate Keys in Translations** (CRITICAL - 48 errors)
**Impact**: Runtime errors, broken translations

**Files**:
- `src/locales/en.json`: 28 duplicate keys
- `src/locales/it.json`: 20 duplicate keys

**Examples**:
```json
// en.json
"notifications_aria_label": "...",  // Line 227
"notifications_aria_label": "...",  // DUPLICATE!

"Learning": "...",  // Line 895
"Learning": "...",  // DUPLICATE!
```

**Fix**: Remove duplicates, keep only one definition per key

---

### 2. **Console Statements** (CRITICAL - 50+ errors)
**Impact**: Production logs pollution, security risk

**Files** (top offenders):
- `src/components/ui/MobileDropdownPopover.tsx`: 8 console statements
- `src/app/auth/callback/route.ts`: 3 console statements
- `src/components/dashboard/LanguageSwitcherDashboard.tsx`: 2 console statements
- `src/hooks/useSettings.ts`: 3 console statements
- `src/lib/telemetry/events.ts`: 3 console statements

**Fix**: Replace with proper logging system or remove

---

### 3. **Accessibility Violations** (CRITICAL - 20+ errors)
**Impact**: WCAG non-compliance, legal risk, bad UX

**Issues**:
- Missing `type` attribute on buttons (50+ warnings)
- Labels not associated with controls (4 errors)
- Click handlers without keyboard listeners (4 errors)
- AutoFocus usage (1 error)
- Mouse events without keyboard events (2 errors)

**Examples**:
```tsx
// BAD
<button onClick={...}>Click</button>

// GOOD
<button type="button" onClick={...}>Click</button>
```

---

### 4. **TypeScript Issues** (CRITICAL - 15+ errors)
**Impact**: Type safety compromised

**Issues**:
- `no-use-before-define`: Variables used before definition (10+ errors)
- `no-unsafe-function-type`: Using `Function` type (1 error)
- `consistent-type-definitions`: Using `interface` instead of `type` (3 errors)
- `ban-ts-comment`: Using `@ts-ignore` instead of `@ts-expect-error` (1 error)

---

### 5. **React Anti-Patterns** (CRITICAL - 30+ errors)
**Impact**: Performance issues, infinite loops

**Issues**:
- `no-unstable-default-props`: Array/object as default props (3 errors)
- `no-unstable-context-value`: Object constructed in render (1 error)
- `no-array-index-key`: Using index as key (40+ warnings)
- `no-nested-components`: Components defined inside components (3 warnings)

**Examples**:
```tsx
// BAD
const Component = ({ items = [] }) => { // Infinite loop risk!
  return items.map((item, index) => <div key={index}>{item}</div>);
};

// GOOD
const DEFAULT_ITEMS = [];
const Component = ({ items = DEFAULT_ITEMS }) => {
  return items.map(item => <div key={item.id}>{item}</div>);
};
```

---

### 6. **Style Issues** (MEDIUM - 10+ errors)
**Impact**: Code consistency

**Issues**:
- `multiline-ternary`: Ternary not split on multiple lines (4 errors)
- `no-trailing-spaces`: Trailing spaces (2 errors)
- `no-empty-pattern`: Empty object pattern (1 error)

---

## 🟡 WARNINGS (118)

### 1. **Missing Button Types** (50+ warnings)
```tsx
// Add type="button" to all buttons
<button type="button" onClick={...}>
```

### 2. **Array Index as Key** (40+ warnings)
```tsx
// Use unique ID instead of index
items.map(item => <div key={item.id}>{item}</div>)
```

### 3. **Custom Tailwind Classes** (10+ warnings)
```tsx
// These classes are not in Tailwind config
className="header-premium-icon"  // Use Tailwind classes
className="z-60"  // Use z-50 or add to config
```

### 4. **React Hooks Dependencies** (5+ warnings)
```tsx
// Missing dependencies in useEffect
useEffect(() => {
  doSomething(store);
}, []); // Add 'store' to deps
```

---

## 🎯 PRIORITIZED FIX PLAN

### P0 - BLOCKERS (Fix NOW)
1. **Duplicate Translation Keys** (48 errors)
   - Breaks i18n system
   - Fix: Remove duplicates in `en.json` and `it.json`

2. **Console Statements in Production** (50+ errors)
   - Security risk, performance impact
   - Fix: Remove or replace with logger

3. **Accessibility Violations** (20+ errors)
   - Legal risk (WCAG compliance)
   - Fix: Add button types, labels, keyboard handlers

### P1 - CRITICAL (Fix ASAP)
4. **React Anti-Patterns** (30+ errors)
   - Performance issues, infinite loops
   - Fix: Extract default props, use proper keys

5. **TypeScript Issues** (15+ errors)
   - Type safety compromised
   - Fix: Reorder definitions, fix types

### P2 - IMPORTANT (Fix Soon)
6. **Array Index as Key** (40+ warnings)
   - Performance issues
   - Fix: Use unique IDs

7. **Missing Button Types** (50+ warnings)
   - HTML validation
   - Fix: Add `type="button"`

---

## 🚀 AUTO-FIX AVAILABLE

**24 errors can be auto-fixed**:
```bash
npm run lint -- --fix
```

This will fix:
- Trailing spaces
- Multiline ternary formatting
- Some style issues

---

## 📋 DETAILED BREAKDOWN BY CATEGORY

### Errors by Type
```
Console Statements:        50 errors
Duplicate Keys:            48 errors
Accessibility:             20 errors
TypeScript:                15 errors
React Anti-Patterns:       30 errors
Style Issues:               5 errors
```

### Warnings by Type
```
Missing Button Types:      50 warnings
Array Index as Key:        40 warnings
Custom Tailwind Classes:   10 warnings
React Hooks Deps:           5 warnings
Fast Refresh:              10 warnings
Other:                      3 warnings
```

---

## 🔧 RECOMMENDED ACTIONS

### Immediate (Today)
1. Run auto-fix: `npm run lint -- --fix`
2. Fix duplicate translation keys (manual)
3. Remove console statements (manual or script)

### Short-term (This Week)
4. Add button types (can be automated)
5. Fix accessibility violations
6. Fix React anti-patterns

### Medium-term (Next Week)
7. Replace array index keys with unique IDs
8. Fix TypeScript issues
9. Clean up custom Tailwind classes

---

## 📊 FILES WITH MOST ISSUES

### Top 10 Offenders
1. `src/locales/en.json`: 28 errors (duplicate keys)
2. `src/locales/it.json`: 20 errors (duplicate keys)
3. `src/components/ui/__tests__/ContextMenu.test.tsx`: 35 warnings
4. `src/components/ui/MobileDropdownPopover.tsx`: 10 errors
5. `src/components/dashboard/DashboardHeader.tsx`: 8 errors
6. `src/components/learning/CryptoLesson0.tsx`: 7 errors
7. `src/components/learning/TradeliaCoinDisplay.tsx`: 6 errors
8. `src/components/dashboard/DashboardSkeleton.tsx`: 5 errors
9. `src/app/[locale]/(auth)/(center)/auth/page.tsx`: 6 errors
10. `src/hooks/useMemoryLeakDetection.ts`: 4 errors

---

## 💡 NEXT STEPS

1. **Run auto-fix** (5 min)
   ```bash
   npm run lint -- --fix
   ```

2. **Fix duplicate keys** (10 min)
   - Open `src/locales/en.json` and `src/locales/it.json`
   - Remove duplicate keys
   - Verify with `npm run i18n:validate`

3. **Remove console statements** (15 min)
   - Create script to find/replace
   - Or manual cleanup

4. **Add button types** (10 min)
   - Can be automated with codemod

5. **Fix accessibility** (30 min)
   - Add labels, keyboard handlers
   - Test with screen reader

**Total Time**: ~1-2 hours for P0 fixes

---

## 🎯 SUCCESS CRITERIA

- [ ] Zero duplicate translation keys
- [ ] Zero console statements in production code
- [ ] All buttons have `type` attribute
- [ ] All form labels associated with controls
- [ ] All click handlers have keyboard equivalents
- [ ] Zero React anti-patterns (unstable props)
- [ ] ESLint passes with 0 errors

---

**Status**: Ready for fixes. Start with auto-fix, then tackle P0 issues.
