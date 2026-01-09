# Security Contract - Tradelia 2026

> Cosa è pubblico, cosa no. Se non è scritto, verrà esposto.

---

## 1. Route Protection

### Pubbliche (no auth)
```
/                     # Landing page
/[locale]             # Landing localizzata
/auth/login           # Login
/auth/register        # Registrazione
/auth/forgot-password # Reset password
/auth/callback        # OAuth callback
/manifest.webmanifest # PWA manifest
/robots.txt           # SEO
/sitemap.xml          # SEO
```

### Protette (auth required)
```
/[locale]/dashboard/*  # Tutto il dashboard
/[locale]/settings/*   # Impostazioni utente
/[locale]/portfolio/*  # Dati portfolio
/api/user/*            # API utente
/api/portfolio/*       # API portfolio
```

### Guest Mode
```
/[locale]/dashboard?guest=true  # Dashboard limitata
```
- Dati mock, non reali
- CTA per registrazione
- No persistenza

---

## 2. Middleware Rules

```typescript
// middleware.ts
export const config = {
  matcher: [
    // Proteggi tutto tranne:
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)',
  ],
}
```

### Esclusioni Obbligatorie
- `_next/*` - Asset Next.js
- `*.ico, *.png, *.svg` - Immagini statiche
- `manifest.webmanifest` - PWA (causa 401 se bloccato)
- `robots.txt`, `sitemap.xml` - SEO

---

## 3. Environment Variables

### Pubbliche (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://tradelia.com
```

### Private (server-only)
```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # MAI esporre
DATABASE_URL=postgres://...        # MAI esporre
SMTP_PASSWORD=...                  # MAI esporre
```

**Regola**: Se non ha `NEXT_PUBLIC_`, non è accessibile client-side.

---

## 4. API Security

### Headers Obbligatori
```typescript
// Ogni API route
export async function GET(request: Request) {
  // Verifica auth
  const session = await getSession(request)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Verifica ownership
  if (resource.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

### Rate Limiting
- Auth endpoints: 5 req/min per IP
- API generiche: 100 req/min per user
- Implementare con middleware o edge function

---

## 5. Data Exposure

### MAI esporre
- Password (anche hash)
- Token di sessione in URL
- Chiavi API in client code
- Stack trace in produzione
- ID interni sequenziali

### Sanitizzare sempre
```typescript
// ✅ Corretto
return {
  id: user.id,
  name: user.name,
  email: user.email,
  // ❌ MAI: password, passwordHash, internalId
}
```

---

## 6. Input Validation

### Client-side (UX)
```typescript
// Feedback immediato, non sicurezza
const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

### Server-side (OBBLIGATORIO)
```typescript
// Zod schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
})

// Validazione
const result = userSchema.safeParse(body)
if (!result.success) {
  return new Response('Invalid input', { status: 400 })
}
```

---

## 7. Auth Flow

### Login
1. User inserisce credenziali
2. Server verifica con Supabase
3. Supabase ritorna session token
4. Token salvato in httpOnly cookie
5. Redirect a dashboard

### Logout
1. Invalida session server-side
2. Cancella cookie
3. Redirect a landing

### Password Reset
1. User richiede reset
2. Email con link temporaneo (1h expiry)
3. Link porta a form reset
4. Nuova password salvata
5. Tutte le sessioni invalidate

---

## 8. CORS & CSP

### CORS (API)
```typescript
// Solo origini autorizzate
const allowedOrigins = [
  'https://tradelia.com',
  'https://www.tradelia.com',
]
```

### CSP (Content Security Policy)
```typescript
// next.config.js headers
{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co;
  `
}
```

---

## 9. Error Handling

### Produzione
```typescript
// ✅ Messaggio generico
return new Response('Something went wrong', { status: 500 })

// ❌ MAI stack trace
return new Response(error.stack, { status: 500 })
```

### Development
```typescript
if (process.env.NODE_ENV === 'development') {
  console.error(error)
}
```

---

## 10. Checklist Security

### Pre-Deploy
- [ ] Nessuna chiave API in client code
- [ ] Tutte le route protette hanno auth check
- [ ] Input validato server-side
- [ ] Error messages generici in prod
- [ ] HTTPS forzato
- [ ] Cookie httpOnly per session

### Periodico
- [ ] Dipendenze aggiornate (`npm audit`)
- [ ] Review accessi Supabase
- [ ] Log anomalie auth
- [ ] Test penetration (annuale)
