-- =========================================================================
-- MIGRATION 0007: Performance Optimizations
-- =========================================================================
-- Date: 2026-01-27
-- Description: Fix Auth RLS InitPlan, duplicate policies, missing indexes
-- Fixes: 24 Auth RLS warnings + 3 duplicate policies + 1 missing index
-- =========================================================================

-- ========================= 
-- 1) FIX AUTH RLS INITPLAN (24 policies)
-- ========================= 

-- 1.1) TODO table
DROP POLICY IF EXISTS "Users can manage their own todos" ON todo;
CREATE POLICY "Users can manage their own todos"
ON todo FOR ALL
USING (user_id = (SELECT auth.uid()));

-- 1.2) USER_PROFILE table
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profile;

CREATE POLICY "Users can view their own profile"
ON user_profile FOR SELECT
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile"
ON user_profile FOR UPDATE
USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own profile"
ON user_profile FOR INSERT
WITH CHECK (id = (SELECT auth.uid()));

-- 1.3) TRACKED_CHALLENGES table
DROP POLICY IF EXISTS "Users can view their own tracked challenges" ON tracked_challenges;
DROP POLICY IF EXISTS "Users can insert their own tracked challenges" ON tracked_challenges;
DROP POLICY IF EXISTS "Users can update their own tracked challenges" ON tracked_challenges;
DROP POLICY IF EXISTS "Users can delete their own tracked challenges" ON tracked_challenges;

CREATE POLICY "Users can view their own tracked challenges"
ON tracked_challenges FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own tracked challenges"
ON tracked_challenges FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own tracked challenges"
ON tracked_challenges FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own tracked challenges"
ON tracked_challenges FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- 1.4) TRADES table
DROP POLICY IF EXISTS "Users can view their own trades" ON trades;
DROP POLICY IF EXISTS "Users can insert their own trades" ON trades;
DROP POLICY IF EXISTS "Users can update their own trades" ON trades;
DROP POLICY IF EXISTS "Users can delete their own trades" ON trades;

CREATE POLICY "Users can view their own trades"
ON trades FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own trades"
ON trades FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own trades"
ON trades FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own trades"
ON trades FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- 1.5) TRADING_SIGNALS table
DROP POLICY IF EXISTS "Users can view their own signals" ON trading_signals;
DROP POLICY IF EXISTS "Users can insert their own signals" ON trading_signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON trading_signals;
DROP POLICY IF EXISTS "Users can delete their own signals" ON trading_signals;

CREATE POLICY "Users can view their own signals"
ON trading_signals FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own signals"
ON trading_signals FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own signals"
ON trading_signals FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own signals"
ON trading_signals FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- 1.6) SIGNAL_SETTINGS table
DROP POLICY IF EXISTS "Users can view their own signal settings" ON signal_settings;
DROP POLICY IF EXISTS "Users can insert their own signal settings" ON signal_settings;
DROP POLICY IF EXISTS "Users can update their own signal settings" ON signal_settings;
DROP POLICY IF EXISTS "Users can delete their own signal settings" ON signal_settings;

CREATE POLICY "Users can view their own signal settings"
ON signal_settings FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own signal settings"
ON signal_settings FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own signal settings"
ON signal_settings FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own signal settings"
ON signal_settings FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- 1.7) ALERTS table
DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can insert their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON alerts;

CREATE POLICY "Users can view their own alerts"
ON alerts FOR SELECT
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own alerts"
ON alerts FOR INSERT
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own alerts"
ON alerts FOR UPDATE
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own alerts"
ON alerts FOR DELETE
USING (user_id = (SELECT auth.uid()));

-- ========================= 
-- 2) REMOVE DUPLICATE POLICIES
-- ========================= 

-- Drop old policies (without "their")
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;

-- ========================= 
-- 3) ADD MISSING INDEX
-- ========================= 

CREATE INDEX IF NOT EXISTS idx_alerts_challenge_id 
ON alerts(challenge_id);

-- ========================= 
-- 4) COMPLETION
-- ========================= 
-- Migration 0007 applied successfully
-- Fixed: 24 Auth RLS InitPlan warnings
-- Fixed: 3 duplicate policies  
-- Added: 1 missing index
-- 
-- Next Steps:
-- 1. Monitor query performance for 30-60 days
-- 2. Review unused indexes after production usage
-- 3. Consider cleanup migration if needed
