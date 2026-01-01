-- MCE utility functions

-- Function for data quality monitoring
CREATE OR REPLACE FUNCTION public.get_data_gaps(
  p_symbol TEXT DEFAULT 'BTCUSDT',
  p_tf TEXT DEFAULT '1m',
  p_hours INTEGER DEFAULT 24
) RETURNS TABLE (
  expected_time BIGINT,
  actual_time BIGINT,
  gap_minutes INTEGER
) AS $$
DECLARE
  interval_ms BIGINT;
  start_time BIGINT;
  end_time BIGINT;
BEGIN
  -- Calculate interval in milliseconds
  interval_ms := CASE p_tf
    WHEN '1m' THEN 60000
    WHEN '5m' THEN 300000
    WHEN '15m' THEN 900000
    WHEN '1h' THEN 3600000
    WHEN '4h' THEN 14400000
    ELSE 60000
  END;
  
  -- Time range
  end_time := EXTRACT(EPOCH FROM NOW()) * 1000;
  start_time := end_time - (p_hours * 3600000);
  
  -- Find gaps in data
  RETURN QUERY
  WITH expected_times AS (
    SELECT generate_series(
      start_time, 
      end_time, 
      interval_ms
    ) AS expected_time
  ),
  actual_data AS (
    SELECT open_time as actual_time
    FROM public.market_data 
    WHERE symbol = p_symbol 
      AND tf = p_tf 
      AND open_time >= start_time 
      AND open_time <= end_time
  )
  SELECT 
    e.expected_time,
    a.actual_time,
    ((e.expected_time - COALESCE(a.actual_time, 0)) / 60000)::INTEGER as gap_minutes
  FROM expected_times e
  LEFT JOIN actual_data a ON e.expected_time = a.actual_time
  WHERE a.actual_time IS NULL
  ORDER BY e.expected_time;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function for old data (free tier space management)
CREATE OR REPLACE FUNCTION public.cleanup_old_data(
  p_days INTEGER DEFAULT 90
) RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  cutoff_time TIMESTAMPTZ;
BEGIN
  cutoff_time := NOW() - (p_days || ' days')::INTERVAL;
  
  -- Delete old market data
  DELETE FROM public.market_data 
  WHERE inserted_at < cutoff_time;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Update system health
  INSERT INTO public.system_health (key, value) 
  VALUES ('last_cleanup', jsonb_build_object(
    'timestamp', EXTRACT(EPOCH FROM NOW()),
    'deleted_rows', deleted_count,
    'cutoff_days', p_days
  ))
  ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();
    
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;;
