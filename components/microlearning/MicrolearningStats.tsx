'use client'

import { useState, useEffect } from 'react'
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, TrendingUp, Award } from "lucide-react"
import { microlearningService } from '@/lib/services/microlearning'
import type { MicrolearningData } from '@/lib/types/microlearning'

interface MicrolearningStatsProps {
  data: MicrolearningData
  userId?: string
}

interface UserStats {
  total_lessons: number
  completed_lessons: number
  in_progress_lessons: number
  total_time_spent: number
  average_quiz_score: number
  streak_days: number
}

export function MicrolearningStats({ data, userId }: MicrolearningStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [userId])

  const loadStats = async () => {
    try {
      const userStats = await microlearningService.getUserStats(userId)
      setStats(userStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const statCards = [
    {
      icon: Target,
      label: 'Completate',
      value: `${data.completed_lessons}/${data.total_lessons}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
      icon: Clock,
      label: 'Tempo Totale',
      value: stats ? formatTime(stats.total_time_spent) : '0 min',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      icon: TrendingUp,
      label: 'In Corso',
      value: stats?.in_progress_lessons.toString() || '0',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      icon: Award,
      label: 'Media Quiz',
      value: stats?.average_quiz_score ? `${stats.average_quiz_score}%` : 'N/A',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <UnifiedCard key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        ))}
      </div>

      {/* Achievement Badges */}
      {data.completed_lessons > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {data.completed_lessons >= 1 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              🎯 Prima Lezione
            </Badge>
          )}
          {data.completed_lessons >= 5 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🚀 5 Lezioni
            </Badge>
          )}
          {data.completed_lessons >= 10 && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🏆 10 Lezioni
            </Badge>
          )}
          {data.overall_progress_percentage === 100 && (
            <Badge variant="outline" className="bg-gold-50 text-gold-700 border-gold-200">
              👑 Completista
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}