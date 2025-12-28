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

    // Call our custom Tradelia AI
    const aiResponse = await callTradeliaAI({
      task: 'explain_indicator',
      context: {
        indicator: 'Fear & Greed Index',
        value: value,
        classification: classificationItalian
      }
    })

    return NextResponse.json({
      success: aiResponse.success,
      explanation: aiResponse.explanation,
      confidence: aiResponse.confidence,
      model: aiResponse.model,
      fallback: aiResponse.fallback,
      provider: 'tradelia-ai',
      // Add Tradelia branding
      signature: '🎓 Spiegato da Tradelia AI - Educazione antifuffa',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Tradelia AI explanation error:', error)
    
    // Always provide educational fallback
    const fallbackExplanation = `Il Fear & Greed Index misura le emozioni dominanti nel mercato crypto. È uno strumento educativo per comprendere la psicologia di mercato, non un segnale di trading. Tradelia si impegna a fornire educazione trasparente sui limiti di ogni indicatore.`
    
    return NextResponse.json({
      success: true,
      explanation: fallbackExplanation,
      confidence: 0.5,
      model: 'tradelia-fallback',
      fallback: true,
      provider: 'tradelia-ai',
      signature: '🎓 Spiegato da Tradelia AI - Educazione antifuffa',
      error: 'AI service temporarily unavailable',
      timestamp: new Date().toISOString()
    })
  }
}