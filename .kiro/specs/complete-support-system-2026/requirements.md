# Complete Support System 2026 - Requirements

## 🎯 Obiettivo

Creare un sistema di supporto completo e professionale per Tradelia che include:
1. Email system con template professionali bilingue
2. FAQ page dedicata nella landing
3. Support workflow con ticketing base

## 📋 User Stories

### US1: Email Templates Professionali Bilingue

**Come** utente che invia un messaggio di contatto  
**Voglio** ricevere una conferma professionale nella mia lingua  
**Così che** sappia che il mio messaggio è stato ricevuto e quando aspettarmi una risposta

**Acceptance Criteria:**
- [ ] Email di conferma arriva entro 30 secondi
- [ ] Email è nella lingua corretta (IT/EN basato su locale)
- [ ] Design branded con gradient header Tradelia
- [ ] Include ticket ID per tracking
- [ ] Indica tempo di risposta atteso (24-48h)
- [ ] Link a FAQ per self-service
- [ ] Mobile responsive

---

### US2: Supabase Auth Emails Branded

**Come** utente che reimposta la password  
**Voglio** ricevere un'email branded e chiara  
**Così che** possa completare l'azione in sicurezza

**Acceptance Criteria:**
- [ ] Template password reset bilingue (IT/EN)
- [ ] Template email change bilingue (IT/EN)
- [ ] Design match contact form style
- [ ] Security tips inclusi
- [ ] Link con scadenza chiara (1 ora)
- [ ] Mobile responsive

---

### US3: FAQ Page Dedicata

**Come** utente che cerca informazioni  
**Voglio** una pagina FAQ completa e ben organizzata  
**Così che** possa trovare risposte senza contattare support

**Acceptance Criteria:**
- [ ] 7 categorie principali (Getting Started, Pricing, Learning, Account, Security, Technical, Community)
- [ ] Minimo 30 domande totali
- [ ] Search bar funzionante con auto-suggestions
- [ ] Accordion per ogni domanda
- [ ] Bilingue (IT/EN)
- [ ] Mobile responsive
- [ ] Link a contact form se non trova risposta
- [ ] Analytics su domande più viste

---

### US4: Support Ticket System

**Come** team support  
**Voglio** un sistema di ticketing base  
**Così che** possa tracciare e gestire le richieste

**Acceptance Criteria:**
- [ ] Ogni messaggio genera ticket ID univoco
- [ ] Ticket salvato in database
- [ ] Status tracking (open, pending, resolved, closed)
- [ ] Priority assignment (low, medium, high, urgent)
- [ ] Follow-up automatico dopo 24h se no risposta
- [ ] Dashboard semplice per visualizzare tickets (futuro)

---

### US5: Email Follow-up Automatico

**Come** utente che non ha ricevuto risposta  
**Voglio** un reminder automatico  
**Così che** non dimentichi la mia richiesta

**Acceptance Criteria:**
- [ ] Follow-up inviato dopo 24h se no risposta
- [ ] Email bilingue
- [ ] Riferimento a ticket originale
- [ ] Link FAQ per self-service
- [ ] CTA chiaro: "Rispondi" o "Prenota call"

---

## 🎨 Design Requirements

### Email Templates

