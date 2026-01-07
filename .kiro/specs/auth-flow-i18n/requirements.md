# Requirements Document - Auth Flow & i18n System

## Introduction

Sistema completo di autenticazione e internazionalizzazione per Tradelia 2026, coerente con la spec tradelia-superbig-dashboard. Include tutte le pagine auth (login, forgot-password, reset-password, verify-email, callback), il modale di onboarding (DashboardModal), e il form di registrazione (RegistrationForm).

**Principio Guida**: Usare il sistema `lib/translations.ts` esistente (stesso della homepage) per garantire consistenza. La homepage NON va modificata - la sua struttura è congelata.

**Riferimento**: Questo documento estende il Requirement 15 (Internationalization Enterprise) della spec tradelia-superbig-dashboard.

### Architettura i18n Esistente (Bridge Mode)

Il repo ha già 2 sistemi i18n in parallelo:
- **Marketing/Auth** → `lib/translations.ts` + `useLanguage()` + localStorage
- **Dashboard** → `next-intl` + cookie/route locale

**Bridge Mode**: Quando l'utente cambia lingua, sincronizziamo:
1. `localStorage` (tradelia-language) per marketing/auth
2. `cookie` (NEXT_LOCALE) per dashboard/next-intl

Questo garantisce consistenza senza toccare la homepage.

### Best Practice 2026 Compliance

Questo sistema deve rispettare:
- **Sicurezza**: Input sanitization, XSS prevention, secure error messages (NO info leak, NO email enumeration)
- **Performance**: Bundle auth keys < 5KB, layout-level provider (no per-page wrap), minimal re-renders
- **Qualità Codice**: TypeScript strict, ESLint boundaries, no any types
- **UX/UI**: Tradelia 2026 design guide, WCAG AAA+, consistent micro-interactions
- **Manutenibilità**: Chiara separazione concerns, documentazione inline, test coverage
- **Infrastruttura**: Compatibile con SSR/SSG, html lang da cookie in root layout

## Glossary

- **Translation_System**: Sistema basato su `lib/translations.ts` con `useLanguage()` hook e `LanguageProvider`
- **Auth_Pages**: Pagine in `app/auth/` (login, forgot-password, reset-password, verify-email, callback)
- **Dashboard_Modal**: Componente `DashboardModal.tsx` per onboarding utente
- **Registration_Form**: Componente `RegistrationForm.tsx` per registrazione email
- **Locale**: Codice lingua supportato (it, en)
- **Homepage**: Pagina marketing in `app/(marketing)/page.tsx` - CONGELATA, non modificare

## Requirements

### Requirement 1: Auth Pages Internationalization

**User Story:** Come utente, voglio vedere le pagine di autenticazione nella mia lingua preferita, così da comprendere l'interfaccia indipendentemente dalla mia preferenza linguistica.

#### Acceptance Criteria

1. WHEN a user visits any auth page, THE Auth_Pages SHALL display all text in the user's selected Locale using Translation_System
2. THE Auth_Pages SHALL use a single `app/auth/layout.tsx` that wraps all auth pages with LanguageProvider (NOT per-page wrapping)
3. THE Auth_Pages SHALL import `useLanguage` from `@/lib/translations` (single source of truth)
4. IF a translation key is missing, THEN THE Translation_System SHALL return the key as fallback
5. THE Auth_Pages SHALL NOT cause hydration mismatch (locale from cookie, not just localStorage)

### Requirement 2: Registration Form Internationalization

**User Story:** Come utente, voglio vedere il form di registrazione nella mia lingua preferita, così da completare la registrazione senza barriere linguistiche.

#### Acceptance Criteria

1. WHEN the Registration_Form is displayed, THE Registration_Form SHALL show all labels in the user's selected Locale
2. WHEN the Registration_Form shows validation errors, THE Registration_Form SHALL display error messages in the user's selected Locale
3. WHEN the Registration_Form shows success/loading states, THE Registration_Form SHALL display status messages in the user's selected Locale
4. THE Registration_Form SHALL use `useLanguage()` hook for translations
5. THE Registration_Form SHALL remove all hardcoded Italian text

### Requirement 3: Dashboard Modal Complete Translations

**User Story:** Come utente, voglio che il modale di onboarding sia completamente tradotto, così da completare il flusso nella mia lingua.

#### Acceptance Criteria

1. WHEN the Dashboard_Modal displays step 6 (registration), THE Dashboard_Modal SHALL show step indicator in the user's selected Locale
2. WHEN the Dashboard_Modal displays the close button, THE Dashboard_Modal SHALL use translated aria-label for accessibility
3. THE Dashboard_Modal SHALL replace all hardcoded Italian text with translation keys
4. THE Dashboard_Modal SHALL ensure all existing translation keys work correctly in both locales

### Requirement 4: Translation Keys Completeness

**User Story:** Come sviluppatore, voglio che tutte le chiavi di traduzione esistano in entrambe le lingue, così che l'app funzioni correttamente in italiano e inglese.

#### Acceptance Criteria

1. THE Translation_System SHALL contain all auth-related keys in `lib/translations.ts` under `it.auth` namespace
2. THE Translation_System SHALL contain all auth-related keys in `lib/translations.ts` under `en.auth` namespace
3. WHEN a new translation key is added, THE Translation_System SHALL have corresponding entries in both locales
4. THE Translation_System SHALL organize auth keys in logical sub-namespaces (login, register, reset, verify, common)

