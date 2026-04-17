// Stub client for when Supabase is not available
// This should be replaced with proper auth implementation

export function createClient() {
  throw new Error('Supabase client is not available - authentication has been disabled');
}