**Visual Identity:**
- Gradient header: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Logo Tradelia in header
- Font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Colors: Brand purple (#667eea), white, gray scale
- Border radius: 12px per cards
- Box shadow: `0 4px 6px rgba(0,0,0,0.1)`

**Layout:**
- Max width: 600px
- Padding: 40px
- Mobile responsive (stack on small screens)
- White space generoso

**Components:**
- Header con gradient + logo
- Content card con white background
- Footer con social links + copyright
- CTA buttons con hover states

### FAQ Page

**Layout:**
- Search bar prominente in alto
- Category grid (7 cards, 2 colonne su desktop)
- Popular questions section (top 5)
- Accordion per tutte le domande
- "Still need help?" section in fondo

**Visual:**
- Icone per categorie (emoji o Lucide icons)
- Hover states su cards
- Smooth animations (Framer Motion)
- Breadcrumbs se multi-livello

---

## 🔧 Technical Requirements

### TR1: Email Template System

**Stack:**
- Nodemailer (già installato)
- Template engine: Inline HTML (no external deps per ora)
- Locale detection: `accept-language` header
- Storage: Template strings in code (futuro: database)

**Files:**
```
src/lib/email-templates/
  ├── base-template.ts          # Shared layout
  ├── contact-confirmation.ts   # User confirmation
  ├── contact-notification.ts   # Team notification
  ├── follow-up.ts              # 24h follow-up
  └── types.ts                  # TypeScript types
```

**API:**
```typescript
interface EmailTemplate {
  subject: (locale: string, data: any) => string;
  html: (locale: string, data: any) => string;
  text: (locale: string, data: any) => string;
}
```

---

### TR2: Supabase Email Templates

**Implementation:**
- Create 2 versions of each template (IT/EN)
- Upload to Supabase dashboard manually
- Use same design system as contact form
- Include locale switcher in email (optional)

**Templates Needed:**
1. Password reset (IT/EN)
2. Email change (IT/EN)
3. Magic link (IT/EN) - se attivato

---

### TR3: FAQ System

**Stack:**
- Next.js static generation
- Fuse.js for client-side search (MVP)
- Framer Motion for animations
- i18n with next-intl

**Data Structure:**
```typescript
interface FAQCategory {
  id: string;
  icon: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  questions: FAQQuestion[];
}

interface FAQQuestion {
  id: string;
  question: { it: string; en: string };
  answer: { it: string; en: string };
  category: string;
  popular: boolean;
  tags: string[];
}
```

**Files:**
```
src/data/faq/
  ├── categories.ts       # Category definitions
  ├── questions.ts        # All questions
  └── index.ts            # Exports

src/app/[locale]/faq/
  └── page.tsx            # FAQ page component

src/components/faq/
  ├── FAQSearch.tsx       # Search bar
  ├── FAQCategory.tsx     # Category card
  ├── FAQAccordion.tsx    # Question accordion
  └── FAQCta.tsx          # "Still need help?" section
```

---

### TR4: Ticket System

**Database Schema:**
```sql
CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,              -- "TKT-2026-001234"
  status TEXT NOT NULL,             -- 'open' | 'pending' | 'resolved' | 'closed'
  priority TEXT NOT NULL,           -- 'low' | 'medium' | 'high' | 'urgent'
  
  -- User info
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  user_locale TEXT NOT NULL,        -- 'it' | 'en'
  
  -- Ticket info
  inquiry_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  assigned_to TEXT,
  
  -- Tracking
  source TEXT NOT NULL,             -- 'contact_form' | 'email' | 'chat'
  user_agent TEXT,
  ip TEXT,
  
  -- Follow-up
  follow_up_sent_at TIMESTAMP,
  feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5)
);

CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX idx_tickets_user_email ON support_tickets(user_email);
```

**API Routes:**
```
POST   /api/tickets          # Create ticket
GET    /api/tickets/:id      # Get ticket
PATCH  /api/tickets/:id      # Update ticket
GET    /api/tickets          # List tickets (admin)
```

---

### TR5: Follow-up Automation

**Implementation:**
- Vercel Cron Job (daily at 9 AM)
- Query tickets: `status = 'open' AND created_at < NOW() - INTERVAL '24 hours' AND follow_up_sent_at IS NULL`
- Send follow-up email
- Update `follow_up_sent_at`

**Cron Config:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/follow-up-tickets",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 📊 Success Metrics

### Email System:
- Open rate > 80%
- Click-through rate > 20%
- Bounce rate < 2%
- Spam complaints < 0.1%

### FAQ System:
- Bounce rate < 40%
- Time on page > 2 min
- Search usage > 30%
- Contact form reduction > 30%

### Support System:
- First response time < 24h
- Resolution time < 48h
- Customer satisfaction > 4.5/5

---

## 🚫 Out of Scope (Per Ora)

- ❌ Live chat integration
- ❌ AI chatbot
- ❌ WhatsApp Business integration
- ❌ Video call booking
- ❌ Advanced analytics dashboard
- ❌ Multi-agent assignment
- ❌ SLA tracking
- ❌ Knowledge base CMS

---

## 📅 Implementation Phases

### Phase 1 - Email Templates (Week 1)
- Email template system
- Contact form templates (confirmation, notification, follow-up)
- Supabase auth templates
- Bilingual support

### Phase 2 - FAQ Page (Week 1-2)
- FAQ data structure
- FAQ page layout
- Search functionality
- Mobile responsive

### Phase 3 - Ticketing (Week 2)
- Database schema
- Ticket creation
- API routes
- Follow-up automation

### Phase 4 - Polish (Week 3)
- Analytics integration
- Performance optimization
- A/B testing
- Documentation

---

**Priority:** P0 - CRITICAL  
**Estimated Effort:** 2-3 weeks  
**Dependencies:** Nodemailer setup (done), Aruba SMTP credentials (pending)
