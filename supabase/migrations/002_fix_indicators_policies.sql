-- ============================================
-- TRADELIA - Fix Indicators Policies
-- Migration: 002_fix_indicators_policies
-- ============================================

-- Add INSERT/UPDATE policies for indicators table
-- Service role should bypass RLS, but adding explicit policies for safety

-- Allow service role to insert indicators (for API routes)
DROP POLICY IF EXISTS "Service role can insert indicators" ON public.indicators;
CREATE POLICY "Service role can insert indicators" ON public.indicators
  FOR INSERT WITH CHECK (true);

-- Allow service role to update indicators (for API routes)
DROP POLICY IF EXISTS "Service role can update indicators" ON public.indicators;
CREATE POLICY "Service role can update indicators" ON public.indicators
  FOR UPDATE USING (true);

-- Success message
DO $
BEGIN
  RAISE NOTICE 'Migration 002_fix_indicators_policies completed successfully!';
END $;