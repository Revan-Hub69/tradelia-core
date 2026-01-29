# Tradelia Core - Codebase Cleanup Audit Report

**Date:** 2026-01-28  
**Auditor:** Kilo Code AI  
**Scope:** Comprehensive audit of unused files, components, and code

---

## Executive Summary

This audit identified **significant cleanup opportunities** across the tradelia-core codebase. The project has accumulated technical debt from rapid development, including unused components, duplicate lesson implementations, temporary scripts, and extensive archived documentation.

### Key Findings

| Category | Files Identified | Priority |
|----------|------------------|----------|
| **SAFE TO DELETE** | 25+ files | HIGH |
| **CONSIDER REMOVING** | 15+ files | MEDIUM |
| **ARCHIVE DOCUMENTATION** | 200+ files | LOW |
| **DUPLICATE COMPONENTS** | 7 variants | MEDIUM |

---

## 1. FILES SAFE TO DELETE (High Priority)

### 1.1 Root-Level Temporary Scripts

These scripts were created for one-time operations and are no longer needed:

| File | Purpose | Status |
|------|---------|--------|
| [`check-supabase.js`](check-supabase.js:1) | Database verification script | ✅ One-time use complete |
| [`cleanup-and-verify-competitions.js`](cleanup-and-verify-competitions.js:1) | Competition data cleanup | ✅ One-time use complete |
| [`add-translations-system.js`](add-translations-system.js:1) | Translation system setup | ✅ One-time use complete |
| [`add-top5-opportunities.js`](add-top5-opportunities.js:1) | Seed top 5 opportunities | ✅ One-time use complete |
| [`cleanup-ftmo-swing.js`](cleanup-ftmo-swing.js:1) | FTMO data cleanup | ✅ One-time use complete |
| [`create-translations-table.sql`](create-translations-table.sql:1) | SQL for translations | ✅ Migrated to migrations |
| [`supabase_setup.sql`](supabase_setup.sql:1) | Initial Supabase setup | ✅ Outdated, use migrations |
| [`supabase_setup_complete_rls_2026.sql`](supabase_setup_complete_rls_2026.sql:1) | RLS setup | ✅ Migrated to migrations |
| [`supabase_trading_schema.sql`](supabase_trading_schema.sql:1) | Trading schema | ✅ Migrated to migrations |

**Estimated Space Savings:** ~150 KB

### 1.2 Unused API Routes

| File | Issue | Recommendation |
|------|-------|----------------|
| [`src/app/api/contact-simple/route.ts`](src/app/api/contact-simple/route.ts:1) | Debug/temp API for contact form | Remove - main `/api/contact` works |
| [`src/app/api/contact-test/route.ts`](src/app/api/contact-test/route.ts:1) | Test endpoint for email | Remove - debugging complete |
| [`src/app/api/seed-challenges/route.ts`](src/app/api/seed-challenges/route.ts:1) | Seeding endpoint | Remove - use scripts instead |

### 1.3 Unused/Obsolete Components

| File | Issue | Recommendation |
|------|-------|----------------|
| [`src/components/Background.tsx`](src/components/Background.tsx:1) | Only used in Storybook | Remove if Storybook not used |
| [`src/components/Background.stories.tsx`](src/components/Background.stories.tsx:1) | Storybook file | Remove if Storybook not used |
| [`src/components/OptimizedImage.tsx`](src/components/OptimizedImage.tsx:1) | Not imported anywhere | Verify usage, likely safe to remove |
| [`src/components/ui/MobileBottomSheet.tsx`](src/components/ui/MobileBottomSheet.tsx:1) | Not imported anywhere | Safe to remove |
| [`src/components/ui/MobileDropdownDialog.tsx`](src/components/ui/MobileDropdownDialog.tsx:1) | Not imported anywhere | Safe to remove |
| [`src/components/ui/MobileFullscreenMenu.tsx`](src/components/ui/MobileFullscreenMenu.tsx:1) | Not imported anywhere | Safe to remove |

