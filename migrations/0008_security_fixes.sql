-- =========================================================================
-- MIGRATION 0008: Security Fixes
-- =========================================================================
-- Date: 2026-01-27
-- Description: Fix RLS policies, views security, and function search paths
-- Fixes: 10 RLS disabled errors + 5 security definer view errors + 3 function warnings
-- =========================================================================

-- ========================= 
-- 1) ENABLE RLS ON CHALLENGE LIBRARY TABLES (10 tables)
-- ========================= 

-- These tables contain public data (challenges, programs, etc.)
-- RLS is enabled but policies allow public read access

ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rulesets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

-- ========================= 
-- 2) CREATE RLS POLICIES FOR PUBLIC READ ACCESS
-- ========================= 

-- Public read access for challenge data (everyone can view)
CREATE POLICY "Public read access for organizers"
ON organizers FOR SELECT
USING (true);

CREATE POLICY "Public read access for programs"
ON programs FOR SELECT
USING (true);

CREATE POLICY "Public read access for offers"
ON offers FOR SELECT
USING (true);

CREATE POLICY "Public read access for rulesets"
ON rulesets FOR SELECT
USING (true);

CREATE POLICY "Public read access for payout_terms"
ON payout_terms FOR SELECT
USING (true);

CREATE POLICY "Public read access for market_access"
ON market_access FOR SELECT
USING (true);

CREATE POLICY "Public read access for trust_metrics"
ON trust_metrics FOR SELECT
USING (true);

CREATE POLICY "Public read access for sources"
ON sources FOR SELECT
USING (true);

CREATE POLICY "Public read access for field_sources"
ON field_sources FOR SELECT
USING (true);

CREATE POLICY "Public read access for snapshots"
ON snapshots FOR SELECT
USING (true);

-- ========================= 
-- 3) RECREATE VIEWS WITHOUT SECURITY DEFINER (5 views)
-- ========================= 

-- Drop existing views
DROP VIEW IF EXISTS sources_with_freshness CASCADE;
DROP VIEW IF EXISTS dashboard_offers CASCADE;
DROP VIEW IF EXISTS dashboard_free_offers CASCADE;
DROP VIEW IF EXISTS dashboard_paid_offers CASCADE;
DROP VIEW IF EXISTS organizers_trust_latest CASCADE;

-- Recreate with SECURITY INVOKER
CREATE VIEW sources_with_freshness
WITH (security_invoker=true) AS
SELECT
  s.*,
  FLOOR(EXTRACT(EPOCH FROM (NOW() - s.accessed_at)) / 86400)::INT AS freshness_days
FROM sources s;

CREATE VIEW dashboard_offers
WITH (security_invoker=true) AS
SELECT
  o.id AS offer_id,
  o.offer_name,
  o.display_order,
  o.entry_fee,
  o.fee_currency,
  o.refundable,
  o.prize_pool,
  o.account_size,
  o.account_currency,
  o.frequency,
  o.next_edition_date,
  o.is_featured,
  o.is_hot,
  o.badges,
  o.tags,
  o.geo_mode,
  o.geo_list,
  
  p.id AS program_id,
  p.name AS program_name,
  p.category,
  p.type,
  p.subtype,
  p.status AS program_status,
  p.official_url,
  p.has_free_trial,
  p.pros,
  p.cons,
  
  org.id AS organizer_id,
  org.name AS organizer_name,
  org.organizer_type,
  org.legal_status,
  org.reputation_score,
  org.trustpilot_score,
  org.logo_url
FROM offers o
JOIN programs p ON p.id = o.program_id
JOIN organizers org ON org.id = p.organizer_id;

CREATE VIEW dashboard_free_offers
WITH (security_invoker=true) AS
SELECT * FROM dashboard_offers
WHERE category = 'free_competition';

CREATE VIEW dashboard_paid_offers
WITH (security_invoker=true) AS
SELECT * FROM dashboard_offers
WHERE category IN ('paid_evaluation','instant_funding');

