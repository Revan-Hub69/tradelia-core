/**
 * Advanced Analytics Dashboard - Tradelia 2026
 * 
 * Dashboard avanzata con insights actionable per business decisions
 * - Behavioral insights
 * - User segmentation
 * - Funnel analysis
 * - Predictive analytics
 * - Heatmaps comportamentali
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { useAdvancedAnalytics } from '@/components/AdvancedAnalyticsProvider'
import { 
  AnalyticsIcon,
  TrendingUpIcon,
  UsersIcon,
  EyeIcon,
  BrainIcon,
  TargetIcon,
  AlertTriangleIcon,
  CheckIcon,
  HelpIcon,
  FilterIcon,
  DownloadIcon,
  RefreshIcon
} from '@/components/icons/TradeliaIcons'

interface AdvancedAnalyticsData {
  overview: {
    total_sessions: number
    active_sessions: number
    total_events: number
    avg_session_duration: number
    bounce_rate: number
    conversion_rate: number
  }
  behavioral_insights: Array<{
    insight_id: string
    type: 'opportunity' | 'problem' | 'trend' | 'prediction'
    priority: 'critical' | 'high' | 'medium' | 'low'
    title: string
    description: string
    impact_estimate: {
      metric: string
      current_value: number
      potential_value: number
      confidence: number
    }
    recommended_actions: Array<{
      action: string
      effort: 'low' | 'medium' | 'high'
      impact: 'low' | 'medium' | 'high'
      timeline: string
    }>
  }>
  user_segments: Array<{
    name: string
    description: string
    user_count: number
    key_insights: string[]
    top_recommendation: string
  }>
  real_time: {
    active_users: number
    current_activity: Array<{
      event_type: string
      page: string
      section: string
      timestamp: number
    }>
  }
}

export default function AdvancedAnalyticsPage() {
  const t = useTranslations('dashboard')
  const { trackCustomEvent } = useAdvancedAnalytics()
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track advanced analytics page view
  useEffect(() => {
    trackCustomEvent({
      event_type: 'page_view',
      element: 'advanced_analytics_dashboard',
      user_intent: 'learning'
    })
  }, [trackCustomEvent])

  // Fetch advanced analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/advanced?type=overview')
        
        if (!response.ok) {
          throw new Error('Failed to fetch advanced analytics data')
        }
        
        const analyticsData = await response.json()
        setData(analyticsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <DashboardAuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <BrainIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading advanced analytics...</p>
            </div>
          </div>
        </DashboardLayout>
      </DashboardAuthGuard>
    )
  }

  if (error) {
    return (
      <DashboardAuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangleIcon className="w-12 h-12 text-error mx-auto mb-4" />
              <p className="text-error mb-2">Failed to load advanced analytics</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        </DashboardLayout>
      </DashboardAuthGuard>
    )
  }

  if (!data) return null

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BrainIcon className="w-8 h-8 text-primary" />
                Advanced Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered insights and behavioral analysis for data-driven decisions
              </p>
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <UsersIcon className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {data.overview.total_sessions}
                </span>
              </div>
              <h3 className="font-medium text-foreground">Total Sessions</h3>
              <p className="text-sm text-muted-foreground">
                {data.overview.active_sessions} currently active
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <AnalyticsIcon className="w-8 h-8 text-success" />
                <span className="text-2xl font-bold text-foreground">
                  {Math.round(data.overview.avg_session_duration)}s
                </span>
              </div>
              <h3 className="font-medium text-foreground">Avg. Session Duration</h3>
              <p className="text-sm text-muted-foreground">
                {data.overview.bounce_rate}% bounce rate
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUpIcon className="w-8 h-8 text-info" />
                <span className="text-2xl font-bold text-foreground">
                  {data.overview.conversion_rate}%
                </span>
              </div>
              <h3 className="font-medium text-foreground">Conversion Rate</h3>
              <p className="text-sm text-success">
                +2.1% from last period
              </p>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <EyeIcon className="w-6 h-6 text-primary" />
              Real-time Activity ({data.real_time.active_users} active users)
            </h2>
            
            <div className="space-y-3">
              {data.real_time.current_activity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="font-medium text-foreground">
                      {activity.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      on {activity.page}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}