### 1.4 Duplicate Lesson Components (7 Variants!)

The `src/components/learning/` folder contains **7 different implementations** of the same Crypto Lesson 0:

| File | Status | Recommendation |
|------|--------|----------------|
| [`CryptoLesson0.tsx`](src/components/learning/CryptoLesson0.tsx:1) | Original | **Keep** - referenced but not used |
| [`CryptoLesson0Clean.tsx`](src/components/learning/CryptoLesson0Clean.tsx:1) | Used by WithAuth | **Keep** |
| [`CryptoLesson0WithAuth.tsx`](src/components/learning/CryptoLesson0WithAuth.tsx:1) | **ACTIVE** - used in lesson-0 page | **Keep** |
| [`CryptoLesson0Simple.tsx`](src/components/learning/CryptoLesson0Simple.tsx:1) | Not imported | Remove |
| [`CryptoLesson0Professional.tsx`](src/components/learning/CryptoLesson0Professional.tsx:1) | Not imported | Remove |
| [`CryptoLesson0Real.tsx`](src/components/learning/CryptoLesson0Real.tsx:1) | Not imported | Remove |
| [`CryptoLesson0Ultra.tsx`](src/components/learning/CryptoLesson0Ultra.tsx:1) | Not imported | Remove |

**Recommendation:** Consolidate to 2 files:
1. `CryptoLesson0Clean.tsx` - The clean implementation
2. `CryptoLesson0WithAuth.tsx` - Wrapper with auth logic

Delete the other 5 variants - **~2,500 lines of code**.

### 1.5 Unused Challenge Components

The following components in [`src/components/dashboard/challenges/`](src/components/dashboard/challenges/) are **not imported anywhere**:

| File | Issue |
|------|-------|
| [`ChallengeCard.tsx`](src/components/dashboard/challenges/ChallengeCard.tsx:1) | Not imported - using ProgramCard instead |
| [`ChallengeComparison.tsx`](src/components/dashboard/challenges/ChallengeComparison.tsx:1) | Not imported |
| [`ChallengeFilters.tsx`](src/components/dashboard/challenges/ChallengeFilters.tsx:1) | Not imported - filters inline in page |
| [`ChallengeSearch.tsx`](src/components/dashboard/challenges/ChallengeSearch.tsx:1) | Not imported |
| [`ChallengeSortDropdown.tsx`](src/components/dashboard/challenges/ChallengeSortDropdown.tsx:1) | Not imported - using native select |

**Note:** These may be work-in-progress or planned features. Verify before deleting.

---

## 2. FILES TO CONSIDER REMOVING (Medium Priority)

### 2.1 Deprecated Locale Files

| File | Issue | Recommendation |
|------|-------|----------------|
| [`src/locales/en.json`](src/locales/en.json:1) | Old locale format | Migrate to `messages/en/` and remove |
| [`src/locales/it.json`](src/locales/it.json:1) | Old locale format | Migrate to `messages/it/` and remove |

The project now uses the `messages/` folder structure with next-intl.

### 2.2 Scripts Folder - One-Time Scripts

These scripts in [`scripts/`](scripts/) have likely served their purpose:

| File | Purpose | Status |
|------|---------|--------|
| [`seed-drawer-data.ts`](scripts/seed-drawer-data.ts:1) | Seeded drawer data | Likely one-time use |
| [`seed-ftmo-data.ts`](scripts/seed-ftmo-data.ts:1) | Seeded FTMO data | Likely one-time use |
| [`research-free-opportunities.ts`](scripts/research-free-opportunities.ts:1) | Research script | One-time research |
| [`find-hardcoded-strings.ts`](scripts/find-hardcoded-strings.ts:1) | Analysis script | Can be kept for future use |
| [`analyze-barrel-imports.ts`](scripts/analyze-barrel-imports.ts:1) | Analysis script | Can be kept for future use |
| [`transform-barrel-imports.ts`](scripts/transform-barrel-imports.ts:1) | Codemod | Can be kept for future use |

