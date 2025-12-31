// MCE Supabase Integration
// Handles database connections and basic client setup

import { createClient } from "@supabase/supabase-js";

// Admin client for server-side operations (bypasses RLS)
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  }
  
  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema: "public" }
  });
}

// Anonymous client for client-side operations (respects RLS)
export function supabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error("Missing public Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required");
  }
  
  return createClient(url, key);
}

// Health check function
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  
  try {
    const sb = supabaseAdmin();
    const { error } = await sb.from("system_health").select("key").limit(1);
    
    const latencyMs = Date.now() - start;
    
    if (error) {
      return {
        connected: false,
        latencyMs,
        error: error.message
      };
    }
    
    return {
      connected: true,
      latencyMs
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

// Database utility functions
export async function executeRawSQL(sql: string, params?: any[]): Promise<any> {
  const sb = supabaseAdmin();
  const { data, error } = await sb.rpc('execute_sql', { 
    sql_query: sql, 
    params: params || [] 
  });
  
  if (error) {
    throw new Error(`SQL execution failed: ${error.message}`);
  }
  
  return data;
}

// Connection pool management (for high-frequency operations)
let adminClientPool: ReturnType<typeof supabaseAdmin> | null = null;

export function getPooledAdminClient() {
  if (!adminClientPool) {
    adminClientPool = supabaseAdmin();
  }
  return adminClientPool;
}

export function resetClientPool() {
  adminClientPool = null;
}