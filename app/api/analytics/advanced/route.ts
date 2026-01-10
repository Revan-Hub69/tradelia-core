/**
 * Advanced Analytics API - Tradelia 2026
 * 
 * Endpoint per analytics avanzate con insights actionable
 * - Behavioral analysis
 * - User segmentation
 * - Funnel analysis
 * - Predictive insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { advancedAnalytics, type DetailedEvent, type UserSession } from '@/src/shared/lib/advancedAnalytics'

export async function POST(request: NextRequest) {
  try {
    const { events, session_data } = await request.json()

    // Track session if provided
    if (session_data) {
      advancedAnalytics.trackSession(session_data)
    }

    // Track detailed events
    const trackedEvents = []
    for (const eventData of events || []) {
      const event = advancedAnalytics.trackDetailedEvent(eventData)
      trackedEvents.push(event)
    }

    return NextResponse.json({
      success: true,
      tracked_events: trackedEvents.length,
      message: 'Advanced analytics events processed'
    })

  } catch (error) {
    console.error('Advanced Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analysis_type = searchParams.get('type') || 'overview'

    switch (analysis_type) {
      case 'insights':
        const insights = advancedAnalytics.generateBehavioralInsights()
        return NextResponse.json({
          insights,
          generated_at: Date.now(),
          total_insights: insights.length
        })

      case 'segments':
        const segments = advancedAnalytics.generateUserSegments()
        return NextResponse.json({
          segments,
          generated_at: Date.now(),
          total_segments: segments.length
        })

      case 'funnel':
        const funnelName = searchParams.get('funnel') || 'main_journey'
        const steps = ['homepage', 'dashboard', 'journey_selection', 'tool_usage', 'completion']
        const funnelAnalysis = advancedAnalytics.analyzeFunnel(funnelName, steps)
        
        return NextResponse.json({
          funnel_name: funnelName,
          steps: funnelAnalysis,
          generated_at: Date.now()
        })

      case 'heatmap':
        const page = searchParams.get('page') || '/dashboard'
        const heatmapData = advancedAnalytics.generateHeatmapData(page)
        
        return NextResponse.json({
          page,
          heatmap_data: heatmapData,
          generated_at: Date.now()
        })

      case 'predictions':
        const predictions = advancedAnalytics.generatePredictions()
        
        return NextResponse.json({
          predictions,
          generated_at: Date.now()
        })

      case 'overview':
      default:
        const sessions = advancedAnalytics.getSessions()
        const events = advancedAnalytics.getEvents()
        const recentInsights = advancedAnalytics.getInsights().slice(0, 5)
        const userSegments = advancedAnalytics.getSegments()

        // Calculate advanced metrics
        const totalSessions = sessions.length
        const activeSessions = sessions.filter(s => 
          Date.now() - s.last_activity < 30 * 60 * 1000
        ).length

        const avgSessionDuration = sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + s.total_duration, 0) / sessions.length / 1000
          : 0

        const bounceRate = sessions.length > 0
          ? sessions.filter(s => s.bounce).length / sessions.length * 100
          : 0

        const conversionRate = sessions.length > 0
          ? sessions.filter(s => s.conversions.length > 0).length / sessions.length * 100
          : 0

        // User type distribution
        const userTypeDistribution = sessions.reduce((acc, s) => {
          acc[s.user_type] = (acc[s.user_type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Device type distribution
        const deviceDistribution = sessions.reduce((acc, s) => {
          acc[s.device_type] = (acc[s.device_type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // Top pages by engagement
        const pageEngagement = events
          .filter(e => e.event_type === 'page_view')
          .reduce((acc, e) => {
            if (!acc[e.page]) {
              acc[e.page] = { views: 0, total_time: 0, interactions: 0 }
            }
            acc[e.page].views++
            acc[e.page].total_time += e.time_on_element || 0
            return acc
          }, {} as Record<string, any>)

        const topPages = Object.entries(pageEngagement)
          .map(([page, data]) => ({
            page,
            views: data.views,
            avg_time: data.total_time / data.views,
            engagement_score: (data.views * 0.3) + (data.avg_time * 0.7)
          }))
          .sort((a, b) => b.engagement_score - a.engagement_score)
          .slice(0, 10)

        // Journey stage analysis
        const journeyStages = events.reduce((acc, e) => {
          if (e.journey_stage) {
            acc[e.journey_stage] = (acc[e.journey_stage] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)

        // User intent analysis
        const userIntents = events.reduce((acc, e) => {
          if (e.user_intent) {
            acc[e.user_intent] = (acc[e.user_intent] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)

        return NextResponse.json({
          overview: {
            total_sessions: totalSessions,
            active_sessions: activeSessions,
            total_events: events.length,
            avg_session_duration: Math.round(avgSessionDuration),
            bounce_rate: Math.round(bounceRate * 10) / 10,
            conversion_rate: Math.round(conversionRate * 10) / 10
          },
          
          user_analysis: {
            user_type_distribution: userTypeDistribution,
            device_distribution: deviceDistribution,
            journey_stages: journeyStages,
            user_intents: userIntents
          },
          
          content_performance: {
            top_pages: topPages,
            page_engagement: pageEngagement
          },
          
          behavioral_insights: recentInsights,
          
          user_segments: userSegments.map(s => ({
            name: s.name,
            description: s.description,
            user_count: s.users.length,
            key_insights: s.insights.slice(0, 2),
            top_recommendation: s.recommendations[0]
          })),
          
          real_time: {
            active_users: activeSessions,
            current_activity: events
              .filter(e => Date.now() - e.timestamp < 5 * 60 * 1000)
              .slice(-10)
              .map(e => ({
                event_type: e.event_type,
                page: e.page,
                section: e.section,
                timestamp: e.timestamp
              }))
          },
          
          generated_at: Date.now()
        })
    }

  } catch (error) {
    console.error('Advanced Analytics GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    )
  }
}