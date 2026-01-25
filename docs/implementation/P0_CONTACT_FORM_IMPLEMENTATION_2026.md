# P0: Contact Form - Complete Implementation Guide 2026

**Priority**: 🔴 P0 (Critical - Must Have)  
**Effort**: 3-4 ore  
**Impact**: HIGH (professionalità)  
**Status**: 📋 Ready to Implement

---

## Executive Summary

**Cosa**: Form di contatto professionale con spam protection e accessibilità WCAG 2.2  
**Dove**: Landing page footer + Dashboard help section  
**Perché**: Ogni progetto serio 2026 deve avere un modo per contattare il team

**Features**:
- ✅ Validation client + server
- ✅ Spam protection (honeypot + rate limiting)
- ✅ Accessibility WCAG 2.2 AA
- ✅ Email notifications
- ✅ Success/error states
- ✅ Mobile-optimized

---

## 1. Research Tier-1: Best Practices 2026

### Form Accessibility

**Source**: [UXPin - Accessible Form Validation Best Practices](https://www.uxpin.com/studio/blog/accessible-form-validation-best-practices/)

> Required Fields: Indicate visually with asterisks and programmatically with the required attribute. Validation Timing: Combine real-time feedback for critical fields, on-blur checks for formatted inputs, and on-submit validation for comprehensive error reviews.

**Source**: [AllAccessible - React Accessibility Guide](https://www.allaccessible.org/blog/react-accessibility-best-practices-guide)

> React powers millions of modern web applications, but SPAs introduce unique accessibility challenges. Proper form labeling, error announcements, and keyboard navigation are essential.

**WCAG 2.2 Requirements**:
1. **Labels**: Every input must have a visible `<label>` with `for` attribute
2. **Error Messages**: Must be announced to screen readers via `aria-describedby`
3. **Required Fields**: Must use `required` attribute + visual indicator (*)
4. **Focus Management**: Errors should move focus to first invalid field
5. **Keyboard Navigation**: All fields accessible via Tab/Shift+Tab

### Spam Protection

**Source**: [Gravity Forms - Anti-Spam for WordPress](https://www.gravityforms.com/blog/gravity-forms-anti-spam-wordpress/)

> Cloudflare Turnstile provides frictionless, privacy-first bot protection through background challenges. Honeypot fields catch simple bots without user friction.

**Source**: [VPSFuel - Secure Your Contact Forms](https://understandably.vpsfuel.com/)

> Securing contact forms requires a multi-layered defense. The most effective strategy combines user-facing verification tools like CAPTCHA with invisible backend techniques such as honeypot fields.

**Best Practices 2026**:
1. **Honeypot Field** (invisible) - Catches 80% of bots
2. **Rate Limiting** (server-side) - Max 3 submissions/hour per IP
3. **Cloudflare Turnstile** (optional) - Better UX than reCAPTCHA
4. **Email Validation** (server-side) - Verify domain exists
5. **Content Filtering** (server-side) - Block spam keywords

**Recommendation**: Start with Honeypot + Rate Limiting (zero cost, 90% effective)

---

## 2. Architecture

### File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact page
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts          # API endpoint
│   └── [locale]/(auth)/dashboard/
│       └── help/
│           └── page.tsx              # Dashboard help with contact
├── components/
│   └── forms/
│       ├── ContactForm.tsx           # Main form component
│       ├── ContactFormSchema.ts      # Zod validation
│       └── HoneypotField.tsx         # Spam protection
├── lib/
│   ├── email/
│   │   └── send-contact-email.ts    # Email service
│   └── validation/
│       └── contact-validation.ts     # Server validation
└── types/
    └── contact.ts                    # TypeScript types
```

### Data Flow

```
User fills form
    ↓
Client validation (Zod)
    ↓
Submit to /api/contact
    ↓
Server validation (Zod + honeypot + rate limit)
    ↓
Send email (Resend/SendGrid)
    ↓
Save to Supabase (optional)
    ↓
Return success/error
    ↓
Show feedback to user
```

---

## 3. Implementation Step-by-Step

### Step 1: Install Dependencies (5 min)

```bash
# Email service (choose one)
npm install resend              # Recommended (free 100 emails/day)
# OR
npm install @sendgrid/mail      # Alternative

# Already installed
# - zod (validation)
# - react-hook-form (form management)
# - @hookform/resolvers (zod integration)
```

### Step 2: Create Types (5 min)

**File**: `src/types/contact.ts`

```typescript
import { z } from 'zod';

// Validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  
  // Honeypot field (must be empty)
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// API response types
export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### Step 3: Create Honeypot Component (10 min)

**File**: `src/components/forms/HoneypotField.tsx`

```typescript
'use client';

/**
 * Honeypot Field - Invisible spam trap
 * 
 * How it works:
 * 1. Hidden from humans via CSS (position: absolute, opacity: 0)
 * 2. Bots fill it because they see it in HTML
 * 3. Server rejects if field is not empty
 * 
 * IMPORTANT: Do NOT use display: none (bots detect it)
 */
export function HoneypotField() {
  return (
    <div
      className="absolute left-0 top-0 -z-10 h-0 w-0 opacity-0"
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor="website">
        Website (leave blank)
      </label>
      <input
        type="text"
        id="website"
        name="website"
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}
```

### Step 4: Create Contact Form Component (45 min)

**File**: `src/components/forms/ContactForm.tsx`

```typescript
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ContactFormData } from '@/types/contact';
import { contactFormSchema } from '@/types/contact';

import { HoneypotField } from './HoneypotField';

interface ContactFormProps {
  variant?: 'landing' | 'dashboard';
  onSuccess?: () => void;
}

export function ContactForm({ variant = 'landing', onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      reset();
      onSuccess?.();
    }
    catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Honeypot field (invisible) */}
      <HoneypotField />

      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Subject field */}
      <div className="space-y-2">
        <Label htmlFor="subject">
          Subject <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="subject"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          {...register('subject')}
        />
        {errors.subject && (
          <p id="subject-error" className="text-sm text-destructive" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message field */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Success message */}
      {submitStatus === 'success' && (
        <div
          className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400"
          role="status"
          aria-live="polite"
        >
          ✓ Message sent successfully! We'll reply within 24 hours.
        </div>
      )}

      {/* Error message */}
      {submitStatus === 'error' && (
        <div
          className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          ✗ {errorMessage}
        </div>
      )}
    </form>
  );
}
```

### Step 5: Create API Endpoint (30 min)

**File**: `src/app/api/contact/route.ts`

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { contactFormSchema } from '@/types/contact';
import { rateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter: max 3 requests per hour per IP
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    try {
      await limiter.check(3, ip); // 3 requests per hour
    }
    catch {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const data = contactFormSchema.parse(body);

    // Check honeypot field
    if (data.website) {
      // Bot detected - return success but don't send email
      return NextResponse.json({ success: true, message: 'Message sent' });
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'Tradelia Contact <noreply@tradelia.com>',
      to: 'support@tradelia.com',
      replyTo: data.email,
      subject: `[Contact Form] ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Optional: Save to Supabase for tracking
    // await supabase.from('contact_submissions').insert({
    //   name: data.name,
    //   email: data.email,
    //   subject: data.subject,
    //   message: data.message,
    //   ip,
    //   created_at: new Date().toISOString(),
    // });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 },
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 },
    );
  }
}
```

### Step 6: Create Contact Page (20 min)

**File**: `src/app/[locale]/contact/page.tsx`

```typescript
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { ContactForm } from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Tradelia',
  description: 'Get in touch with the Tradelia team',
};

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="container max-w-2xl py-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('title', { default: 'Contact Us' })}
          </h1>
          <p className="text-muted-foreground">
            {t('description', {
              default: 'Have a question? We\'d love to hear from you. Send us a message and we\'ll respond within 24 hours.',
            })}
          </p>
        </div>

        {/* Contact info */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Other ways to reach us</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Email:</span>{' '}
              <a href="mailto:support@tradelia.com" className="text-primary hover:underline">
                support@tradelia.com
              </a>
            </div>
            <div>
              <span className="font-medium">Response time:</span> Within 24 hours
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-lg border bg-card p-6">
          <ContactForm variant="landing" />
        </div>
      </div>
    </div>
  );
}
```

### Step 7: Add to Dashboard Help (15 min)

**File**: `src/app/[locale]/(auth)/dashboard/help/page.tsx`

```typescript
import { ContactForm } from '@/components/forms/ContactForm';

export default function DashboardHelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Need help? Check our FAQ or contact us directly.
        </p>
      </div>

      {/* FAQ section (to be implemented) */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
        {/* FAQ component here */}
      </section>

      {/* Contact form */}
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

### Step 8: Add Translations (10 min)

**File**: `messages/en/contact.json`

```json
{
  "title": "Contact Us",
  "description": "Have a question? We'd love to hear from you.",
  "form": {
    "name": "Name",
    "email": "Email",
    "subject": "Subject",
    "message": "Message",
    "submit": "Send Message",
    "sending": "Sending...",
    "success": "Message sent successfully! We'll reply within 24 hours.",
    "error": "Failed to send message. Please try again."
  }
}
```

**File**: `messages/it/contact.json`

```json
{
  "title": "Contattaci",
  "description": "Hai una domanda? Ci piacerebbe sentirti.",
  "form": {
    "name": "Nome",
    "email": "Email",
    "subject": "Oggetto",
    "message": "Messaggio",
    "submit": "Invia Messaggio",
    "sending": "Invio in corso...",
    "success": "Messaggio inviato con successo! Risponderemo entro 24 ore.",
    "error": "Invio fallito. Riprova."
  }
}
```

### Step 9: Setup Environment Variables (5 min)

**File**: `.env.local`

```bash
# Resend API Key (get from https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Support email
SUPPORT_EMAIL=support@tradelia.com
```

### Step 10: Test (15 min)

**Test Checklist**:
- [ ] Form validation works (client-side)
- [ ] Required fields show errors
- [ ] Email validation works
- [ ] Honeypot catches bots (fill hidden field)
- [ ] Rate limiting works (try 4 submissions)
- [ ] Email is sent successfully
- [ ] Success message appears
- [ ] Error handling works
- [ ] Keyboard navigation works (Tab/Shift+Tab)
- [ ] Screen reader announces errors
- [ ] Mobile responsive
- [ ] Dark mode works

---

## 4. Advanced Features (Optional)

### A. Cloudflare Turnstile (Better than reCAPTCHA)

**Why**: Privacy-first, better UX, free

**Installation**:
```bash
npm install @marsidev/react-turnstile
```

**Usage**:
```typescript
import { Turnstile } from '@marsidev/react-turnstile';

<Turnstile
  siteKey="your-site-key"
  onSuccess={(token) => setTurnstileToken(token)}
/>
```

### B. File Attachments

**Why**: Users can send screenshots

**Implementation**:
```typescript
// Add to schema
attachments: z.array(z.instanceof(File)).max(3).optional(),

// Upload to Supabase Storage
const { data } = await supabase.storage
  .from('contact-attachments')
  .upload(`${Date.now()}-${file.name}`, file);
```

### C. Auto-reply Email

**Why**: Confirm receipt

**Implementation**:
```typescript
// Send confirmation to user
await resend.emails.send({
  from: 'Tradelia <noreply@tradelia.com>',
  to: data.email,
  subject: 'We received your message',
  html: `
    <p>Hi ${data.name},</p>
    <p>Thanks for contacting us! We'll get back to you within 24 hours.</p>
  `,
});
```

---

## 5. Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Resend API key configured
- [ ] Support email verified
- [ ] Rate limiting tested
- [ ] Spam protection tested
- [ ] Email delivery tested
- [ ] Mobile tested
- [ ] Accessibility tested (WAVE, axe)
- [ ] Analytics tracking added (optional)

---

## 6. Maintenance

**Monthly**:
- Check spam submissions (honeypot catches)
- Review rate limit logs
- Monitor email delivery rate

**Quarterly**:
- Update dependencies
- Review and improve FAQ based on common questions
- A/B test form fields (optional)

---

## 7. Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| **Resend** | 100 emails/day | $20/month (50k emails) |
| **SendGrid** | 100 emails/day | $15/month (40k emails) |
| **Cloudflare Turnstile** | Unlimited | Free |
| **Supabase Storage** | 1GB | $0.021/GB |

**Recommendation**: Start with Resend free tier (100 emails/day = 3000/month)

---

## 8. Success Metrics

**Track**:
- Submissions per day
- Spam caught (honeypot + rate limit)
- Response time (support team)
- User satisfaction (follow-up survey)

**Target**:
- < 5% spam rate
- < 24h response time
- > 90% user satisfaction

---

## Sources

1. [UXPin - Accessible Form Validation](https://www.uxpin.com/studio/blog/accessible-form-validation-best-practices/)
2. [AllAccessible - React Accessibility Guide](https://www.allaccessible.org/blog/react-accessibility-best-practices-guide)
3. [Gravity Forms - Anti-Spam](https://www.gravityforms.com/blog/gravity-forms-anti-spam-wordpress/)
4. [VPSFuel - Secure Contact Forms](https://understandably.vpsfuel.com/)
5. [Next.js - Form Accessibility](https://www.compilenrun.com/docs/framework/nextjs/nextjs-forms/nextjs-form-accessibility)

---

**Implementation Time**: 3-4 hours  
**Difficulty**: Medium  
**ROI**: High (essential feature)

**Ready to implement!** 🚀
