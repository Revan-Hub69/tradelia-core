// Fear & Greed Index Implementation
// Source: Alternative.me API (free)

export interface FearGreedData {
  value: number
  value_classification: string
  timestamp: string
  time_until_update?: string
}

export interface FearGreedResponse {
  name: string
  data: FearGreedData[]
}

// Alternative.me API (free, no auth required)
const FEAR_GREED_API = 'https://api.alternative.me/fng/'

export async function fetchFearGreedIndex(): Promise<FearGreedData | null> {
  try {
    const response = await fetch(`${FEAR_GREED_API}?limit=1&format=json`, {
      headers: {
        'User-Agent': 'Tradelia/1.0 (Educational Platform)',
      },
      // Cache for 15 minutes
      next: { revalidate: 900 }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data: FearGreedResponse = await response.json()
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No data received from API')
    }

    return data.data[0]
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error)
    return null
  }
}

// Map numeric value to classification
export function getFearGreedClass(value: number): string {
  if (value <= 24) return 'extreme_fear'
  if (value <= 49) return 'fear'
  if (value <= 74) return 'greed'
  return 'extreme_greed'
}

// Get Italian translation for classification
export function getFearGreedClassItalian(classification: string): string {
  const translations = {
    'extreme_fear': 'Paura Estrema',
    'fear': 'Paura',
    'neutral': 'Neutrale',
    'greed': 'Avidità',
    'extreme_greed': 'Avidità Estrema'
  }
  return translations[classification as keyof typeof translations] || 'Sconosciuto'
}

// Get color for UI display
export function getFearGreedColor(classification: string): string {
  const colors = {
    'extreme_fear': 'text-red-600 dark:text-red-400',
    'fear': 'text-orange-600 dark:text-orange-400',
    'neutral': 'text-gray-600 dark:text-gray-400',
    'greed': 'text-green-600 dark:text-green-400',
    'extreme_greed': 'text-emerald-600 dark:text-emerald-400'
  }
  return colors[classification as keyof typeof colors] || 'text-gray-600'
}

// Educational explanation based on current value
export function getFearGreedExplanation(value: number, classification: string): string {
  const baseExplanation = `Il Fear & Greed Index è attualmente a ${value}, indicando "${getFearGreedClassItalian(classification)}".`
  
  if (value <= 24) {
    return `${baseExplanation} Questo suggerisce che gli investitori crypto sono dominati dalla paura. Storicamente, periodi di paura estrema possono coincidere con opportunità di acquisto, ma ricorda: questo è solo un indicatore di sentiment, non un segnale di trading.`
  }
  
  if (value <= 49) {
    return `${baseExplanation} Il mercato mostra segni di cautela e preoccupazione. Gli investitori sono nervosi, ma non in panico totale. È importante mantenere la prospettiva e non farsi influenzare dalle emozioni collettive.`
  }
  
  if (value <= 74) {
    return `${baseExplanation} L'ottimismo prevale nel mercato crypto. Gli investitori mostrano fiducia, ma attenzione a non farsi trascinare dall'euforia. L'avidità può portare a decisioni irrazionali.`
  }
  
  return `${baseExplanation} Il mercato è dominato dall'avidità estrema. Storicamente, questi livelli possono precedere correzioni. Ricorda: quando tutti sono euforici, è il momento di essere più cauti.`
}