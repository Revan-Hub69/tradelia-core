-- Grant permissions for pipeline operations

-- Grant permissions on market_data table
GRANT ALL ON TABLE public.market_data TO service_role;
GRANT ALL ON TABLE public.market_data TO authenticated;
GRANT SELECT ON TABLE public.market_data TO anon;

-- Grant permissions on mce_regime_snapshots table  
GRANT ALL ON TABLE public.mce_regime_snapshots TO service_role;
GRANT ALL ON TABLE public.mce_regime_snapshots TO authenticated;
GRANT SELECT ON TABLE public.mce_regime_snapshots TO anon;

-- Grant permissions on universe_active table
GRANT ALL ON TABLE public.universe_active TO service_role;
GRANT ALL ON TABLE public.universe_active TO authenticated;
GRANT SELECT ON TABLE public.universe_active TO anon;

-- Grant permissions on msf_snapshots table
GRANT ALL ON TABLE public.msf_snapshots TO service_role;
GRANT ALL ON TABLE public.msf_snapshots TO authenticated;
GRANT SELECT ON TABLE public.msf_snapshots TO anon;

-- Grant permissions on setup tables
GRANT ALL ON TABLE public.setup_events TO service_role;
GRANT ALL ON TABLE public.setup_events TO authenticated;
GRANT SELECT ON TABLE public.setup_events TO anon;

GRANT ALL ON TABLE public.active_setups TO service_role;
GRANT ALL ON TABLE public.active_setups TO authenticated;
GRANT SELECT ON TABLE public.active_setups TO anon;

-- Success message
DO $
BEGIN
  RAISE NOTICE 'Permissions granted for pipeline operations!';
END $;