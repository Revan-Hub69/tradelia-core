/**
 * Form Validation - Tradelia 2026
 * 
 * Seguendo ux-contract.md e security-contract.md:
 * - Validazione client-side per UX (feedback immediato)
 * - Validazione server-side OBBLIGATORIA per sicurezza
 * - Messaggi specifici, non generici
 * - Zod schemas riutilizzabili
 */

import { z } from 'zod'

// ============================================
// VALIDATION MESSAGES (i18n ready)
// ============================================

export const validationMessages = {
  it: {
    required: 'Campo obbligatorio',
    email: {
      invalid: 'Inserisci un\'email valida',
      required: 'L\'email è obbligatoria'
    },
    password: {
      required: 'La password è obbligatoria',
      minLength: 'La password deve essere di almeno 8 caratteri',
      maxLength: 'La password non può superare i 100 caratteri',
      weak: 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero'
    },
    confirmPassword: {
      required: 'Conferma la password',
      mismatch: 'Le password non coincidono'
    },
    name: {
      required: 'Il nome è obbligatorio',
      minLength: 'Il nome deve essere di almeno 2 caratteri',
      maxLength: 'Il nome non può superare i 100 caratteri'
    },
    nickname: {
      required: 'Il nickname è obbligatorio',
      minLength: 'Il nickname deve avere almeno 3 caratteri',
      maxLength: 'Il nickname non può superare 20 caratteri',
      invalid: 'Solo lettere, numeri e underscore'
    },
    country: {
      required: 'Seleziona il tuo paese di residenza'
    },
    generic: {
      tooShort: 'Valore troppo corto',
      tooLong: 'Valore troppo lungo',
      invalid: 'Valore non valido'
    }
  },
  en: {
    required: 'Required field',
    email: {
      invalid: 'Please enter a valid email',
      required: 'Email is required'
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      maxLength: 'Password cannot exceed 100 characters',
      weak: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    },
    confirmPassword: {
      required: 'Please confirm your password',
      mismatch: 'Passwords do not match'
    },
    name: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 100 characters'
    },
    nickname: {
      required: 'Nickname is required',
      minLength: 'Nickname must be at least 3 characters',
      maxLength: 'Nickname cannot exceed 20 characters',
      invalid: 'Only letters, numbers and underscore allowed'
    },
    country: {
      required: 'Please select your country of residence'
    },
    generic: {
      tooShort: 'Value too short',
      tooLong: 'Value too long',
      invalid: 'Invalid value'
    }
  }
}

type Locale = 'it' | 'en'
type Messages = typeof validationMessages.it

export function getMessages(locale: Locale = 'it'): Messages {
  return validationMessages[locale] || validationMessages.it
}

// ============================================
// ZOD SCHEMAS
// ============================================

// Email schema
export const emailSchema = (messages: Messages) => 
  z.string()
    .min(1, messages.email.required)
    .email(messages.email.invalid)
    .max(255, messages.generic.tooLong)

// Password schema (basic)
export const passwordSchema = (messages: Messages) =>
  z.string()
    .min(1, messages.password.required)
    .min(8, messages.password.minLength)
    .max(100, messages.password.maxLength)

// Password schema (strong - with pattern)
export const strongPasswordSchema = (messages: Messages) =>
  z.string()
    .min(1, messages.password.required)
    .min(8, messages.password.minLength)
    .max(100, messages.password.maxLength)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, messages.password.weak)

// Name schema
export const nameSchema = (messages: Messages) =>
  z.string()
    .min(1, messages.name.required)
    .min(2, messages.name.minLength)
    .max(100, messages.name.maxLength)
    .trim()

// Nickname schema (3-20 chars, alphanumeric + underscore)
export const nicknameSchema = (messages: Messages) =>
  z.string()
    .min(1, messages.nickname.required)
    .min(3, messages.nickname.minLength)
    .max(20, messages.nickname.maxLength)
    .regex(/^[a-zA-Z0-9_]+$/, messages.nickname.invalid)

// Country schema (any valid ISO 3166-1 alpha-2 code)
export const countrySchema = (messages: Messages) =>
  z.string()
    .length(2, messages.country.required)
    .regex(/^[A-Z]{2}$/, messages.country.required)

