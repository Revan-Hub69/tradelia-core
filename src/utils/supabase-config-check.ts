/**
 * Supabase Configuration Checker
 * Verifica che la configurazione Supabase sia corretta per OAuth
 */

import { createClient } from '@/libs/supabase/client';

export const checkSupabaseConfig = async () => {
  const supabase = createClient();

  const checks = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    connection: false,
  };

  try {
    // Test basic connection
    const { error } = await supabase.auth.getSession();
    checks.connection = !error;

    if (!checks.supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    }

    if (!checks.supabaseKey) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    }

    if (!checks.connection) {
      console.error('❌ Cannot connect to Supabase');
    }

    return checks;
  } catch (error) {
    console.error('Supabase config check failed:', error);
    return { ...checks, connection: false };
  }
};

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  checkSupabaseConfig();
}
