# Auth & Email Architecture - FINAL 2026

## 🎯 Architettura Semplice

```
┌─────────────────────────────────────────────────┐
│         SUPABASE (Built-in SMTP)                │
│                                                 │
│  ✅ Signup confirmation                        │
│  ✅ Password reset                             │
│  ✅ Email change                               │
│  ✅ Magic link                                 │
│                                                 │
│  📧 SMTP: Built-in Supabase                    │
│  📝 Templates: HTML in dashboard               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              RESEND (API)                       │
│                                                 │
│  ✅ Contact form                               │
│  ✅ Future: notifications, marketing           │
│                                                 │
│  📧 API: https://api.resend.com/emails         │
│  📝 Templates: Inline HTML                     │
└─────────────────────────────────────────────────┘
```

## 📋 Configurazione

### Supabase Dashboard

**Authentication > Email:**
- ❌ Confirm email: **DISABLED** (soft verification)
- ✅ Allow new users to sign up: **ENABLED**

**Authentication > Email Templates:**
- Upload 4 template HTML:
  - `confirm-signup.html`
  - `reset-password.html`
  - `change-email.html`
  - `magic-link.html`

**Settings > Auth > SMTP:**
- ❌ Custom SMTP: **DISABLED** (usa built-in)

### Resend Dashboard

1. Verifica dominio: `tradelia.com`
2. Copia API key
3. Aggiungi a Vercel: `RESEND_API_KEY=re_xxxxx`

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Resend
RESEND_API_KEY=re_xxxxx
SUPPORT_EMAIL=support@tradelia.com
```

## 🔄 Flussi Email

### 1. Signup Flow

```
User fa signup
    ↓
Supabase crea user
    ↓
Codice chiama resend() manualmente
    ↓
Supabase invia email via built-in SMTP
    ↓
User riceve email di verifica
    ↓
User clicca link
    ↓
email_confirmed_at viene settato
```

**File:** `src/app/[locale]/(auth)/(center)/auth/page.tsx` (lines 280-295)

### 2. Contact Form Flow

```
User compila form
    ↓
Frontend chiama /api/contact
    ↓
API route chiama Resend API
    ↓
Resend invia 2 email:
  - A support@tradelia.com (notifica)
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
email_confirmed_at già settato (Google verifica)
```

**File:** `src/app/[locale]/(auth)/(center)/auth/page.tsx` (handleGoogleAuth)

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

1. Verifica `RESEND_API_KEY` in Vercel
2. Verifica dominio verificato in Resend
3. Check logs in Vercel: `vercel logs`
4. Check console browser per errori

### Email verification non arriva

1. Verifica "Confirm email" sia DISABLED in Supabase
2. Verifica che `resend()` venga chiamato nel codice (line 280-295)
3. Check spam folder
4. Verifica template caricati in Supabase

### OAuth non funziona

1. Verifica Google OAuth configurato in Supabase
2. Verifica redirect URL: `https://xxx.supabase.co/auth/v1/callback`
3. Check console per errori

## 📊 Limiti

### Supabase Built-in SMTP
- **Limite:** 2 email/ora (development)
- **Limite:** Illimitato (production con dominio verificato)
- **Deliverability:** Buona

### Resend Free Tier
- **Limite:** 100 email/giorno
- **Limite:** 3,000 email/mese
- **Deliverability:** Ottima

## ✅ Checklist Deployment

- [ ] Supabase: "Confirm email" DISABLED
- [ ] Supabase: Template HTML caricati
- [ ] Supabase: Custom SMTP DISABLED
- [ ] Resend: Dominio verificato
- [ ] Resend: API key copiata
- [ ] Vercel: `RESEND_API_KEY` aggiunta
- [ ] Vercel: `SUPPORT_EMAIL` aggiunta
- [ ] Test: Contact form funziona
- [ ] Test: Signup email arriva
- [ ] Test: OAuth funziona

---

**Data:** 2026-01-26  
**Status:** ✅ Contact form migrato a Resend  
**Next:** Test in production
