'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, AlertCircle, ExternalLink } from 'lucide-react'

interface FearGreedData {
  value: string
  value_classification: string
  timestamp: string
  time_until_update: string
}

export function FearGreedSimpleTest() {
  const [data, setData] = useState<FearGreedData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDirectAPI = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    
    try {
      const response = await fetch('https://api.alternative.me/fng/')
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data && result.data[0]) {
        setData(result.data[0])
      } else {
        throw new Error('Invalid API response format')
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Fear & Greed API Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const testOurAPI = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    
    try {
      const response = await fetch('/api/test/fear-greed-simple')
      
      if (!response.ok) {
        throw new Error(`Our API Error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        setData({
          value: result.data.value.toString(),
          value_classification: result.data.value_classification,
          timestamp: result.data.timestamp,
          time_until_update: result.data.time_until_update
        })
      } else {
        throw new Error(result.error || 'Invalid API response')
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Our API Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const getValueColor = (value: number) => {
    if (value <= 25) return 'text-red-600'
    if (value <= 45) return 'text-orange-600'
    if (value <= 55) return 'text-yellow-600'
    if (value <= 75) return 'text-green-600'
    return 'text-blue-600'
  }

  const getClassBadgeVariant = (classification: string) => {
    const lower = classification.toLowerCase()
    if (lower.includes('extreme fear')) return 'destructive'
    if (lower.includes('fear')) return 'secondary'
    if (lower.includes('neutral')) return 'outline'
    if (lower.includes('greed')) return 'default'
    return 'outline'
  }

  const getItalianClassification = (classification: string) => {
    const lower = classification.toLowerCase()
    if (lower.includes('extreme fear')) return 'Paura Estrema'
    if (lower.includes('fear')) return 'Paura'
    if (lower.includes('neutral')) return 'Neutrale'
    if (lower.includes('greed') && lower.includes('extreme')) return 'Avidità Estrema'
    if (lower.includes('greed')) return 'Avidità'
    return classification
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Fear & Greed Index - Test Database
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Test API Alternative.me + Database Supabase
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={testDirectAPI} 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              API Diretta
            </Button>
            
            <Button 
              onClick={testOurAPI} 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="mr-2 h-4 w-4" />
              )}
              Nostra API + DB
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Errore</span>
              </div>
              <p className="text-red-700 mt-1 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risultato Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Valore</p>
                <p className={`text-3xl font-bold ${getValueColor(parseInt(data.value))}`}>
                  {data.value}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Classificazione</p>
                <div className="space-y-1">
                  <Badge variant={getClassBadgeVariant(data.value_classification)} className="mt-1">
                    {data.value_classification}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    ({getItalianClassification(data.value_classification)})
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Timestamp: {new Date(parseInt(data.timestamp) * 1000).toLocaleString('it-IT')}</p>
              <p>Prossimo aggiornamento: {data.time_until_update}</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-sm">
                ✅ <strong>Test Completato!</strong> API funzionante.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}