**Recommendation:** Move one-time seed scripts to `scripts/archive/`.

### 2.3 Test Files (Verify Usage)

| File | Issue |
|------|-------|
| [`src/components/ui/__tests__/ContextMenu.test.tsx`](src/components/ui/__tests__/ContextMenu.test.tsx:1) | Verify if test suite runs |
| [`src/components/navigation/CommandPalette.test.ts`](src/components/navigation/CommandPalette.test.ts:1) | Verify if test suite runs |
| [`src/components/navigation/NavigationTypeSafety.test.ts`](src/components/navigation/NavigationTypeSafety.test.ts:1) | Verify if test suite runs |
| [`src/components/motion/__tests__/motion-system.test.tsx`](src/components/motion/__tests__/motion-system.test.tsx:1) | Verify if test suite runs |
| [`src/components/ToggleMenuButton.test.tsx`](src/components/ToggleMenuButton.test.tsx:1) | Verify if test suite runs |
| [`src/components/i18n/I18nCoverage.test.ts`](src/components/i18n/I18nCoverage.test.ts:1) | Verify if test suite runs |

---

## 3. ARCHIVED DOCUMENTATION (Low Priority)

### 3.1 Archive Folders

The following folders contain extensive archived documentation:

| Folder | File Count | Size | Recommendation |
|--------|------------|------|----------------|
| [`docs/_archive/`](docs/_archive/) | 100+ files | ~5 MB | Move to separate repo or compress |
| [`docs/_archive_2026-01-26/`](docs/_archive_2026-01-26/) | 100+ files | ~5 MB | Move to separate repo or compress |

These contain session summaries, research docs, and implementation plans that are no longer active but may have historical value.

### 3.2 Obsolete Documentation Files

| File | Issue |
|------|-------|
| `docs/SESSION_SUMMARY_2026-01-26_*.md` (multiple) | Old session summaries - archived |
| `docs/CHALLENGE_LIBRARY_*_2026.md` (multiple) | Implementation complete - archived |
| `docs/DATABASE_*_2026.md` | Migrations complete - archived |
| `docs/DRAWER_*_2026.md` | Implementation complete - archived |

---

## 4. POTENTIAL CONSOLIDATIONS

### 4.1 Mobile Dropdown Components

Currently have 4 variants:
- [`MobileBottomSheet.tsx`](src/components/ui/MobileBottomSheet.tsx:1) - Not used
- [`MobileDropdownDialog.tsx`](src/components/ui/MobileDropdownDialog.tsx:1) - Not used
- [`MobileDropdownPopover.tsx`](src/components/ui/MobileDropdownPopover.tsx:1) - **Used**
- [`MobileFullscreenMenu.tsx`](src/components/ui/MobileFullscreenMenu.tsx:1) - Not used

**Recommendation:** Consolidate to single `MobileDropdown` component with variants.

### 4.2 Skeleton Components

Currently have:
- [`DashboardSkeleton.tsx`](src/components/dashboard/DashboardSkeleton.tsx:1) - Contains multiple skeletons
- [`HeaderSkeletons.tsx`](src/components/dashboard/HeaderSkeletons.tsx:1) - Separate file

**Recommendation:** Consolidate all skeletons into `DashboardSkeleton.tsx`.

---

## 5. RECOMMENDED CLEANUP ACTIONS

### Phase 1: Safe Deletions (Immediate)

