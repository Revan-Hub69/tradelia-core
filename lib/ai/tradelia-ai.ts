// Tradelia AI - Educational AI for Crypto (Hugging Face - FREE)

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
// Using Hugging Face Router with OpenAI-compatible format
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions'

// List of free models to try (in order of preference)
// Multiple providers available: sambanova, novita, hyperbolic, featherless-ai
const AVAILABLE_MODELS = [
  'meta-llama/Llama-3.2-3B-Instruct:sambanova',
  'meta-llama/Llama-3.2-3B-Instruct:novita',
  'meta-llama/Llama-3.2-3B-Instruct:hyperbolic',
  'Qwen/Qwen2.5-1.5B-Instruct:featherless-ai',
  'google/gemma-2-2b-it:featherless-ai'
]

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

// Tradelia AI System Prompt - EDUCATIONAL ONLY
const TRADELIA_SYSTEM_PROMPT = `Sei Tradelia AI, un assistente educativo specializzato in psicologia dei mercati crypto.

IDENTITÀ TRADELIA:
- Educativo, mai commerciale
- Antifuffa: smonta false promesse
- Trasparente sui limiti degli indicatori
- Linguaggio semplice ma preciso
- Focus su consapevolezza e riduzione bias
- ZERO consigli di trading

PRINCIPI:
1. Educazione > Profitto
2. Trasparenza > Marketing
3. Consapevolezza > Certezze
4. Psicologia > Tecnicismi
5. Limiti > Promesse

TONO: Professionale ma accessibile, paziente, critico verso "soluzioni magiche".
`

export async function callTradeliaAI(request: TradeliaAIRequest): Promise<TradeliaAIResponse> {
  try {
    if (!HF_API_KEY) {
      console.log('Hugging Face API key not found, using fallback')
      return getFallbackResponse(request)
    }

    // Try each model until one works
    for (const model of AVAILABLE_MODELS) {
      console.log(`Trying model: ${model}`)
      
      const result = await tryModel(model, request)
      
      if (result.success && !result.fallback) {
        console.log(`✅ Success with model: ${model}`)
        return result
      }
      
      console.log(`❌ Failed with model: ${model}, trying next...`)
    }

    // If all models fail, use fallback
    console.log('All models failed, using fallback')
    return getFallbackResponse(request)

  } catch (error) {
    console.error('Tradelia AI error:', error)
    return getFallbackResponse(request)
  }
}

async function tryModel(model: string, request: TradeliaAIRequest): Promise<TradeliaAIResponse> {
  try {
    const prompt = buildTradeliaPrompt(request)

    // OpenAI-compatible format for Hugging Face Router
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 350,  // Increased to avoid truncation with warning
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Model ${model} error:`, {
        status: response.status,
        body: errorText
      })
      return getFallbackResponse(request)
    }

    const data = await response.json()
    
    // OpenAI format: data.choices[0].message.content
    let explanation = ''
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      explanation = data.choices[0].message.content
    } else if (data.error) {
      console.error(`Model ${model} error:`, data.error)
      return getFallbackResponse(request)
    }

    if (!explanation || explanation.trim().length < 20) {
      return getFallbackResponse(request)
    }

    explanation = cleanTradeliaResponse(explanation)

    return {
      success: true,
      explanation,
      confidence: 0.8,
      model: model,
      fallback: false
    }

  } catch (error) {
    console.error(`Error with model ${model}:`, error)
    return getFallbackResponse(request)
  }
}

function buildTradeliaPrompt(request: TradeliaAIRequest): string {
  const { task, context } = request

  switch (task) {
    case 'explain_indicator':
      // Determine sentiment context
      const sentiment = context.value! <= 25 ? 'Paura Estrema' :
                       context.value! <= 45 ? 'Paura' :
                       context.value! <= 55 ? 'Neutrale' :
                       context.value! <= 75 ? 'Avidità' : 'Avidità Estrema'
      
      return `Tradelia AI - Interpretazione pratica del sentiment di mercato.

VALORE: ${context.value}/100 (${sentiment})

Fornisci SOLO l'interpretazione pratica di questo valore specifico.
NON spiegare cos'è il Fear & Greed Index (già spiegato altrove).

STRUTTURA OBBLIGATORIA (markdown con emoji):

**⚠️ Clima attuale (${context.value}/100)**
In 2 frasi: cosa indica questo valore per il sentiment ora.

**🧭 Riflessione pratica**
2 domande concrete che un investitore dovrebbe porsi:
- Domanda 1 (es: "Sto reagendo alle emozioni o seguendo il piano?")
- Domanda 2 (es: "Questo sentiment influenza le mie decisioni?")

**📌 Contesto**
1 frase: come contestualizzare questo dato (es: "Valori estremi possono durare settimane").

VINCOLI:
❌ NON spiegare cos'è l'indicatore
❌ NON dare consigli di trading
❌ NON fare previsioni
✅ Solo interpretazione del valore ${context.value}
✅ Linguaggio neutro ed educativo
✅ Massimo 120 parole
✅ Usa **grassetto** per enfasi

Scrivi SOLO l'interpretazione.`

    case 'answer_question':
      return `Tradelia AI - Sistema educativo antifuffa.

DOMANDA: "${context.userQuestion}"

Rispondi in modo educativo (max 150 parole):
- Linguaggio neutro e calmo
- Zero previsioni o consigli operativi
- Focus su comprensione e consapevolezza
- Usa **grassetto** per concetti chiave

Struttura:
**Risposta**: Spiegazione chiara
**Contesto**: Aspetti da considerare
**Cautela**: Limiti e bias da evitare

Scrivi SOLO la risposta.`

    case 'educational_content':
      return `Tradelia AI - Contenuto educativo su ${context.indicator}.

Scrivi (max 180 parole):
**Cos'è**: Spiegazione base
**Perché è utile**: Valore educativo
**Come NON usarlo**: Errori comuni
**Approccio corretto**: Uso consapevole

Stile: istituzionale, neutro, antifuffa.
Usa **grassetto** per enfasi.

Scrivi SOLO il contenuto.`

    default:
      return `Spiega indicatori crypto in modo educativo. Linguaggio neutro, zero previsioni. Max 150 parole. Usa **grassetto**.`
  }
}

