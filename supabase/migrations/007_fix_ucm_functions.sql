-- Fix UCM utility functions - PATCH 4: SQL type mismatch fixes
-- Migration 007: Fix function return types for JSONB compatibility

-- Drop and recreate function with correct return type
DROP FUNCTION IF EXISTS get_current_active_symbols();

-- Function to get current active symbols (returns JSONB, not TEXT[])
CREATE OR REPLACE FUNCTION get_current_active_symbols()
RETURNS JSONB AS $$
DECLARE
  active_symbols JSONB;
BEGIN
  SELECT symbols INTO active_symbols
  FROM universe_active
  ORDER BY as_of DESC
  LIMIT 1;
  
  RETURN COALESCE(active_symbols, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get universe active with metadata
CREATE OR REPLACE FUNCTION get_current_universe_active()
RETURNS JSONB AS $$
DECLARE
  universe_data JSONB;
BEGIN
  SELECT to_jsonb(universe_active.*) INTO universe_data
  FROM universe_active
  ORDER BY as_of DESC
  LIMIT 1;
  
  RETURN COALESCE(universe_data, '{}'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get universe diff between two timestamps
CREATE OR REPLACE FUNCTION get_universe_diff(from_ts BIGINT, to_ts BIGINT)
RETURNS JSONB AS $$
DECLARE
  diff_data JSONB;
BEGIN
  WITH universe_changes AS (
    SELECT 
      as_of,
      symbols,
      meta,
      LAG(symbols) OVER (ORDER BY as_of) as prev_symbols
    FROM universe_active
    WHERE as_of BETWEEN from_ts AND to_ts
    ORDER BY as_of
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'asOf', as_of,
      'symbols', symbols,
      'meta', meta,
      'prevSymbols', prev_symbols
    )
  ) INTO diff_data
  FROM universe_changes
  WHERE prev_symbols IS NOT NULL;
  
  RETURN COALESCE(diff_data, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION get_current_active_symbols() IS 'Returns current active universe symbols as JSONB array';
COMMENT ON FUNCTION get_current_universe_active() IS 'Returns complete current universe active record as JSONB';
COMMENT ON FUNCTION get_universe_diff(BIGINT, BIGINT) IS 'Returns universe changes between two timestamps';