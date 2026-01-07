# Design Document: Tradelia 2026 Best Practices Audit

## Overview

Questo documento definisce l'architettura tecnica e le specifiche di implementazione per allineare Tradelia alle best practice 2025-2026. Il design si basa sui principi di chiarezza, verificabilità e neutralità definiti nel Tradelia Design Guide, integrati con gli standard più recenti per SEO AI, accessibilità, performance e qualità del codice.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 16 App Router                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Layout    │  │   Pages     │  │ Components  │              │
│  │  (Server)   │  │  (Server)   │  │  (Mixed)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    SEO      │  │    i18n     │  │   Styles    │              │
│  │  (JSON-LD)  │  │ (next-intl) │  │ (Tailwind)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Supabase   │  │    PWA      │  │  Analytics  │              │
│  │   (Auth)    │  │    (SW)     │  │  (Privacy)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
app/
├── [locale]/                    # Locale-based routing
│   ├── layout.tsx              # Locale layout with i18n
│   ├── page.tsx                # Homepage
│   └── dashboard/
│       └── page.tsx
├── manifest.ts                  # PWA manifest (dynamic)
├── sitemap.ts                   # Dynamic sitemap
├── robots.ts                    # Robots.txt
└── layout.tsx                   # Root layout

components/
├── seo/
│   ├── JsonLd.tsx              # Structured data components
│   ├── OrganizationSchema.tsx
│   └── FAQSchema.tsx
├── ui/                          # Design system components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
└── ...

lib/
├── i18n/
│   ├── config.ts               # i18n configuration
│   ├── dictionaries/           # Translation files
│   │   ├── it.json
│   │   └── en.json
│   └── get-dictionary.ts
└── seo/
    └── structured-data.ts      # JSON-LD generators
```

---

## Components and Interfaces

### 1. SEO Components

#### JsonLd Component

```typescript
interface JsonLdProps {
  type: 'Organization' | 'WebSite' | 'FAQPage' | 'EducationalOrganization';
  data: Record<string, unknown>;
}

// Usage in layout.tsx
<JsonLd 
  type="Organization"
  data={{
    name: "Tradelia",
    url: "https://tradelia.com",
    logo: "https://tradelia.com/icons/icon-512x512.png",
    sameAs: [/* social profiles */]
  }}
/>
```

#### Structured Data Types

```typescript
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FAQItem[];
}

interface FAQItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

interface EducationalOrganizationSchema {
  "@context": "https://schema.org";
  "@type": "EducationalOrganization";
  name: string;
  description: string;
  areaServed: string;
  educationalCredentialAwarded?: string;
}
```

### 2. i18n Architecture

#### Configuration

```typescript
// lib/i18n/config.ts
export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English'
};
```

#### Dictionary Structure

```typescript
// Type-safe translations
interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    methodology: string;
    dashboard: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    cta: string;
  };
  // ... other sections
}
```

### 3. Design System Components

#### Button Component

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Styles aligned with Design Guide
const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'border border-border bg-background hover:bg-muted',
  ghost: 'hover:bg-muted'
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-6 text-sm'  // CTA principale
};
```

#### Card Component

```typescript
interface CardProps {
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Base styles
const baseStyles = 'rounded border border-border/50 bg-background p-5';
const interactiveStyles = 'transition-all duration-150 hover:border-border hover:bg-muted/30 hover:-translate-y-px';
```

---

## Data Models

### Translation Dictionary Schema

```typescript
// Strict typing for all translations
type TranslationKey = 
  | `metadata.${string}`
  | `nav.${string}`
  | `hero.${string}`
  | `context.${string}`
  | `methodology.${string}`
  | `limits.${string}`
  | `cta.${string}`
  | `footer.${string}`
  | `errors.${string}`;

// Runtime validation
function validateDictionary(dict: unknown): dict is Dictionary {
  // Validate all required keys exist
}
```

### SEO Metadata Schema

```typescript
interface PageMetadata {
  title: string;           // 50-60 chars
  description: string;     // 150-160 chars
  canonical: string;
  locale: Locale;
  alternates: {
    languages: Record<Locale, string>;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: 'website';
    images: OGImage[];
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    images: string[];
  };
}
```

---


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified and consolidated to eliminate redundancy:

### Property 1: Structured Data Presence
*For any* page in the application, the rendered HTML SHALL contain a valid JSON-LD script tag with properly formatted structured data that matches the page content.

**Validates: Requirements 1.1, 1.6**

---

### Property 2: Color Contrast Compliance
*For any* text element in the application, the contrast ratio between the text color and its background SHALL meet the following thresholds:
- Primary text (foreground): >= 7:1 (WCAG AAA)
- Secondary text (muted-foreground): >= 4.5:1 (WCAG AA)
- UI components and icons: >= 3:1 (WCAG AA)

**Validates: Requirements 3.1, 3.2, 3.3**

---

### Property 3: Keyboard Accessibility
*For any* interactive element (button, link, input, select), the element SHALL:
- Be focusable via Tab key
- Have a visible focus indicator
- Be activatable via Enter or Space key
- Not trap keyboard focus

**Validates: Requirements 3.6, 3.7, 3.8, 3.10**

---

### Property 4: Semantic HTML Structure
*For any* page in the application:
- Heading levels SHALL not skip (no h1 -> h3 without h2)
- All images SHALL have alt text or role="presentation"
- Interactive elements without visible text SHALL have aria-label
- Semantic landmarks (nav, main, article, section) SHALL be present

**Validates: Requirements 3.11, 3.12, 3.13, 3.15**

---

