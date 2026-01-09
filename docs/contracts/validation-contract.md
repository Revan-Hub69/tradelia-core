# Validation Contract - Tradelia 2026

> Validazione client-side per UX, server-side OBBLIGATORIA per sicurezza.

---

## 1. Principi

### Client-Side (UX)
- Feedback immediato all'utente
- Messaggi specifici, non generici
- Validazione on-blur o on-submit
- NON è sicurezza, solo UX

### Server-Side (Sicurezza)
- SEMPRE validare sul server
- Mai fidarsi del client
- Stessi schema Zod riutilizzabili

---

## 2. Messaggi di Errore

### Regole
- Specifici: "Email non valida" non "Errore"
- Localizzati: IT/EN supportati
- Inline: sotto il campo, non alert globale
- Accessibili: `role="alert"` per screen reader

### Formato
```tsx
{errors.email && (
  <p className="text-xs text-error mt-1" role="alert">
    {errors.email}
  </p>
)}
```

---

## 3. Schema Disponibili

| Schema | Uso | Validazioni |
|--------|-----|-------------|
| `emailSchema` | Campo email | required, format, max 255 |
| `passwordSchema` | Password base | required, min 8, max 100 |
| `strongPasswordSchema` | Password forte | + uppercase, lowercase, number |
| `nameSchema` | Nome utente | required, min 2, max 100, trim |
| `loginSchema` | Form login | email + password |
| `registerSchema` | Form registrazione | name + email + password + confirm |
| `resetRequestSchema` | Reset password | email |
| `resetPasswordSchema` | Nuova password | password + confirm |

---

## 4. Utilizzo

### Validazione Form Completo
```tsx
import { loginSchema, validateForm } from '@/src/shared/lib/validation'

const handleSubmit = () => {
  const result = validateForm(loginSchema('it'), formData)
  if (!result.success) {
    setErrors(result.errors)
    return
  }
  // Procedi con submit
}
```

### Validazione Campo Singolo
```tsx
import { emailSchema, validateField, getMessages } from '@/src/shared/lib/validation'

const handleBlur = () => {
  const m = getMessages('it')
  const error = validateField(emailSchema(m), email)
  if (error) setEmailError(error)
}
```

### Hook useFormValidation
```tsx
import { useFormValidation, loginSchema } from '@/src/shared/lib/validation'

const { errors, isSubmitting, handleSubmit } = useFormValidation({
  schema: loginSchema('it'),
  onSubmit: async (data) => {
    await api.login(data)
  }
})
```

---

## 5. Stati Input

| Stato | Classe Border | Classe Ring |
|-------|---------------|-------------|
| Default | `border-border` | - |
| Focus | `border-primary` | `ring-2 ring-primary` |
| Error | `border-error` | - |
| Disabled | `border-border opacity-50` | - |

---

## 6. Checklist

- [ ] Ogni form usa schema Zod
- [ ] Errori inline sotto il campo
- [ ] Messaggi localizzati (IT/EN)
- [ ] Border rosso su campo con errore
- [ ] `role="alert"` su messaggi errore
- [ ] Server-side validation identica
- [ ] No submit durante loading
