# OAuth Troubleshooting Guide 2026

## Problema Riportato
"ho provato ora a registrarmi con email da oauth e mi da errore invio confirm email"

## Diagnosi del Problema

### 1. Configurazione Supabase
Il problema principale è che Supabase ha la conferma email abilitata per default, ma questo non dovrebbe applicarsi agli utenti OAuth (Google, etc.) perché il provider ha già verificato l'email.

### 2. Soluzioni Implementate

#### A. Modifica del Flusso OAuth
- **File**: `src/app/auth/callback/route.ts`
- **Fix**: Distinguere tra utenti OAuth e utenti email/password
- **Logica**: Gli utenti OAuth non richiedono conferma email aggiuntiva

```typescript
// For OAuth providers (Google, etc.), we don't require email confirmation
// The provider has already verified the email
const isOAuthUser = data.user.app_metadata?.provider !== 'email';

if (!isOAuthUser && !data.user.email_confirmed_at) {
  // Only require email confirmation for email/password signups
  // OAuth users skip this check
}
```

#### B. Miglioramento Gestione Errori OAuth
- **File**: `src/app/[locale]/(auth)/(center)/auth/page.tsx`
- **Fix**: Logging dettagliato degli errori OAuth
- **Beneficio**: Debug più facile dei problemi

### 3. Configurazione Supabase Richiesta

Per risolvere completamente il problema, verifica queste impostazioni nel dashboard Supabase:

#### Authentication → Settings
1. **Enable email confirmations**: ✅ (per sicurezza email/password)
2. **Confirm email change**: ✅ 
3. **Enable phone confirmations**: ❌ (opzionale)

#### Authentication → Providers → Google
1. **Enable Google provider**: ✅
2. **Client ID**: [Il tuo Google Client ID]
3. **Client Secret**: [Il tuo Google Client Secret]

#### Authentication → URL Configuration
1. **Site URL**: `http://localhost:3000` (development) / `https://tuodominio.com` (production)
2. **Redirect URLs**: 
   - `http://localhost:3000/auth/callback` (development)
   - `https://tuodominio.com/auth/callback` (production)

### 4. Test del Flusso OAuth

#### Scenario di Test:
1. Utente clicca "Continue with Google"
2. Viene reindirizzato a Google OAuth
3. Utente autorizza l'app
4. Google reindirizza a `/auth/callback?code=...`
5. Il callback scambia il code per una sessione
6. L'utente viene reindirizzato a `/auth/sync`
7. Sync crea profilo utente e progress
8. Reindirizzamento finale a `/dashboard`

#### Debug Steps:
1. Controlla i log del browser (Console)
2. Controlla i log di Supabase (Dashboard → Logs)
3. Verifica che l'URL di callback sia corretto
4. Controlla che Google OAuth sia configurato correttamente

### 5. Possibili Cause del Problema

#### A. URL di Callback Errato
- **Problema**: L'URL di callback non è registrato in Supabase
- **Soluzione**: Aggiungere `http://localhost:3000/auth/callback` nelle Redirect URLs

#### B. Google OAuth Non Configurato
- **Problema**: Client ID/Secret di Google mancanti o errati
- **Soluzione**: Configurare correttamente il provider Google in Supabase

#### C. Configurazione Email Confirmation Troppo Restrittiva
- **Problema**: Supabase richiede conferma email anche per OAuth
- **Soluzione**: ✅ Implementata - distinguere OAuth da email/password

#### D. CORS Issues
- **Problema**: Problemi CORS con localhost
- **Soluzione**: Verificare che `http://localhost:3000` sia nelle Site URLs

### 6. Comandi di Debug

#### Verifica Configurazione Supabase:
```bash
# Controlla le variabili d'ambiente
cat .env.local

# Verifica che l'URL Supabase sia raggiungibile
curl https://higkhlfjfhlecbtfnznx.supabase.co/rest/v1/
```

#### Test OAuth Flow:
1. Apri Developer Tools (F12)
2. Vai alla tab Network
3. Prova il login con Google
4. Controlla le richieste HTTP per errori

### 7. Soluzione Rapida

Se il problema persiste, prova questa configurazione temporanea in Supabase:

#### Authentication → Settings:
- **Enable email confirmations**: ❌ (temporaneamente)
- **Confirm email change**: ❌ (temporaneamente)

Questo disabiliterà la conferma email per tutti gli utenti, permettendo il test del flusso OAuth.

⚠️ **IMPORTANTE**: Riabilita la conferma email in produzione per sicurezza!

### 8. Verifica Finale

Dopo le modifiche, il flusso dovrebbe funzionare così:

1. ✅ OAuth Google funziona senza richiedere conferma email
2. ✅ Utenti email/password richiedono ancora conferma (sicurezza)
3. ✅ Errori chiari e actionable per l'utente
4. ✅ Logging dettagliato per debug

### 9. Prossimi Passi

1. **Testa il flusso OAuth** con le modifiche implementate
2. **Verifica la configurazione Supabase** secondo questa guida
3. **Controlla i log** per eventuali errori residui
4. **Riporta il risultato** per ulteriori aggiustamenti se necessario

---

**Status**: 🔧 **IMPLEMENTATO** - Modifiche al codice completate
**Prossimo**: 🧪 **TEST** - Verifica che il flusso OAuth funzioni correttamente