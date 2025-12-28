-- ============================================
-- SUPABASE PERMISSION FIX
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. First, check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('indicators', 'user_profiles');

-- 2. Create indicators table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.indicators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_type text NOT NULL,
  value numeric NOT NULL,
  value_class text,
  metadata jsonb DEFAULT '{}',
  source text NOT NULL DEFAULT 'unknown',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 3. Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. DISABLE RLS for testing (CRITICAL!)
ALTER TABLE public.indicators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 5. Grant permissions to service role (just in case)
GRANT ALL ON public.indicators TO service_role;
GRANT ALL ON public.user_profiles TO service_role;

-- 6. Grant permissions to anon role for reading
GRANT SELECT ON public.indicators TO anon;

-- 7. Insert test data
INSERT INTO public.indicators (indicator_type, value, value_class, source)
VALUES ('fear_greed', 50, 'neutral', 'test')
ON CONFLICT DO NOTHING;

-- 8. Test the setup
SELECT * FROM public.indicators LIMIT 5;

-- Success message
SELECT 'Database setup completed successfully!' as status;