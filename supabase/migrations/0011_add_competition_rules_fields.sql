/* Migration: Add competition-specific fields for detailed rules
   Based on cognitive communication best practices
   Supports TradingView The Leap and similar competitions */

/* ============================================
   1. COMPETITION RULES TABLE
   ============================================
   Stores detailed rules for competitions (one per program) */
CREATE TABLE IF NOT EXISTS competition_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    -- Tagline/Hook (Priority 1 - Emotional hook)
    tagline TEXT,
    tagline_it TEXT,
    
    -- Timeline (Priority 2)
    registration_start TIMESTAMPTZ,
    registration_end TIMESTAMPTZ,
    trading_start TIMESTAMPTZ,
    trading_end TIMESTAMPTZ,
    
    -- Prize Information
    prize_pool_total DECIMAL(12, 2),
    prize_pool_currency VARCHAR(3) DEFAULT 'USD',
    prize_winners_count INTEGER,
    
    -- Winning Criteria
    winning_method VARCHAR(50), -- 'profit_amount', 'profit_percentage', 'ranking', 'consistency'
    winning_description TEXT,
    winning_description_it TEXT,
    min_trading_days INTEGER DEFAULT 1,
    
    -- Eligibility (stored as JSON for flexibility)
    eligibility_requirements JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"type": "age", "description": "18+ years old", "met": true}, ...]
    
    restricted_countries TEXT[],
    min_age INTEGER DEFAULT 18,
    
    -- Trading Rules (categorized)
    trading_rules JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"category": "instruments", "title": "Available Instruments", "description": "Only EUREX futures", "highlight": true},
    --   {"category": "position_limits", "title": "Position Limits", "description": "Max 2 contracts FDAX", "highlight": false}
    -- ]
    
    -- Prize Tiers
    prize_tiers JSONB DEFAULT '[]'::jsonb,
    -- Example: [
    --   {"position": 1, "prize": "$3,000", "value": 3000, "currency": "USD"},
    --   {"position": 2, "prize": "$2,500", "value": 2500, "currency": "USD"}
    -- ]
    
    -- Additional Resources
    official_rules_url TEXT,
    official_rules_url_it TEXT,
    faq_url TEXT,
    support_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(program_id)
);

-- Enable RLS
ALTER TABLE competition_rules ENABLE ROW LEVEL SECURITY;

-- Everyone can read competition rules
CREATE POLICY "Competition rules are viewable by everyone"
    ON competition_rules FOR SELECT
    USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can modify competition rules"
    ON competition_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
        )
    );

-- ============================================
-- 2. UPDATE OFFERS TABLE - Add competition-specific fields
-- ============================================
-- Add fields for competition editions
ALTER TABLE offers ADD COLUMN IF NOT EXISTS 
    competition_edition_name VARCHAR(100);

ALTER TABLE offers ADD COLUMN IF NOT EXISTS 
    competition_account_label VARCHAR(50);
-- Example: 'EUREX', 'The Leap'

ALTER TABLE offers ADD COLUMN IF NOT EXISTS 
    virtual_balance DECIMAL(12, 2);
-- For paper trading competitions (e.g., 100,000 USD)

ALTER TABLE offers ADD COLUMN IF NOT EXISTS 
    leverage_competition VARCHAR(10);
-- Example: '10:1'

ALTER TABLE offers ADD COLUMN IF NOT EXISTS 
    commission_per_contract DECIMAL(8, 2);
-- Example: 1.00 (USD per contract)

-- ============================================
-- 3. UPDATE RULESETS TABLE - Add competition-specific rules
-- ============================================
-- Add fields for position limits and instrument restrictions
ALTER TABLE rulesets ADD COLUMN IF NOT EXISTS 
    allowed_instruments TEXT[];
-- Example: ['EUREX:FDAX1!', 'EUREX:FESX1!']

ALTER TABLE rulesets ADD COLUMN IF NOT EXISTS 
    position_limits JSONB DEFAULT '{}'::jsonb;
-- Example: {"EUREX:FDAX1!": 2.0, "EUREX:FESX1!": 4.0}

ALTER TABLE rulesets ADD COLUMN IF NOT EXISTS 
    max_transactions_per_minute INTEGER;
-- Example: 60 (for TradingView anti-spam)

ALTER TABLE rulesets ADD COLUMN IF NOT EXISTS 
    auto_close_positions_at_end BOOLEAN DEFAULT false;

-- ============================================
-- 4. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_competition_rules_program 
    ON competition_rules(program_id);

CREATE INDEX IF NOT EXISTS idx_offers_competition_edition 
    ON offers(competition_edition_name) 
    WHERE competition_edition_name IS NOT NULL;

-- ============================================
-- 5. CREATE TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_competition_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_competition_rules_updated_at ON competition_rules;

CREATE TRIGGER update_competition_rules_updated_at
    BEFORE UPDATE ON competition_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_competition_rules_updated_at();

