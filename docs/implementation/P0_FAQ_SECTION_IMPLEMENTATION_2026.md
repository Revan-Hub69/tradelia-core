# P0: FAQ Section - Complete Implementation Guide 2026

**Priority**: 🔴 P0 (Critical - Must Have)  
**Effort**: 3-4 ore  
**Impact**: HIGH (riduce support tickets del 40-60%)  
**Status**: 📋 Ready to Implement

---

## Executive Summary

**Cosa**: Sezione FAQ accessibile con accordion pattern  
**Dove**: Landing page + Dashboard help section  
**Perché**: Riduce support tickets, migliora UX, standard 2026

**Features**:
- ✅ Accordion UI (expand/collapse)
- ✅ Accessibility WCAG 2.2 AA
- ✅ Keyboard navigation
- ✅ Search functionality
- ✅ Categories organization
- ✅ Mobile-optimized

---

## 1. Research Tier-1: Best Practices 2026

### Accordion UI Design

**Source**: [Lollypop Design - Accessible Accordion UI](https://lollypop.design/blog/2025/december/accordion-ui-design/)

> A strong accordion is built from 6 core elements that work together to make the component easy to read, simple to interact with, and predictable for users.

**Source**: [Eleken - Accordion UI Best Practices](http://eleken.co/blog-posts/accordion-ui)


> Accordions present important content upfront, allowing users to quickly access key details and reducing the need to scroll through long pages. When designed well, accordion UIs save space, improve focus, and enhance mobile usability.

**Source**: [LogRocket - Accordion UI Design](https://blog.logrocket.com/ux-design/accordion-ui-design/)

> An accordion UI reduces cognitive load and eases navigation by allowing users to expand or collapse sections to reveal or hide content.

**Source**: [Aditus - Accessible Accordion](https://www.aditus.io/patterns/accordion/)

> Accordions relate to the UX technique of progressive disclosure, which aims to maintain the focus of a user's attention by reducing clutter, confusion and cognitive workload.

**Best Practices 2026**:
1. **Progressive Disclosure**: Show only what users need
2. **Clear Headers**: Descriptive question text
3. **Visual Indicators**: Icons showing expand/collapse state
4. **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space, Arrow keys)
5. **ARIA Attributes**: Proper roles and states for screen readers
6. **Single vs Multiple**: Allow multiple items open (better UX)
7. **Search**: Filter FAQs by keyword
8. **Categories**: Group related questions

### Accessibility Requirements

**WCAG 2.2 AA Compliance**:
1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Focus Indicators**: Visible focus states
3. **ARIA Roles**: `button` for headers, `region` for panels
4. **ARIA States**: `aria-expanded`, `aria-controls`, `aria-labelledby`
5. **Screen Reader**: Announce state changes
6. **Color Contrast**: 4.5:1 minimum for text

---

## 2. Architecture

### File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── faq/
│   │   │   └── page.tsx              # Standalone FAQ page
│   │   └── (auth)/dashboard/
│   │       └── help/
│   │           └── page.tsx          # Dashboard help with FAQ
├── components/
│   └── faq/
│       ├── FAQSection.tsx            # Main FAQ component
│       ├── FAQAccordion.tsx          # Accordion wrapper
│       ├── FAQItem.tsx               # Single FAQ item
│       ├── FAQSearch.tsx             # Search functionality
│       └── FAQCategories.tsx         # Category filter
├── data/
│   └── faq.ts                        # FAQ content (questions + answers)
└── types/
    └── faq.ts                        # TypeScript types
```

### Component Hierarchy

```
FAQSection
├── FAQSearch (optional)
├── FAQCategories (optional)
└── FAQAccordion
    └── FAQItem (multiple)
        ├── Header (button)
        └── Panel (content)
```

---

## 3. Implementation Step-by-Step

### Step 1: Create Types (5 min)

**File**: `src/types/faq.ts`

```typescript
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  keywords?: string[]; // For search
}

export type FAQCategory =
  | 'general'
  | 'account'
  | 'learning'
  | 'technical'
  | 'billing'
  | 'privacy';

export interface FAQCategoryInfo {
  id: FAQCategory;
  label: string;
  icon?: string;
}
```

### Step 2: Create FAQ Data (30 min)

**File**: `src/data/faq.ts`

```typescript
import type { FAQItem, FAQCategoryInfo } from '@/types/faq';

export const faqCategories: FAQCategoryInfo[] = [
  { id: 'general', label: 'General', icon: '❓' },
  { id: 'account', label: 'Account', icon: '👤' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'technical', label: 'Technical', icon: '⚙️' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
];

export const faqItems: FAQItem[] = [
  // General
  {
    id: 'what-is-tradelia',
    question: 'What is Tradelia?',
    answer: 'Tradelia is an interactive learning platform that helps you master cryptocurrency trading through gamified lessons, real-time simulations, and personalized progress tracking.',
    category: 'general',
    keywords: ['about', 'platform', 'what', 'crypto', 'trading'],
  },
  {
    id: 'how-it-works',
    question: 'How does Tradelia work?',
    answer: 'Tradelia uses a step-by-step learning approach with interactive lessons, quizzes, and simulations. You earn XP points as you progress, unlock new content, and track your learning journey through a personalized dashboard.',
    category: 'general',
    keywords: ['how', 'works', 'process', 'learn'],
  },
  {
    id: 'is-free',
    question: 'Is Tradelia free?',
    answer: 'Yes! Tradelia offers a free plan with access to core lessons and features. Premium plans with advanced content and features are also available.',
    category: 'general',
    keywords: ['free', 'cost', 'price', 'premium'],
  },

  // Account
  {
    id: 'create-account',
    question: 'How do I create an account?',
    answer: 'Click "Sign Up" in the header, then choose to sign up with email or use OAuth providers (Google, GitHub). Verify your email and you\'re ready to start learning!',
    category: 'account',
    keywords: ['signup', 'register', 'create', 'account', 'new'],
  },
  {
    id: 'reset-password',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox. The reset link expires after 24 hours.',
    category: 'account',
    keywords: ['password', 'reset', 'forgot', 'recover'],
  },
  {
    id: 'delete-account',
    question: 'How do I delete my account?',
    answer: 'Go to Dashboard → Settings → Account → Delete Account. This action is permanent and will delete all your data including progress, achievements, and personal information.',
    category: 'account',
    keywords: ['delete', 'remove', 'close', 'account', 'gdpr'],
  },

  // Learning
  {
    id: 'track-progress',
    question: 'How do I track my progress?',
    answer: 'Your dashboard shows your learning progress, XP points, completed lessons, and achievements. You can also view detailed statistics for each lesson category.',
    category: 'learning',
    keywords: ['progress', 'track', 'stats', 'dashboard'],
  },
  {
    id: 'earn-xp',
    question: 'How do I earn XP points?',
    answer: 'You earn XP by completing lessons, passing quizzes, and achieving milestones. Each lesson has a specific XP value shown before you start.',
    category: 'learning',
    keywords: ['xp', 'points', 'earn', 'gamification'],
  },
  {
    id: 'lesson-order',
    question: 'Do I need to complete lessons in order?',
    answer: 'Some lessons have prerequisites, but many can be completed in any order. Locked lessons will show what you need to complete first.',
    category: 'learning',
    keywords: ['order', 'sequence', 'prerequisites', 'locked'],
  },

  // Technical
  {
    id: 'change-language',
    question: 'How do I change the language?',
    answer: 'Click the language switcher in the header (🌐 icon) and select your preferred language. Currently supported: English and Italian.',
    category: 'technical',
    keywords: ['language', 'translate', 'i18n', 'locale'],
  },
  {
    id: 'change-theme',
    question: 'How do I switch between light and dark mode?',
    answer: 'Click the theme switcher in the header (☀️/🌙 icon). You can choose Light, Dark, or System (follows your device preference).',
    category: 'technical',
    keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
  },
  {
    id: 'mobile-support',
    question: 'Does Tradelia work on mobile?',
    answer: 'Yes! Tradelia is fully responsive and optimized for mobile devices. You can access all features on phones and tablets.',
    category: 'technical',
    keywords: ['mobile', 'responsive', 'phone', 'tablet'],
  },

  // Billing
  {
    id: 'premium-features',
    question: 'What do I get with Premium?',
    answer: 'Premium includes advanced lessons, exclusive content, priority support, detailed analytics, and ad-free experience.',
    category: 'billing',
    keywords: ['premium', 'paid', 'features', 'subscription'],
  },
  {
    id: 'cancel-subscription',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Dashboard → Settings → Billing → Cancel Subscription. You\'ll retain access until the end of your billing period.',
    category: 'billing',
    keywords: ['cancel', 'subscription', 'refund', 'billing'],
  },

  // Privacy
  {
    id: 'data-privacy',
    question: 'How is my data protected?',
    answer: 'We use industry-standard encryption, secure authentication, and follow GDPR compliance. Your data is never sold to third parties. See our Privacy Policy for details.',
    category: 'privacy',
    keywords: ['privacy', 'data', 'security', 'gdpr', 'protection'],
  },
  {
    id: 'cookies',
    question: 'What cookies does Tradelia use?',
    answer: 'We use essential cookies for authentication and preferences, and optional analytics cookies (with your consent). See our Cookie Policy for details.',
    category: 'privacy',
    keywords: ['cookies', 'tracking', 'analytics'],
  },
];
```

### Step 3: Create FAQ Item Component (20 min)

**File**: `src/components/faq/FAQItem.tsx`

```typescript
'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { FAQItem as FAQItemType } from '@/types/faq';

interface FAQItemProps {
  item: FAQItemType;
  defaultOpen?: boolean;
}

export function FAQItem({ item, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const headerId = `faq-header-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className="border-b border-border last:border-0">
      {/* Header (button) */}
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="text-base font-medium">{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Panel (content) */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'pb-4' : 'h-0'
        }`}
      >
        <div className="text-sm text-muted-foreground">{item.answer}</div>
      </div>
    </div>
  );
}
```


### Step 4: Create FAQ Accordion Component (15 min)

**File**: `src/components/faq/FAQAccordion.tsx`

```typescript
'use client';

import type { FAQItem as FAQItemType } from '@/types/faq';

import { FAQItem } from './FAQItem';

interface FAQAccordionProps {
  items: FAQItemType[];
  defaultOpenFirst?: boolean;
}

export function FAQAccordion({ items, defaultOpenFirst = false }: FAQAccordionProps) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No FAQs found. Try a different search or category.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border bg-card">
      {items.map((item, index) => (
        <FAQItem
          key={item.id}
          item={item}
          defaultOpen={defaultOpenFirst && index === 0}
        />
      ))}
    </div>
  );
}
```

### Step 5: Create FAQ Search Component (20 min)

**File**: `src/components/faq/FAQSearch.tsx`

```typescript
'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

