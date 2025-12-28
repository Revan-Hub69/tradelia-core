-- ============================================
-- SUPABASE CRON JOB SETUP
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Create a function to update Fear & Greed data
CREATE OR REPLACE FUNCTION update_fear_greed_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_response jsonb;
  fear_greed_value integer;
  fear_greed_class text;
  fear_greed_timestamp text;
  fear_greed_time_until_update text;
  fear_greed_classification text;
BEGIN
  -- Make HTTP request to our API endpoint
  SELECT content::jsonb INTO api_response
  FROM http_post(
    'https://your-vercel-domain.vercel.app/api/indicators/fear-greed',
    '',
    'application/json'
  );
  
  -- Log the function execution
  RAISE NOTICE 'Fear & Greed cron job executed at %', now();
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors
    RAISE NOTICE 'Error in update_fear_greed_data: %', SQLERRM;
END;
$$;

-- 3. Schedule the cron job to run daily at 2:00 AM UTC
-- (Alternative.me updates at midnight UTC, so we run 2 hours later)
SELECT cron.schedule(
  'update-fear-greed-daily',
  '0 2 * * *',  -- Every day at 2:00 AM UTC
  'SELECT update_fear_greed_data();'
);

-- 4. Alternative: Simple approach using direct HTTP call
-- If the above doesn't work, use this simpler version:
SELECT cron.schedule(
  'fear-greed-http-update',
  '0 2 * * *',  -- Every day at 2:00 AM UTC
  $$
  SELECT http_post(
    'https://your-vercel-domain.vercel.app/api/indicators/fear-greed',
    '',
    'application/json'
  );
  $$
);

-- 5. Check scheduled jobs
SELECT * FROM cron.job;

-- 6. Test the function manually (optional)
-- SELECT update_fear_greed_data();

-- Success message
SELECT 'Cron job setup completed! Fear & Greed will update daily at 2:00 AM UTC' as status;