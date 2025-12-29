import { NextRequest, NextResponse } from 'next/server'
import { getFearGreedClassItalian } from '@/lib/indicators/fear-greed'
import { callTradeliaAI } from '@/lib/ai/tradelia-ai'
import { FearGreedRequestSchema } from '@/lib/validation/schemas'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = FearGreedRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { value, classification, context } = validationResult.data
    const classificationItalian = getFearGreedClassItalian(classification)

    // Hardcoded explanation of what the indicator is
    const indicatorExplanation = `**📊 Cos'è il Fear & Greed Index**

L'indice misura il **sentiment del mercato crypto** su una scala 0-100, analizzando volatilità, volume, social media, dominance e trends. Non è un segnale di trading, ma uno strumento per comprendere la **psicologia collettiva** degli investitori.`

    // Call AI for practical interpretation of the specific value
    const aiResponse = await callTradeliaAI({
      task: 'explain_indicator',
      context: {
        indicator: 'Fear & Greed Index',
        value: value,
        classification: classificationItalian
      }
    })

    // Combine hardcoded + AI interpretation
    const fullExplanation = `${indicatorExplanation}\n\n${aiResponse.explanation}`

    return NextResponse.json({
      success: aiResponse.success,
      explanation: fullExplanation,
      confidence: aiResponse.confidence,
      model: aiResponse.model,
      fallback: aiResponse.fallback,
      provider: 'tradelia-ai',
      signature: '🎓 Analisi educativa Tradelia AI',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Tradelia AI explanation error:', error)
    
    // Educational fallback
    const fallbackExplanation = `**📊 Cos'è il Fear & Greed Index**

L'indice misura il sentiment del mercato crypto su una scala 0-100. Non è un segnale di trading, ma uno strumento educativo per comprendere la psicologia di mercato.

**⚠️ Valore attuale: ${body.value}/100**

Questo valore riflette il sentiment collettivo. Ricorda: gli indicatori non predicono il futuro e possono rimanere in zone estreme per periodi prolungati. Usa questo dato per riflettere sui tuoi bias emotivi, non per decisioni operative.`
    
    return NextResponse.json({
      success: true,
      explanation: fallbackExplanation,
      confidence: 0.5,
      model: 'tradelia-fallback',
      fallback: true,
      provider: 'tradelia-ai',
      signature: '🎓 Analisi educativa Tradelia AI',
      timestamp: new Date().toISOString()
    })
  }
}