-- ============================================================================
-- PHASE 1: CREATE MISSING TABLES
-- ============================================================================

-- market_data_runs: Track MCE pipeline executions
CREATE TABLE IF NOT EXISTS public.market_data_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id TEXT NOT NULL UNIQUE,
  module TEXT NOT NULL CHECK (module IN ('MCE', 'UCM', 'MSF')),
  status TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_data_runs_module_status ON public.market_data_runs(module, status);
CREATE INDEX IF NOT EXISTS idx_market_data_runs_created_at ON public.market_data_runs(created_at DESC);

-- paper_trades: Track paper trading execution
CREATE TABLE IF NOT EXISTS public.paper_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  entry_price NUMERIC NOT NULL CHECK (entry_price > 0),
  exit_price NUMERIC,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  pnl NUMERIC,
  pnl_percent NUMERIC,
  status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  setup_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paper_trades_symbol_status ON public.paper_trades(symbol, status);
CREATE INDEX IF NOT EXISTS idx_paper_trades_entry_time ON public.paper_trades(entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_paper_trades_setup_id ON public.paper_trades(setup_id);

-- ============================================================================
-- PHASE 2: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE IF EXISTS public.market_data_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.paper_trades ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PHASE 3: CREATE RLS POLICIES (DESK-GRADE: STRICT)
-- ============================================================================

-- market_data_runs: Service role only
DROP POLICY IF EXISTS "market_data_runs_service_role" ON public.market_data_runs;
CREATE POLICY "market_data_runs_service_role" ON public.market_data_runs
  FOR ALL USING (auth.role() = 'service_role');

-- paper_trades: Service role only
DROP POLICY IF EXISTS "paper_trades_service_role" ON public.paper_trades;
CREATE POLICY "paper_trades_service_role" ON public.paper_trades
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- PHASE 4: GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON TABLE public.market_data_runs TO service_role;
GRANT ALL ON TABLE public.paper_trades TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Tables created and RLS configured' as status;;
