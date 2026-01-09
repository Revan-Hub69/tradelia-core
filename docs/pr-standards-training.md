# PR Standards Training - Tradelia 2026

## Overview

This document provides training for the Tradelia 2026 PR standards, ensuring all team members understand the quality requirements and automated checks.

**Principio Guida**: "Se non è abbastanza buono per Google Workspace, non è abbastanza buono per Tradelia."

## PR Template Sections

### 1. Code Quality Checks

#### Import Boundaries
- **Rule**: Respect architectural layers (shared → entities → features → widgets)
- **Check**: ESLint will fail if boundaries are violated
- **Example**: Entities cannot import from features or widgets

```typescript
// ❌ Wrong - Entity importing from feature
import { useAuth } from '@/features/auth/hooks/useAuth';

// ✅ Correct - Entity receives data via props
interface UserEntityProps {
  isAuthenticated: boolean;
}
```

#### Bundle Size Budgets
- **Marketing**: <150KB (lightweight, Italian-only)
- **Dashboard**: <300KB (full-featured, i18n)
- **Check**: Automated bundle analysis in CI

#### TypeScript Strict Mode
- **Rule**: No `any` types, proper type safety
- **Check**: `npx tsc --noEmit --strict` must pass
- **Tip**: Use proper type definitions for all props and functions

### 2. Accessibility (WCAG AAA+)

#### Contrast Ratios
- **Primary text**: 8:1 contrast ratio minimum
- **Secondary text**: 4.5:1 contrast ratio minimum
- **Check**: Automated color contrast verification

#### Keyboard Navigation
- **Rule**: All interactive elements accessible via keyboard
- **Test**: Tab through entire interface, verify focus indicators
- **Tip**: Use semantic HTML elements when possible

#### Screen Reader Compatibility
- **Rule**: Proper ARIA labels and semantic structure
- **Test**: Use NVDA, JAWS, or browser screen reader
- **Tip**: Test with eyes closed to verify experience

### 3. Performance Standards

#### Lighthouse Scores
- **Performance**: >95
- **Accessibility**: 100
- **Check**: Lighthouse CI runs on every PR

#### Service Worker Caching
- **Rule**: Follow data freshness categories
- **Categories**: immutable-asset, freshness-critical, stale-allowed, static-snapshot
- **Check**: Verify proper cache headers and TTL

### 4. Internationalization (Dashboard Only)

#### Translation Requirements
- **Rule**: All user-facing strings use `t()` function
- **Check**: Automated scan for hardcoded strings
- **Files**: Update both `messages/it/` and `messages/en/`

```tsx
// ❌ Wrong - Hardcoded string
<button>Save Changes</button>

// ✅ Correct - Using translation
<button>{t('common.save')}</button>
```

#### Marketing Exception
- **Rule**: Marketing pages remain Italian-only (no i18n overhead)
- **Check**: Automated verification that marketing doesn't import i18n

### 5. Security Compliance

#### Input Validation
- **Rule**: All user inputs must be validated and sanitized
- **Check**: Verify form validation and XSS prevention
- **Tip**: Use the security utilities in `lib/security.ts`

#### CSP Compliance
- **Rule**: No inline scripts or `unsafe-eval`
- **Check**: Automated CSP violation detection
- **Tip**: Use proper event handlers instead of inline scripts

#### Sensitive Data
- **Rule**: No PII or secrets in logs
- **Check**: Automated scan for sensitive data patterns
- **Tip**: Use the logger's PII sanitization features

### 6. Testing Requirements

#### Coverage Thresholds
- **Unit tests**: 80% minimum coverage
- **Integration tests**: Critical flows covered
- **E2E tests**: User journeys tested

#### Property-Based Testing
- **Rule**: Complex algorithms use property-based tests
- **Tool**: Use fast-check for property-based testing
- **Example**: Data validation, calculations, transformations

### 7. Tradelia 2026 Compliance

#### Copy Principles
- **Chiarezza > Persuasione**: Avoid excitement-inducing words
- **Verificabilità > Opinione**: All claims must be traceable
- **Neutralità > Bias**: Use neutral, academic tone

```markdown
❌ "Amazing dashboard that revolutionizes crypto trading!"
✅ "Dashboard dinamica che evita gli errori nel mondo crypto."

❌ "73% of traders choose incompatible tools"
✅ "I portali di comparazione sono spesso remunerati tramite affiliazioni."
```

