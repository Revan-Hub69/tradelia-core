import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'

// GET - Fetch current Fear & Greed data
export async function GET() {
  try {
    const supabase = createServerClient()

    // Get latest data from database
    const { data, error } = await supabase
      .from('indicators')
      .select('*')
      .eq('indicator_type', 'fear_greed')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No Fear & Greed data available' },
        { status: 404 }
      )
    }

    // Format response for frontend
    const getItalianClassification = (valueClass: string) => {
      switch (valueClass) {
        case 'extreme_fear': return 'Paura Estrema'
        case 'fear': return 'Paura'
        case 'neutral': return 'Neutrale'
        case 'greed': return 'Avidità'
        case 'extreme_greed': return 'Avidità Estrema'
        default: return 'Sconosciuto'
      }
    }

    // Type assertion for the data
    const indicatorData = data as any

    const response = {
      success: true,
      data: {
        value: Number(indicatorData.value),
        value_class: indicatorData.value_class,
        value_classification: getItalianClassification(indicatorData.value_class || ''),
        timestamp: indicatorData.metadata?.timestamp || indicatorData.updated_at,
        time_until_update: indicatorData.metadata?.time_until_update,
        source: indicatorData.source,
        last_updated: indicatorData.updated_at,
        database_id: indicatorData.id
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Unexpected error in fear-greed API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update Fear & Greed data (for cron job)
export async function POST() {
  try {
    console.log('Updating Fear & Greed data from Alternative.me...')
    
    const supabase = createServerClient()
    
    // Fetch from Alternative.me API
    const response = await fetch('https://api.alternative.me/fng/', {
      headers: {
        'User-Agent': 'Tradelia/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Alternative.me API error: ${response.status}`)
    }
    
    const apiData = await response.json()
    
    if (!apiData.data || !apiData.data[0]) {
      throw new Error('Invalid API response format')
    }
    
    const fearGreedData = apiData.data[0]

    const getItalianClass = (classification: string) => {
      const lower = classification.toLowerCase()
      if (lower.includes('extreme fear')) return 'extreme_fear'
      if (lower.includes('fear')) return 'fear'
      if (lower.includes('neutral')) return 'neutral'
      if (lower.includes('greed') && lower.includes('extreme')) return 'extreme_greed'
      if (lower.includes('greed')) return 'greed'
      return 'neutral'
    }

    // Check for existing record
    const { data: existingData, error: selectError } = await supabase
      .from('indicators')
      .select('id')
      .eq('indicator_type', 'fear_greed')
      .single()

    let savedData
    if (existingData && !selectError) {
      // Update existing record
      const updatePayload = {
        value: parseInt(fearGreedData.value),
        value_class: getItalianClass(fearGreedData.value_classification),
        metadata: {
          timestamp: fearGreedData.timestamp,
          time_until_update: fearGreedData.time_until_update,
          classification_original: fearGreedData.value_classification
        },
        source: 'alternative.me',
        updated_at: new Date().toISOString()
      }
      
      const { data: updatedData, error: updateError } = await supabase
        .from('indicators')
        .update(updatePayload)
        .eq('id', existingData.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Database update error: ${updateError.message}`)
      }
      savedData = updatedData
    } else {
      // Insert new record
      const insertPayload = {
        indicator_type: 'fear_greed',
        value: parseInt(fearGreedData.value),
        value_class: getItalianClass(fearGreedData.value_classification),
        metadata: {
          timestamp: fearGreedData.timestamp,
          time_until_update: fearGreedData.time_until_update,
          classification_original: fearGreedData.value_classification
        },
        source: 'alternative.me'
      }
      
      const { data: insertedData, error: insertError } = await supabase
        .from('indicators')
        .insert(insertPayload)
        .select()
        .single()

      if (insertError) {
        throw new Error(`Database insert error: ${insertError.message}`)
      }
      savedData = insertedData
    }

    console.log('✅ Fear & Greed data updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Fear & Greed data updated successfully',
      data: {
        value: parseInt(fearGreedData.value),
        value_class: getItalianClass(fearGreedData.value_classification),
        timestamp: fearGreedData.timestamp,
        database_id: savedData.id
      }
    })

  } catch (error) {
    console.error('Fear & Greed update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}