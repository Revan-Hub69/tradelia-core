# Implementation Plan: Auth Flow & i18n System

## Overview

Implementazione del sistema di internazionalizzazione per le pagine auth e il modale di onboarding. Usa il sistema `lib/translations.ts` esistente con Bridge Mode per sincronizzare preferenze tra marketing/auth e dashboard.

**Principio**: Homepage congelata, solo aggiunta chiavi auth.

**Best Practice 2026**: Sicurezza (anti-enumeration, safe redirect), performance (layout-level provider), qualità codice (TypeScript strict), UI/UX Tradelia.

## Tasks

- [ ] 1. Setup Bridge Mode infrastructure
  - [ ] 1.1 Create lib/locale-preference.ts
    - persistLocale() function that syncs localStorage + cookie
    - getLocale() function that reads from cookie/localStorage
    - _Requirements: 5.1, 5.2, 5.4_
  - [ ] 1.2 Update LanguageSelector to use Bridge Mode
    - Import persistLocale from lib/locale-preference
    - Call persistLocale in handleSetLocale
    - DO NOT change any other LanguageSelector behavior
    - _Requirements: 5.1, 5.4_
  - [ ] 1.3 Create app/auth/layout.tsx
    - Single LanguageProvider wrapper for all auth pages
    - NO per-page provider wrapping
    - _Requirements: 1.2, 9.2_

- [ ] 2. Add auth translation keys to lib/translations.ts
  - Add `auth` namespace with all required keys for both IT and EN
  - Include auth.common.aria.* keys for accessibility
  - Use ONLY generic error messages (anti-enumeration)
  - Add auth.common.rateLimited for rate limit awareness
  - DO NOT modify existing homepage translations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 8.2, 8.4_

- [ ] 3. Create security utilities
  - [ ] 3.1 Create lib/auth/safe-redirect.ts
    - safeRedirect() function with allowlist
    - Block protocol-relative URLs, javascript:, encoded tricks
    - _Requirements: 8.5_
  - [ ] 3.2 Create lib/auth/error-mapping.ts
    - mapAuthErrorToKey() function
    - Map Supabase error codes to translation keys
    - NEVER expose raw error.message
    - _Requirements: 8.8_

- [ ] 4. Update Login Page with i18n
  - [ ] 4.1 Remove any LanguageProvider wrapper (use layout)
    - Import useLanguage from @/components/LanguageSelector
    - _Requirements: 1.1, 9.2_
  - [ ] 4.2 Replace all hardcoded text with t() calls
    - Title, subtitle, labels, placeholders, buttons
    - Use generic error messages (anti-enumeration)
    - _Requirements: 1.1, 8.2_
  - [ ] 4.3 Add security attributes
    - autoComplete="email" for email field
    - autoComplete="current-password" for password field
    - Use mapAuthErrorToKey for error handling
    - Use safeRedirect for post-login redirect
    - _Requirements: 8.3, 8.5, 8.8_
  - [ ] 4.4 Add accessibility attributes
    - aria-label, aria-invalid, aria-errormessage
    - role="alert" for error messages
    - _Requirements: 6.2, 6.5_

- [ ] 5. Update Forgot Password Page with i18n
  - [ ] 5.1 Remove any LanguageProvider wrapper
    - _Requirements: 9.2_
  - [ ] 5.2 Replace all hardcoded text with t() calls
    - Use GENERIC success message (anti-enumeration)
    - "Se l'indirizzo è valido, riceverai un'email..."
    - _Requirements: 1.1, 8.2_
  - [ ] 5.3 Add security and accessibility attributes
    - _Requirements: 6.2, 8.3_

- [ ] 6. Update Reset Password Page with i18n
  - [ ] 6.1 Remove any LanguageProvider wrapper
    - _Requirements: 9.2_
  - [ ] 6.2 Update ResetPasswordForm with t() calls
    - Labels, placeholders, buttons, success/error states
    - _Requirements: 1.1_
  - [ ] 6.3 Add security attributes
    - autoComplete="new-password" for both password fields
    - Strip token from URL after consuming: history.replaceState()
    - _Requirements: 8.3, 8.7_
  - [ ] 6.4 Add accessibility attributes
    - _Requirements: 6.2, 6.5_

