/* Migration: Fix security warnings from migration 0011
   Addresses Supabase security linter warnings */

/* ============================================
   1. FIX FUNCTION SEARCH PATH
   ============================================ */

/* Fix update_competition_rules_updated_at function
   Adds explicit search_path to prevent search_path mutable warning */
DROP TRIGGER IF EXISTS update_competition_rules_updated_at ON competition_rules;

CREATE OR REPLACE FUNCTION update_competition_rules_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_competition_rules_updated_at
    BEFORE UPDATE ON competition_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_competition_rules_updated_at();

/* ============================================
   2. ADD INDEXES FOR PERFORMANCE
   ============================================ */

/* Index on registration dates for filtering active competitions */
CREATE INDEX IF NOT EXISTS idx_competition_rules_registration 
    ON competition_rules(registration_start, registration_end);

/* Index on trading dates for filtering live competitions */
CREATE INDEX IF NOT EXISTS idx_competition_rules_trading 
    ON competition_rules(trading_start, trading_end);

/* Index on prize pool for sorting */
CREATE INDEX IF NOT EXISTS idx_competition_rules_prize_pool 
    ON competition_rules(prize_pool_total DESC);

/* ============================================
   3. ADD COMMENTS FOR DOCUMENTATION
   ============================================ */

COMMENT ON FUNCTION update_competition_rules_updated_at() IS 
'Trigger function to automatically update updated_at timestamp.
Security: Runs with DEFINER privileges and explicit search_path.';

/* ============================================
   4. VERIFY SETUP
   ============================================ */

/* Check table structure */
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'competition_rules') THEN
        RAISE NOTICE 'competition_rules table exists';
    ELSE
        RAISE EXCEPTION 'competition_rules table does not exist';
    END IF;
END $$;

/* Check indexes */
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes 
               WHERE indexname = 'idx_competition_rules_program') THEN
        RAISE NOTICE 'Index idx_competition_rules_program exists';
    ELSE
        RAISE WARNING 'Index idx_competition_rules_program missing';
    END IF;
END $$;
