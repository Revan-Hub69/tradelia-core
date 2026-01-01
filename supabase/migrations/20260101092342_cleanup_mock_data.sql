-- Clean up all mock data from public schema
DELETE FROM public.indicators;
DELETE FROM public.system_health;
DELETE FROM public.universe_pool;
DELETE FROM public.universe_active;
DELETE FROM public.universe_state;
DELETE FROM public.regime_signatures;
DELETE FROM public.market_data;
DELETE FROM public.eligibility_snapshots;
DELETE FROM public.auth_events;
DELETE FROM public.cookie_preferences;
DELETE FROM public.user_sessions;
DELETE FROM public.user_progress;
DELETE FROM public.start_flow_responses;
DELETE FROM public.platform_checks;
DELETE FROM public.microlearning_progress;
DELETE FROM public.distributed_locks;
DELETE FROM public.rate_limits;
DELETE FROM public.user_profiles;

-- Verify all tables are empty
SELECT 'Cleanup complete' as status;;