#### Color Palette
- **Rule**: Use only approved Tradelia 2026 colors
- **Palette**: Desaturated, institutional colors
- **Check**: Automated scan for non-approved colors

## Pre-PR Checklist

### Before Creating PR
1. **Run local checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run test:unit
   npm run build
   ```

2. **Test accessibility**:
   - Tab through interface
   - Test with screen reader
   - Verify color contrast

3. **Check bundle sizes**:
   ```bash
   npm run analyze:marketing
   npm run analyze:dashboard
   ```

4. **Verify translations**:
   - All strings use `t()` function
   - Both IT and EN files updated
   - No hardcoded text

### PR Creation
1. **Use the template**: GitHub will auto-populate the PR template
2. **Fill all sections**: Don't skip checklist items
3. **Add metrics**: Include before/after bundle sizes and performance scores
4. **Link related issues**: Reference issue numbers and design links

### During Review
1. **Address feedback promptly**: Respond to review comments quickly
2. **Update checklist**: Mark items as completed when addressed
3. **Re-run checks**: Ensure CI passes after changes
4. **Test thoroughly**: Verify all functionality works as expected

## Common Issues and Solutions

### Bundle Size Violations
**Problem**: Bundle exceeds size limits
**Solution**: 
- Use dynamic imports for heavy components
- Check for duplicate dependencies
- Remove unused imports

### Accessibility Failures
**Problem**: WCAG compliance issues
**Solution**:
- Add proper ARIA labels
- Improve color contrast
- Fix keyboard navigation

### Translation Issues
**Problem**: Missing or hardcoded strings
**Solution**:
- Extract all strings to JSON files
- Use `t()` function consistently
- Verify both languages

### Performance Regressions
**Problem**: Lighthouse scores drop
**Solution**:
- Optimize images (WebP, lazy loading)
- Remove unused JavaScript
- Implement proper caching

## Tools and Resources

### Development Tools
- **ESLint**: `npm run lint`
- **TypeScript**: `npm run type-check`
- **Bundle Analyzer**: `npm run analyze`
- **Lighthouse**: `npm run lighthouse`

### Testing Tools
- **Unit Tests**: `npm run test:unit`
- **E2E Tests**: `npm run test:e2e`
- **Accessibility**: `npm run test:a11y`
- **Coverage**: `npm run test:coverage`

### Accessibility Tools
- **NVDA**: Free screen reader for Windows
- **axe DevTools**: Browser extension for accessibility testing
- **Colour Contrast Analyser**: Tool for checking contrast ratios

### Performance Tools
- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: Online performance testing
- **Bundle Analyzer**: Visualize bundle composition

## Getting Help

### Documentation
- **Architecture**: `.kiro/specs/tradelia-superbig-dashboard/design.md`
- **Requirements**: `.kiro/specs/tradelia-superbig-dashboard/requirements.md`
- **Tradelia 2026 Guide**: `.kiro/steering/tradelia-2026-design-copy-guide.md`

### Team Support
- **Code Review**: Tag `@lead-developer` for architecture questions
- **Accessibility**: Tag `@accessibility-expert` for WCAG issues
- **Performance**: Tag `@performance-engineer` for optimization help
- **Security**: Tag `@security-engineer` for security concerns

### Escalation Process
1. **Try to resolve locally**: Use documentation and tools
2. **Ask team member**: Reach out to relevant expert
3. **Escalate to lead**: If issue blocks progress
4. **Document solution**: Update training materials if needed

## Success Metrics

### Quality Gates
- **All CI checks pass**: Green build status
- **Code review approved**: At least one approval
- **Performance maintained**: No regressions in Lighthouse scores
- **Accessibility verified**: WCAG AAA+ compliance

### Team Goals
- **PR cycle time**: <24 hours from creation to merge
- **First-time pass rate**: >90% of PRs pass CI on first try
- **Review quality**: Meaningful feedback, not just approval
- **Knowledge sharing**: Team members learn from each review

---

**Remember**: These standards exist to ensure Tradelia meets the highest quality bar. When in doubt, ask "Is this good enough for Google Workspace?" If not, keep improving.