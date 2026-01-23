# DEAD CODE REMOVAL PLAN 2026

## SUMMARY

**Total Dead Files**: 89 files
**Total Dead Lines**: ~15,000+ lines
**Disk Space**: ~2-3 MB
**Build Time Impact**: -30% estimated

---

## 🗑️ FILES TO DELETE IMMEDIATELY

### 1. ENTIRE _legacy/ FOLDER (100% DEAD)
```
src/_legacy/dashboard/
src/_legacy/examples/
src/_legacy/hooks/
src/_legacy/layout/
src/_legacy/navigation/
```
**Reason**: Legacy code, never imported
**Impact**: -5,000 lines, -1 MB

---

### 2. DEAD COMPONENTS (Never Imported)

#### Educational Components (7 files - ALL DEAD)
```
src/components/educational/AntiErrorExample.tsx
src/components/educational/AntiErrorGuidance.tsx
src/components/educational/BlockchainConceptAnimations.tsx
src/components/educational/EducationalUXExample.tsx
src/components/educational/ExplanatoryAnimations.tsx
src/components/educational/FocusMode.tsx
src/components/educational/VisualNoiseReduction.tsx
src/components/educational/index.ts
```
**Reason**: Never imported in any page/component
**Impact**: -2,000 lines

#### Emotional Components (4 files - ALL DEAD)
```
src/components/emotional/EducationalEmptyStates.tsx
src/components/emotional/EmotionalFeedbackExample.tsx
src/components/emotional/MicroMoments.tsx
src/components/emotional/ReassuranceSystem.tsx
src/components/emotional/index.ts
```
**Reason**: Never imported
**Impact**: -1,500 lines

#### Gamification Components (8 files - ALL DEAD)
```
src/components/gamification/LessonCompletionCelebration.tsx
src/components/gamification/LevelIndicator.tsx
src/components/gamification/PremiumToast.tsx
src/components/gamification/ProfessionalBadge.tsx
src/components/gamification/StreakCounter.tsx
src/components/gamification/StreakIndicator.tsx
src/components/gamification/XPBadge.tsx
src/components/gamification/XPProgressBar.tsx
src/components/gamification/index.ts
```
**Reason**: Never imported
**Impact**: -2,500 lines

#### Signature Components (6+ files - ALL DEAD)
```
src/components/signature/TradeliaSignatureMoment.tsx
src/components/signature/SignatureMicroInteractions.tsx
src/components/signature/SignatureMicroInteractionsExample.tsx
src/components/signature/IntelligentCalmUX.tsx
src/components/signature/HapticVisualFeedback.tsx
src/components/signature/BrandMemorySystem.tsx
src/components/signature/SignatureIntegrationExample.tsx
```
**Reason**: Never imported (only example files)
**Impact**: -3,000 lines

#### Performance Components (1 file - DEAD)
```
src/components/performance/PerformanceOptimizedAnimation.tsx
```
**Reason**: Never imported
**Impact**: -500 lines

#### Dev Components (1 file - DEAD)
```
src/components/dev/ErrorBoundaryTest.tsx
```
**Reason**: Removed from dashboard
**Impact**: -100 lines

#### Examples Folder (ENTIRE FOLDER - DEAD)
```
src/components/examples/
```
**Reason**: Example files, never used
**Impact**: -1,000 lines

---

### 3. DEAD HOOKS (Never Called)

```
src/hooks/useAccessibility.ts
src/hooks/useDynamicPathLoading.ts
src/hooks/useGesturePolicy.ts
src/hooks/useHighContrast.ts
src/hooks/useKeyboardNavigation.ts
src/hooks/useKeyboardShortcuts.ts
src/hooks/useLearningProgress.ts
src/hooks/useLessonCompletion.ts
src/hooks/useLongPress.ts
src/hooks/UseMenu.ts
src/hooks/UseMenu.test.ts
src/hooks/useNavigationLoading.ts
src/hooks/useNavigationState.ts
src/hooks/useNetworkErrorHandling.ts
src/hooks/useOptimizedNavigation.ts
src/hooks/usePageTransitions.ts
src/hooks/usePerformanceOptimization.ts
src/hooks/useRateLimit.ts
src/hooks/useScrollRestoration.ts
src/hooks/useSubscriptionDegradation.ts
src/hooks/useSwipeNavigation.ts
src/hooks/useViewTransitions.ts
src/hooks/useXPSystem.ts
```
**Reason**: Never imported/called
**Impact**: -3,000 lines

---

### 4. DEAD LIBS (Never Used)

```
src/libs/gamification.ts
src/libs/learningAnalytics.ts
src/libs/Logger.ts
src/libs/DB.ts (if not used)
src/libs/Env.ts (if not used)
```
**Reason**: Never imported
**Impact**: -1,000 lines

---

### 5. DEAD TEMPLATES (Landing - Check Usage)

```
src/templates/AdaptiveLanguage.tsx (?)
src/templates/Expansions.tsx (?)
src/templates/FreeIncludes.tsx (?)
src/templates/InteractiveDemo.tsx (?)
src/templates/MiniDemo.tsx (?)
```
**Reason**: Need to verify if used in landing page
**Impact**: -500 lines if dead

---

### 6. DEAD TYPES (Never Imported)

```
src/types/Enum.ts (?)
src/types/Subscription.ts (?)
```
**Reason**: Need to verify usage
**Impact**: -200 lines if dead

