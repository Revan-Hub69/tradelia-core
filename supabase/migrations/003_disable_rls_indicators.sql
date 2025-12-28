-- ============================================
-- TRADELIA - Temporarily Disable RLS for Indicators
-- Migration: 003_disable_rls_indicators
-- ============================================

-- Disable RLS for indicators table (for testing)
-- Service role should bypass RLS anyway, but let's test without RLS
ALTER TABLE public.indicators DISABLE ROW LEVEL SECURITY;

-- Success message
DO $
BEGIN
  RAISE NOTICE 'Migration 003_disable_rls_indicators completed successfully!';
  RAISE NOTICE 'RLS disabled for indicators table - FOR TESTING ONLY';
END $;