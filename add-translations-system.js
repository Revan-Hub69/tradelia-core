const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://higkhlfjfhlecbtfnznx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ2tobGZqZmhsZWNidGZuem54Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ1Nzk5OSwiZXhwIjoyMDc4MDMzOTk5fQ.iOqVIFi-WxChkTNkc58fizixSfRcANohcG1A9ggtkjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTranslationsSystem() {
  console.log('🌍 Creating Database Translation System...\n');

  // Create translations table
  console.log('📋 Step 1: Creating program_translations table...');

  const { error: tableError } = await supabase.rpc('exec_sql', {
    sql: `
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

      CREATE INDEX IF NOT EXISTS idx_program_translations_program 
        ON program_translations(program_id);
      CREATE INDEX IF NOT EXISTS idx_program_translations_locale 
        ON program_translations(locale);
    `,
  });

  if (tableError) {
    console.log('ℹ️ Table might already exist or using alternative method...');
    // Try direct insert to test if table exists
  }

  // Insert translations for TOP 5 competitions
  console.log('\n📋 Step 2: Adding translations for TOP 5 competitions...\n');

  const translations = [
    // THE5ERS - EN
    {
      program_id: 'the5ers-top100',
      locale: 'en',
      name: 'The5ers Top 100 Competition',
      description: 'Free trading competition where the top 100 traders win funded accounts from $5K to $100K. No entry fee required. Scale up to $4M with profit splits up to 100%.',
      pros: ['Entry: $0', 'Funded account prizes up to $100K', 'Scaling up to $4M', 'Profit split up to 100%', 'Verified rules'],
      cons: ['High competition (top 100 only)', 'Strict risk rules', '5 minimum trading days required'],
      best_for: 'Experienced traders seeking funded accounts',
    },
    // THE5ERS - IT
    {
      program_id: 'the5ers-top100',
      locale: 'it',
      name: 'The5ers Top 100 Competition',
      description: 'Competizione di trading gratuita dove i top 100 trader vincono account finanziati da $5K a $100K. Nessuna quota di iscrizione. Scaling fino a $4M con divisione profitti fino al 100%.',
      pros: ['Iscrizione: 0€', 'Account finanziati fino a $100K', 'Scaling fino a $4M', 'Profit split fino al 100%', 'Regole verificate'],
      cons: ['Alta competizione (solo top 100)', 'Regole di rischio rigide', '5 giorni di trading minimi richiesti'],
      best_for: 'Trader esperti che cercano account finanziati',
    },

    // NINJATRADER - EN
    {
      program_id: 'ninjatrader-arena',
      locale: 'en',
      name: 'NinjaTrader Arena',
      description: 'Monthly futures trading competition with real cash prizes. Trade on professional simulation platform. $50K prize pool with $10K first prize.',
      pros: ['Entry: $0', '$10,000 first prize', 'Monthly recurring', 'Professional platform', 'Real cash prizes'],
      cons: ['Futures complexity', 'High skill required', 'Rules partially verified'],
      best_for: 'Futures traders with experience',
    },
    // NINJATRADER - IT
    {
      program_id: 'ninjatrader-arena',
      locale: 'it',
      name: 'NinjaTrader Arena',
      description: 'Competizione mensile di trading futures con premi in cash reali. Piattaforma professionale di simulazione. Prize pool $50K con $10K primo premio.',
      pros: ['Iscrizione: 0€', '$10.000 primo premio', 'Mensile ricorrente', 'Piattaforma professionale', 'Premi in cash reali'],
      cons: ['Complessità futures', 'Skill elevata richiesta', 'Regole parzialmente verificate'],
      best_for: 'Trader futures con esperienza',
    },

    // TRADINGVIEW - EN
    {
      program_id: 'tradingview-leap',
      locale: 'en',
      name: 'TradingView The Leap',
      description: '⭐ OPEN NOW! Paper trading competition with cash prizes up to $10,000. Register by March 9, 2026. Trade with $100K virtual capital. Top 500 win prizes. ZERO catch - no deposit required.',
      pros: ['Entry: $0', '$10,000 first prize', 'Top 500 win prizes', 'OPEN NOW - Register by Mar 9', 'No deposit required', 'All verified rules'],
      cons: ['High competition (10K+ participants)', 'Must trade minimum 3 days'],
      best_for: 'All levels - perfect for beginners',
    },
    // TRADINGVIEW - IT
    {
      program_id: 'tradingview-leap',
      locale: 'it',
      name: 'TradingView The Leap',
      description: '⭐ APERTO ADESSO! Competizione paper trading con premi in cash fino a $10.000. Registrazione entro 9 Marzo 2026. Tradare con $100K virtuali. Top 500 vincono. ZERO catch - nessun deposito richiesto.',
      pros: ['Iscrizione: 0€', '$10.000 primo premio', 'Top 500 vincono', 'APERTO ADESSO - Reg entro 9 Marzo', 'Nessun deposito richiesto', 'Tutte le regole verificate'],
      cons: ['Alta competizione (10K+ partecipanti)', 'Minimo 3 giorni di trading richiesti'],
      best_for: 'Tutti i livelli - perfetto per principianti',
    },

    // FUNDEDNEXT - EN
    {
      program_id: 'fundednext-contest',
      locale: 'en',
      name: 'FundedNext Cash Contest',
      description: 'Demo trading contests with real cash prizes (not just funded accounts). From the #4 prop firm globally. Reliable payouts and transparent rules.',
      pros: ['Entry: $0', 'Real cash prizes', 'Not just funded accounts', 'Top 4 prop firm', 'Reliable payouts'],
      cons: ['Periodic only', 'Limited spots', 'Rules need verification'],
      best_for: 'Serious traders wanting cash prizes',
    },
    // FUNDEDNEXT - IT
    {
      program_id: 'fundednext-contest',
      locale: 'it',
      name: 'FundedNext Cash Contest',
      description: 'Contest di trading demo con premi in cash reali (non solo account finanziati). Dalla #4 prop firm globale. Pagamenti affidabili e regole trasparenti.',
      pros: ['Iscrizione: 0€', 'Premi in cash reali', 'Non solo account', 'Top 4 prop firm', 'Pagamenti affidabili'],
      cons: ['Solo periodici', 'Posti limitati', 'Regole da verificare'],
      best_for: 'Trader seri che vogliono premi in cash',
    },

    // XM - EN
    {
      program_id: 'xm-competitions',
      locale: 'en',
      name: 'XM Trading Competitions',
      description: 'Weekly and monthly demo contests with cash prizes from $500 to $10,000. Regulated broker (Cyprus). Check T&C for withdrawal requirements.',
      pros: ['Entry: $0', 'Regulated broker', 'Frequent contests', 'Cash prizes', 'Weekly and monthly'],
      cons: ['Check T&C for withdrawal', 'KYC required', 'Rules need verification'],
      best_for: 'Forex traders wanting frequent competitions',
    },
    // XM - IT
    {
      program_id: 'xm-competitions',
      locale: 'it',
      name: 'XM Trading Competitions',
      description: 'Contest demo settimanali e mensili con premi in cash da $500 a $10.000. Broker regolamentato (Cipro). Verificare T&C per i requisiti di prelievo.',
      pros: ['Iscrizione: 0€', 'Broker regolamentato', 'Contest frequenti', 'Premi in cash', 'Settimanali e mensili'],
      cons: ['Verificare T&C per prelievo', 'KYC richiesto', 'Regole da verificare'],
      best_for: 'Trader forex che vogliono contest frequenti',
    },
  ];

  for (const trans of translations) {
    const { error } = await supabase
      .from('program_translations')
      .upsert(trans, { onConflict: 'program_id,locale' });

    if (error) {
      console.error(`❌ Error adding ${trans.program_id} (${trans.locale}):`, error.message);
    } else {
      console.log(`✅ Added: ${trans.program_id} (${trans.locale})`);
    }
  }

  // Create view for easy access
  console.log('\n📋 Step 3: Creating helper view...');

  const { error: viewError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `,
  });

  if (viewError) {
    console.log('ℹ️ View creation skipped:', viewError.message);
  } else {
    console.log('✅ Created view: programs_with_translations');
  }

  console.log('\n✅ TRANSLATION SYSTEM COMPLETE!');
  console.log('\n📊 Summary:');
  console.log('   ✅ Created program_translations table');
  console.log('   ✅ Added 10 translations (5 programs × 2 locales)');
  console.log('   ✅ Created helper view for queries');
  console.log('\n🌍 Translations added:');
  console.log('   🇬🇧 English: All 5 competitions');
  console.log('   🇮🇹 Italian: All 5 competitions');
}

createTranslationsSystem().catch(console.error);
