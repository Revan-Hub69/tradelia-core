-- ============================================
-- TRADELIA - DATABASE RESET (FIXED)
-- ATTENZIONE: Questo cancella TUTTO!
-- ============================================

-- Disable RLS temporarily
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.indicators DISABLE ROW LEVEL SECURITY;

-- Drop all existing tables in public schema (be careful!)
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.indicators CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.follows CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Remove from realtime publication (without IF EXISTS)
DO $
BEGIN
  -- Try to remove tables from realtime, ignore errors if they don't exist
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.user_profiles;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore error if table doesn't exist in publication
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.indicators;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.users;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.posts;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.comments;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.likes;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.follows;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $;

-- Success message
DO $
BEGIN
  RAISE NOTICE 'Database reset completed! All tables dropped.';
END $;