- [ ] 7. Update Verify Email Page with i18n
  - [ ] 7.1 Remove any LanguageProvider wrapper
    - _Requirements: 9.2_
  - [ ] 7.2 Replace all hardcoded text with t() calls
    - Remove emailNotFound error (anti-enumeration)
    - Use generic error messages
    - _Requirements: 1.1, 8.2_
  - [ ] 7.3 Fix TypeScript warnings
    - Remove unused ArrowRightIcon import
    - Fix unused catch variables (use _err pattern)
    - _Requirements: 10.1_
  - [ ] 7.4 Strip token from URL after consuming
    - _Requirements: 8.7_

- [ ] 8. Update Auth Callback Page with i18n
  - [ ] 8.1 Remove any LanguageProvider wrapper
    - _Requirements: 9.2_
  - [ ] 8.2 Replace hardcoded text with t() calls
    - Loading title and subtitle
    - Add error fallback message
    - _Requirements: 1.1_
  - [ ] 8.3 Strip token from URL after consuming
    - _Requirements: 8.7_
  - [ ] 8.4 Use safeRedirect for post-auth redirect
    - _Requirements: 8.5_

- [ ] 9. Update Dashboard Modal with complete translations
  - [ ] 9.1 Fix step 6 indicator to use translation
    - Replace hardcoded "Registrazione" with t('auth.register.title')
    - _Requirements: 3.1_
  - [ ] 9.2 Add translated aria-label for close button
    - Use t('auth.common.aria.closeModal')
    - _Requirements: 3.2, 6.2_

- [ ] 10. Update Registration Form with i18n
  - [ ] 10.1 Add useLanguage hook
    - Import from @/components/LanguageSelector
    - _Requirements: 2.4_
  - [ ] 10.2 Replace all hardcoded labels and placeholders
    - Full name, email, password, confirm password
    - _Requirements: 2.1_
  - [ ] 10.3 Add security attributes
    - autoComplete="name" for full name
    - autoComplete="email" for email
    - autoComplete="new-password" for passwords
    - minLength={8} maxLength={128} for passwords
    - _Requirements: 8.3_
  - [ ] 10.4 Replace all hardcoded error messages
    - Use translation keys
    - Use mapAuthErrorToKey for API errors
    - _Requirements: 2.2, 8.8_
  - [ ] 10.5 Add accessibility attributes
    - aria-invalid, aria-errormessage for each field
    - role="alert" for error messages
    - _Requirements: 6.2, 6.5_
  - [ ] 10.6 Replace all hardcoded status messages
    - Submit button states, terms text
    - _Requirements: 2.3_

- [ ] 11. Checkpoint - Manual Testing
  - Test all auth pages in Italian
  - Test all auth pages in English
  - Test language switching persists across pages (Bridge Mode)
  - Verify no Italian text appears when locale is EN
  - Test keyboard navigation and focus management
  - Verify error messages are generic (no email enumeration)
  - Verify tokens are stripped from URLs after use
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Write tests for translation system
  - [ ] 12.1 Test: Translation Key Parity
    - **Property 3: Translation Key Parity**
    - Verify all IT auth keys exist in EN and vice versa
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [ ] 12.2 Test: Translation Fallback Behavior
    - **Property 4: Translation Fallback Behavior**
    - Verify missing keys return key as fallback
    - **Validates: Requirements 1.8**
  - [ ] 12.3 Test: Safe Redirect Security
    - Test safeRedirect with malicious inputs
    - //evil.com, javascript:, encoded URLs
    - **Validates: Requirements 8.5**

- [ ] 13. Final Checkpoint
  - All auth pages fully translated
  - All TypeScript/ESLint errors resolved
  - All tests pass
  - No regressions in homepage
  - Bundle size within budget (< 5KB increase)
  - Security: no email enumeration, safe redirects, tokens stripped
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Homepage translations and components are NOT modified
- Uses existing `lib/translations.ts` system with Bridge Mode (localStorage + cookie)
- Single LanguageProvider in app/auth/layout.tsx (NOT per-page)
- All user-facing text must use t() function
- Security: Generic error messages only (no email enumeration)
- Security: safeRedirect for all post-auth redirects
- Security: Strip tokens from URL after consuming
- Performance: Layout-level provider, memoized t()
- Accessibility: aria-invalid, aria-errormessage, role="alert"
