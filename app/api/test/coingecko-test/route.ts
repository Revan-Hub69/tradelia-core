import { NextResponse } from 'next/server'

// CoinGecko API test - Global market data
export async function GET() {
  try {
    console.log('Testing CoinGecko API...')
    
    // CoinGecko Global API (free, no auth required)
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: {
        'User-Agent': 'Tradelia/1.0',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.data) {
      throw new Error('Invalid CoinGecko response format')
    }
    
    const globalData = data.data
    
    // Calculate our own Fear & Greed based on multiple factors
    const calculateFearGreed = (marketData: any) => {
      // Factors for Fear & Greed calculation:
      // 1. Market Cap Change (24h)
      // 2. Bitcoin Dominance
      // 3. Volume Change
      // 4. Active Cryptocurrencies growth
      
      const btcDominance = marketData.market_cap_percentage?.btc || 50
      const marketCapChange = marketData.market_cap_change_percentage_24h_usd || 0
      
      // Simple algorithm (we can improve this)
      let score = 50 // Start neutral
      
      // Bitcoin dominance factor (higher dominance = more fear)
      if (btcDominance > 60) score -= 10
      else if (btcDominance < 40) score += 10
      
      // Market cap change factor
      if (marketCapChange > 5) score += 15
      else if (marketCapChange > 2) score += 10
      else if (marketCapChange < -5) score -= 15
      else if (marketCapChange < -2) score -= 10
      
      // Clamp between 0-100
      score = Math.max(0, Math.min(100, score))
      
      return Math.round(score)
    }
    
    const fearGreedValue = calculateFearGreed(globalData)
    
    // Classify the value
    const getClassification = (value: number) => {
      if (value <= 20) return { en: 'Extreme Fear', it: 'Paura Estrema' }
      if (value <= 40) return { en: 'Fear', it: 'Paura' }
      if (value <= 60) return { en: 'Neutral', it: 'Neutrale' }
      if (value <= 80) return { en: 'Greed', it: 'Avidità' }
      return { en: 'Extreme Greed', it: 'Avidità Estrema' }
    }
    
    const classification = getClassification(fearGreedValue)
    
    return NextResponse.json({
      success: true,
      data: {
        // Our calculated Fear & Greed
        fear_greed_value: fearGreedValue,
        fear_greed_classification: classification.en,
        fear_greed_classification_italian: classification.it,
        
        // Raw CoinGecko data
        market_cap_usd: globalData.total_market_cap?.usd,
        market_cap_change_24h: globalData.market_cap_change_percentage_24h_usd,
        volume_24h_usd: globalData.total_volume?.usd,
        btc_dominance: globalData.market_cap_percentage?.btc,
        eth_dominance: globalData.market_cap_percentage?.eth,
        active_cryptocurrencies: globalData.active_cryptocurrencies,
        
        // Metadata
        updated_at: new Date().toISOString(),
        source: 'coingecko',
        algorithm: 'tradelia-v1'
      },
      test: true,
      message: 'CoinGecko API funziona! Dati aggiornati ogni 10 minuti.'
    })
    
  } catch (error) {
    console.error('CoinGecko test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      test: true
    }, { status: 500 })
  }
}