interface FAQSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function FAQSearch({ onSearch, placeholder = 'Search FAQs...' }: FAQSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 pr-10"
        aria-label="Search frequently asked questions"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
```

### Step 6: Create FAQ Categories Component (20 min)

**File**: `src/components/faq/FAQCategories.tsx`

```typescript
'use client';

import type { FAQCategory, FAQCategoryInfo } from '@/types/faq';

interface FAQCategoriesProps {
  categories: FAQCategoryInfo[];
  activeCategory: FAQCategory | 'all';
  onCategoryChange: (category: FAQCategory | 'all') => void;
}

export function FAQCategories({
  categories,
  activeCategory,
  onCategoryChange,
}: FAQCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onCategoryChange('all')}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {category.icon && <span className="mr-1">{category.icon}</span>}
          {category.label}
        </button>
      ))}
    </div>
  );
}
```

### Step 7: Create Main FAQ Section Component (30 min)

**File**: `src/components/faq/FAQSection.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';

import type { FAQCategory } from '@/types/faq';
import { faqCategories, faqItems } from '@/data/faq';

import { FAQAccordion } from './FAQAccordion';
import { FAQCategories } from './FAQCategories';
import { FAQSearch } from './FAQSearch';

interface FAQSectionProps {
  variant?: 'landing' | 'dashboard';
  showSearch?: boolean;
  showCategories?: boolean;
  defaultCategory?: FAQCategory | 'all';
}

