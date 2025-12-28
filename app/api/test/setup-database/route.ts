import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Setup database tables - run migration manually
export async function POST() {
  try {
    console.log('Setting up database tables...')
    
    const supabase = createServerClient()
    console.log('✅ Supabase server client created')

    // Step 1: Create indicators table
    console.log('📝 Creating indicators table...')
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.indicators (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        indicator_type text NOT NULL,
        value numeric NOT NULL,
        value_class text,
        metadata jsonb DEFAULT '{}',
        source text NOT NULL DEFAULT 'unknown',
        updated_at timestamptz DEFAULT now(),
        created_at timestamptz DEFAULT now()
      )
    `

    // Use raw SQL query
    const { error: createError } = await supabase.rpc('exec', { 
      sql: createTableQuery 
    })

    if (createError) {
      console.error('Create table error:', createError)
      // Try alternative approach - direct table creation might not work
      console.log('Trying alternative approach...')
    }

    // Step 2: Disable RLS (for testing)
    console.log('🔓 Disabling RLS for testing...')
    
    // Step 3: Test if table exists by trying to select
    console.log('🔍 Testing table access...')
    const { data: testData, error: testError } = await supabase
      .from('indicators')
      .select('*')
      .limit(1)

    if (testError) {
      console.error('Table access error:', testError)
      
      // If table doesn't exist, return instructions
      if (testError.code === '42P01') {
        return NextResponse.json({
          success: false,
          error: 'Table "indicators" does not exist',
          instructions: [
            '1. Go to Supabase Dashboard > SQL Editor',
            '2. Run the migration SQL from supabase/migrations/001_initial_setup.sql',
            '3. Or create the table manually with the provided schema'
          ],
          sql_to_run: `
CREATE TABLE public.indicators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_type text NOT NULL,
  value numeric NOT NULL,
  value_class text,
  metadata jsonb DEFAULT '{}',
  source text NOT NULL DEFAULT 'unknown',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Disable RLS for testing
ALTER TABLE public.indicators DISABLE ROW LEVEL SECURITY;

-- Insert test data
INSERT INTO public.indicators (indicator_type, value, value_class, source)
VALUES ('fear_greed', 50, 'neutral', 'test');
          `
        })
      }
      
      throw new Error(`Table access failed: ${testError.message}`)
    }

    console.log('✅ Table access successful, found records:', testData?.length || 0)

    return NextResponse.json({
      success: true,
      message: '✅ Database is accessible!',
      records_found: testData?.length || 0,
      sample_data: testData
    })

  } catch (error) {
    console.error('Database setup error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}