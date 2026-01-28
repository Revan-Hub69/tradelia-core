-- Create translations table for programs
CREATE TABLE IF NOT EXISTS program_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'it')),
  name TEXT,
  description TEXT,
  pros TEXT[],
  cons TEXT[],
  best_for TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(program_id, locale)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_program_translations_program 
  ON program_translations(program_id);
CREATE INDEX IF NOT EXISTS idx_program_translations_locale 
  ON program_translations(locale);

-- Insert translations for TOP 5 competitions

-- THE5ERS - EN
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'the5ers-top100',
  'en',
  'The5ers Top 100 Competition',
  'Free trading competition where the top 100 traders win funded accounts from $5K to $100K. No entry fee required. Scale up to $4M with profit splits up to 100%.',
  ARRAY['Entry: $0', 'Funded account prizes up to $100K', 'Scaling up to $4M', 'Profit split up to 100%', 'Verified rules'],
  ARRAY['High competition (top 100 only)', 'Strict risk rules', '5 minimum trading days required'],
  'Experienced traders seeking funded accounts'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- THE5ERS - IT
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'the5ers-top100',
  'it',
  'The5ers Top 100 Competition',
  'Competizione di trading gratuita dove i top 100 trader vincono account finanziati da $5K a $100K. Nessuna quota di iscrizione. Scaling fino a $4M con divisione profitti fino al 100%.',
  ARRAY['Iscrizione: 0€', 'Account finanziati fino a $100K', 'Scaling fino a $4M', 'Profit split fino al 100%', 'Regole verificate'],
  ARRAY['Alta competizione (solo top 100)', 'Regole di rischio rigide', '5 giorni di trading minimi richiesti'],
  'Trader esperti che cercano account finanziati'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- NINJATRADER - EN
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'ninjatrader-arena',
  'en',
  'NinjaTrader Arena',
  'Monthly futures trading competition with real cash prizes. Trade on professional simulation platform. $50K prize pool with $10K first prize.',
  ARRAY['Entry: $0', '$10,000 first prize', 'Monthly recurring', 'Professional platform', 'Real cash prizes'],
  ARRAY['Futures complexity', 'High skill required', 'Rules partially verified'],
  'Futures traders with experience'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- NINJATRADER - IT
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'ninjatrader-arena',
  'it',
  'NinjaTrader Arena',
  'Competizione mensile di trading futures con premi in cash reali. Piattaforma professionale di simulazione. Prize pool $50K con $10K primo premio.',
  ARRAY['Iscrizione: 0€', '$10.000 primo premio', 'Mensile ricorrente', 'Piattaforma professionale', 'Premi in cash reali'],
  ARRAY['Complessità futures', 'Skill elevata richiesta', 'Regole parzialmente verificate'],
  'Trader futures con esperienza'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- TRADINGVIEW - EN
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'tradingview-leap',
  'en',
  'TradingView The Leap',
  '⭐ OPEN NOW! Paper trading competition with cash prizes up to $10,000. Register by March 9, 2026. Trade with $100K virtual capital. Top 500 win prizes. ZERO catch - no deposit required.',
  ARRAY['Entry: $0', '$10,000 first prize', 'Top 500 win prizes', 'OPEN NOW - Register by Mar 9', 'No deposit required', 'All verified rules'],
  ARRAY['High competition (10K+ participants)', 'Must trade minimum 3 days'],
  'All levels - perfect for beginners'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- TRADINGVIEW - IT
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'tradingview-leap',
  'it',
  'TradingView The Leap',
  '⭐ APERTO ADESSO! Competizione paper trading con premi in cash fino a $10.000. Registrazione entro 9 Marzo 2026. Tradare con $100K virtuali. Top 500 vincono. ZERO catch - nessun deposito richiesto.',
  ARRAY['Iscrizione: 0€', '$10.000 primo premio', 'Top 500 vincono', 'APERTO ADESSO - Reg entro 9 Marzo', 'Nessun deposito richiesto', 'Tutte le regole verificate'],
  ARRAY['Alta competizione (10K+ partecipanti)', 'Minimo 3 giorni di trading richiesti'],
  'Tutti i livelli - perfetto per principianti'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- FUNDEDNEXT - EN
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'fundednext-contest',
  'en',
  'FundedNext Cash Contest',
  'Demo trading contests with real cash prizes (not just funded accounts). From the #4 prop firm globally. Reliable payouts and transparent rules.',
  ARRAY['Entry: $0', 'Real cash prizes', 'Not just funded accounts', 'Top 4 prop firm', 'Reliable payouts'],
  ARRAY['Periodic only', 'Limited spots', 'Rules need verification'],
  'Serious traders wanting cash prizes'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- FUNDEDNEXT - IT
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'fundednext-contest',
  'it',
  'FundedNext Cash Contest',
  'Contest di trading demo con premi in cash reali (non solo account finanziati). Dalla #4 prop firm globale. Pagamenti affidabili e regole trasparenti.',
  ARRAY['Iscrizione: 0€', 'Premi in cash reali', 'Non solo account', 'Top 4 prop firm', 'Pagamenti affidabili'],
  ARRAY['Solo periodici', 'Posti limitati', 'Regole da verificare'],
  'Trader seri che vogliono premi in cash'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- XM - EN
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'xm-competitions',
  'en',
  'XM Trading Competitions',
  'Weekly and monthly demo contests with cash prizes from $500 to $10,000. Regulated broker (Cyprus). Check T&C for withdrawal requirements.',
  ARRAY['Entry: $0', 'Regulated broker', 'Frequent contests', 'Cash prizes', 'Weekly and monthly'],
  ARRAY['Check T&C for withdrawal', 'KYC required', 'Rules need verification'],
  'Forex traders wanting frequent competitions'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- XM - IT
INSERT INTO program_translations (program_id, locale, name, description, pros, cons, best_for)
VALUES (
  'xm-competitions',
  'it',
  'XM Trading Competitions',
  'Contest demo settimanali e mensili con premi in cash da $500 a $10.000. Broker regolamentato (Cipro). Verificare T&C per i requisiti di prelievo.',
  ARRAY['Iscrizione: 0€', 'Broker regolamentato', 'Contest frequenti', 'Premi in cash', 'Settimanali e mensili'],
  ARRAY['Verificare T&C per prelievo', 'KYC richiesto', 'Regole da verificare'],
  'Trader forex che vogliono contest frequenti'
)
ON CONFLICT (program_id, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  best_for = EXCLUDED.best_for,
  updated_at = CURRENT_TIMESTAMP;

-- Create helper view
CREATE OR REPLACE VIEW programs_with_translations AS
SELECT 
  p.*,
  pt_en.name as name_en,
  pt_en.description as description_en,
  pt_en.pros as pros_en,
  pt_en.cons as cons_en,
  pt_en.best_for as best_for_en,
  pt_it.name as name_it,
  pt_it.description as description_it,
  pt_it.pros as pros_it,
  pt_it.cons as cons_it,
  pt_it.best_for as best_for_it
FROM programs p
LEFT JOIN program_translations pt_en ON p.id = pt_en.program_id AND pt_en.locale = 'en'
LEFT JOIN program_translations pt_it ON p.id = pt_it.program_id AND pt_it.locale = 'it';
