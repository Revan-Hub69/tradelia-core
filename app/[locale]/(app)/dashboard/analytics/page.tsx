/**
 * Analytics Dashboard Page - Tradelia 2026
 * 
 * Dashboard per monitorare il comportamento degli utenti
 * - Metriche in tempo reale
 * - Analisi del comportamento
 * - Insights automatici
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { 
  AnalyticsIcon,
  TrendingUpIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckIcon,
  HelpIcon
} from '@/components/icons/TradeliaIcons'

interface AnalyticsData {
  overview: {
    total_sessions: number
    unique_visitors: number
    page_views: number
    avg_session_duration: number
    bounce_rate: number
    conversion_rate: number
  }
  user_behavior: {
    most_visited_sections: Array<{
      section: string
      visits: number
      percentage: number
    }>
    navigation_patterns: Array<{
      from: string
      to: string
      count: number
    }>
    tool_usage: Array<{
      tool_id: string
      usage_count: number
      avg_duration: number
    }>
    education_progress: Array<{
      section: string
      intro_read: number
      errors_read: number
      educational_read: number
    }>
  }
  performance_metrics: {
    avg_load_time: number
    error_rate: number
    api_response_time: number
    user_satisfaction: number
  }
  real_time: {
    active_users: number
    current_sessions: Array<{
      session_id: string
      section: string
      duration: number
    }>
  }
  insights: Array<{
    type: 'positive' | 'warning' | 'info'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
  }>
}

export default function AnalyticsPage() {
  const t = useTranslations('dashboard')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState('24h')

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics/dashboard?timeframe=${timeframe}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
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
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [timeframe])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckIcon className="w-5 h-5 text-success" />
      case 'warning': return <AlertTriangleIcon className="w-5 h-5 text-warning" />
      case 'info': return <HelpIcon className="w-5 h-5 text-info" />
      default: return <HelpIcon className="w-5 h-5 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <DashboardAuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AnalyticsIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading analytics data...</p>
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
              <p className="text-error mb-2">Failed to load analytics</p>
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
              <h1 className="text-3xl font-bold text-foreground">User Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Real-time insights into user behavior and engagement
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <UsersIcon className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  {data.overview.unique_visitors}
                </span>
              </div>
              <h3 className="font-medium text-foreground">Unique Visitors</h3>
              <p className="text-sm text-muted-foreground">
                {data.overview.total_sessions} total sessions
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <EyeIcon className="w-8 h-8 text-success" />
                <span className="text-2xl font-bold text-foreground">
                  {data.overview.page_views}
                </span>
              </div>
              <h3 className="font-medium text-foreground">Page Views</h3>
              <p className="text-sm text-muted-foreground">
                {(data.overview.page_views / data.overview.unique_visitors).toFixed(1)} per visitor
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <ClockIcon className="w-8 h-8 text-warning" />
                <span className="text-2xl font-bold text-foreground">
                  {formatDuration(data.overview.avg_session_duration)}
                </span>
              </div>
              <h3 className="font-medium text-foreground">Avg. Session</h3>
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
                +2.3% from last period
              </p>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Real-time Activity ({data.real_time.active_users} active users)
            </h2>
            
            <div className="space-y-3">
              {data.real_time.current_sessions.map((session, index) => (
                <div key={session.session_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="font-medium text-foreground">
                      {session.section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(session.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Behavior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Most Visited Sections */}
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Most Visited Sections</h2>
              
              <div className="space-y-4">
                {data.user_behavior.most_visited_sections.map((section, index) => (
                  <div key={section.section} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {section.section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {section.visits} visits ({section.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${section.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Usage */}
            <div className="bg-background border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Tool Usage</h2>
              
              <div className="space-y-4">
                {data.user_behavior.tool_usage.map((tool, index) => (
                  <div key={tool.tool_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="font-medium text-foreground block">
                        {tool.tool_id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Avg. {formatDuration(tool.avg_duration)}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-primary">
                      {tool.usage_count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-background border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Insights & Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.insights.map((insight, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      <span className={`
                        inline-block px-2 py-1 text-xs rounded-full mt-2
                        ${insight.impact === 'high' ? 'bg-error/10 text-error' : 
                          insight.impact === 'medium' ? 'bg-warning/10 text-warning' : 
                          'bg-info/10 text-info'}
                      `}>
                        {insight.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}