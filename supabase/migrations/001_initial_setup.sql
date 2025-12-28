-- ============================================
-- TRADELIA - INITIAL SETUP (ATOMIC)
-- Migration: 001_initial_setup
-- ============================================

-- Enable necessary extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================
-- BASIC TABLES (minimal for MVP)
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Basic indicators table (start simple)
CREATE TABLE IF NOT EXISTS public.indicators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_type text NOT NULL,
  value numeric NOT NULL,
  value_class text, -- 'extreme_fear', 'fear', 'neutral', 'greed', 'extreme_greed'
  metadata jsonb DEFAULT '{}',
  source text NOT NULL DEFAULT 'unknown',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_indicators_type ON public.indicators(indicator_type);
CREATE INDEX IF NOT EXISTS idx_indicators_updated ON public.indicators(updated_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Indicators policies (public read)
DROP POLICY IF EXISTS "Anyone can view indicators" ON public.indicators;
CREATE POLICY "Anyone can view indicators" ON public.indicators
  FOR SELECT USING (true);

-- ============================================
-- REALTIME (for live updates)
-- ============================================

-- Enable realtime for indicators
ALTER PUBLICATION supabase_realtime ADD TABLE public.indicators;

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (for testing)
-- ============================================

-- Insert test Fear & Greed data (if not exists)
INSERT INTO public.indicators (indicator_type, value, value_class, metadata, source)
SELECT 'fear_greed', 50, 'neutral', '{"components": {"volatility": 25, "volume": 25}}', 'alternative.me'
WHERE NOT EXISTS (
  SELECT 1 FROM public.indicators WHERE indicator_type = 'fear_greed'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 001_initial_setup completed successfully!';
END $$;