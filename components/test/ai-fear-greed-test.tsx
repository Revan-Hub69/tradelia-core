'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Brain, TrendingUp, AlertCircle } from 'lucide-react'

interface FearGreedData {
  indicator_type: string
  value: number
  value_class: string
  metadata: {
    timestamp: string
    time_until_update: string
    classification_original: string
  }
  source: string
  updated_at: string
}

interface AIExplanation {
  success: boolean
  explanation: string
  confidence: number
  model: string
  fallback: boolean
  provider: string
  signature: string
}

export function AIFearGreedTest() {
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null)
  const [aiExplanation, setAIExplanation] = useState<AIExplanation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testFearGreedAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/indicators/fear-greed')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch Fear & Greed data')
      }
      
      setFearGreedData(result.data)
      return result.data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Fear & Greed API Error: ${errorMsg}`)
      return null
    }
  }

  const testAIExplanation = async (data: FearGreedData) => {
    try {
      const response = await fetch('/api/ai/explain-fear-greed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: data.value,
          classification: data.value_class,
          context: 'test'
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to get AI explanation')
      }
      
      setAIExplanation(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(prev => prev ? `${prev} | AI Error: ${errorMsg}` : `AI Error: ${errorMsg}`)
    }
  }

  const runFullTest = async () => {
    setLoading(true)
    setError(null)
    setFearGreedData(null)
    setAIExplanation(null)
    
    // Test Fear & Greed API
    const data = await testFearGreedAPI()
    
    if (data) {
      // Test AI Explanation
      await testAIExplanation(data)
    }
    
    setLoading(false)
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
    if (lower.includes('extreme fear') || lower.includes('paura estrema')) return 'destructive'
    if (lower.includes('fear') || lower.includes('paura')) return 'secondary'
    if (lower.includes('neutral') || lower.includes('neutrale')) return 'outline'
    if (lower.includes('greed') || lower.includes('avidità')) return 'default'
    return 'outline'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Test AI + Fear & Greed Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runFullTest} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing APIs...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Test Fear & Greed + AI Explanation
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {fearGreedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Fear & Greed Index Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className={`text-3xl font-bold ${getValueColor(fearGreedData.value)}`}>
                  {fearGreedData.value}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Classification</p>
                <Badge variant={getClassBadgeVariant(fearGreedData.value_class)} className="mt-1">
                  {fearGreedData.value_class}
                </Badge>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Source: {fearGreedData.source}</p>
              <p>Updated: {new Date(fearGreedData.updated_at).toLocaleString('it-IT')}</p>
              <p>Next Update: {fearGreedData.metadata.time_until_update}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {aiExplanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Tradelia AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">
                {aiExplanation.explanation}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Model: {aiExplanation.model}</span>
                <span>Confidence: {Math.round(aiExplanation.confidence * 100)}%</span>
                {aiExplanation.fallback && (
                  <Badge variant="outline" className="text-xs">Fallback</Badge>
                )}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground italic">
              {aiExplanation.signature}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}