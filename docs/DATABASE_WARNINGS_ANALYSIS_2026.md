# Database Warnings Analysis & Fix Plan 2026

**Date**: 2026-01-27  
**Status**: 🔍 ANALYSIS COMPLETE  
**Migration**: 0006 applied successfully ✅  
**Database**: Tradelia Login (higkhlfjfhlecbtfnznx)

---

## 📊 EXECUTIVE SUMMARY

La migrazione 0006 è stata **applicata con successo**. Tutti i warning rilevati sono **raccomandazioni di ottimizzazione**, non errori critici. Il database funziona correttamente.

### Breakdown dei Warning

| Tipo | Count | Livello | Impatto |
|------|-------|---------|---------|
| **Auth RLS InitPlan** | 24 | WARN | Performance (scale) |
| **Multiple Permissive Policies** | 3 | WARN | Performance |
| **Unindexed Foreign Keys** | 1 | INFO | Performance |
| **Unused Indexes** | 80+ | INFO | Storage/Maintenance |

---

## 🔴 PRIORITY 1: Auth RLS InitPlan (24 warnings)

### Problema
Le RLS policies ricalcolano `auth.uid()` per ogni riga invece di valutarlo una volta sola.

### Tabelle Affette
- `todo` (1 policy)
- `user_profile` (3 policies: INSERT, SELECT, UPDATE)
- `tracked_challenges` (4 policies: SELECT, INSERT, UPDATE, DELETE)
- `trades` (4 policies: SELECT, INSERT, UPDATE, DELETE)
- `trading_signals` (4 policies: SELECT, INSERT, UPDATE, DELETE)
- `signal_settings` (4 policies: SELECT, INSERT, UPDATE, DELETE)
- `alerts` (4 policies: SELECT, INSERT, UPDATE, DELETE)

### Fix Pattern
```sql
-- ❌ BEFORE (slow)
CREATE POLICY "Users can view their own trades"
ON trades FOR SELECT
USING (user_id = auth.uid());

-- ✅ AFTER (fast)
CREATE POLICY "Users can view their own trades"
ON trades FOR SELECT
USING (user_id = (SELECT auth.uid()));
```

### Impatto
- **Performance**: Significativo su query con molte righe (>1000)
- **Urgenza**: Media (ottimizzazione, non bug)
- **Effort**: 30 minuti (script automatico)

---

## 🟡 PRIORITY 2: Multiple Permissive Policies (3 warnings)

### Problema
La tabella `user_profile` ha **policy duplicate** per INSERT, SELECT, UPDATE.

### Policies Duplicate
```sql
-- INSERT
- "Users can insert own profile"
- "Users can insert their own profile"

-- SELECT
- "Users can view own profile"
- "Users can view their own profile"

-- UPDATE
- "Users can update own profile"
- "Users can update their own profile"
```

### Fix
Rimuovere le policy duplicate (probabilmente da migrazioni precedenti).

```sql
-- Drop duplicate policies
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;

-- Keep only the newer ones (with "their")
-- Already exist, no need to recreate
```

### Impatto
- **Performance**: Minore (ogni policy viene eseguita)
- **Urgenza**: Bassa
- **Effort**: 5 minuti

---

## 🔵 PRIORITY 3: Unindexed Foreign Key (1 warning)

### Problema
La tabella `alerts` ha una foreign key `alerts_challenge_id_fkey` senza indice.

### Fix
```sql
CREATE INDEX IF NOT EXISTS idx_alerts_challenge_id 
ON alerts(challenge_id);
```

### Impatto
- **Performance**: Minore (solo se si fanno JOIN su challenge_id)
- **Urgenza**: Bassa
- **Effort**: 1 minuto

---

## ⚪ PRIORITY 4: Unused Indexes (80+ warnings)

### Problema
Molti indici non sono mai stati usati (normale per database nuovo/poco traffico).

### Strategia
**NON rimuovere subito**. Monitorare per 30-60 giorni, poi decidere.