### Requirement 5: UX Consistency Across Auth Flow

**User Story:** Come utente, voglio una lingua consistente in tutto il flusso di autenticazione, così da non vedere lingue miste durante l'autenticazione.

#### Acceptance Criteria

1. WHEN a user changes language, THE Translation_System SHALL sync both localStorage AND cookie (NEXT_LOCALE) for Bridge Mode
2. WHEN a user navigates from marketing to dashboard, THE Dashboard SHALL use the same locale preference
3. THE Auth_Pages SHALL use the same Translation_System as the homepage and modal
4. THE Translation_System SHALL persist language preference in both localStorage (tradelia-language) AND cookie (NEXT_LOCALE)

### Requirement 6: Accessibility Compliance (WCAG AAA+)

**User Story:** Come utente con disabilità, voglio che le pagine auth siano accessibili e nella mia lingua, seguendo gli standard Tradelia 2026.

#### Acceptance Criteria

1. THE Root_Layout (app/layout.tsx) SHALL set `lang` attribute on html element based on cookie locale (WCAG 3.1.1)
2. THE Auth_Pages SHALL provide translated aria-labels for all interactive elements
3. THE Auth_Pages SHALL maintain WCAG AAA contrast ratios (8:1 per Tradelia 2026 internal standard)
4. THE Auth_Pages SHALL implement proper focus management (focusFirstInvalid on form errors)
5. THE Auth_Pages SHALL use aria-invalid, aria-errormessage, and role="alert" for form errors
6. THE Auth_Pages SHALL announce form errors to screen readers via aria-live regions

### Requirement 7: Homepage Freeze Policy

**User Story:** Come team lead, voglio che la homepage rimanga invariata, così da non introdurre regressioni nel marketing.

#### Acceptance Criteria

1. THE Homepage structure in `app/(marketing)/page.tsx` SHALL NOT be modified
2. THE Homepage components in `components/sections/` SHALL NOT be modified
3. THE Homepage translations in `lib/translations.ts` (hero, research, trust, etc.) SHALL NOT be modified
4. ONLY auth-related translation keys SHALL be added to `lib/translations.ts`

### Requirement 8: Security Best Practices

**User Story:** Come security engineer, voglio che le pagine auth seguano le best practice di sicurezza, così da proteggere gli utenti.

#### Acceptance Criteria

1. THE Auth_Pages SHALL sanitize all user inputs before display to prevent XSS
2. THE Auth_Pages SHALL use ONLY generic error messages to prevent email enumeration (e.g., "Se l'email esiste, riceverai un messaggio...")
3. THE Auth_Pages SHALL use secure password input fields with correct autocomplete attributes (current-password, new-password)
4. THE Auth_Pages SHALL implement rate limiting awareness with translated message (auth.common.rateLimited)
5. THE Auth_Pages SHALL implement safe redirect utility that accepts ONLY relative paths or allowlisted URLs
6. THE Translation_System SHALL NOT interpolate user input directly into translations (render email in separate sanitized span)
7. THE Auth_Pages SHALL strip tokens from URL after consuming them (history.replaceState)
8. THE Auth_Pages SHALL map SDK error codes to translation keys, NEVER display raw error.message

### Requirement 9: Performance Best Practices

**User Story:** Come utente, voglio che le pagine auth carichino velocemente, così da non aspettare durante l'autenticazione.

#### Acceptance Criteria

1. THE Auth_Pages SHALL NOT increase the main bundle size by more than 5KB (measured via bundle analyzer in CI)
2. THE Auth_Pages SHALL use layout-level LanguageProvider (app/auth/layout.tsx), NOT per-page wrapping
3. THE Auth_Pages SHALL memoize t() function in provider (useMemo, depends only on locale)
4. THE Auth_Pages SHALL implement proper loading states with CSS skeleton (no heavy lib)
5. THE Auth_Pages SHALL split form logic into separate components for better code-splitting

### Requirement 10: Code Quality Best Practices

**User Story:** Come sviluppatore, voglio che il codice auth sia manutenibile e type-safe, così da poterlo estendere facilmente.

#### Acceptance Criteria

1. THE Auth_Pages SHALL use TypeScript strict mode with no `any` types
2. THE Auth_Pages SHALL follow ESLint boundaries (no imports from wrong layers)
3. THE Translation_System SHALL have typed translation keys for autocomplete support
4. THE Auth_Pages SHALL have inline documentation for complex logic
5. THE Auth_Pages SHALL follow Tradelia 2026 component patterns (separation of concerns)
6. THE Auth_Pages SHALL export reusable hooks and utilities for future use

### Requirement 11: UI/UX Best Practices (Tradelia 2026)

**User Story:** Come utente, voglio che le pagine auth abbiano la stessa qualità visiva della homepage, così da avere un'esperienza coerente.

#### Acceptance Criteria

1. THE Auth_Pages SHALL follow Tradelia 2026 color palette (desaturated, institutional)
2. THE Auth_Pages SHALL use consistent spacing (section-sm/md/lg patterns)
3. THE Auth_Pages SHALL implement micro-interactions (150ms, cubic-bezier easing)
4. THE Auth_Pages SHALL show clear visual feedback for all interactive states
5. THE Auth_Pages SHALL use consistent typography (text-sm, text-muted-foreground patterns)
6. THE Auth_Pages SHALL implement proper focus management for keyboard users
7. THE Auth_Pages SHALL respect prefers-reduced-motion for animations