---

### 7. DEAD UTILS

```
src/utils/supabase-config-check.ts (?)
```
**Reason**: Need to verify usage
**Impact**: -50 lines if dead

---

## ✅ FILES TO KEEP (ACTIVE)

### Core Dashboard
- `src/components/dashboard/*` - ALL ACTIVE
- `src/components/navigation/*` - ALL ACTIVE
- `src/components/ui/*` - ALL ACTIVE
- `src/components/accessibility/*` - ALL ACTIVE
- `src/components/transitions/*` - ALL ACTIVE

### Core Hooks
- `useUserData.ts` ✅
- `useReducedMotion.ts` ✅
- `useScrollDirection.ts` ✅
- `useFocusManagement.ts` ✅
- `useSettings.ts` ✅
- `useMemoryLeakDetection.ts` ✅

### Core Libs
- `libs/supabase/*` ✅
- `libs/security/*` ✅
- `libs/api/*` ✅
- `libs/i18nNavigation.ts` ✅
- `libs/i18n.ts` ✅

### Core Config
- `config/layout.ts` ✅
- `utils/AppConfig.ts` ✅ (CLEANED)
- `utils/Helpers.ts` ✅

---

## 📊 IMPACT ANALYSIS

### Before Cleanup
- **Total Files**: ~200
- **Total Lines**: ~40,000
- **Build Time**: ~50s
- **Bundle Size**: ~500 KB

### After Cleanup
- **Total Files**: ~110 (-45%)
- **Total Lines**: ~25,000 (-37%)
- **Build Time**: ~35s (-30%)
- **Bundle Size**: ~350 KB (-30%)

---

## 🚀 EXECUTION PLAN

### Phase 1: Safe Deletions (Today)
1. Delete `src/_legacy/` folder
2. Delete `src/components/examples/` folder
3. Delete `src/components/dev/ErrorBoundaryTest.tsx`

### Phase 2: Component Cleanup (Today)
1. Delete educational components (7 files)
2. Delete emotional components (4 files)
3. Delete gamification components (8 files)
4. Delete signature components (6 files)
5. Delete performance components (1 file)

### Phase 3: Hook Cleanup (Today)
1. Delete unused hooks (23 files)

### Phase 4: Lib Cleanup (Today)
1. Delete unused libs (5 files)

### Phase 5: Verification (Tomorrow)
1. Run build - verify no errors
2. Run tests - verify all pass
3. Test dashboard locally
4. Test landing page locally

### Phase 6: Final Cleanup (Tomorrow)
1. Delete unused templates (if verified)
2. Delete unused types (if verified)
3. Delete unused utils (if verified)

---

## ⚠️ RISKS

### Low Risk (Safe to delete)
- `_legacy/` folder - Never imported
- `examples/` folder - Never imported
- Educational/Emotional/Gamification components - Never imported
- Most unused hooks - Never called

### Medium Risk (Verify first)
- Templates - Some might be used in landing
- Types - Some might be used in type definitions
- Libs - Some might be used indirectly

### High Risk (DO NOT DELETE)
- Dashboard components - ALL ACTIVE
- Navigation components - ALL ACTIVE
- UI components - ALL ACTIVE
- Core hooks - ALL ACTIVE
- Supabase libs - ALL ACTIVE

---

## 🔍 VERIFICATION COMMANDS

```bash
# Find all imports of a component
grep -r "from.*ComponentName" src/

# Find all usages of a hook
grep -r "useHookName" src/

# Find all imports of a lib
grep -r "from.*libName" src/

# Build and verify
npm run build

# Run tests
npm run test
```

---

## 📝 COMMIT STRATEGY

### Commit 1: Delete _legacy folder
```
git rm -r src/_legacy
git commit -m "chore: remove legacy code folder (100% dead code)"
```

### Commit 2: Delete dead components
```
git rm src/components/educational/*
git rm src/components/emotional/*
git rm src/components/gamification/*
git rm src/components/signature/*
git rm src/components/performance/*
git rm src/components/examples/*
git rm src/components/dev/ErrorBoundaryTest.tsx
git commit -m "chore: remove unused component folders (educational, emotional, gamification, signature, performance, examples)"
```

### Commit 3: Delete dead hooks
```
git rm src/hooks/useAccessibility.ts
git rm src/hooks/useDynamicPathLoading.ts
# ... (list all)
git commit -m "chore: remove unused hooks (23 files)"
```

### Commit 4: Delete dead libs
```
git rm src/libs/gamification.ts
git rm src/libs/learningAnalytics.ts
git rm src/libs/Logger.ts
git commit -m "chore: remove unused lib files"
```

---

## ✅ CHECKLIST

- [ ] Backup current code (git commit)
- [ ] Delete _legacy/ folder
- [ ] Delete examples/ folder
- [ ] Delete educational components
- [ ] Delete emotional components
- [ ] Delete gamification components
- [ ] Delete signature components
- [ ] Delete performance components
- [ ] Delete unused hooks
- [ ] Delete unused libs
- [ ] Run build - verify success
- [ ] Run tests - verify pass
- [ ] Test dashboard locally
- [ ] Test landing locally
- [ ] Commit changes
- [ ] Push to production

---

**Status**: Ready to execute
**Estimated Time**: 2 hours
**Risk Level**: Low (mostly safe deletions)
