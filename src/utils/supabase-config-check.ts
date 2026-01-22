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
    oauth: false,
  };

  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    checks.connection = !error;

    // Test OAuth configuration (this will show available providers)
    const { data: providers } = await supabase.auth.getOAuthProviders();
    checks.oauth = providers && providers.length > 0;

    console.log('Supabase Configuration Check:', checks);
    
    if (!checks.supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    }
    
    if (!checks.supabaseKey) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    }
    
    if (!checks.connection) {
      console.error('❌ Cannot connect to Supabase');
    }
    
    if (!checks.oauth) {
      console.warn('⚠️ No OAuth providers configured or available');
    }

    return checks;
  } catch (error) {
    console.error('Supabase config check failed:', error);
    return { ...checks, connection: false, oauth: false };
  }
};

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  checkSupabaseConfig();
}