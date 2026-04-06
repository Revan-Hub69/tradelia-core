# 📚 Tradelia Documentation

## Overview
Tradelia is a deterministic trading cost simulator and comparison engine for retail and professional traders. It calculates the "cost drag" (trading friction) by comparing Financial Instruments (CFD vs Futures vs Options vs Spot) and Real Brokers (Interactive Brokers, Fineco, Binance, etc.) based on three exact vectors: Asset, Strategy, and Time Horizon.

## Core Purpose
Answer the question: *"Given my specific trading profile, which broker and which instrument are mathematically the most efficient when considering spreads, slippage, commissions, and overnight funding?"*

---

## 🏗️ Architecture

### Current Homepage Structure
```
src/app/[locale]/(unauth)/page.tsx
├── Navbar
├── LandingFooter
├── ProblemSection
├── TradeHero
├── HowItWorks
├── ScenarioSection (refactored with Framer Motion)
├── FAQ
├── DisclaimerBar
├── BrokerTicker
├── FeatureBento
├── Comparison
├── FinalCTA
└── TrustBadge
```

### Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with CSS variable theming
- **Animations:** Framer Motion (spring physics)
- **Internationalization:** next-intl (with i18n support)
- **Database:** Supabase (PostgreSQL)
- **Components:** shadcn/ui primitives
- **TypeScript:** Strict mode enabled

---

## 🎨 Design System

### Color Palette (CSS Variables)
```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--destructive, --destructive-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--popover, --popover-foreground
--card, --card-foreground
--border, --input, --ring
```

### Typography & Spacing
- **Font:** Inter (sans-serif), JetBrains Mono (monospace)
- **Scale:** text-xs → text-4xl (responsive)
- **Spacing:** 4px base unit (Tailwind default)
- **Radius:** lg (var(--radius)), md, sm

### Animations
- **Spring:** stiffness 300, damping 20 (drawer)
- **Tween:** duration 0.2s (quick transitions)
- **Hover/Tap:** scale(1.04) / scale(0.97)

---

## 📁 Project Structure

### Active Directories
```
src/
├── app/              # Next.js pages and API routes
│   ├── [locale]/    # Internationalized routes
│   ├── api/         # Backend endpoints (REST)
│   └── (unauth)/    # Public pages
├── components/
│   ├── ui/          # shadcn/ui primitives
│   ├── dashboard/   # Dashboard-specific components
│   ├── icons/       # Icon system (unified)
│   └── motion/      # Animation utilities
├── templates/       # Landing page sections
├── lib/
│   ├── validation/  # Zod schemas
│   ├── settings/    # Settings management
│   └── performance/ # Optimization utilities
├── stores/          # Zustand state stores
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── utils/           # Helper functions
├── i18n/            # Translation files
└── messages/        # next-intl messages (en, it)

supabase/
├── email-templates/ # V1 only (v2 removed)
└── functions/       # Edge functions

migrations/          # Database migrations
scripts/             # Build/data scripts
docs/                # Project documentation
public/              # Static assets
```

---

## 🔄 Workflow

### Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `refactor:` code improvement
- `chore:` maintenance
- `docs:` documentation
- `test:` testing

### Git Workflow
1. Pull latest from `origin/main`
2. Create feature branch
3. Make changes + test locally
4. Commit with proper message
5. Push and create PR
6. Merge after review

---

## 🌍 Internationalization

### Structure
```
messages/
├── en/
│   ├── Index.json      # Homepage
│   ├── Tools.json      # Tools section
│   └── ...             # Other namespaces
└── it/
    └── (mirror of en)
```

### Usage in Components
```tsx
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations('Tools'); // namespace
  return <h1>{t('title')}</h1>;
};
```

### Adding New Keys
1. Add to appropriate `messages/{locale}/{namespace}.json`
2. Run i18n-ally extract if configured
3. Update default locale fallbacks

---

## 🎯 Current Features

### Landing Page (Public)
- **ProblemSection:** Identifies trading cost pain points
- **TradeHero:** Main value proposition
- **HowItWorks:** 3-step process explanation
- **ScenarioSection:** Interactive simulator launcher (drawer)
- **FeatureBento:** Grid of key capabilities
- **Comparison:** Broker/instrument comparison
- **FAQ:** Frequently asked questions
- **TrustBadge:** Credibility indicators

