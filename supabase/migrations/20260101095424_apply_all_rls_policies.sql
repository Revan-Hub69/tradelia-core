-- Apply RLS policies to all tables

DROP POLICY IF EXISTS "regime_signatures_service_role" ON public.regime_signatures;
DROP POLICY IF EXISTS "regime_signatures_anon_read" ON public.regime_signatures;
CREATE POLICY "regime_signatures_service_role" ON public.regime_signatures FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "regime_signatures_anon_read" ON public.regime_signatures FOR SELECT USING (auth.role() = 'anon' AND inserted_at > NOW() - INTERVAL '24 hours');

DROP POLICY IF EXISTS "market_data_service_role" ON public.market_data;
DROP POLICY IF EXISTS "market_data_anon_read" ON public.market_data;
CREATE POLICY "market_data_service_role" ON public.market_data FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "market_data_anon_read" ON public.market_data FOR SELECT USING (auth.role() = 'anon' AND inserted_at > NOW() - INTERVAL '24 hours');

DROP POLICY IF EXISTS "universe_pool_service_role" ON public.universe_pool;
CREATE POLICY "universe_pool_service_role" ON public.universe_pool FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "universe_active_service_role" ON public.universe_active;
CREATE POLICY "universe_active_service_role" ON public.universe_active FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "universe_state_service_role" ON public.universe_state;
CREATE POLICY "universe_state_service_role" ON public.universe_state FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "eligibility_snapshots_service_role" ON public.eligibility_snapshots;
DROP POLICY IF EXISTS "eligibility_snapshots_anon_read" ON public.eligibility_snapshots;
CREATE POLICY "eligibility_snapshots_service_role" ON public.eligibility_snapshots FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "eligibility_snapshots_anon_read" ON public.eligibility_snapshots FOR SELECT USING (auth.role() = 'anon' AND created_at > NOW() - INTERVAL '24 hours');

DROP POLICY IF EXISTS "setup_events_service_role" ON public.setup_events;
CREATE POLICY "setup_events_service_role" ON public.setup_events FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "active_setups_service_role" ON public.active_setups;
CREATE POLICY "active_setups_service_role" ON public.active_setups FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "api_keys_service_role" ON public.api_keys;
CREATE POLICY "api_keys_service_role" ON public.api_keys FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "indicators_service_role" ON public.indicators;
DROP POLICY IF EXISTS "indicators_anon_read" ON public.indicators;
CREATE POLICY "indicators_service_role" ON public.indicators FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "indicators_anon_read" ON public.indicators FOR SELECT USING (auth.role() = 'anon' AND created_at > NOW() - INTERVAL '24 hours');

DROP POLICY IF EXISTS "rate_limits_service_role" ON public.rate_limits;
CREATE POLICY "rate_limits_service_role" ON public.rate_limits FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "distributed_locks_service_role" ON public.distributed_locks;
CREATE POLICY "distributed_locks_service_role" ON public.distributed_locks FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "market_data_runs_service_role" ON public.market_data_runs;
CREATE POLICY "market_data_runs_service_role" ON public.market_data_runs FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "paper_trades_service_role" ON public.paper_trades;
CREATE POLICY "paper_trades_service_role" ON public.paper_trades FOR ALL USING (auth.role() = 'service_role');

SELECT 'All RLS policies applied' as status;;
