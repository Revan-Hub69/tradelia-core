import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// Simple Fear & Greed API test WITH database save
export async function GET() {
  try {
    console.log('Testing Alternative.me API + Database save...')
    console.log('Environment check:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING')
    
    // Debug: Show first few characters of keys (for verification)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('- URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...')
    }
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('- Service key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 30) + '...')
    }
    
    // Step 1: Call Alternative.me API
    const response = await fetch('https://api.alternative.me/fng/', {
      headers: {
        'User-Agent': 'Tradelia/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Alternative.me API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.data || !data.data[0]) {
      throw new Error('Invalid API response format')
    }
    
    const fearGreedData = data.data[0]
    console.log('✅ Alternative.me API data:', fearGreedData)
    
    // Step 2: Save to Supabase database using server client
    try {
      const supabase = createServerClient()
      console.log('✅ Supabase server client created')

      const getItalianClass = (classification: string) => {
        const lower = classification.toLowerCase()
        if (lower.includes('extreme fear')) return 'extreme_fear'
        if (lower.includes('fear')) return 'fear'
        if (lower.includes('neutral')) return 'neutral'
        if (lower.includes('greed') && lower.includes('extreme')) return 'extreme_greed'
        if (lower.includes('greed')) return 'greed'
        return 'neutral'
      }

      // Test simple select first
      console.log('🔍 Testing simple select from indicators...')
      const { data: testData, error: testError } = await supabase
        .from('indicators')
        .select('*')
        .limit(1)

      if (testError) {
        console.error('Simple select error:', testError)
        throw new Error(`Database connection test failed: ${testError.message}`)
      }
      
      console.log('✅ Simple select works, found records:', testData?.length || 0)

      // Now try to find existing fear_greed record
      console.log('🔍 Checking for existing fear_greed record...')
      const { data: existingData, error: selectError } = await supabase
        .from('indicators')
        .select('id')
        .eq('indicator_type', 'fear_greed')
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Select error:', selectError)
        throw new Error(`Database select error: ${selectError.message}`)
      }

      let savedData
      if (existingData && !selectError) {
        // @ts-expect-error - Supabase type inference issue
        console.log('📝 Updating existing record:', existingData.id)
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('indicators')
          // @ts-expect-error - Supabase type inference issue with metadata field
          .update({
            value: parseInt(fearGreedData.value),
            value_class: getItalianClass(fearGreedData.value_classification),
            metadata: {
              timestamp: fearGreedData.timestamp,
              time_until_update: fearGreedData.time_until_update,
              classification_original: fearGreedData.value_classification
            },
            source: 'alternative.me',
            updated_at: new Date().toISOString()
          })
          // @ts-expect-error - Supabase type inference issue
          .eq('id', existingData.id)
          .select()
          .single()

        if (updateError) {
          console.error('Update error:', updateError)
          throw new Error(`Database update error: ${updateError.message}`)
        }
        savedData = updatedData
        console.log('✅ Record updated successfully')
      } else {
        console.log('➕ Inserting new record...')
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('indicators')
          // @ts-expect-error - Supabase type inference issue with metadata field
          .insert({
            indicator_type: 'fear_greed',
            value: parseInt(fearGreedData.value),
            value_class: getItalianClass(fearGreedData.value_classification),
            metadata: {
              timestamp: fearGreedData.timestamp,
              time_until_update: fearGreedData.time_until_update,
              classification_original: fearGreedData.value_classification
            },
            source: 'alternative.me'
          })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          console.error('Insert error details:', JSON.stringify(insertError, null, 2))
          throw new Error(`Database insert error: ${insertError.message}`)
        }
        savedData = insertedData
        console.log('✅ Record inserted successfully')
      }

      console.log('✅ Data saved to database:', savedData)
      
      return NextResponse.json({
        success: true,
        data: {
          value: parseInt(fearGreedData.value),
          value_classification: fearGreedData.value_classification,
          value_classification_italian: getItalianClass(fearGreedData.value_classification),
          timestamp: fearGreedData.timestamp,
          time_until_update: fearGreedData.time_until_update,
          source: 'alternative.me',
          database_saved: true,
          // @ts-expect-error - Supabase type inference issue
          database_id: savedData.id
        },
        test: true,
        message: '✅ API Alternative.me + Database save funziona!'
      })
      
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      // Return API data even if database fails
      return NextResponse.json({
        success: true,
        data: {
          value: parseInt(fearGreedData.value),
          value_classification: fearGreedData.value_classification,
          value_classification_italian: 'N/A',
          timestamp: fearGreedData.timestamp,
          time_until_update: fearGreedData.time_until_update,
          source: 'alternative.me',
          database_saved: false,
          database_error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        test: true,
        message: '⚠️ API funziona, ma database ha problemi'
      })
    }
    
  } catch (error) {
    console.error('Fear & Greed test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      test: true
    }, { status: 500 })
  }
}