function cleanTradeliaResponse(response: string): string {
  let cleaned = response
    .replace(/^(AI|Assistant|Tradelia|RISPOSTA):\s*/i, '')
    .replace(/\n\n+/g, '\n\n')
    .trim()

  // Ensure no trading advice
  const tradingWords = ['compra', 'vendi', 'investi', 'buy', 'sell', 'invest']
  const lowerCleaned = cleaned.toLowerCase()
  
  if (tradingWords.some(word => lowerCleaned.includes(word))) {
    cleaned += '\n\n⚠️ Questo è solo contenuto educativo, non un consiglio di investimento.'
  }

  return cleaned
}

function getFallbackResponse(request: TradeliaAIRequest): TradeliaAIResponse {
  const { task, context } = request

  let fallbackText = ''

  switch (task) {
    case 'explain_indicator':
      fallbackText = `Il ${context.indicator} a ${context.value} indica "${context.classification}".\n\nQuesto indicatore misura le emozioni dominanti nel mercato crypto attraverso 6 fattori: volatilità, volume, social media, dominance, trends e surveys.\n\n**Cosa significa:** Il sentiment attuale riflette ${context.classification === 'fear' ? 'paura e pessimismo' : context.classification === 'greed' ? 'avidità ed euforia' : 'equilibrio'}.\n\n**Limiti:** Non predice movimenti futuri. È solo un termometro delle emozioni collettive. Può rimanere in zone estreme per periodi prolungati.\n\n**Uso corretto:** Strumento per comprendere la psicologia di mercato, non per timing operativo.`
      break
    
    case 'answer_question':
      fallbackText = `Gli indicatori crypto sono strumenti educativi che ci aiutano a comprendere il sentiment e la psicologia del mercato. È importante studiarli per sviluppare consapevolezza critica, ma ricorda sempre che nessun indicatore può prevedere il futuro o sostituire una strategia di investimento ben ponderata.`
      break
    
    default:
      fallbackText = `Tradelia AI fornisce educazione trasparente sui mercati crypto. Il nostro approccio si basa su riduzione dei bias cognitivi e comprensione dei limiti degli strumenti di analisi. Nessun indicatore è perfetto o predittivo.`
  }

  return {
    success: true,
    explanation: fallbackText,
    confidence: 0.7,
    model: 'tradelia-fallback',
    fallback: true
  }
}

export type { TradeliaAIRequest, TradeliaAIResponse }
