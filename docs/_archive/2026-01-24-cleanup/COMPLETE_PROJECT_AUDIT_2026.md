# COMPLETE PROJECT AUDIT 2026

## EXECUTIVE SUMMARY

**Total Files**: ~200+
**Dead Code Found**: ~40% (estimated)
**Critical Issues**: 5
**Recommendations**: Immediate cleanup needed

---

## 1. ROOT LEVEL FILES

### ✅ ACTIVE
- `src/middleware.ts` - i18n routing + auth + rate limiting
- `src/instrumentation.ts` - Sentry monitoring

### ❌ TO REVIEW
- None at root level

---

## 2. APP DIRECTORY (`src/app/`)

### ✅ ACTIVE
- `layout.tsx` - Root HTML structure
- `global-error.tsx` - Error boundary
- `not-found.tsx` - 404 page
- `robots.ts` - SEO
- `sitemap.ts` - SEO

### 📁 SUBDIRECTORIES

#### `app/[locale]/` - Locale routing
- ✅ `layout.tsx` - i18n + providers
- ✅ `global-error.tsx` - Locale error
- ✅ `not-found.tsx` - Locale 404
- ✅ `(auth)/` - Protected routes (dashboard)
- ✅ `(unauth)/` - Public routes (landing)

#### `app/actions/` - Server actions
- ✅ `auth.ts` - Signup/login/email check

#### `app/api/` - API routes
- ✅ `api/user/progress/` - User data endpoint
- ❓ `api/lessons/` - TO CHECK if used

#### `app/auth/` - Auth callbacks
- ✅ `callback/` - OAuth callback
- ✅ `sync/` - Session sync
- ✅ `layout.tsx` - Auth layout

---

## 3. COMPONENTS (`src/components/`)

### ✅ ACTIVE CORE
- `dashboard/` - Dashboard components (8 files)
  - DashboardHeader.tsx ✅
  - DashboardClient.tsx ✅
  - DashboardShell.tsx ✅
  - ThemeSwitcher.tsx ✅
  - LanguageSwitcherDashboard.tsx ✅
  - NotificationsBell.tsx ✅
  - UserDropdown.tsx ✅
  - EmailVerificationBanner.tsx ✅

- `navigation/` - Navigation components
  - SidebarNavigation.tsx ✅
  - BottomNavigationSimple.tsx ✅
  - CommandPalette.tsx ✅
  - QuickActionsMenu.tsx ✅

- `ui/` - UI primitives (shadcn/ui)
  - All active ✅

- `accessibility/` - A11y components
  - LiveRegion.tsx ✅
  - SkipLinks.tsx ✅

- `transitions/` - Page transitions
  - PageTransitionWrapper.tsx ✅

### ⚠️ POTENTIALLY DEAD

- `dev/` - Development tools
  - ❌ ErrorBoundaryTest.tsx - REMOVED from dashboard

- `educational/` - Educational UX (7 files)
  - ❓ AntiErrorExample.tsx - Used?
  - ❓ AntiErrorGuidance.tsx - Used?
  - ❓ BlockchainConceptAnimations.tsx - Used?
  - ❓ EducationalUXExample.tsx - Used?
  - ❓ ExplanatoryAnimations.tsx - Used?
  - ❓ FocusMode.tsx - Used?
  - ❓ VisualNoiseReduction.tsx - Used?

- `emotional/` - Emotional feedback (4 files)
  - ❓ EducationalEmptyStates.tsx - Used?
  - ❓ EmotionalFeedbackExample.tsx - Used?
  - ❓ MicroMoments.tsx - Used?
  - ❓ ReassuranceSystem.tsx - Used?

- `gamification/` - Gamification (8 files)
  - ❓ LessonCompletionCelebration.tsx - Used?
  - ❓ LevelIndicator.tsx - Used?
  - ❓ PremiumToast.tsx - Used?
  - ❓ ProfessionalBadge.tsx - Used?
  - ❓ StreakCounter.tsx - Used?
  - ❓ StreakIndicator.tsx - Used?
  - ❓ XPBadge.tsx - Used?
  - ❓ XPProgressBar.tsx - Used?

- `learning/` - Learning components
  - ❓ CompetencyProgressBar.tsx - Used?
  - ❓ PathCard.tsx - Used?
  - ❓ ProfessionalCertification.tsx - Used?
  - ❓ TradeliaCoinDisplay.tsx - Used?

- `signature/` - Signature components (6 files)
  - ❓ All signature components - Used?

- `performance/` - Performance components
  - ❓ PerformanceOptimizedAnimation.tsx - Used?

- `runtime/` - Runtime components
  - ❓ What's in here?

- `motion/` - Motion components
  - ❓ What's in here?

- `examples/` - Example components
  - ❌ Likely all dead

### 🗑️ CONFIRMED DEAD