/**
 * Validates a nickname string
 * @param nickname - The nickname to validate
 * @returns { success: true } if valid, { success: false, error: string } if invalid
 */
export function validateNickname(nickname: string): { success: true } | { success: false; error: string } {
  // Check length
  if (nickname.length < 3) {
    return { success: false, error: 'minLength' }
  }
  if (nickname.length > 20) {
    return { success: false, error: 'maxLength' }
  }
  // Check format (alphanumeric + underscore only)
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return { success: false, error: 'invalid' }
  }
  return { success: true }
}

// ============================================
// FORM SCHEMAS
// ============================================

// Login form
export const loginSchema = (locale: Locale = 'it') => {
  const m = getMessages(locale)
  return z.object({
    email: emailSchema(m),
    password: z.string().min(1, m.password.required)
  })
}

// Registration form
export const registerSchema = (locale: Locale = 'it') => {
  const m = getMessages(locale)
  return z.object({
    nickname: nicknameSchema(m),
    country: countrySchema(m),
    email: emailSchema(m),
    password: passwordSchema(m),
    confirmPassword: z.string().min(1, m.confirmPassword.required)
  }).refine((data) => data.password === data.confirmPassword, {
    message: m.confirmPassword.mismatch,
    path: ['confirmPassword']
  })
}

// Registration form (legacy - with fullName for backward compatibility)
export const registerSchemaLegacy = (locale: Locale = 'it') => {
  const m = getMessages(locale)
  return z.object({
    fullName: nameSchema(m),
    email: emailSchema(m),
    password: passwordSchema(m),
    confirmPassword: z.string().min(1, m.confirmPassword.required)
  }).refine((data) => data.password === data.confirmPassword, {
    message: m.confirmPassword.mismatch,
    path: ['confirmPassword']
  })
}

// Password reset request
export const resetRequestSchema = (locale: Locale = 'it') => {
  const m = getMessages(locale)
  return z.object({
    email: emailSchema(m)
  })
}

// Password reset (new password)
export const resetPasswordSchema = (locale: Locale = 'it') => {
  const m = getMessages(locale)
  return z.object({
    password: passwordSchema(m),
    confirmPassword: z.string().min(1, m.confirmPassword.required)
  }).refine((data) => data.password === data.confirmPassword, {
    message: m.confirmPassword.mismatch,
    path: ['confirmPassword']
  })
}

// ============================================
// VALIDATION HELPERS
// ============================================

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

/**
 * Validate form data with Zod schema
 * Returns either validated data or field-level errors
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Convert Zod errors to field-level errors
  const errors: Record<string, string> = {}
  for (const error of result.error.issues) {
    const path = error.path.join('.')
    if (!errors[path]) {
      errors[path] = error.message
    }
  }
  
  return { success: false, errors }
}

/**
 * Validate single field (for real-time validation)
 */
export function validateField(
  schema: z.ZodSchema,
  value: unknown
): string | null {
  const result = schema.safeParse(value)
  if (result.success) return null
  return result.error.issues[0]?.message || 'Invalid value'
}

// ============================================
// REACT HOOK
// ============================================

import { useState, useCallback } from 'react'

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  onSubmit
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((data: unknown): data is T => {
    const result = validateForm(schema, data)
    if (result.success) {
      setErrors({})
      return true
    }
    setErrors(result.errors)
    return false
  }, [schema])

  const validateSingleField = useCallback((field: string, value: unknown) => {
    // Get field schema from parent schema - safe type check
    const schemaShape = (schema as unknown as { shape?: Record<string, z.ZodTypeAny> }).shape
    const fieldSchema = schemaShape?.[field]
    if (!fieldSchema) return
    
    const error = validateField(fieldSchema, value)
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error }
      }
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [schema])

  const handleSubmit = useCallback(async (data: unknown) => {
    if (!validate(data)) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(data as T)
    } finally {
      setIsSubmitting(false)
    }
  }, [validate, onSubmit])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  return {
    errors,
    isSubmitting,
    validate,
    validateSingleField,
    handleSubmit,
    clearErrors,
    setFieldError
  }
}

// Export types
export type { Locale, Messages }
