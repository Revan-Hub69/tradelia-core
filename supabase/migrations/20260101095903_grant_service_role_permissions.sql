-- ============================================================================
-- GRANT SERVICE ROLE PERMISSIONS ON ALL TABLES
-- ============================================================================

-- MCE Tables
GRANT ALL ON TABLE public.market_data TO service_role;
GRANT ALL ON TABLE public.regime_signatures TO service_role;
GRANT ALL ON TABLE public.system_health TO service_role;

-- UCM Tables
GRANT ALL ON TABLE public.universe_pool TO service_role;
GRANT ALL ON TABLE public.universe_active TO service_role;
GRANT ALL ON TABLE public.universe_state TO service_role;
GRANT ALL ON TABLE public.eligibility_snapshots TO service_role;

-- Setup Tables
GRANT ALL ON TABLE public.setup_events TO service_role;
GRANT ALL ON TABLE public.active_setups TO service_role;

-- Support Tables
GRANT ALL ON TABLE public.api_keys TO service_role;
GRANT ALL ON TABLE public.indicators TO service_role;
GRANT ALL ON TABLE public.rate_limits TO service_role;
GRANT ALL ON TABLE public.distributed_locks TO service_role;

-- Operational Tables
GRANT ALL ON TABLE public.market_data_runs TO service_role;
GRANT ALL ON TABLE public.paper_trades TO service_role;

-- Auth Tables
GRANT ALL ON TABLE public.auth_events TO service_role;
GRANT ALL ON TABLE public.user_profiles TO service_role;
GRANT ALL ON TABLE public.user_sessions TO service_role;
GRANT ALL ON TABLE public.cookie_preferences TO service_role;
GRANT ALL ON TABLE public.user_progress TO service_role;
GRANT ALL ON TABLE public.start_flow_responses TO service_role;
GRANT ALL ON TABLE public.platform_checks TO service_role;
GRANT ALL ON TABLE public.microlearning_progress TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO service_role;

SELECT 'Service role permissions granted' as status;;
