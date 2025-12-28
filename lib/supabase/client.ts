import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Allow development without Supabase credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Database features disabled.')
}

// Client-side Supabase client (only create if credentials exist)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

// Server-side Supabase client (for API routes)
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase server credentials')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Error handling wrapper
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

// Query wrapper with error handling and logging
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  operation: string
): Promise<T> {
  try {
    const { data, error } = await queryFn()
    
    if (error) {
      console.error(`Supabase ${operation} error:`, error)
      throw new SupabaseError(
        error.message || `Failed to ${operation}`,
        error.code,
        error
      )
    }
    
    if (data === null) {
      throw new SupabaseError(`No data returned from ${operation}`)
    }
    
    return data
  } catch (error) {
    if (error instanceof SupabaseError) {
      throw error
    }
    
    console.error(`Unexpected error in ${operation}:`, error)
    throw new SupabaseError(
      `Unexpected error during ${operation}`,
      'UNEXPECTED_ERROR',
      error
    )
  }
}

// Retry wrapper for network errors
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on auth errors or client errors
      if (error instanceof SupabaseError && 
          (error.code?.startsWith('4') || error.code === 'PGRST301')) {
        throw error
      }
      
      if (i === maxRetries) break
      
      console.warn(`Retry ${i + 1}/${maxRetries} after error:`, error)
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  throw lastError!
}