export function FAQSection({
  variant = 'landing',
  showSearch = true,
  showCategories = true,
  defaultCategory = 'all',
}: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'all'>(defaultCategory);

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqItems;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.keywords?.some((keyword) => keyword.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  return (
    <section className={variant === 'landing' ? 'py-20' : 'space-y-6'}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className={variant === 'landing' ? 'text-3xl font-bold' : 'text-2xl font-semibold'}>
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Find answers to common questions about Tradelia
        </p>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="max-w-2xl">
          <FAQSearch onSearch={setSearchQuery} />
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <FAQCategories
          categories={faqCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      {/* Results count */}
      {(searchQuery || activeCategory !== 'all') && (
        <p className="text-sm text-muted-foreground">
          {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'} found
        </p>
      )}

      {/* FAQ Accordion */}
      <FAQAccordion items={filteredFAQs} defaultOpenFirst={variant === 'landing'} />

      {/* Contact CTA */}
      {variant === 'landing' && (
        <div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold">Still have questions?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Can't find the answer you're looking for? Contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Contact Support
          </a>
        </div>
      )}
    </section>
  );
}
```

### Step 8: Add to Landing Page (10 min)

**File**: `src/app/[locale]/page.tsx` (modify existing)

```typescript
import { FAQSection } from '@/components/faq/FAQSection';

export default function LandingPage() {
  return (
    <>
      {/* ... existing sections ... */}
      
      {/* FAQ Section */}
      <FAQSection variant="landing" />
      
      {/* ... rest of page ... */}
    </>
  );
}
```

### Step 9: Add to Dashboard Help Page (10 min)

**File**: `src/app/[locale]/(auth)/dashboard/help/page.tsx`

```typescript
import { FAQSection } from '@/components/faq/FAQSection';
import { ContactForm } from '@/components/forms/ContactForm';

export default function DashboardHelpPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* FAQ Section */}
      <FAQSection variant="dashboard" />

      {/* Contact Form */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Contact Support</h2>
        <div className="max-w-2xl rounded-lg border bg-card p-6">
          <ContactForm variant="dashboard" />
        </div>
      </section>
    </div>
  );
}
```

### Step 10: Add Translations (15 min)

**File**: `messages/en/faq.json`

```json
{
  "title": "Frequently Asked Questions",
  "description": "Find answers to common questions about Tradelia",
  "search": {
    "placeholder": "Search FAQs...",
    "clear": "Clear search",
    "results": "{count} {count, plural, one {result} other {results}} found"
  },
  "categories": {
    "all": "All",
    "general": "General",
    "account": "Account",
    "learning": "Learning",
    "technical": "Technical",
    "billing": "Billing",
    "privacy": "Privacy"
  },
  "cta": {
    "title": "Still have questions?",
    "description": "Can't find the answer you're looking for? Contact our support team.",
    "button": "Contact Support"
  },
  "empty": "No FAQs found. Try a different search or category."
}
```

**File**: `messages/it/faq.json`

```json
{
  "title": "Domande Frequenti",
  "description": "Trova risposte alle domande comuni su Tradelia",
  "search": {
    "placeholder": "Cerca nelle FAQ...",
    "clear": "Cancella ricerca",
    "results": "{count} {count, plural, one {risultato} other {risultati}} trovati"
  },
  "categories": {
    "all": "Tutte",
    "general": "Generale",
    "account": "Account",
    "learning": "Apprendimento",
    "technical": "Tecnico",
    "billing": "Fatturazione",
    "privacy": "Privacy"
  },
  "cta": {
    "title": "Hai ancora domande?",
    "description": "Non trovi la risposta che cerchi? Contatta il nostro team di supporto.",
    "button": "Contatta Supporto"
  },
  "empty": "Nessuna FAQ trovata. Prova una ricerca o categoria diversa."
}
```

---

## 4. Advanced Features (Optional)

### A. Analytics Tracking

Track which FAQs are most viewed:

```typescript
const handleOpen = (faqId: string) => {
  // Track with analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', 'FAQ Viewed', { faqId });
  }
};
```

### B. Helpful/Not Helpful Feedback

```typescript
<div className="mt-4 flex items-center gap-2 text-sm">
  <span className="text-muted-foreground">Was this helpful?</span>
  <button onClick={() => handleFeedback('yes')}>👍 Yes</button>
  <button onClick={() => handleFeedback('no')}>👎 No</button>