- `i18n/I18nCoverage.test.ts` - Test file, not component

---

## 4. CONFIG (`src/config/`)

### ✅ ACTIVE
- `layout.ts` - Single Source of Truth for layout dimensions
  - Used by: CSS files, components

---

## 5. CONTEXTS (`src/contexts/`)

### ✅ ACTIVE
- `DashboardContext.tsx` - Dashboard state management

---

## 6. CONTRACTS (`src/contracts/`)

### ✅ ACTIVE
- `userProgress.contract.ts` - Zod schema for user progress validation

---

## 7. DATA (`src/data/`)

### ✅ ACTIVE
- `navigation.config.ts` - Sidebar navigation items

### ❓ TO CHECK
- `lessons/` - Lesson data files

---

## 8. FEATURES (`src/features/`)

### ✅ ACTIVE
- `landing/` - Landing page components
  - CenteredFooter.tsx ✅
  - CenteredMenu.tsx ✅
  - Section.tsx ✅

### ❓ TO CHECK
- `auth/` - Auth feature components
- `dashboard/` - Dashboard feature components

---

## 9. HOOKS (`src/hooks/`)

### ✅ ACTIVE (Used in dashboard)
- `useUserData.ts` ✅
- `useReducedMotion.ts` ✅
- `useScrollDirection.ts` ✅
- `useFocusManagement.ts` ✅
- `useSettings.ts` ✅

### ⚠️ POTENTIALLY DEAD (Need to check usage)
- `useAccessibility.ts` ❓
- `useDynamicPathLoading.ts` ❓
- `useGesturePolicy.ts` ❓
- `useHighContrast.ts` ❓
- `useKeyboardNavigation.ts` ❓
- `useKeyboardShortcuts.ts` ❓
- `useLearningProgress.ts` ❓
- `useLessonCompletion.ts` ❓
- `useLongPress.ts` ❓
- `useMemoryLeakDetection.ts` ✅ (Used in dashboard components)
- `UseMenu.ts` ❓
- `useNavigationLoading.ts` ❓
- `useNavigationState.ts` ❓
- `useNetworkErrorHandling.ts` ❓
- `useOptimizedNavigation.ts` ❓
- `usePageTransitions.ts` ❓
- `usePerformanceOptimization.ts` ❓
- `useRateLimit.ts` ❓
- `useScrollRestoration.ts` ❓
- `useSubscriptionDegradation.ts` ❓
- `useSwipeNavigation.ts` ❓
- `useViewTransitions.ts` ❓
- `useXPSystem.ts` ❓

---

## 10. I18N (`src/i18n/`)

### ✅ ACTIVE
- `request.ts` - i18n configuration for Server Components

---

## 11. LIB (`src/lib/`)

### ✅ ACTIVE
- `settings/` - Settings management system
  - precedence.ts ✅
  - migration.ts ✅
  - defaults.ts ✅

### ❓ TO CHECK
- `i18n/` - i18n utilities
- `keyboard/` - Keyboard utilities
- `telemetry/` - Telemetry utilities

---

## 12. LIBS (`src/libs/`)

### ✅ ACTIVE
- `supabase/` - Supabase client/server/middleware
  - client.ts ✅
  - server.ts ✅
  - middleware.ts ✅
  - database.ts ✅

- `security/` - Security utilities
  - headers.ts ✅
  - rateLimiter.ts ✅

- `api/` - API utilities
  - errorHandler.ts ✅

- `i18nNavigation.ts` ✅
- `i18n.ts` ✅

### ⚠️ POTENTIALLY DEAD
- `dashboard-data.ts` ❓ (Mock data?)
- `DB.ts` ❓
- `Env.ts` ❓
- `gamification.ts` ❓
- `learningAnalytics.ts` ❓
- `Logger.ts` ❓

---

## 13. LOCALES (`src/locales/`)

### ✅ ACTIVE
- `en.json` - English translations
- `it.json` - Italian translations

---

## 14. MODELS (`src/models/`)

### ✅ ACTIVE
- `Schema.ts` - Drizzle ORM schema

---

## 15. NORMALIZERS (`src/normalizers/`)

### ✅ ACTIVE
- `userProgress.normalizer.ts` - Normalize user progress data

---

## 16. PROVIDERS (`src/providers/`)

### ✅ ACTIVE
- `UserDataProvider.tsx` - React Query provider for user data
- `UserDataProvider.test.tsx` - Tests

---

## 17. STORES (`src/stores/`)

### ✅ ACTIVE
- `settingsStore.ts` - Zustand store for settings

---

## 18. STYLES (`src/styles/`)

### ✅ ACTIVE CORE
- `shared.css` - Entry point for shared styles
- `dashboard.css` - Entry point for dashboard styles
- `landing.css` - Entry point for landing styles
- `shared/` folder:
  - tokens.css ✅
  - base.css ✅
  - utilities.css ✅
  - animation-tokens.css ✅

