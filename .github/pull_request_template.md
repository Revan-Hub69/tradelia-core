# PR Checklist - Tradelia 2026

**Principio Guida**: "Se non è abbastanza buono per Google Workspace, non è abbastanza buono per Tradelia."

## 📋 Pre-submission Checklist

### Code Quality
- [ ] **Import boundaries respected** - ESLint passes without violations
- [ ] **No circular dependencies** - Verified with `npm run check:deps`
- [ ] **TypeScript strict mode passes** - No `any` types, proper type safety
- [ ] **Bundle size budget not exceeded** - Marketing <150KB, Dashboard <300KB
- [ ] **Architecture rules followed** - Proper layer separation (shared/entities/features/widgets)

### Accessibility (WCAG AAA+)
- [ ] **Contrast ratios verified** - 8:1 for primary text, 4.5:1 minimum for secondary
- [ ] **Keyboard navigation tested** - All interactive elements accessible via keyboard
- [ ] **Screen reader compatibility checked** - Tested with NVDA/JAWS or browser screen reader
- [ ] **Focus management working** - Proper focus indicators and logical tab order
- [ ] **Semantic HTML used** - Proper heading hierarchy, landmarks, and ARIA labels

### Performance
- [ ] **No performance regressions** - Lighthouse CI score maintained (>95)
- [ ] **Service Worker caching rules followed** - Proper freshness categories applied
- [ ] **Critical resources preloaded** - Above-the-fold content optimized
- [ ] **Virtual scrolling for large lists** - Lists >100 items use virtualization
- [ ] **Image optimization** - WebP format, proper sizing, lazy loading

### Internationalization (Dashboard Only)
- [ ] **All user-facing strings use t() function** - No hardcoded text in components
- [ ] **No hardcoded text in components** - All strings externalized to JSON files
- [ ] **Translation keys added to JSON files** - Both IT and EN translations provided
- [ ] **WCAG language compliance** - Proper `lang` attributes for mixed-language content
- [ ] **Marketing remains Italian-only** - No i18n overhead in marketing bundle

### Security
- [ ] **No sensitive data in logs** - PII sanitization applied
- [ ] **CSP headers not violated** - No inline scripts or unsafe-eval
- [ ] **Input validation implemented** - All user inputs validated and sanitized
- [ ] **Authentication/authorization checked** - Proper access controls in place
- [ ] **Rate limiting applied** - API endpoints protected against abuse

### Testing
- [ ] **Unit tests added/updated** - New functionality covered by tests
- [ ] **Property-based tests for core logic** - Complex algorithms tested with property-based testing
- [ ] **E2E tests for critical flows** - User journeys tested end-to-end
- [ ] **Accessibility tests passing** - Automated a11y tests included

### Data & Observability
- [ ] **Data freshness categories applied** - Proper caching strategy per data type
- [ ] **Structured logging implemented** - Trace IDs and context included
- [ ] **Error budgets respected** - No degradation of SLIs
- [ ] **Monitoring alerts configured** - Proper alerting for new features

## 📝 Description

### What does this PR do?
<!-- Describe the changes in this PR -->

### Why is this change needed?
<!-- Link to issue or explain the business need -->

### How was this tested?
<!-- Describe your testing approach -->

## 🔍 Review Focus Areas

### Architecture Impact
- [ ] **Route group separation maintained** - Marketing vs Dashboard bundles isolated
- [ ] **State ownership rules followed** - React Query/Zustand/IndexedDB boundaries respected
- [ ] **Import boundaries enforced** - No violations of layer architecture

### Tradelia 2026 Compliance
- [ ] **Chiarezza > Persuasione** - Copy increases clarity, not excitement
- [ ] **Verificabilità > Opinione** - All claims traceable to public sources
- [ ] **Neutralità > Bias** - Desaturated colors, neutral language, academic tone

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] **Feature flags configured** - New features behind flags if needed
- [ ] **Database migrations tested** - Schema changes verified in staging
- [ ] **Environment variables updated** - All required config in place

### Post-deployment
- [ ] **Monitoring dashboards checked** - Metrics flowing correctly
- [ ] **Error rates monitored** - No spike in error budgets
- [ ] **Performance verified** - Lighthouse scores maintained

## 📊 Metrics Impact

### Bundle Size Impact
- Marketing bundle: **[current size]** → **[new size]**
- Dashboard bundle: **[current size]** → **[new size]**

### Performance Impact
- Lighthouse Performance: **[before]** → **[after]**
- First Contentful Paint: **[before]** → **[after]**
- Largest Contentful Paint: **[before]** → **[after]**

### Accessibility Impact
- WCAG Compliance Level: **[before]** → **[after]**
- Axe violations: **[before]** → **[after]**

## 🔗 Related Links

- Issue: #[issue-number]
- Design: [Figma/design link]
- Documentation: [link to updated docs]
- Staging URL: [staging environment link]

---

## ⚠️ Breaking Changes

<!-- List any breaking changes and migration steps -->

## 🧪 Testing Instructions

<!-- Step-by-step instructions for reviewers to test this PR -->

1. 
2. 
3. 

---

**Reviewer Note**: This PR follows Tradelia 2026 standards. Focus on clarity, verifiability, and neutrality in all user-facing changes.