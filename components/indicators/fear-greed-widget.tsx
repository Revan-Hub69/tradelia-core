'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw } from 'lucide-react'

interface FearGreedData {
  value: number
  value_class: string
  value_classification: string
  timestamp: string
  time_until_update: string
  source: string
  last_updated: string
  database_id: string
}

interface FearGreedResponse {
  success: boolean
  data: FearGreedData
  error?: string
}

export function FearGreedWidget() {
  const [data, setData] = useState<FearGreedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/indicators/fear-greed')
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const result: FearGreedResponse = await response.json()
      
      if (result.success && result.data) {
        setData(result.data)
      } else {
        throw new Error(result.error || 'Invalid API response')
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Errore nel caricamento: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getValueColor = (value: number) => {
    if (value <= 25) return '#dc2626' // red-600
    if (value <= 45) return '#ea580c' // orange-600
    if (value <= 55) return '#ca8a04' // yellow-600
    if (value <= 75) return '#16a34a' // green-600
    return '#2563eb' // blue-600
  }

  const getClassBadgeVariant = (valueClass: string) => {
    switch (valueClass) {
      case 'extreme_fear': return 'destructive'
      case 'fear': return 'secondary'
      case 'neutral': return 'outline'
      case 'greed': return 'default'
      case 'extreme_greed': return 'default'
      default: return 'outline'
    }
  }

  const getIcon = (value: number) => {
    if (value <= 45) return <TrendingDown className="h-3 w-3" />
    if (value <= 55) return <Minus className="h-3 w-3" />
    return <TrendingUp className="h-3 w-3" />
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000)
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  // Gauge component
  const GaugeChart = ({ value }: { value: number }) => {
    const radius = 45
    const strokeWidth = 8
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (value / 100) * circumference
    const color = getValueColor(value)

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-sm border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Errore</p>
              <p className="text-xs text-red-600">{error}</p>
              <button 
                onClick={fetchData}
                className="mt-1 text-xs text-red-700 hover:text-red-900 underline"
              >
                Riprova
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          {/* Gauge Chart */}
          <GaugeChart value={data.value} />
          
          {/* Info Section */}
          <div className="flex-1 space-y-2">
            <div>
              <Badge 
                variant={getClassBadgeVariant(data.value_class)} 
                className="text-xs font-medium"
              >
                {data.value_classification}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Aggiornato:</span>
                <span>{formatTimestamp(data.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fonte:</span>
                <span className="capitalize">{data.source}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scale indicators */}
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="text-center">Paura ← → Avidità</span>
          <span>100</span>
        </div>
      </CardContent>
    </Card>
  )
}