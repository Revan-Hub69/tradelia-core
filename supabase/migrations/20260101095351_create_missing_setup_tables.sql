-- Create missing setup tables

CREATE TABLE IF NOT EXISTS public.setup_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  setup_id TEXT,
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  market_state JSONB DEFAULT '{}',
  outcome JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_setup_events_symbol_timestamp ON public.setup_events(symbol, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_setup_events_setup_id ON public.setup_events(setup_id);
CREATE INDEX IF NOT EXISTS idx_setup_events_event_type_timestamp ON public.setup_events(event_type, timestamp DESC);

CREATE TABLE IF NOT EXISTS public.active_setups (
  id BIGSERIAL PRIMARY KEY,
  setup_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  setup_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  entry_price NUMERIC NOT NULL,
  stop_price NUMERIC NOT NULL,
  target_primary NUMERIC NOT NULL,
  target_secondary NUMERIC,
  confidence_score NUMERIC NOT NULL,
  risk_reward NUMERIC NOT NULL,
  max_risk NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_active_setups_symbol_status ON public.active_setups(symbol, status);
CREATE INDEX IF NOT EXISTS idx_active_setups_expires_at ON public.active_setups(expires_at);

ALTER TABLE IF EXISTS public.setup_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.active_setups ENABLE ROW LEVEL SECURITY;

SELECT 'Setup tables created' as status;;