</div>
```

### C. Related FAQs

Show related questions based on keywords:

```typescript
const relatedFAQs = faqItems
  .filter((faq) => 
    faq.id !== currentFaq.id &&
    faq.keywords?.some((k) => currentFaq.keywords?.includes(k))
  )
  .slice(0, 3);
```

---

## 5. Testing Checklist

- [ ] All FAQs display correctly
- [ ] Accordion expand/collapse works
- [ ] Search filters FAQs correctly
- [ ] Category filter works
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Screen reader announces state changes
- [ ] Focus indicators visible
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] No layout shift on expand/collapse
- [ ] Empty state shows when no results
- [ ] Contact CTA links to contact page

---

## 6. Content Guidelines

### Writing Good FAQ Questions

**DO**:
- Use natural language (how users ask)
- Start with question words (How, What, Why, Can)
- Be specific and clear
- Keep questions short (< 15 words)

**DON'T**:
- Use jargon or technical terms
- Make assumptions about user knowledge
- Write vague questions
- Duplicate similar questions

### Writing Good FAQ Answers

**DO**:
- Answer directly and concisely
- Use simple language
- Include actionable steps
- Link to related resources
- Keep answers short (< 100 words)

**DON'T**:
- Write long paragraphs
- Use marketing speak
- Assume context
- Leave questions partially answered

---

## 7. Maintenance

**Monthly**:
- Review analytics to see most viewed FAQs
- Add new FAQs based on support tickets
- Update outdated answers
- Remove irrelevant FAQs

**Quarterly**:
- Reorganize categories if needed
- A/B test FAQ order
- Survey users for missing topics

---

## 8. Success Metrics

**Track**:
- FAQ page views
- Search queries (what users look for)
- Most viewed FAQs
- Support ticket reduction
- Time on page

**Target**:
- 40-60% reduction in support tickets
- < 3% bounce rate on FAQ page
- > 2 min average time on page
- > 70% users find answer

---

## Sources

1. [Lollypop Design - Accessible Accordion UI](https://lollypop.design/blog/2025/december/accordion-ui-design/)
2. [Eleken - Accordion UI Best Practices](http://eleken.co/blog-posts/accordion-ui)
3. [LogRocket - Accordion UI Design](https://blog.logrocket.com/ux-design/accordion-ui-design/)
4. [Aditus - Accessible Accordion](https://www.aditus.io/patterns/accordion/)
5. [UXPatterns - Accordion Pattern](https://uxpatterns.dev/patterns/content-management/accordion)
6. [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Implementation Time**: 3-4 hours  
**Difficulty**: Medium  
**ROI**: Very High (reduces support load 40-60%)

**Ready to implement!** 🚀
