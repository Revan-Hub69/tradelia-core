#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { supabaseAdmin } from '../lib/mce/db/supabase';

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    const sb = supabaseAdmin();
    
    // Create active_setups table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS active_setups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        setup_id TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        setup_type TEXT NOT NULL,
        direction TEXT NOT NULL,
        
        -- Entry/Exit levels
        entry_price NUMERIC NOT NULL,
        stop_level NUMERIC NOT NULL,
        target_primary NUMERIC NOT NULL,
        target_secondary NUMERIC,
        
        -- Risk metrics
        confidence_score NUMERIC NOT NULL,
        risk_reward NUMERIC NOT NULL,
        max_risk NUMERIC NOT NULL,
        
        -- Timing
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        
        -- Full setup data (JSON)
        setup_data JSONB NOT NULL,
        
        -- Constraints
        CONSTRAINT valid_setup_type CHECK (
          setup_type IN ('BREAKOUT_ACCEPTANCE', 'PULLBACK_STRUCTURAL', 'LIQUIDITY_SWEEP_REVERSAL')
        ),
        CONSTRAINT valid_direction CHECK (
          direction IN ('LONG', 'SHORT')
        ),
        CONSTRAINT valid_confidence CHECK (
          confidence_score >= 0 AND confidence_score <= 1
        ),
        CONSTRAINT valid_risk_reward CHECK (
          risk_reward > 0
        ),
        CONSTRAINT valid_max_risk CHECK (
          max_risk > 0
        )
      );
    `;
    
    const { error: createError } = await sb.rpc('exec', { sql: createTableSQL });
    
    if (createError) {
      console.log('Error creating table:', createError.message);
      
      // Try alternative approach - direct table creation
      const { error: directError } = await sb
        .from('active_setups')
        .select('*')
        .limit(1);
      
      if (directError && directError.message.includes('does not exist')) {
        console.log('Table does not exist, trying to create via SQL...');
        
        // Use raw SQL execution if available
        try {
          const { data, error } = await sb.rpc('execute_sql', { 
            query: createTableSQL 
          });
          
          if (error) {
            console.log('SQL execution error:', error.message);
          } else {
            console.log('Table created successfully via SQL');
          }
        } catch (sqlError) {
          console.log('SQL execution not available, manual setup required');
          console.log('Please run the migration manually in Supabase dashboard:');
          console.log(createTableSQL);
        }
      }
    } else {
      console.log('Table created successfully');
    }
    
    // Test the table
    const { data, error } = await sb
      .from('active_setups')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Table test failed:', error.message);
    } else {
      console.log('Table test successful - active_setups is ready');
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase();