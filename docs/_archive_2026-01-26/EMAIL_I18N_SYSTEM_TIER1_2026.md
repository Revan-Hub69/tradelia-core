# EMAIL I18N SYSTEM - TIER 1 RESEARCH 2026

**STATUS**: Research Complete → Implementation Ready  
**PRIORITY**: P1 (User Experience + Professionalism)  
**RESEARCH DATE**: 2026-01-25

---

## EXECUTIVE SUMMARY

Comprehensive tier-1 research on bilingual email templates for Supabase + Brevo, focusing on:
1. **React Email + next-intl**: Modern, type-safe, component-based approach
2. **Template Organization**: Scalable structure for multiple email types
3. **Locale Detection**: Automatic language selection based on user preferences
4. **Maintainability**: Single source of truth for translations

**KEY FINDING**: React Email with next-intl provides the best DX and maintainability for bilingual emails.

---

## TIER 1 RESEARCH SOURCES

### 1. React Email Official Documentation (2026)
**Source**: https://react.email/  
**Authority**: Official React Email project

**Key Findings**:
- Next-generation email components using React + Tailwind
- Type-safe, component-based architecture
- Automatic HTML generation with email client compatibility
- Built-in support for i18n (react-intl, next-intl, react-i18next)

### 2. React Email + next-intl Guide
**Source**: https://react.email/docs/guides/internationalization/next-intl  
**Authority**: Official React Email documentation

**Key Findings**:
- **Native next-intl support**: Use same translation system as app
- **Server-side rendering**: Generate HTML at build time or runtime
- **Type safety**: Full TypeScript support with translation keys
- **Best Practice**: Pass locale and messages as props to email components

### 3. Supabase Email Templates Documentation
**Source**: https://supabase.com/docs/guides/auth/auth-email-templates  
**Authority**: Official Supabase documentation

**Key Findings**:
- Supabase uses Go templating for auth emails
- Custom SMTP allows full HTML control
- **Limitation**: Auth emails require Go templates (not React)
- **Solution**: Use React Email for transactional emails (contact, notifications)

### 4. Supabase i18n Email Discussion
**Source**: https://github.com/orgs/supabase/discussions/953  
**Authority**: Official Supabase GitHub discussions

**Key Findings**:
- Community request for i18n auth emails (2021)
- **Workaround**: Store user locale in metadata
- **Best Practice**: Use Edge Functions for custom i18n emails
- **Current Status**: No native i18n support in Supabase auth emails

### 5. Custom i18n Emails with Edge Functions
**Source**: https://blog.mansueli.com/creating-customized-i18n-ready-authentication-emails-using-supabase-edge-functions-postgresql-and-resend  
**Authority**: Supabase community expert (Mansueli)

**Key Findings**:
- **Architecture**: Edge Functions + PostgreSQL + Email Service
- **Locale Storage**: Store user locale in `auth.users` metadata
- **Dynamic Templates**: Generate HTML based on locale
- **Performance**: Edge Functions provide low latency

### 6. MJML for Email Development
**Source**: https://mashhadiebad.com/blog/why-we-switched-to-mjml-email-templates-at-scale  
**Authority**: Production case study

**Key Findings**:
- MJML compiles to email-safe HTML
- **Pros**: Responsive, Outlook-compatible, semantic
- **Cons**: Additional build step, learning curve
- **Verdict**: React Email is more modern and integrates better with Next.js

### 7. Josh W. Comeau's Email Workflow
**Source**: https://www.joshwcomeau.com/react/wonderful-emails-with-mjml-and-mdx/  
**Authority**: Industry expert, educator

**Key Findings**:
- **Component Reusability**: Create custom email components
- **Web Versions**: Generate web-viewable versions automatically
- **MDX Integration**: Write content in MDX, render with React
- **Best Practice**: Separate content from presentation

### 8. React Email i18n Implementation
**Source**: https://dev.to/femtowork/how-to-send-i18n-html-emails-from-scripts-using-react-email-3lea  
**Authority**: Developer community tutorial

**Key Findings**:
- **Pattern**: Pass translations as props to email components
- **Rendering**: Use `render()` function to generate HTML
- **Plain Text**: Automatic plain text generation for accessibility
- **Testing**: Preview emails in development with React Email CLI

---

## ARCHITECTURE DECISION

### Option 1: MJML + Nunjucks (Traditional)
**Pros**:
- Mature ecosystem
- Excellent email client compatibility
- Separate from app code

**Cons**:
- Additional build tooling
- No TypeScript support
- Separate i18n system from app
- Harder to maintain

### Option 2: React Email + next-intl (Modern) ✅ RECOMMENDED
**Pros**:
- **Same i18n system as app** (next-intl)
- **Type-safe translations** (TypeScript)
- **Component reusability** (React)
- **Easy testing** (React Email preview)
- **Automatic HTML generation** (email-safe)
- **Plain text fallback** (accessibility)

**Cons**:
- Requires React knowledge (already have)
- Runtime rendering (acceptable for transactional emails)

**Verdict**: React Email + next-intl is the best choice for Tradelia.

---

## IMPLEMENTATION STRATEGY

### Phase 1: Setup React Email (P0)
1. Install dependencies: `react-email`, `@react-email/components`
2. Create email templates directory: `src/emails/`
3. Setup preview server: `npm run email:dev`
4. Configure build script: `npm run email:build`

### Phase 2: Create Email Components (P0)
1. **Base Layout**: Reusable email shell (header, footer, styles)
2. **Contact Form Notification**: Support team notification
3. **Contact Form Auto-Reply**: User confirmation
4. **Welcome Email**: New user onboarding (future)
5. **Password Reset**: Custom Supabase email (future)

### Phase 3: i18n Integration (P0)
1. Create email translation files: `messages/en/email.json`, `messages/it/email.json`
2. Pass locale to email components
3. Use `useTranslations()` equivalent for emails
4. Test both languages

### Phase 4: API Integration (P0)
1. Update `/api/contact` to use React Email
2. Detect user locale from request headers or form data
3. Render email with correct locale
4. Send via Brevo API

---

## FOLDER STRUCTURE

```
tradelia/
├── src/
│   ├── emails/                          # Email templates
│   │   ├── components/                  # Reusable email components
│   │   │   ├── EmailLayout.tsx         # Base layout (header, footer)
│   │   │   ├── EmailButton.tsx         # CTA button
│   │   │   ├── EmailHeader.tsx         # Tradelia header
│   │   │   └── EmailFooter.tsx         # Footer with links
│   │   ├── ContactNotification.tsx     # Support team notification
│   │   ├── ContactAutoReply.tsx        # User confirmation
│   │   ├── WelcomeEmail.tsx            # New user welcome (future)
│   │   └── PasswordReset.tsx           # Password reset (future)
│   ├── app/
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts            # Updated to use React Email
│   └── messages/
│       ├── en/
│       │   └── email.json              # English email translations
│       └── it/
│           └── email.json              # Italian email translations
└── package.json                         # Add react-email scripts
```

---

## EMAIL TRANSLATION STRUCTURE

### messages/en/email.json
```json
{
  "contact": {
    "notification": {
      "subject": "New Contact Form Submission",
      "title": "New Contact Form Submission",
      "contactInfo": "Contact Information",
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "inquiryType": "Inquiry Type",
      "subject": "Subject",
      "message": "Message",
      "footer": "Sent from Tradelia Contact Form"
    },
    "autoReply": {
      "subject": "We received your message: {subject}",
      "title": "Thank You for Contacting Us!",
      "greeting": "Hi {name},",
      "body": "We've received your message and our support team will review it shortly.",
      "nextSteps": {
        "title": "What happens next?",
        "step1": "Our team will review your {inquiryType}",
        "step2": "You'll receive a response within 24 hours",
        "step3": "Check your spam folder if you don't see our reply"
      },
      "yourMessage": "Your message:",
      "needHelp": "Need immediate help?",
      "visitFaq": "Visit FAQ",
      "emailUs": "Email Us",
      "footer": "© {year} Tradelia. All rights reserved."
    }
  },
  "inquiryTypes": {
    "general": "General Inquiry",
    "technical": "Technical Support",
    "account": "Account Issue",
    "billing": "Billing Question",
    "feedback": "Feedback",
    "other": "Other"
  }
}
```

### messages/it/email.json
```json
{
  "contact": {
    "notification": {
      "subject": "Nuova Richiesta dal Form di Contatto",
      "title": "Nuova Richiesta dal Form di Contatto",
      "contactInfo": "Informazioni di Contatto",
      "name": "Nome",
      "email": "E-mail",
      "phone": "Telefono",
      "inquiryType": "Tipo di Richiesta",
      "subject": "Oggetto",
      "message": "Messaggio",
      "footer": "Inviato dal Form di Contatto Tradelia"
    },
    "autoReply": {
      "subject": "Abbiamo ricevuto il tuo messaggio: {subject}",
      "title": "Grazie per Averci Contattato!",
      "greeting": "Ciao {name},",
      "body": "Abbiamo ricevuto il tuo messaggio e il nostro team di supporto lo esaminerà a breve.",
      "nextSteps": {
        "title": "Cosa succede ora?",
        "step1": "Il nostro team esaminerà la tua {inquiryType}",
        "step2": "Riceverai una risposta entro 24 ore",
        "step3": "Controlla la cartella spam se non vedi la nostra risposta"
      },
      "yourMessage": "Il tuo messaggio:",
      "needHelp": "Serve aiuto immediato?",
      "visitFaq": "Visita FAQ",
      "emailUs": "Scrivici",
      "footer": "© {year} Tradelia. Tutti i diritti riservati."
    }
  },
  "inquiryTypes": {
    "general": "Richiesta Generale",
    "technical": "Supporto Tecnico",
    "account": "Problema Account",
    "billing": "Domanda Fatturazione",
    "feedback": "Commenti e Suggerimenti",
    "other": "Altro"
  }
}
```

---

## LOCALE DETECTION STRATEGY

### Priority Order:
1. **Form Data**: User selects language in contact form (future enhancement)
2. **Request Headers**: `Accept-Language` header from browser
3. **URL Locale**: Extract from Next.js locale routing (`/en/contact`, `/it/contact`)
4. **User Metadata**: Stored locale in Supabase (for authenticated users)
5. **Fallback**: Default to English (`en`)

### Implementation:
```typescript
function detectEmailLocale(request: Request): 'en' | 'it' {
  // 1. Check URL locale (from Next.js routing)
  const url = new URL(request.url);
  const urlLocale = url.pathname.split('/')[1];
  if (urlLocale === 'en' || urlLocale === 'it') {
    return urlLocale;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage?.includes('it')) {
    return 'it';
  }

  // 3. Fallback to English
  return 'en';
}
```

---

## BEST PRACTICES 2026

### 1. Component Reusability
- Create base `EmailLayout` component
- Reuse header, footer, button components
- Maintain consistent branding

### 2. Type Safety
- Use TypeScript for all email components
- Define props interfaces
- Type-safe translation keys

### 3. Testing
- Preview emails in development: `npm run email:dev`
- Test both languages
- Test on multiple email clients (Gmail, Outlook, Apple Mail)

### 4. Performance
- Pre-render static emails at build time (when possible)
- Cache rendered HTML for common templates
- Use Edge Functions for dynamic emails

### 5. Accessibility
- Include plain text version (automatic with React Email)
- Use semantic HTML
- Ensure sufficient color contrast
- Include alt text for images

### 6. Maintenance
- Keep translations in sync with app
- Document email template usage
- Version email templates
- Monitor email delivery rates

---

## MIGRATION PLAN

### Step 1: Install Dependencies
```bash
npm install react-email @react-email/components
npm install -D @types/react-email
```

### Step 2: Create Email Templates
- Start with Contact Form emails (notification + auto-reply)
- Use existing HTML as reference
- Add i18n support

### Step 3: Update API Route
- Import React Email render function
- Detect locale from request
- Render email with correct locale
- Send via Brevo

### Step 4: Test & Deploy
- Test both languages
- Verify email delivery
- Check spam scores
- Monitor error rates

---

## FUTURE ENHANCEMENTS

### Phase 2 (P1)
1. **Welcome Email**: New user onboarding
2. **Email Verification**: Custom Supabase email
3. **Password Reset**: Custom Supabase email
4. **Newsletter**: Marketing emails

### Phase 3 (P2)
1. **Email Preferences**: User-selectable language
2. **Email Templates CMS**: Admin panel for editing
3. **A/B Testing**: Test different email variants
4. **Analytics**: Track open rates, click rates

---

## CONCLUSION

**Recommended Approach**:
1. Use React Email + next-intl for bilingual emails
2. Create reusable email components
3. Store translations in `messages/*/email.json`
4. Detect locale from request headers
5. Render emails server-side with correct locale

**Expected Benefits**:
- ✅ Consistent i18n system across app and emails
- ✅ Type-safe translations
- ✅ Component reusability
- ✅ Easy maintenance
- ✅ Professional, branded emails
- ✅ Better user experience

**Implementation Time**: ~4 hours
- Setup: 1 hour
- Templates: 2 hours
- Testing: 1 hour

---

**NEXT STEPS**: Implement Phase 1 (Setup + Contact Form Emails)