-- ============================================
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE competition_rules IS 
'Detailed rules for trading competitions following cognitive communication best practices.
Supports progressive disclosure: Priority 1 (hook), Priority 2 (timeline/eligibility), 
Priority 3 (how to win/rules), Priority 4 (resources).';

COMMENT ON COLUMN competition_rules.tagline IS 
'Emotional hook explaining what the competition is about (Priority 1)';

COMMENT ON COLUMN competition_rules.eligibility_requirements IS 
'JSON array of eligibility requirements with type, description, and met status';

COMMENT ON COLUMN competition_rules.trading_rules IS 
'JSON array of trading rules categorized by: instruments, position_limits, activity, restrictions';

COMMENT ON COLUMN competition_rules.prize_tiers IS 
'JSON array of prize distribution by position';

-- ============================================
-- 7. SEED DATA FOR TRADINGVIEW THE LEAP (Example)
-- ============================================
-- Note: Run this after creating the programs and offers

-- Example insert (uncomment and modify when ready):
/*
INSERT INTO competition_rules (
    program_id,
    tagline,
    tagline_it,
    registration_start,
    registration_end,
    trading_start,
    trading_end,
    prize_pool_total,
    prize_pool_currency,
    prize_winners_count,
    winning_method,
    winning_description,
    winning_description_it,
    min_trading_days,
    eligibility_requirements,
    restricted_countries,
    min_age,
    trading_rules,
    prize_tiers,
    official_rules_url,
    official_rules_url_it,
    faq_url,
    support_url
) VALUES (
    'PROGRAM_UUID_HERE',
    'Prove your skills with EUREX futures and win up to $3,000 in real prizes',
    'Dimostra le tue skills con futures EUREX e vinci fino a $3.000 in premi reali',
    '2026-01-19 13:00:00+00',
    '2026-02-22 23:59:00+00',
    '2026-02-02 08:00:00+00',
    '2026-02-27 08:00:00+00',
    20000,
    'USD',
    250,
    'profit_amount',
    'Winners are determined by realized profit on the competition account. All open positions are automatically closed at the end.',
    'I vincitori sono determinati dal profitto realizzato sul conto competizione. Tutte le posizioni aperte vengono chiuse automaticamente alla fine.',
    5,
    '[
        {"type": "age", "description": "18+ years old", "met": true},
        {"type": "account", "description": "Active TradingView paid plan or trial", "met": false},
        {"type": "location", "description": "Resident in eligible territory", "met": true}
    ]'::jsonb,
    ARRAY['Belarus', 'Crimea', 'Donetsk', 'Luhansk', 'Cuba', 'Iran', 'North Korea', 'Russia'],
    18,
    '[
        {"category": "instruments", "title": "Available Instruments", "description": "Only EUREX futures: FDAX, FESX, FGBL, FGBM, FGBS, FBON, FVS, FXXP, FESB, FDXS, FDXM", "highlight": true},
        {"category": "position_limits", "title": "Position Limits", "description": "FDAX max 2.0 | FESX max 4.0 | FGBL max 2.0 | Others max 2.0-4.0", "highlight": true},
        {"category": "activity", "title": "Activity Requirements", "description": "Minimum 5 active trading days required", "highlight": true},
        {"category": "restrictions", "title": "Important Restrictions", "description": "Max 60 transactions per minute. Excessive activity results in 1+ hour ban.", "highlight": false}
    ]'::jsonb,
    '[
        {"position": 1, "prize": "$3,000", "value": 3000, "currency": "USD"},
        {"position": 2, "prize": "$2,500", "value": 2500, "currency": "USD"},
        {"position": 3, "prize": "$2,000", "value": 2000, "currency": "USD"},
        {"position": 4, "prize": "$1,500", "value": 1500, "currency": "USD"},
        {"position": 5, "prize": "$1,000", "value": 1000, "currency": "USD"},
        {"position": 6, "prize": "$250", "value": 250, "currency": "USD"},
        {"position": 26, "prize": "$200", "value": 200, "currency": "USD"},
        {"position": 51, "prize": "3-month TradingView subscription", "value": 45, "currency": "USD"}
    ]'::jsonb,
    'https://www.tradingview.com/the-leap/february-2026-eurex/rules',
    'https://it.tradingview.com/the-leap/february-2026-eurex/rules',
    'https://www.tradingview.com/the-leap/february-2026-eurex/faq',
    'https://www.tradingview.com/support'
);
*/

-- ============================================
-- 8. UPDATE API TO INCLUDE COMPETITION RULES
-- ============================================
-- The programs API should join with competition_rules
-- Modify src/app/api/programs/route.ts to include:
-- competition_rules (*) in the select query

COMMENT ON TABLE competition_rules IS 
'Detailed competition rules following cognitive load theory and progressive disclosure.
Created: 2026-01-28
Purpose: Support TradingView The Leap and future competitions with clear, user-friendly rules presentation.';
