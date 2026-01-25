# P0: Email Verification Banner Implementation

## 🎯 Obiettivo

Implementare verifica email opzionale con banner persistente in dashboard, seguendo le best practices 2025.

## 📋 Task Overview

**Priority**: P0 (Critical for UX)
**Effort**: 2-3 ore
**Impact**: +150% signup conversion, migliore UX

## 🔧 Implementation Steps

### Step 1: Configurazione Supabase (5 min)

#### 1.1 Disabilita Verifica Obbligatoria

```bash
# Supabase Dashboard
1. Vai a: Authentication → Providers → Email
2. Trova: "Confirm email"
3. ☐ DISABILITA questa opzione
4. Save
```

**Risultato**: Gli utenti possono fare login immediatamente dopo signup, anche senza verificare email.

#### 1.2 Verifica Configurazione

```typescript
// Test che funziona
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123'
})

// Ora data.session esiste immediatamente!
// Prima: data.session = null (dovevi verificare prima)
// Dopo: data.session = {...} (logged in subito)
```

### Step 2: Crea Banner Component (30 min)

#### 2.1 Crea File Component

```tsx
// src/components/dashboard/EmailVerificationBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X, Mail, AlertCircle } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import { supabase } from '@/libs/supabase/client'

export function EmailVerificationBanner() {
  const t = useTranslations('dashboard')
  const { user } = useUserData()
  const [dismissed, setDismissed] = useState(false)
  const [resending, setResending] = useState(false)
  const [justSent, setJustSent] = useState(false)

  // Check if banner was dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('email-banner-dismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])

  // Don't show if:
  // - No user
  // - Email already verified
  // - User dismissed banner
  if (!user || user.email_confirmed_at || dismissed) {
    return null
  }

  const handleResend = async () => {
    setResending(true)
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      setJustSent(true)
      setTimeout(() => setJustSent(false), 5000)
    } catch (error) {
      console.error('Error resending verification:', error)
    } finally {
      setResending(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('email-banner-dismissed', 'true')
  }

  return (
    <div className="email-verification-banner">
      <div className="banner-icon">
        <AlertCircle className="w-5 h-5" />
      </div>
      
      <div className="banner-content">
        <h4 className="banner-title">
          {t('emailVerification.title')}
        </h4>
        <p className="banner-message">
          {t('emailVerification.message', { email: user.email })}
        </p>
      </div>

      <div className="banner-actions">
        {justSent ? (
          <span className="text-sm text-green-600 dark:text-green-400">
            ✓ {t('emailVerification.sent')}
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="banner-button-primary"
          >
            <Mail className="w-4 h-4" />
            {resending 
              ? t('emailVerification.sending')
              : t('emailVerification.resend')
            }
          </button>
        )}

        <button
          onClick={handleDismiss}
          className="banner-button-dismiss"
          aria-label={t('emailVerification.dismiss')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

#### 2.2 Aggiungi Stili

```css
/* src/styles/dashboard.css */

.email-verification-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.1) 0%,
    rgba(245, 158, 11, 0.1) 100%
  );
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-icon {
  flex-shrink: 0;
  color: rgb(245, 158, 11);
}

.banner-content {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17, 24, 39);
  margin: 0 0 0.25rem 0;
}

.dark .banner-title {
  color: rgb(243, 244, 246);
}

.banner-message {
  font-size: 0.8125rem;
  color: rgb(75, 85, 99);
  margin: 0;
}

.dark .banner-message {
  color: rgb(156, 163, 175);
}

.banner-message strong {
  color: rgb(17, 24, 39);
  font-weight: 500;
}

.dark .banner-message strong {
  color: rgb(243, 244, 246);
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.banner-button-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: rgb(245, 158, 11);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.banner-button-primary:hover:not(:disabled) {
  background: rgb(217, 119, 6);
  transform: translateY(-1px);
}

.banner-button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.banner-button-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: rgb(107, 114, 128);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.banner-button-dismiss:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgb(17, 24, 39);
}

