-- ============================================
-- TRADELIA DATABASE SCHEMA
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================
-- USERS & AUTH (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  preferred_locale text DEFAULT 'it' CHECK (preferred_locale IN ('it', 'en')),
  timezone text DEFAULT 'Europe/Rome',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User learning progress
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  completion_date timestamptz,
  time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id, lesson_id)
);

-- User saved indicators/watchlist
CREATE TABLE public.user_watchlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  indicator_type text NOT NULL,
  symbol text, -- optional, for crypto-specific indicators
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, indicator_type, symbol)
);

-- ============================================
-- MARKET DATA & INDICATORS
-- ============================================

-- Cached market indicators
CREATE TABLE public.indicators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_type text NOT NULL, -- 'fear_greed', 'btc_dominance', 'total_market_cap', etc
  value numeric NOT NULL,
  value_class text, -- 'extreme_fear', 'fear', 'neutral', 'greed', 'extreme_greed'
  metadata jsonb DEFAULT '{}', -- extra data (components, sources, etc)
  source text NOT NULL, -- API source
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_indicators_type ON public.indicators(indicator_type);
CREATE INDEX idx_indicators_updated ON public.indicators(updated_at DESC);

-- Time-series market prices
CREATE TABLE public.market_prices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol text NOT NULL, -- 'BTC', 'ETH', etc
  price numeric NOT NULL,
  volume_24h numeric,
  market_cap numeric,
  price_change_24h numeric,
  timestamp timestamptz DEFAULT now()
);

-- Index for fast time-series queries
CREATE INDEX idx_market_prices_symbol_time ON public.market_prices(symbol, timestamp DESC);

-- Historical indicator snapshots (for charts)
CREATE TABLE public.indicator_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_type text NOT NULL,
  value numeric NOT NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX idx_indicator_history_type_time ON public.indicator_history(indicator_type, timestamp DESC);

-- ============================================
-- MICROLEARNING CONTENT
-- ============================================

-- Learning modules
CREATE TABLE public.learning_modules (
  id text PRIMARY KEY, -- 'intro-to-crypto', 'fear-greed-index', etc
  title jsonb NOT NULL, -- {"it": "Introduzione", "en": "Introduction"}
  description jsonb NOT NULL,
  category text NOT NULL, -- 'basics', 'indicators', 'risk-management', etc
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes integer,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual lessons within modules
CREATE TABLE public.learning_lessons (
  id text PRIMARY KEY, -- 'intro-to-crypto-lesson-1', etc
  module_id text REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  title jsonb NOT NULL,
  content jsonb NOT NULL, -- Rich content structure
  estimated_minutes integer DEFAULT 5,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_lessons_module ON public.learning_lessons(module_id, order_index);

-- ============================================
-- AI INTERACTIONS & LOGS
-- ============================================

-- AI explanation requests (for analytics & improvement)
CREATE TABLE public.ai_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  interaction_type text NOT NULL, -- 'indicator_explanation', 'lesson_question', etc
  context jsonb NOT NULL, -- indicator data, lesson id, etc
  ai_response text,
  feedback_rating integer CHECK (feedback_rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ai_interactions_user ON public.ai_interactions(user_id, created_at DESC);
CREATE INDEX idx_ai_interactions_type ON public.ai_interactions(interaction_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all user tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User progress: users can only see/edit their own
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- User watchlist: users can only see/edit their own
CREATE POLICY "Users can view own watchlist" ON public.user_watchlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own watchlist" ON public.user_watchlist
  FOR ALL USING (auth.uid() = user_id);

-- AI interactions: users can only see their own
CREATE POLICY "Users can view own AI interactions" ON public.ai_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI interactions" ON public.ai_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for market data (no auth required)
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published indicators" ON public.indicators
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view market prices" ON public.market_prices
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view indicator history" ON public.indicator_history
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view published modules" ON public.learning_modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view published lessons" ON public.learning_lessons
  FOR SELECT USING (is_published = true);

-- ============================================
-- REALTIME PUBLICATIONS
-- ============================================

-- Enable realtime for market data tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_prices;

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

-- Apply to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_lessons_updated_at BEFORE UPDATE ON public.learning_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (optional, for development)
-- ============================================

-- Insert example learning module
INSERT INTO public.learning_modules (id, title, description, category, difficulty, estimated_minutes, order_index, is_published)
VALUES (
  'fear-greed-index',
  '{"it": "Fear & Greed Index", "en": "Fear & Greed Index"}',
  '{"it": "Impara a leggere il sentiment di mercato", "en": "Learn to read market sentiment"}',
  'indicators',
  'beginner',
  15,
  1,
  true
);

-- Insert example lesson
INSERT INTO public.learning_lessons (id, module_id, title, content, estimated_minutes, order_index, is_published)
VALUES (
  'fear-greed-index-lesson-1',
  'fear-greed-index',
  '{"it": "Da dove nasce", "en": "Where it comes from"}',
  '{"it": {"blocks": [{"type": "paragraph", "text": "L''idea di misurare il sentiment di mercato viene dalla finanza comportamentale..."}]}, "en": {"blocks": [{"type": "paragraph", "text": "The idea of measuring market sentiment comes from behavioral finance..."}]}}',
  5,
  1,
  true
);
