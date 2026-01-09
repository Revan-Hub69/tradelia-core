# Design Document - Sistema Autenticazione Integrato

## Overview

Riprogettazione completa del sistema di autenticazione come modal unificato che integra onboarding, registrazione, login e reset password in un'esperienza fluida e coerente.

## Architecture

### State Management
```typescript
interface AuthModalState {
  mode: 'gateway' | 'onboarding' | 'register' | 'login' | 'reset-request' | 'reset-confirm'
  step: number // Only relevant for onboarding mode
  onboardingData: OnboardingProfile | null // Only filled for new users
  formData: AuthFormData
  loading: boolean
  errors: Record<string, string>
  userType: 'new' | 'existing' | 'unknown'
}
```

### Component Structure
```
AuthModal/
├── AuthModalProvider (Context + State)
├── AuthModalContainer (Main Modal)
├── OnboardingSteps/ (Steps 1-5)
├── AuthForms/
│   ├── RegisterForm
│   ├── LoginForm
│   ├── ResetRequestForm
│   └── ResetConfirmForm
├── AuthButtons/
│   ├── GoogleOAuthButton
│   └── StateTransitionButtons
└── AuthValidation/ (Real-time validation)
```

## Components and Interfaces

### AuthModalProvider
```typescript
interface AuthModalContextType {
  state: AuthModalState
  actions: {
    setMode: (mode: AuthMode) => void
    updateOnboarding: (data: Partial<OnboardingProfile>) => void
    updateForm: (data: Partial<AuthFormData>) => void
    submitAuth: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    confirmReset: (password: string) => Promise<void>
  }
}
```

### Unified Modal States

#### State 1: Auth Gateway (NEW - First Screen)
```typescript
interface AuthGatewayOptions {
  newUser: {
    title: "Nuovo utente"
    description: "Inizia la verifica di coerenza"
    action: () => setMode('onboarding')
  }
  existingUser: {
    title: "Hai già un account?"
    description: "Accedi per vedere la tua dashboard"
    action: () => setMode('login')
  }
  googleOAuth: {
    title: "Continua con Google"
    description: "Accesso rapido"
    action: () => signInWithGoogle()
  }
}
```

#### State 2-6: Onboarding (Only for New Users)
- Attivato solo se utente sceglie "Nuovo utente"
- Raccoglie: objective, experience, otherTools, storageMode

#### State 7: Registration Form (Only if chosen)
```typescript
interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}
```

#### State 8: Login Form (Direct Access)
```typescript
interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}
```

#### State 9: Reset Password Flow
```typescript
interface ResetFlow {
  request: { email: string }
  confirm: { password: string, confirmPassword: string }
}
```

## Data Models

### Enhanced Onboarding Profile
```typescript
interface OnboardingProfile {
  objective: CryptoObjective
  experience: Experience
  otherTools: OtherTools
  storageMode: 'guest' | 'register'
  completedAt: string
  sessionId?: string
}
```

### Auth Form Validation
```typescript
interface ValidationRules {
  email: {
    required: true
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    message: "Inserisci un indirizzo email valido"
  }
  password: {
    required: true
    minLength: 8
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    message: "Password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero"
  }
  fullName: {
    required: true
    minLength: 2
    message: "Inserisci il tuo nome completo"
  }
}
```

## User Experience Flow

### Primary Flow (New User)
1. **Homepage** → Click "Avvia verifica"
2. **Auth Check** → Modal opens with login/register choice FIRST
3. **If New User** → Complete onboarding questionnaire (Steps 1-5)
4. **Storage Selection** → Choose Guest or Register
5. **Success** → Redirect to dashboard with data saved

### Secondary Flow (Existing User)
1. **Homepage** → Click "Avvia verifica"
2. **Auth Check** → Modal opens with login/register choice FIRST
3. **Login** → Enter credentials and go DIRECTLY to dashboard
4. **Success** → Dashboard with existing preferences loaded

### Alternative Entry Points
- **Header "Accedi"** → Opens modal directly in login mode
- **Direct Dashboard Access** → Redirect to auth modal if not logged in

### Recovery Flow (Forgot Password)
1. **Login Form** → Click "Password dimenticata?"
2. **Reset Request** → Enter email in same modal
3. **Email Sent** → Show confirmation with back to login option
4. **Email Link** → Opens modal in reset-confirm mode
5. **New Password** → Set password and auto-login

## Error Handling

### Real-time Validation
```typescript
interface ValidationState {
  email: {
    isValid: boolean
    message: string
    showIndicator: boolean
  }
  password: {
    isValid: boolean
    strength: 'weak' | 'medium' | 'strong'
    message: string
  }
}
```

### Network Error Recovery
```typescript
interface ErrorRecovery {
  retryAttempts: number
  backoffDelay: number
  fallbackActions: {
    saveLocally: () => void
    showOfflineMode: () => void
    contactSupport: () => void
  }
}
```

## Testing Strategy

### Unit Tests
- Form validation logic
- State transitions
- Data persistence
- Error handling

### Integration Tests  
- Complete user flows
- OAuth integration
- Email delivery
- Database operations

### Property-Based Tests
- Form input sanitization
- State consistency
- Data integrity

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Focus management
- Color contrast

## Performance Optimizations

### Code Splitting
```typescript
const AuthModal = lazy(() => import('./AuthModal'))
const GoogleOAuth = lazy(() => import('./GoogleOAuth'))
```

### State Persistence
```typescript
// Preserve form data during state transitions
const useFormPersistence = () => {
  const [formData, setFormData] = useLocalStorage('auth-form-data')
  
  useEffect(() => {
    // Clear on successful auth
    if (authSuccess) {
      localStorage.removeItem('auth-form-data')
    }
  }, [authSuccess])
}
```

### Optimistic Updates
```typescript
// Show success state immediately, rollback on error
const optimisticAuth = async (credentials) => {
  setLoading(true)
  setSuccess(true) // Optimistic
  
  try {
    await authenticate(credentials)
  } catch (error) {
    setSuccess(false) // Rollback
    setError(error.message)
  }
}
```

## Security Considerations

### Input Sanitization
```typescript
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim())
}
```

### Rate Limiting
```typescript
interface RateLimiter {
  maxAttempts: 5
  windowMs: 15 * 60 * 1000 // 15 minutes
  blockDuration: 30 * 60 * 1000 // 30 minutes
}
```

### Secure Storage
```typescript
// Guest mode: AES-GCM encryption
// Registered: Supabase RLS policies
// Passwords: bcrypt with salt rounds 12
```

## Accessibility Implementation

### ARIA Labels
```typescript
const ariaLabels = {
  modal: "Configurazione account Tradelia",
  step: (current: number, total: number) => `Passo ${current} di ${total}`,
  form: (type: string) => `Modulo ${type}`,
  error: (field: string) => `Errore nel campo ${field}`,
  success: "Operazione completata con successo"
}
```

### Keyboard Navigation
```typescript
const keyboardHandlers = {
  'Escape': closeModal,
  'Tab': handleTabNavigation,
  'Enter': submitCurrentForm,
  'ArrowLeft': previousStep,
  'ArrowRight': nextStep
}
```

## Migration Strategy

### Phase 1: Create New Components
- Build AuthModalProvider
- Create unified form components
- Implement state management

### Phase 2: Integrate with Existing
- Replace current modal with new system
- Migrate existing auth pages to modal states
- Update routing and redirects

### Phase 3: Cleanup and Optimize
- Remove old auth pages
- Optimize bundle size
- Add comprehensive testing

### Phase 4: Monitor and Iterate
- Track user behavior
- Optimize conversion rates
- Gather user feedback