### Indici da Monitorare (Challenge Library)
```sql
-- Nuovi indici dalla migrazione 0006
idx_organizers_type
idx_organizers_status
idx_organizers_reputation
idx_programs_organizer
idx_programs_category
idx_programs_status
idx_programs_trial
idx_offers_fee
idx_offers_size
idx_offers_featured
idx_offers_hot
idx_rulesets_offer
idx_rulesets_phase
idx_payout_offer
idx_market_offer
idx_trust_organizer
idx_trust_score
idx_trust_calculated
idx_sources_type
idx_sources_status
idx_sources_accessed
idx_field_sources_record
idx_field_sources_field
idx_field_sources_source
idx_snapshots_record
idx_snapshots_date
```

### Quando Rimuovere
- Dopo 60 giorni di produzione
- Se `idx_scan = 0` AND `idx_tup_read = 0`
- Se storage diventa un problema

### Impatto
- **Performance**: Nessuno (indici inutilizzati non rallentano query)
- **Storage**: Minore (~1-5MB per indice)
- **Urgenza**: Molto bassa
- **Effort**: 2 ore (analisi + cleanup)

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Critical Fixes (30 min)
1. ✅ Fix Auth RLS InitPlan (24 policies)
2. ✅ Remove duplicate policies (3 policies)
3. ✅ Add missing index (1 index)

### Phase 2: Monitoring (30-60 days)
1. Monitor unused indexes
2. Collect query performance metrics
3. Identify truly unused indexes

### Phase 3: Cleanup (optional, after 60 days)
1. Remove confirmed unused indexes
2. Document removed indexes
3. Update migration scripts

---

## 📝 FIX SCRIPT

### Migration 0007: Performance Optimizations

```sql
-- =========================================================================
-- MIGRATION 0007: Performance Optimizations
-- =========================================================================
-- Date: 2026-01-27
-- Description: Fix Auth RLS InitPlan, duplicate policies, missing indexes
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
-- 4) COMPLETION MESSAGE
-- ========================= 

DO $
BEGIN
  RAISE NOTICE '✅ Performance Optimizations Applied!';
  RAISE NOTICE '📊 Fixed: 24 Auth RLS InitPlan warnings';
  RAISE NOTICE '🔧 Fixed: 3 duplicate policies';
  RAISE NOTICE '📇 Added: 1 missing index';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Next Steps:';
  RAISE NOTICE '1. Monitor query performance for 30-60 days';
  RAISE NOTICE '2. Review unused indexes after production usage';
  RAISE NOTICE '3. Consider cleanup migration if needed';
END $;
```

---

## ✅ VERIFICATION QUERIES

### Check RLS Policies
```sql
-- Verify policies are using (SELECT auth.uid())
SELECT 
  schemaname,
  tablename,
  policyname,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('todo', 'user_profile', 'tracked_challenges', 'trades', 'trading_signals', 'signal_settings', 'alerts')
ORDER BY tablename, policyname;
```

### Check Duplicate Policies
```sql
-- Should return 0 rows
SELECT 
  tablename,
  cmd,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_profile'
GROUP BY tablename, cmd
HAVING COUNT(*) > 1;
```

### Check Missing Indexes
```sql
-- Verify idx_alerts_challenge_id exists
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'alerts'
  AND indexname = 'idx_alerts_challenge_id';
```

---

## 📈 EXPECTED IMPROVEMENTS

### Performance
- **RLS Queries**: 10-50% faster su tabelle con >1000 righe
- **Duplicate Policies**: 5-10% faster su user_profile operations
- **Missing Index**: 20-80% faster su JOIN alerts-challenges

### Storage
- **No impact**: Fix non aggiungono storage significativo

### Maintenance
- **Cleaner schema**: Meno policy duplicate
- **Better monitoring**: Indici più chiari

---

## 🎯 RECOMMENDATIONS

### Immediate (Today)
1. ✅ Apply migration 0007
2. ✅ Verify with queries above
3. ✅ Test RLS policies in development

### Short Term (This Week)
1. Monitor query performance
2. Set up index usage tracking
3. Document baseline metrics

### Long Term (60 days)
1. Review unused indexes
2. Create cleanup migration if needed
3. Update documentation

---

## 📚 REFERENCES

- [Supabase RLS Performance](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select)
- [Supabase Database Linter](https://supabase.com/docs/guides/database/database-linter)
- [PostgreSQL Index Usage](https://www.postgresql.org/docs/current/indexes-examine.html)

---

**Status**: ✅ Analysis Complete, Ready to Fix  
**Next**: Apply migration 0007  
**Estimated Time**: 30 minutes
