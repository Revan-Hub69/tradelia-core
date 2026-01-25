'use server';

import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Auth Actions using Supabase Admin API
 * Bypasses client-side configuration issues and provides reliable error handling
 */

// Create admin client with service role key
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export type AuthResult = {
  success: boolean;
  error?: string;
  errorCode?: string;
  userId?: string;
  needsEmailConfirmation?: boolean;
};

/**
 * Server-side signup using Admin API
 * Provides clear, reliable error messages without client-side configuration issues
 */
export async function signUpWithEmailAndPassword(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    const supabase = createAdminClient();

    // Use admin.createUser for reliable error handling
    const { data: userData, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false, // We'll handle confirmation separately
    });

    if (error) {
      console.error('❌ Admin signup error:', error);

      // Handle specific error cases with clear messages
      if (error.status === 422) {
        return {
          success: false,
          error: 'Questa email è già registrata. Prova ad accedere invece.',
          errorCode: 'USER_ALREADY_EXISTS',
        };
      }

      if (error.message.includes('Invalid email')) {
        return {
          success: false,
          error: 'Email non valida. Controlla il formato.',
          errorCode: 'INVALID_EMAIL',
        };
      }

      if (error.message.includes('Password')) {
        return {
          success: false,
          error: 'Password troppo debole. Usa almeno 8 caratteri con maiuscole, minuscole e numeri.',
          errorCode: 'WEAK_PASSWORD',
        };
      }

      return {
        success: false,
        error: `Errore durante la registrazione: ${error.message}`,
        errorCode: 'SIGNUP_ERROR',
      };
    }

    if (userData.user) {
      // Send confirmation email manually if needed
      const { error: emailError } = await supabase.auth.admin.generateLink({
        type: 'signup',
        email: data.email,
        password: data.password,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?redirect=/dashboard`,
        },
      });

      if (emailError) {
        console.warn('⚠️ Email confirmation link generation failed:', emailError);
        // Don't fail the signup for email issues
      }

      return {
        success: true,
        userId: userData.user.id,
        needsEmailConfirmation: true,
      };
    }

    return {
      success: false,
      error: 'Errore sconosciuto durante la registrazione.',
      errorCode: 'UNKNOWN_ERROR',
    };
  } catch (error) {
    console.error('💥 Server-side signup exception:', error);
    return {
      success: false,
      error: 'Errore del server. Riprova più tardi.',
      errorCode: 'SERVER_ERROR',
    };
  }
}

/**
 * Check if email exists
 *
 * PRODUCTION-SAFE APPROACH:
 * - Try admin API if available
 * - Gracefully fallback on any error (dev or prod)
 */
export async function checkEmailExistsServer(email: string): Promise<{
  exists: boolean;
  error?: string;
}> {
  try {
    const supabase = createAdminClient();

    // Use admin API to list users by email
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Admin email check error:', error);
      // On error, assume new user to allow signup attempt
      return { exists: false };
    }

    // Check if email exists in the users list
    const userExists = data.users.some(user => user.email === email);
    // Email check result logged to server

    return { exists: userExists };
  } catch (error) {
    // On exception (missing env vars in dev), assume new user
    return { exists: false };
  }
}

/**
 * Server-side login
 */
export async function signInWithEmailAndPassword(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    // For login, we still use the regular client since we need session management
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Email o password non corretti.',
          errorCode: 'INVALID_CREDENTIALS',
        };
      }

      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Conferma la tua email prima di accedere.',
          errorCode: 'EMAIL_NOT_CONFIRMED',
        };
      }

      return {
        success: false,
        error: `Errore durante l'accesso: ${error.message}`,
        errorCode: 'LOGIN_ERROR',
      };
    }

    if (authData.user) {
      // Login successful
      return {
        success: true,
        userId: authData.user.id,
      };
    }

    return {
      success: false,
      error: 'Errore sconosciuto durante l\'accesso.',
      errorCode: 'UNKNOWN_ERROR',
    };
  } catch (error) {
    console.error('💥 Server-side login exception:', error);
    return {
      success: false,
      error: 'Errore del server. Riprova più tardi.',
      errorCode: 'SERVER_ERROR',
    };
  }
}
