/**
 * Validation Utilities - Tradelia 2026
 * 
 * Funzioni di validazione che seguono i principi di verificabilità
 */

/**
 * Valida un indirizzo email
 * Utilizza regex standard RFC 5322 semplificata
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida un URL
 * Supporta HTTP, HTTPS e protocolli personalizzati
 */
export function validateUrl(url: string, allowedProtocols: string[] = ['http', 'https']): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return allowedProtocols.includes(urlObj.protocol.slice(0, -1));
  } catch {
    return false;
  }
}

/**
 * Valida una password seguendo criteri di sicurezza
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password richiesta'] };
  }
  
  if (password.length < 8) {
    errors.push('Minimo 8 caratteri');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Almeno una lettera maiuscola');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Almeno una lettera minuscola');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Almeno un numero');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Almeno un carattere speciale');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida un numero di telefono italiano
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  // Rimuove spazi e caratteri speciali
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Formato italiano: +39 seguito da 9-10 cifre
  const italianPhoneRegex = /^(\+39)?[0-9]{9,10}$/;
  return italianPhoneRegex.test(cleanPhone);
}

/**
 * Valida un codice fiscale italiano
 */
export function validateCodiceFiscale(cf: string): boolean {
  if (!cf || typeof cf !== 'string') return false;
  
  const cleanCF = cf.toUpperCase().replace(/\s/g, '');
  
  // Verifica lunghezza
  if (cleanCF.length !== 16) return false;
  
  // Verifica formato: 6 lettere, 2 numeri, 1 lettera, 2 numeri, 1 lettera, 3 caratteri, 1 lettera
  const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;
  if (!cfRegex.test(cleanCF)) return false;
  
  // Verifica carattere di controllo (algoritmo semplificato)
  const oddChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const evenChars = 'BAKPLCQDREVOSFTGUHMINJWZYX';
  
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const char = cleanCF[i];
    if (i % 2 === 0) {
      // Posizione dispari (1-based)
      sum += oddChars.indexOf(char) !== -1 ? oddChars.indexOf(char) : parseInt(char);
    } else {
      // Posizione pari (1-based)
      sum += evenChars.indexOf(char) !== -1 ? evenChars.indexOf(char) : parseInt(char);
    }
  }
  
  const checkChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[sum % 26];
  return cleanCF[15] === checkChar;
}

/**
 * Valida un input generico con regole personalizzate
 */
export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export function validateWithRules(value: string, rules: ValidationRule[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Regole di validazione predefinite
 */
export const ValidationRules = {
  required: (message = 'Campo obbligatorio'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Minimo ${min} caratteri`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Massimo ${max} caratteri`,
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value) => regex.test(value),
    message,
  }),
  
  noSpecialChars: (message = 'Caratteri speciali non consentiti'): ValidationRule => ({
    test: (value) => /^[a-zA-Z0-9\s]*$/.test(value),
    message,
  }),
};