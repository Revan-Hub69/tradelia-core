# Auth & Email Architecture - FINAL 2026

## 🎯 Architettura Semplice

```
┌─────────────────────────────────────────────────┐
│         SUPABASE (Built-in SMTP)                │
│                                                 │
│  ✅ Signup (immediate login, no verification)  │
│  ✅ Password reset                             │
│  ✅ Email change                               │
│  ✅ Magic link                                 │
│                                                 │
│  📧 SMTP: Built-in Supabase                    │
│  📝 Templates: HTML in dashboard               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         NODEMAILER + ARUBA SMTP                 │
│                                                 │
│  ✅ Contact form                               │
│  ✅ Future: notifications, marketing           │
│                                                 │
│  📧 SMTP: smtp.aruba.it                        │
│  📝 Templates: Inline HTML                     │
└─────────────────────────────────────────────────┘
```

## 📋 Configurazione

### Supabase Dashboard

**Authentication > Email:**
- ❌ Confirm email: **DISABLED** (no email verification)
- ✅ Allow new users to sign up: **ENABLED**

**Settings > Auth > SMTP:**
- ❌ Custom SMTP: **DISABLED** (usa built-in)

### Aruba Email Setup

1. Usa casella email esistente: `support@tradelia.org`
2. Ottieni credenziali SMTP da Aruba
3. Aggiungi a Vercel environment variables (vedi sotto)

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Nodemailer + Aruba SMTP
SMTP_HOST=smtp.aruba.it
SMTP_USER=support@tradelia.org
SMTP_PASS=your_aruba_email_password
SUPPORT_EMAIL=support@tradelia.org
```

## 🔄 Flussi Email

### 1. Signup Flow

```
User fa signup
    ↓
Supabase crea user
    ↓
Login immediato (no email verification)
    ↓
Redirect a dashboard
```

**File:** `src/app/[locale]/(auth)/(center)/auth/page.tsx`

**Note:** Email verification è stata RIMOSSA completamente per semplicità.

### 2. Contact Form Flow

```
User compila form
    ↓
Frontend chiama /api/contact
    ↓
API route usa Nodemailer + Aruba SMTP
    ↓
Nodemailer invia 2 email:
  - A support@tradelia.org (notifica)
  - All'utente (conferma)
```

**File:** `src/app/api/contact/route.ts`

### 3. OAuth Flow

```
User clicca "Sign in with Google"
    ↓
Redirect a Google OAuth
    ↓
Google verifica email
    ↓
Callback crea sessione
    ↓
Redirect a dashboard
```

**File:** `src/app/[locale]/(auth)/(center)/auth/page.tsx`

## 🧪 Testing

### Test Contact Form

```bash
# 1. Vai su /contact
# 2. Compila form
# 3. Invia
# 4. Verifica:
#    - Email arriva a support@tradelia.com
#    - Auto-reply arriva all'utente
#    - Nessun errore in console
```

### Test Signup

```bash
# 1. Vai su /auth
# 2. Inserisci email/password
# 3. Signup
# 4. Verifica:
#    - Email di verifica arriva
#    - Link funziona
#    - email_confirmed_at viene settato
```

### Test OAuth

```bash
# 1. Vai su /auth
# 2. Clicca "Sign in with Google"
# 3. Autorizza
# 4. Verifica:
#    - Redirect a dashboard
#    - Sessione creata
#    - email_confirmed_at già settato
```

## 🚨 Troubleshooting

### Contact form non invia

1. Verifica `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in Vercel
2. Verifica credenziali Aruba email corrette
3. Check logs in Vercel: `vercel logs`
4. Check console browser per errori
5. Verifica che porta 465 (SSL) sia aperta

### Email verification

**Non applicabile** - Email verification è stata rimossa completamente.

### OAuth non funziona

1. Verifica Google OAuth configurato in Supabase
2. Verifica redirect URL: `https://xxx.supabase.co/auth/v1/callback`
3. Check console per errori

## 📊 Limiti

### Supabase Built-in SMTP
- **Limite:** 2 email/ora (development)
- **Limite:** Illimitato (production con dominio verificato)
- **Deliverability:** Buona

### Aruba SMTP
- **Limite:** Dipende dal piano Aruba
- **Deliverability:** Buona (dominio già configurato)
- **Vantaggio:** Nessuna modifica DNS necessaria

## ✅ Checklist Deployment

- [x] Supabase: "Confirm email" DISABLED
- [x] Supabase: Custom SMTP DISABLED
- [x] Nodemailer: Package installato
- [x] TypeScript: @types/nodemailer installato
- [ ] Aruba: Ottieni credenziali SMTP
- [ ] Vercel: `SMTP_HOST` aggiunta (smtp.aruba.it)
- [ ] Vercel: `SMTP_USER` aggiunta (support@tradelia.org)
- [ ] Vercel: `SMTP_PASS` aggiunta (password Aruba)
- [ ] Vercel: `SUPPORT_EMAIL` aggiunta (support@tradelia.org)
- [ ] Test: Contact form funziona
- [ ] Test: Signup funziona (login immediato)
- [ ] Test: OAuth funziona

---

**Data:** 2026-01-26  
**Status:** ✅ Contact form migrato a Nodemailer + Aruba SMTP  
**Next:** Aggiungi credenziali Aruba in Vercel e testa in production