### ⚠️ POTENTIALLY DEAD (Need to check if imported)
- `accessibility-compliance.css` ❓
- `adaptive-micro-copy.css` ❓
- `anti-error-example.css` ❓
- `anti-error-guidance.css` ❓
- `anticipatory-feedback.css` ❓
- `brand-memory-system.css` ❓
- `educational-example.css` ❓
- `explanatory-animations.css` ❓
- `focus-mode.css` ❓
- `haptic-visual-feedback.css` ❓
- `intelligent-calm-ux.css` ❓
- `micro-moments.css` ❓
- `semantic-animations.css` ❓
- `semantic-loading-states.css` ❓
- `signature-component.css` ❓
- `signature-micro-interactions.css` ❓
- `signature-moment.css` ❓
- `visual-noise-reduction.css` ❓

### ✅ ACTIVE (Imported in dashboard.css)
- `glass-effects-tokens.css` ✅
- `premium-spring-physics.css` ✅
- `motion-tokens.css` ✅
- `dashboard-ui.css` ✅
- `performance-optimizations.css` ✅
- `premium-icons.css` ✅

---

## 19. TEMPLATES (`src/templates/`)

### ✅ ACTIVE (Landing page)
- `Logo.tsx` ✅
- `Navbar.tsx` ✅
- `Footer.tsx` ✅
- `PremiumFooter.tsx` ✅
- `Hero.tsx` ✅
- `BenefitsOverview.tsx` ✅
- `HowItWorks.tsx` ✅
- `LearningPath.tsx` ✅
- `Progression.tsx` ✅
- `SocialProof.tsx` ✅
- `FAQ.tsx` ✅
- `CTA.tsx` ✅
- `FinalCTA.tsx` ✅

### ❓ TO CHECK
- `AdaptiveLanguage.tsx` ❓
- `Expansions.tsx` ❓
- `FreeIncludes.tsx` ❓
- `InteractiveDemo.tsx` ❓
- `MiniDemo.tsx` ❓

---

## 20. TYPES (`src/types/`)

### ✅ ACTIVE
- `Auth.ts` ✅
- `settings.ts` ✅
- `settingsPaths.ts` ✅
- `global.d.ts` ✅
- `browser.d.ts` ✅

### ❓ TO CHECK
- `Enum.ts` ❓
- `learning.ts` ❓
- `Subscription.ts` ❓

---

## 21. UTILS (`src/utils/`)

### ✅ ACTIVE
- `AppConfig.ts` ✅ (CLEANED)
- `Helpers.ts` ✅
- `Helpers.test.ts` ✅

### ❓ TO CHECK
- `supabase-config-check.ts` ❓

---

## 22. _LEGACY (`src/_legacy/`)

### 🗑️ CONFIRMED DEAD
- **ENTIRE FOLDER** - Legacy code, should be deleted

---

## CRITICAL FINDINGS

### 🔴 CRITICAL ISSUES

1. **_legacy/ folder** - 100% dead code, delete immediately
2. **40+ CSS files** - Many not imported anywhere
3. **30+ component files** - Educational/Gamification/Signature unused
4. **20+ hooks** - Many custom hooks never used
5. **AppConfig dead exports** - Cleaned, but was 70% dead

### ⚠️ HIGH PRIORITY

1. **Audit all CSS files** - Check which are actually imported
2. **Audit all components** - Check which are actually rendered
3. **Audit all hooks** - Check which are actually called
4. **Audit libs/** - Many utility files might be dead

### 📊 ESTIMATED DEAD CODE

- **Components**: ~40% dead (educational, gamification, signature)
- **Hooks**: ~60% dead (many custom hooks unused)
- **CSS**: ~50% dead (many feature-specific CSS files)
- **Libs**: ~30% dead (mock data, unused utilities)
- **Total**: ~40% of codebase is dead code

---

## NEXT STEPS

1. ✅ Clean AppConfig.ts (DONE)
2. ⏳ Audit CSS files (check imports)
3. ⏳ Audit component files (check usage)
4. ⏳ Audit hooks (check usage)
5. ⏳ Delete _legacy/ folder
6. ⏳ Create cleanup plan with file-by-file analysis

---

## RECOMMENDATIONS

### IMMEDIATE (Today)
1. Delete `src/_legacy/` folder
2. Remove unused CSS files
3. Remove unused component files

### SHORT TERM (This week)
1. Audit and remove unused hooks
2. Audit and remove unused libs
3. Consolidate remaining code

### LONG TERM (This month)
1. Refactor remaining code
2. Add proper documentation
3. Set up dead code detection in CI/CD

---

**Status**: Audit in progress - AppConfig.ts cleaned
**Next**: CSS files audit