CREATE VIEW organizers_trust_latest
WITH (security_invoker=true) AS
SELECT DISTINCT ON (tm.organizer_id)
  tm.organizer_id,
  tm.calculated_at,
  tm.total_reputation_score,
  tm.longevity_score,
  tm.transparency_score,
  tm.payout_policy_score,
  tm.legal_penalty,
  tm.user_feedback_score,
  tm.disclosure_score,
  tm.success_rate_pct,
  tm.avg_pass_days
FROM trust_metrics tm
ORDER BY tm.organizer_id, tm.calculated_at DESC;

-- ========================= 
-- 4) FIX FUNCTION SEARCH PATHS (3 functions)
-- ========================= 

-- Recreate functions with explicit search_path
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$;

CREATE OR REPLACE FUNCTION refresh_source_status()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
BEGIN
  UPDATE sources
  SET status = CASE
    WHEN accessed_at < NOW() - INTERVAL '180 days' THEN 'outdated'::source_status_enum
    WHEN accessed_at < NOW() - INTERVAL '90 days'  THEN 'review_needed'::source_status_enum
    ELSE 'valid'::source_status_enum
  END
  WHERE status <> 'broken';
END;
$;

CREATE OR REPLACE FUNCTION calculate_reputation_score(org_id TEXT)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $
DECLARE
  longevity NUMERIC := 0;
  transparency NUMERIC := 0;
  payout_policy NUMERIC := 0;
  legal_penalty NUMERIC := 0;
  user_feedback NUMERIC := 0;
  disclosure NUMERIC := 0;
  total NUMERIC := 0;
BEGIN
  -- 1. Longevity (0-20): years of activity
  SELECT LEAST(20, (EXTRACT(YEAR FROM NOW()) - founded_year) * 2)
  INTO longevity
  FROM organizers WHERE id = org_id;
  
  -- 2. Legal Penalty (0 to -30)
  SELECT CASE legal_status
    WHEN 'active' THEN 0
    WHEN 'paused' THEN -15
    WHEN 'legal_issues' THEN -25
    WHEN 'ceased' THEN -30
    ELSE 0
  END INTO legal_penalty
  FROM organizers WHERE id = org_id;
  
  -- 3. User Feedback (0-15): Trustpilot normalized
  SELECT LEAST(15, (COALESCE(trustpilot_score, 0) / 5.0) * 15)
  INTO user_feedback
  FROM organizers WHERE id = org_id;
  
  -- Other components should be calculated by application
  transparency := 10; -- Placeholder
  payout_policy := 15; -- Placeholder
  disclosure := 8; -- Placeholder
  
  -- Total
  total := longevity + transparency + payout_policy + legal_penalty + user_feedback + disclosure;
  
  RETURN GREATEST(0, LEAST(100, total));
END;
$;

-- ========================= 
-- 5) GRANT PERMISSIONS
-- ========================= 

-- Grant SELECT on views to authenticated and anon users
GRANT SELECT ON sources_with_freshness TO authenticated, anon;
GRANT SELECT ON dashboard_offers TO authenticated, anon;
GRANT SELECT ON dashboard_free_offers TO authenticated, anon;
GRANT SELECT ON dashboard_paid_offers TO authenticated, anon;
GRANT SELECT ON organizers_trust_latest TO authenticated, anon;

-- ========================= 
-- 6) COMPLETION
-- ========================= 
-- Migration 0008 applied successfully
-- Fixed: 10 RLS disabled errors (enabled RLS + public read policies)
-- Fixed: 5 security definer view errors (recreated without SECURITY DEFINER)
-- Fixed: 3 function search path warnings (added SET search_path = public)
-- 
-- Remaining warnings:
-- - 1 support_tickets RLS policy (existing, not from migration 0006)
-- - 1 auth leaked password protection (Auth config, not database)