.dark .banner-button-dismiss:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgb(243, 244, 246);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .email-verification-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .banner-actions {
    width: 100%;
    justify-content: space-between;
  }

  .banner-button-primary {
    flex: 1;
  }
}
```

#### 2.3 Aggiungi Traduzioni

```json
// messages/en/dashboard.json
{
  "emailVerification": {
    "title": "Verify your email",
    "message": "We sent a verification link to {email}",
    "resend": "Resend email",
    "sending": "Sending...",
    "sent": "Email sent!",
    "dismiss": "Dismiss"
  }
}
```

```json
// messages/it/dashboard.json
{
  "emailVerification": {
    "title": "Verifica la tua email",
    "message": "Abbiamo inviato un link di verifica a {email}",
    "resend": "Invia di nuovo",
    "sending": "Invio...",
    "sent": "Email inviata!",
    "dismiss": "Chiudi"
  }
}
```

### Step 3: Integra Banner in Dashboard (10 min)

```tsx
// src/app/[locale]/dashboard/page.tsx
import { EmailVerificationBanner } from '@/components/dashboard/EmailVerificationBanner'

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Add banner at top */}
      <EmailVerificationBanner />
      
      {/* Rest of dashboard content */}
      <div className="dashboard-content">
        {/* ... */}
      </div>
    </div>
  )
}
```

### Step 4: Implementa Guards per Azioni Critiche (1 ora)

#### 4.1 Crea Hook useRequireVerification

```typescript
// src/hooks/useRequireVerification.ts
'use client'

import { useUserData } from './useUserData'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function useRequireVerification() {
  const { user } = useUserData()
  const t = useTranslations('dashboard')
  const [showModal, setShowModal] = useState(false)

  const isVerified = !!user?.email_confirmed_at

  const requireVerification = (
    action: () => void | Promise<void>,
    options?: {
      message?: string
      onCancel?: () => void
    }
  ) => {
    if (isVerified) {
      action()
      return true
    }

    // Show verification required modal
    setShowModal(true)
    return false
  }

  return {
    isVerified,
    requireVerification,
    showModal,
    setShowModal
  }
}
```

#### 4.2 Crea Modal Component

```tsx
// src/components/dashboard/VerificationRequiredModal.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Mail, AlertCircle } from 'lucide-react'
import { supabase } from '@/libs/supabase/client'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  actionName?: string
}

