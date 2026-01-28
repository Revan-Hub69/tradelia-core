const { createClient } = require('@supabase/supabase-js');
const { config } = require('dotenv');
const { resolve } = require('node:path');

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function cleanup() {
  console.log('🧹 Cleaning up FTMO Swing data...\n');

  try {
    // Delete FTMO Swing program (cascades to related data)
    console.log('📝 Deleting FTMO Swing program...');
    const { error: progError } = await supabase
      .from('programs')
      .delete()
      .eq('id', 'ftmo-swing');

    if (progError) {
      console.error('❌ Error deleting program:', progError);
      throw progError;
    }
    console.log('✅ FTMO Swing program deleted');

    console.log('\n✅ Cleanup completed successfully!');
    console.log('🎯 Only real FTMO products remain (Challenge & Trial)');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
