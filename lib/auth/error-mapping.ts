// lib/auth/error-mapping.ts - Map SDK errors to translation keys

/**
 * Maps SDK error codes to translation keys
 * NEVER expose raw error.message to users (anti-enumeration)
 */
export function mapAuthErrorToKey(error: unknown): string {
  // Supabase error codes
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    
    switch (code) {
      case 'invalid_credentials':
      case 'user_not_found':
        return 'auth.login.errors.invalid'; // Generic, no enumeration
      case 'email_not_confirmed':
        return 'auth.verifyEmail.errors.verifyError';
      case 'invalid_token':
      case 'expired_token':
        return 'auth.resetPassword.errors.invalidLink';
      case 'over_request_rate_limit':
        return 'auth.common.rateLimited';
      default:
        return 'auth.common.errorGeneric';
    }
  }
  
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'auth.common.errorGeneric';
  }
  
  return 'auth.common.errorGeneric';
}