### Property 5: Animation Constraints
*For any* CSS transition or animation in the application:
- Duration SHALL be <= 150ms
- Properties SHALL only include transform and opacity (no layout-triggering properties)
- No bounce, pulse, or glow animation names SHALL exist
- prefers-reduced-motion media query SHALL disable or reduce animations

**Validates: Requirements 3.17, 3.18, 3.20, 10.1, 10.2, 10.3, 10.4**

---

### Property 6: Image Optimization
*For any* image element in the application:
- Images SHALL use next/image component (not raw img tag)
- Images SHALL have explicit width/height or aspect-ratio
- Below-fold images SHALL have loading="lazy"

**Validates: Requirements 4.3, 4.5, 4.12, 4.14**

---

### Property 7: Locale Content Consistency
*For any* page and locale combination:
- hreflang tags SHALL exist for all supported locales
- Meta tags SHALL be translated to the current locale
- SSR HTML SHALL contain translated content (not client-side hydrated)
- Date and number formats SHALL match locale conventions

**Validates: Requirements 5.8, 5.9, 5.10, 5.11, 5.13**

---

### Property 8: Translation Key Type Safety
*For any* translation key used in the application:
- The key SHALL exist in all locale dictionaries
- The key SHALL have the same structure across locales
- Pluralization rules SHALL be correctly applied for counts

**Validates: Requirements 5.6, 5.9**

---

### Property 9: Form Accessibility
*For any* form in the application:
- All inputs SHALL have associated labels
- Error messages SHALL be descriptive and actionable
- Destructive actions SHALL require confirmation
- Form labels SHALL be concise (under 50 characters)

**Validates: Requirements 7.6, 7.7, 7.8, 7.9**

---

### Property 10: TypeScript Strictness
*For any* TypeScript file in the application:
- No `any` type usage SHALL exist (except in type guards)
- All functions SHALL have explicit return types
- All props interfaces SHALL be defined
- Strict mode SHALL be enabled in tsconfig

**Validates: Requirements 8.1, 8.2, 8.3**

---

### Property 11: Server Component Default
*For any* React component in the application:
- Components SHALL be Server Components by default
- "use client" directive SHALL only be used when necessary (event handlers, hooks, browser APIs)
- Client components SHALL be leaf nodes where possible

**Validates: Requirements 8.6**

---

### Property 12: Responsive Touch Targets
*For any* interactive element on mobile viewports:
- Touch target size SHALL be >= 44x44px
- No fixed pixel widths SHALL break on small screens
- Spacing SHALL use relative units (rem, em, %)

**Validates: Requirements 9.8, 9.9**

---

### Property 13: CSS Spacing Scale
*For any* spacing value in the application CSS:
- Values SHALL be multiples of 4px (0.25rem)
- Font sizes SHALL match the defined type scale

**Validates: Requirements 2.2, 2.3**

---

## Error Handling

### SEO Errors
- Missing structured data: Log warning, render page without schema
- Invalid JSON-LD: Validate at build time, fail build on error
- Missing translations: Fall back to default locale, log warning

### Accessibility Errors
- Missing alt text: ESLint rule, fail build
- Contrast violations: Automated testing in CI
- Missing focus styles: Visual regression testing

### Performance Errors
- LCP > 2.5s: Alert in monitoring, investigate
- CLS > 0.1: Automated testing, fail PR
- Large bundle: Bundle analyzer in CI, warn on threshold

### i18n Errors
- Missing translation key: TypeScript error at compile time
- Invalid locale: Redirect to default locale
- Malformed date/number: Use Intl API with fallback

---

## Testing Strategy

### Dual Testing Approach

This implementation requires both unit tests and property-based tests:

**Unit Tests** (specific examples, edge cases):
- Schema validation for specific page types
- Lighthouse score thresholds
- Specific accessibility scenarios
- Build configuration verification

**Property-Based Tests** (universal properties):
- Contrast ratio calculations for all color combinations
- Keyboard navigation for all interactive elements
- Translation key consistency across locales
- CSS value validation

### Testing Framework

- **Unit/Integration**: Vitest + Testing Library
- **Property-Based**: fast-check (already in dependencies)
- **Accessibility**: axe-core + jest-axe
- **Visual Regression**: Playwright (optional)
- **Performance**: Lighthouse CI

### Test Configuration

```typescript
// Property tests: minimum 100 iterations
import fc from 'fast-check';

fc.configureGlobal({
  numRuns: 100,
  verbose: true
});
```

### Property Test Annotations

Each property test must reference its design document property:

```typescript
/**
 * Feature: tradelia-2026-best-practices-audit
 * Property 2: Color Contrast Compliance
 * Validates: Requirements 3.1, 3.2, 3.3
 */
test.prop([colorArbitrary, backgroundArbitrary])('contrast meets WCAG thresholds', (fg, bg) => {
  const ratio = calculateContrastRatio(fg, bg);
  return ratio >= 4.5; // AA minimum
});
```

---

## Implementation Notes

### Priority Order

1. **Critical (Week 1)**: Accessibility (WCAG), Performance (CWV)
2. **High (Week 2)**: SEO (structured data, meta), i18n architecture
3. **Medium (Week 3)**: Design system consistency, animations
4. **Low (Week 4)**: Code quality improvements, testing coverage

### Dependencies

- `next-intl` or custom i18n solution for translations
- `schema-dts` for TypeScript schema.org types
- `axe-core` for accessibility testing
- `fast-check` for property-based testing (already installed)

### Breaking Changes

- Route structure changes for locale-based routing
- Component API changes for accessibility props
- CSS variable naming for design tokens

### Migration Strategy

1. Add i18n infrastructure without breaking existing routes
2. Gradually migrate pages to locale-based routing
3. Add structured data incrementally
4. Refactor components for accessibility
5. Optimize performance metrics