```bash
# Root-level temporary scripts
rm check-supabase.js
rm cleanup-and-verify-competitions.js
rm add-translations-system.js
rm add-top5-opportunities.js
rm cleanup-ftmo-swing.js
rm create-translations-table.sql
rm supabase_setup.sql
rm supabase_setup_complete_rls_2026.sql
rm supabase_trading_schema.sql

# Unused API routes
rm src/app/api/contact-simple/route.ts
rm src/app/api/contact-test/route.ts
rm src/app/api/seed-challenges/route.ts

# Duplicate lesson components (keep only Clean and WithAuth)
rm src/components/learning/CryptoLesson0.tsx
rm src/components/learning/CryptoLesson0Simple.tsx
rm src/components/learning/CryptoLesson0Professional.tsx
rm src/components/learning/CryptoLesson0Real.tsx
rm src/components/learning/CryptoLesson0Ultra.tsx

# Unused mobile components
rm src/components/ui/MobileBottomSheet.tsx
rm src/components/ui/MobileDropdownDialog.tsx
rm src/components/ui/MobileFullscreenMenu.tsx

# Storybook files (if not using Storybook)
rm src/components/Background.stories.tsx
```

**Estimated Impact:** ~3,000 lines of code removed, ~100 KB saved.

### Phase 2: Consolidations (Short-term)

1. **Consolidate lesson components** to single implementation
2. **Merge skeleton components** into single file
3. **Remove old locale files** after migration verification
4. **Archive one-time scripts** to `scripts/archive/`

### Phase 3: Documentation Cleanup (Long-term)

1. Move `docs/_archive/` to separate repository
2. Compress or delete obsolete session summaries
3. Keep only active implementation docs in main repo

---

## 6. FILES TO KEEP (Important)

The following files may appear unused but should be **kept**:

| File | Reason |
|------|--------|
| [`src/components/ServiceWorkerCleanup.tsx`](src/components/ServiceWorkerCleanup.tsx:1) | Used in layout.tsx for PWA cleanup |
| [`src/components/WebVitalsMonitor.tsx`](src/components/WebVitalsMonitor.tsx:1) | Used in layout.tsx for performance monitoring |
| [`src/components/Background.tsx`](src/components/Background.tsx:1) | May be used by Storybook - verify first |
| [`scripts/validate-translations.ts`](scripts/validate-translations.ts:1) | Active utility for CI/CD |
| [`scripts/find-hardcoded-strings.ts`](scripts/find-hardcoded-strings.ts:1) | Active utility for i18n audits |

---

## 7. BIGGEST WINS FOR CODEBASE REDUCTION

### Top 5 Cleanup Actions by Impact:

1. **Remove 5 duplicate CryptoLesson0 variants** - ~2,500 lines
2. **Delete root-level temporary scripts** - 9 files, ~150 KB
3. **Archive docs/_archive folders** - ~200 files, ~10 MB
4. **Remove unused API routes** - 3 files
5. **Consolidate mobile dropdown components** - 3 files

**Total Potential Reduction:** ~3,000+ lines of code, ~10+ MB

---

## 8. VERIFICATION CHECKLIST

Before deleting files, verify:

- [ ] No imports reference the file (check with IDE global search)
- [ ] No dynamic imports (`import()` or `next/dynamic`)
- [ ] No barrel exports (`index.ts` files)
- [ ] No test files depend on it
- [ ] Not referenced in documentation

### Quick Verification Commands:

```bash
# Check if file is imported anywhere
grep -r "from.*ComponentName" src/

# Check for dynamic imports
grep -r "dynamic.*ComponentName" src/

# Check barrel exports
grep -r "export.*ComponentName" src/components/*/index.ts
```

---

## 9. CONCLUSION

The tradelia-core codebase has significant cleanup opportunities. The highest impact actions are:

1. **Immediate:** Delete root-level temporary scripts and unused API routes
2. **Short-term:** Consolidate duplicate lesson components
3. **Long-term:** Archive obsolete documentation

**Estimated Total Cleanup:**
- **Files to delete:** 25+
- **Lines of code:** 3,000+
- **Storage saved:** 10+ MB
- **Maintenance burden:** Significantly reduced

---

*Report generated by Kilo Code AI on 2026-01-28*