### Dashboard (Auth Required)
- **MyChallengeDrawer:** User's simulation history (being refactored)
- **ProgramDrawer:** Detailed broker/instrument view
- **EnrollmentButton:** Start new simulation

---

## 🗑️ What Was Removed

### Legacy Systems (April 2026 Cleanup)
- ❌ All `docs/_archive/` files (120+)
- ❌ Email templates v2 (duplicates)
- ❌ Unused template components (15 files)
- ❌ Prop Firm challenge system (complete domain)
- ❌ Class-based ErrorBoundary (converted to functional)
- ❌ Duplicate icon components (unified system)
- ❌ Dead scripts in `/scripts`

### Documentation Cleaning
- Removed all 2026 session summaries
- Deleted audit reports no longer relevant
- Removed research papers on Prop Firms
- Kept only current architecture docs

---

## 🎨 Styling Guidelines

### Tailwind Configuration
We use `tailwind.config.ts` with CSS variables for theming:
```ts
colors: {
  background: 'hsl(var(--background))',
  primary: { DEFAULT: 'hsl(var(--primary))' },
  // ... semantic colors
}
```

### Component Styling
- Use Tailwind utility classes
- Follow design system colors
- Maintain 4:5 contrast ratio minimum
- Support dark/light mode via CSS variables

---

## ♿ Accessibility

### Standards
- WCAG 2.1 AA compliance
- Keyboard navigation required
- ARIA labels for interactive elements
- Focus visible indicators
- Skip links for main content

### Testing
- Test with keyboard only
- Use screen reader (NVDA/VoiceOver)
- Check color contrast ratios
- Verify focus order

---

## 🔧 Configuration Files

### Key Configuration
- `tailwind.config.ts` - Tailwind settings
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript options
- `eslint.config.js` - Linting rules
- `commitlint.config.ts` - Commit validation
- `lint-staged.config.js` - Pre-commit hooks

---

## 📦 Dependencies

### Production
- `next`: 15.5.9
- `react`: 19.0.0
- `framer-motion`: 12.29.2
- `next-intl`: latest
- `zustand`: state management
- `@supabase/supabase-js`: database client

### Development
- `@types/node`, `@types/react`, `@types/react-dom`
- `tailwindcss`, `autoprefixer`, `postcss`
- `eslint`, `typescript`, `husky`, `lint-staged`

---

## 🚀 Deployment

### Platform
- **Vercel** (auto-deploy from `main` branch)
- Build command: `npm run build`
- Output directory: `.next`

### Environment Variables
Required in Vercel/`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
```

### Preview Deployments
- Automatic on PR creation
- URL format: `pr-{number}--tradelia.vercel.app`

---

## 🐛 Known Issues

### Current Limitations
1. i18n keys missing for ScenarioSection (temporary static text)
2. Mobile drawer animations need testing on real devices
3. Performance audit pending (Lighthouse scores)

### Technical Debt
- Migration from Prop Firm schema to TradeScope schema incomplete
- Some components still reference "challenge" terminology
- Need to rename MyChallengeDrawer → TradeScopeSimulator

---

## 📖 Getting Started for New Developers

1. **Read this document thoroughly**
2. **Review the architecture** - understand TradeScope vision
3. **Set up local environment:**
   - Node.js 20+
   - Copy `.env.example` to `.env.local`
   - Fill Supabase credentials
4. **Run dev server:** `npm run dev`
5. **Explore homepage** at `http://localhost:3000`
6. **Check dashboard** after login

### Important: What We Are NOT
We are **NOT** a Prop Firm evaluation platform. We do **NOT**:
- Track challenge phases
- Sell prop firm evaluations
- Provide trading signals
- Offer funded accounts

We **ARE** a cost comparison engine for **real broker trading**.

---

## 📞 Contact & Support

**Maintainer:** Kilo (AI Engineer)  
**Repository:** https://github.com/Revan-Hub69/tradelia-core  
**Issues:** Use GitHub Issues for bugs/features

---

**Last Updated:** 2026-04-06  
**Version:** 1.0.3  
**License:** Proprietary
