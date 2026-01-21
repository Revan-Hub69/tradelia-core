# Barrel File Elimination Plan - 2026 Best Practices

**Goal:** Achieve 75% faster builds by removing barrel files (Atlassian case study)

**Current Status:** ✅ Step 1 completed (wildcard exports removed)

---

## 📊 Research Evidence (Tier-1 Sources)

### Atlassian Case Study
- **Result:** 75% faster builds
- **Method:** Removed all barrel files, converted to direct imports
- **Scale:** 100,000+ files, 1000+ developers
- **Source:** https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files

### Key Findings
1. **Barrel files cause:**
   - TypeScript to process ALL exports even if you import one
   - Jest to transform unnecessary modules
   - Dependency graph bloat
   - Cascading barrel chains (barrel → barrel → barrel)

2. **Direct imports provide:**
   - Faster TypeScript highlighting
   - Better tree-shaking
   - Clearer dependencies
   - Improved test selection

---

## 🎯 3-Phase Migration Strategy

### Phase 1: Stop the Bleeding ✅ DONE
**Status:** Completed
**What:** Remove wildcard `export *` from root barrel
**Result:** Explicit exports only in `src/components/index.ts`
**Impact:** Prevents cascading barrel chains

### Phase 2: Automated Codemod (Recommended)
**Status:** TODO
**What:** Use jscodeshift to automatically convert imports
**Tool:** Custom codemod based on https://mmazzarolo.com/blog/2024-11-10-removing-barrel-file-references-with-a-codemod/

**Steps:**
1. Install jscodeshift: `npm install -g jscodeshift`
2. Create codemod script: `scripts/transform-barrel-imports.ts`
3. Configure barrel files to eliminate:
   ```ts
   const BARREL_IMPORTS = [
     'src/components',
     'src/components/ui',
     'src/components/dashboard',
     'src/components/navigation',
   ];
   ```
4. Run codemod (dry-run first):
   ```bash
   npx jscodeshift -t ./scripts/transform-barrel-imports.ts \
     --parser=tsx \
     --dry \
     ./src > transform-log.txt
   ```
5. Review changes in `transform-log.txt`
6. Run actual transformation:
   ```bash
   npx jscodeshift -t ./scripts/transform-barrel-imports.ts \
     --parser=tsx \
     ./src
   ```

**Expected Changes:**
```ts
// Before
import { Button, Card } from '@/components';

// After
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### Phase 3: Cleanup & Verification
**Status:** TODO
**What:** Remove unused barrel files and verify build performance

**Steps:**
1. Run build: `npm run build` (measure time)
2. Run tests: `npm test` (measure time)
3. Delete unused barrel files:
   - `src/components/index.ts` (if no longer referenced)
   - Sub-barrel files in `ui/`, `dashboard/`, etc.
4. Verify no broken imports: `npm run check-types`
5. Measure performance improvement
6. Document results

---

## 📈 Expected Benefits

Based on Atlassian case study:
- ✅ **75% faster builds**
- ✅ **Faster TypeScript highlighting**
- ✅ **Better test selection** (fewer unnecessary tests run)
- ✅ **Clearer dependency graph**
- ✅ **Improved IDE navigation** (click goes to source, not barrel)

---

## ⚠️ Trade-offs (Acknowledged)

### What We Lose:
- ❌ "Public API" encapsulation via barrel files
- ❌ Clean single-line imports
- ❌ Easy refactoring (moving files requires updating all imports)

### Why It's Worth It:
- ✅ Performance > Convenience at scale
- ✅ Internal codebase (not published to npm)
- ✅ Direct dependencies are clearer
- ✅ Measurement-driven decision (not "best practice" dogma)

---

## 🚀 Alternative: Hybrid Approach

If full elimination is too disruptive:

### Keep Explicit Barrel for Public API Only
```ts
// src/components/index.ts - ONLY for external consumers
export { UiButton } from './ui/UiButton';
export { UiSurface } from './ui/UiSurface';
// ... explicit exports only
```

### Use Direct Imports Internally
```ts
// Inside src/components/* - use direct imports
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SidebarNavigation } from '@/components/navigation/SidebarNavigation';
```

**Benefit:** 80% of performance gain with 20% of the work

---

## 📝 Implementation Checklist

- [x] Phase 1: Remove wildcard exports
- [ ] Phase 2a: Install jscodeshift
- [ ] Phase 2b: Create codemod script
- [ ] Phase 2c: Test codemod (dry-run)
- [ ] Phase 2d: Run codemod transformation
- [ ] Phase 2e: Fix any edge cases manually
- [ ] Phase 3a: Measure build performance (before/after)
- [ ] Phase 3b: Delete unused barrel files
- [ ] Phase 3c: Verify all imports work
- [ ] Phase 3d: Document results

---

## 🔗 References

1. [Atlassian: 75% Faster Builds](https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files)
2. [Codemod Tutorial](https://mmazzarolo.com/blog/2024-11-10-removing-barrel-file-references-with-a-codemod/)
3. [TkDodo: Stop Using Barrel Files](https://tkdodo.eu/blog/please-stop-using-barrel-files)
4. [jscodeshift Documentation](https://github.com/facebook/jscodeshift)

---

**Last Updated:** 2026-01-21
**Status:** Phase 1 Complete, Phase 2 Ready to Start
