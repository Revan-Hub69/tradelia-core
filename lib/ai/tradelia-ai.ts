// Tradelia AI - Custom Educational AI for Crypto
// Using Hugging Face Serverless Inference API (FREE)

const HF_API_URL = 'https://api-inference.huggingface.co/models'
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

// Tradelia AI Models (we can create our own fine-tuned versions)
const TRADELIA_MODELS = {
  // For now, use existing educational models
  educator: 'microsoft/DialoGPT-medium', // Good for conversational education
  explainer: 'facebook/blenderbot-400M-distill', // Good for explanations
  // Future: 'tradelia/crypto-educator-v1' (our fine-tuned model)
}

interface TradeliaAIRequest {
  task: 'explain_indicator' | 'answer_question' | 'educational_content'
  context: {
    indicator?: string
    value?: number
    classification?: string
    userQuestion?: string
  }
}

interface TradeliaAIResponse {
  success: boolean
  explanation: string
  confidence: number
  model: string
  fallback?: boolean
}

// Tradelia-specific prompts and personality
const TRADELIA_PERSONALITY = `
Sei Tradelia AI, un assistente educativo specializzato in psicologia dei mercati crypto.

PERSONALITÀ TRADELIA:
- Educativo, mai commerciale
- Antifuffa: smonta le false promesse
- Trasparente sui limiti degli indicatori
- Linguaggio semplice ma preciso
- Focus su consapevolezza e riduzione bias
- ZERO consigli di trading

PRINCIPI FONDAMENTALI:
1. Educazione > Profitto
2. Trasparenza > Marketing
3. Consapevolezza > Certezze
4. Psicologia > Tecnicismi
5. Limiti > Promesse

TONO:
- Professionale ma accessibile
- Paziente e comprensivo
- Critico verso le "soluzioni magiche"
- Incoraggiante verso l'apprendimento
`

export async function callTradeliaAI(request: TradeliaAIRequest): Promise<TradeliaAIResponse> {
  try {
    if (!HF_API_KEY) {
      return getFallbackResponse(request)
    }

    const prompt = buildTradeliaPrompt(request)
    const model = TRADELIA_MODELS.explainer // Start with this, upgrade later

    const response = await fetch(`${HF_API_URL}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1
        },
        options: {
          wait_for_model: true,
          use_cache: true
        }
      })
    })

    if (!response.ok) {
      console.error('Hugging Face API error:', response.status)
      return getFallbackResponse(request)
    }

    const data = await response.json()
    
    // Handle different response formats
    let explanation = ''
    if (Array.isArray(data) && data[0]?.generated_text) {
      explanation = data[0].generated_text.replace(prompt, '').trim()
    } else if (data.generated_text) {
      explanation = data.generated_text.replace(prompt, '').trim()
    } else {
      throw new Error('Unexpected response format')
    }

    // Clean up the response
    explanation = cleanTradeliaResponse(explanation)

    return {
      success: true,
      explanation,
      confidence: 0.8, // We can implement confidence scoring later
      model: model,
      fallback: false
    }

  } catch (error) {
    console.error('Tradelia AI error:', error)
    return getFallbackResponse(request)
  }
}

function buildTradeliaPrompt(request: TradeliaAIRequest): string {
  const { task, context } = request

  let prompt = TRADELIA_PERSONALITY + '\n\n'

  switch (task) {
    case 'explain_indicator':
      prompt += `COMPITO: Spiega il ${context.indicator} attualmente a ${context.value} (${context.classification}).

FOCUS:
- Cosa significa questo valore
- Aspetti psicologici del sentiment
- Limiti dell'indicatore
- Contesto educativo

RISPOSTA (max 150 parole):`
      break

    case 'answer_question':
      prompt += `DOMANDA UTENTE: "${context.userQuestion}"

COMPITO: Rispondi in modo educativo, concentrandoti su:
- Spiegazione chiara del concetto
- Aspetti psicologici se rilevanti
- Limiti e cautele
- Zero consigli di trading

RISPOSTA (max 150 parole):`
      break

    case 'educational_content':
      prompt += `COMPITO: Crea contenuto educativo su ${context.indicator}.

FOCUS:
- Spiegazione dalle basi
- Perché è importante capirlo
- Come NON usarlo (errori comuni)
- Sviluppo consapevolezza critica

RISPOSTA (max 200 parole):`
      break

    default:
      prompt += `COMPITO: Fornisci una spiegazione educativa generale.

RISPOSTA (max 150 parole):`
  }

  return prompt
}

function cleanTradeliaResponse(response: string): string {
  // Remove common AI artifacts
  let cleaned = response
    .replace(/^(AI|Assistant|Tradelia):\s*/i, '')
    .replace(/\n\n+/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\[.*?\]/g, '') // Remove [brackets]
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .trim()

  // Ensure it doesn't contain trading advice
  const tradingWords = ['compra', 'vendi', 'investi', 'buy', 'sell', 'invest']
  const lowerCleaned = cleaned.toLowerCase()
  
  if (tradingWords.some(word => lowerCleaned.includes(word))) {
    cleaned += '\n\nNOTA: Questo è solo contenuto educativo, non un consiglio di investimento.'
  }

  return cleaned
}

function getFallbackResponse(request: TradeliaAIRequest): TradeliaAIResponse {
  const { task, context } = request

  let fallbackText = ''

  switch (task) {
    case 'explain_indicator':
      fallbackText = `Il ${context.indicator} è un indicatore di sentiment che misura le emozioni dominanti nel mercato crypto. Valori come ${context.value} indicano "${context.classification}". È importante ricordare che questo è solo uno strumento educativo per comprendere la psicologia di mercato, non un segnale di trading. Gli indicatori hanno sempre dei limiti e non predicono il futuro.`
      break
    
    case 'answer_question':
      fallbackText = `Grazie per la domanda. Gli indicatori crypto sono strumenti educativi che ci aiutano a comprendere il sentiment e la psicologia del mercato. È importante studiarli per sviluppare consapevolezza critica, ma ricorda sempre che nessun indicatore può prevedere il futuro o sostituire una strategia di investimento ben ponderata.`
      break
    
    default:
      fallbackText = `Tradelia AI è temporaneamente non disponibile. Il nostro approccio educativo si basa su trasparenza, riduzione dei bias cognitivi e comprensione dei limiti degli strumenti di analisi. Nessun indicatore è perfetto o predittivo.`
  }

  return {
    success: true,
    explanation: fallbackText,
    confidence: 0.5,
    model: 'fallback',
    fallback: true
  }
}

// Export types for use in API routes
export type { TradeliaAIRequest, TradeliaAIResponse }