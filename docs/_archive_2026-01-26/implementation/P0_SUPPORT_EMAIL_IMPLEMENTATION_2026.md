# P0: Support Email Visible - Implementation Guide 2026

**Priority**: 🔴 P0 (Critical - Must Have)  
**Effort**: 10 minuti  
**Impact**: MEDIUM (professionalità, trust)  
**Status**: 📋 Ready to Implement

---

## Executive Summary

**Cosa**: Rendere visibile l'email di supporto in footer e pagine chiave  
**Dove**: Footer globale + Contact page + Dashboard help  
**Perché**: Standard 2026, aumenta trust, facilita contatto

**Changes**:
- ✅ Add support email to footer
- ✅ Add to contact page
- ✅ Add to dashboard help
- ✅ Make it clickable (mailto:)
- ✅ Add copy-to-clipboard functionality

---

## Implementation

### Step 1: Update Footer Component (5 min)

**File**: `src/templates/Footer.tsx` (or wherever footer is)

```typescript
export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* ... existing columns ... */}
          
          {/* Support Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@tradelia.com"
                  className="text-muted-foreground hover:text-foreground"
                >
                  support@tradelia.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Tradelia. All rights reserved.</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a 
              href="mailto:support@tradelia.com"
              className="text-primary hover:underline"
            >
              support@tradelia.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### Step 2: Update Contact Page (3 min)

**File**: `src/app/[locale]/contact/page.tsx`

Add support email prominently:

```typescript
export default function ContactPage() {
  return (
    <div className="container max-w-2xl py-12">
      {/* ... existing content ... */}
      
      {/* Contact info */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Other ways to reach us</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <a 
                href="mailto:support@tradelia.com"
                className="text-sm text-primary hover:underline"
              >
                support@tradelia.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Response time</p>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Update Dashboard Help (2 min)

**File**: `src/app/[locale]/(auth)/dashboard/help/page.tsx`

```typescript
export default function DashboardHelpPage() {
  return (
    <div className="space-y-8">
      {/* Header with support email */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">Need Help?</h2>
        <p className="text-sm text-muted-foreground">
          Email us at{' '}
          <a 
            href="mailto:support@tradelia.com"
            className="text-primary hover:underline"
          >
            support@tradelia.com
          </a>
          {' '}or use the contact form below. We typically respond within 24 hours.
        </p>
      </div>
      
      {/* ... rest of page ... */}
    </div>
  );
}
```

---

## Optional: Copy-to-Clipboard Component

For better UX, add a copy button:

**File**: `src/components/SupportEmail.tsx`

```typescript
'use client';

import { Check, Copy, Mail } from 'lucide-react';
import { useState } from 'react';

export function SupportEmail() {
  const [copied, setCopied] = useState(false);
  const email = 'support@tradelia.com';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
      <Mail className="h-5 w-5 text-muted-foreground" />
      <a 
        href={`mailto:${email}`}
        className="flex-1 text-sm font-medium text-primary hover:underline"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md p-2 hover:bg-accent"
        aria-label="Copy email address"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
```

Usage:

```typescript
import { SupportEmail } from '@/components/SupportEmail';

<SupportEmail />
```

---

## Environment Variables

**File**: `.env.local`

```bash
# Support email (for reference)
SUPPORT_EMAIL=support@tradelia.com
```

---

## Testing Checklist

- [ ] Email visible in footer
- [ ] Email visible on contact page
- [ ] Email visible in dashboard help
- [ ] mailto: link works
- [ ] Copy button works (if implemented)
- [ ] Mobile responsive
- [ ] Dark mode works

---

## Success Metrics

**Track**:
- Email clicks (mailto: links)
- Copy button usage
- Email open rate (if using tracking)

**Target**:
- Visible on 100% of pages (via footer)
- < 2 clicks to find support email
- > 90% users can find it easily

---

**Implementation Time**: 10 minutes  
**Difficulty**: Easy  
**ROI**: Medium (trust + professionalism)

**Ready to implement!** 🚀