export function VerificationRequiredModal({
  isOpen,
  onClose,
  userEmail,
  actionName
}: Props) {
  const t = useTranslations('dashboard.verificationRequired')
  const [resending, setResending] = useState(false)

  if (!isOpen) return null

  const handleResend = async () => {
    setResending(true)
    
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      // Show success message
      alert(t('emailSent'))
    } catch (error) {
      console.error('Error resending:', error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>

        <h2 className="modal-title">
          {t('title')}
        </h2>

        <p className="modal-message">
          {actionName 
            ? t('messageWithAction', { action: actionName })
            : t('message')
          }
        </p>

        <p className="modal-email">
          {t('sentTo')} <strong>{userEmail}</strong>
        </p>

        <div className="modal-actions">
          <button
            onClick={handleResend}
            disabled={resending}
            className="modal-button-primary"
          >
            <Mail className="w-4 h-4" />
            {resending ? t('sending') : t('resend')}
          </button>

          <button
            onClick={onClose}
            className="modal-button-secondary"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### 4.3 Usa Guard nelle Azioni Critiche

```tsx
// Example: Export Data Button
'use client'

import { useRequireVerification } from '@/hooks/useRequireVerification'
import { VerificationRequiredModal } from '@/components/dashboard/VerificationRequiredModal'
import { useUserData } from '@/hooks/useUserData'

export function ExportDataButton() {
  const { user } = useUserData()
  const { requireVerification, showModal, setShowModal } = useRequireVerification()

  const handleExport = async () => {
    // This will only run if email is verified
    requireVerification(async () => {
      // Actual export logic
      const data = await exportUserData()
      downloadFile(data)
    })
  }

  return (
    <>
      <button onClick={handleExport}>
        Export Data
      </button>

      <VerificationRequiredModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userEmail={user?.email || ''}
        actionName="export data"
      />
    </>
  )
}
```

### Step 5: Aggiungi Reminder Emails (Opzionale)

```typescript
// supabase/functions/send-verification-reminders/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find users who signed up 24h ago and haven't verified
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const { data: users } = await supabase
    .from('auth.users')
    .select('*')
    .is('email_confirmed_at', null)
    .lt('created_at', oneDayAgo.toISOString())
    .limit(100)

  // Send reminder emails
  for (const user of users || []) {
    await supabase.auth.resend({
      type: 'signup',
      email: user.email
    })
  }

  return new Response(
    JSON.stringify({ sent: users?.length || 0 }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## 📊 Testing Checklist

### Functional Tests

- [ ] **Signup Flow**
  - [ ] User può registrarsi
  - [ ] User è loggato immediatamente (senza verificare)
  - [ ] Banner appare in dashboard
  - [ ] Email di verifica è inviata

- [ ] **Banner Behavior**
  - [ ] Banner appare solo se email non verificata
  - [ ] Banner scompare dopo verifica
  - [ ] "Resend" invia nuova email
  - [ ] "Dismiss" nasconde banner (per sessione)
  - [ ] Banner riappare in nuova sessione se non verificato

- [ ] **Verification Flow**
  - [ ] Click link in email verifica account
  - [ ] Banner scompare dopo verifica
  - [ ] User può accedere a tutte le funzioni

- [ ] **Critical Actions**
  - [ ] Export data bloccato senza verifica
  - [ ] Modal appare con opzione resend
  - [ ] Dopo verifica, azione funziona

### UI/UX Tests

- [ ] Banner è visibile ma non invasivo
- [ ] Colori e stile consistenti con design system
- [ ] Responsive su mobile
- [ ] Animazioni smooth
- [ ] Traduzioni corrette (IT/EN)
- [ ] Dark mode funziona

### Edge Cases

- [ ] User cambia email → banner aggiorna
- [ ] User fa logout/login → banner riappare se non verificato
- [ ] Multiple resend → rate limiting funziona
- [ ] Email già verificata → banner non appare mai

## 🎯 Success Metrics

### Immediate (Week 1)
- [ ] 90%+ signup conversion (vs 25% prima)
- [ ] <5% users bloccati su azioni critiche
- [ ] <20% banner dismiss rate

### Short-term (Week 2-4)
- [ ] 60-70% verification rate entro 7 giorni
- [ ] <10% support tickets su verifica email
- [ ] Positive user feedback

### Long-term (Month 1-3)
- [ ] +150% active users
- [ ] +200% retention (7 giorni)
- [ ] Stable verification rate

## 🚀 Deployment

### Pre-deployment
1. [ ] Review code con team
2. [ ] Test su staging
3. [ ] Backup Supabase config

### Deployment
1. [ ] Deploy banner component
2. [ ] Deploy guards
3. [ ] Update Supabase config
4. [ ] Monitor errors

### Post-deployment
1. [ ] Monitor signup conversion
2. [ ] Monitor verification rate
3. [ ] Collect user feedback
4. [ ] Iterate based on data

## 📚 References

- Research: `docs/research/EMAIL_VERIFICATION_OPTIONAL_BEST_PRACTICES_TIER1_2026.md`
- Email Templates: `supabase/email-templates/v2/`
- Supabase Docs: https://supabase.com/docs/guides/auth/passwords

---

**Priority**: P0
**Effort**: 2-3 hours
**Impact**: High (UX + Conversion)
**Status**: Ready to implement
