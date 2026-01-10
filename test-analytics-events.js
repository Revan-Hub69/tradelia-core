/**
 * Test script to generate sample analytics events
 * Run this to populate the analytics dashboard with test data
 */

const events = [
  // Navigation events
  {
    event: 'navigation',
    properties: {
      from_section: 'homepage',
      to_section: 'dashboard_home',
      navigation_type: 'direct',
      section: 'dashboard_home',
      load_time: 1200
    },
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    session_id: 'test_session_1'
  },
  {
    event: 'navigation',
    properties: {
      from_section: 'dashboard_home',
      to_section: 'emergency_journey',
      navigation_type: 'sidebar',
      section: 'emergency_journey'
    },
    timestamp: Date.now() - 8 * 60 * 1000, // 8 minutes ago
    session_id: 'test_session_1'
  },
  {
    event: 'navigation',
    properties: {
      from_section: 'emergency_journey',
      to_section: 'analytics_dashboard',
      navigation_type: 'sidebar',
      section: 'analytics_dashboard'
    },
    timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
    session_id: 'test_session_1'
  },
  
  // Tool usage events
  {
    event: 'tool_usage',
    properties: {
      tool_id: 'risk_calculator',
      section: 'emergency_journey',
      action: 'open',
      usage_duration: 120
    },
    timestamp: Date.now() - 7 * 60 * 1000, // 7 minutes ago
    session_id: 'test_session_1'
  },
  {
    event: 'tool_usage',
    properties: {
      tool_id: 'risk_calculator',
      section: 'emergency_journey',
      action: 'complete',
      usage_duration: 180
    },
    timestamp: Date.now() - 6 * 60 * 1000, // 6 minutes ago
    session_id: 'test_session_1'
  },
  
  // Feature usage events
  {
    event: 'feature_usage',
    properties: {
      feature: 'journey_click',
      action: 'emergency',
      section: 'dashboard_home',
      journey_id: 'emergency'
    },
    timestamp: Date.now() - 8 * 60 * 1000, // 8 minutes ago
    session_id: 'test_session_1'
  },
  {
    event: 'feature_usage',
    properties: {
      feature: 'analytics_view',
      action: 'view',
      section: 'analytics_dashboard'
    },
    timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
    session_id: 'test_session_1'
  },
  
  // Second session
  {
    event: 'navigation',
    properties: {
      from_section: 'homepage',
      to_section: 'dashboard_home',
      navigation_type: 'direct',
      section: 'dashboard_home',
      load_time: 950
    },
    timestamp: Date.now() - 3 * 60 * 1000, // 3 minutes ago
    session_id: 'test_session_2'
  },
  {
    event: 'navigation',
    properties: {
      from_section: 'dashboard_home',
      to_section: 'longterm_journey',
      navigation_type: 'sidebar',
      section: 'longterm_journey'
    },
    timestamp: Date.now() - 2 * 60 * 1000, // 2 minutes ago
    session_id: 'test_session_2'
  }
]

async function sendEvents() {
  try {
    const response = await fetch('http://localhost:3000/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events,
        client_info: {
          user_agent: 'TestScript/1.0',
          screen_resolution: '1920x1080',
          timezone: 'Europe/Rome',
          language: 'it-IT'
        }
      })
    })
    
    const result = await response.json()
    console.log('✅ Events sent successfully:', result)
    
    // Wait a moment then check the dashboard
    setTimeout(async () => {
      const dashboardResponse = await fetch('http://localhost:3000/api/analytics/dashboard')
      const dashboardData = await dashboardResponse.json()
      
      console.log('\n📊 Dashboard Data:')
      console.log('- Total Sessions:', dashboardData.overview.total_sessions)
      console.log('- Page Views:', dashboardData.overview.page_views)
      console.log('- Active Users:', dashboardData.real_time.active_users)
      console.log('- Most Visited Sections:', dashboardData.user_behavior.most_visited_sections.map(s => `${s.section} (${s.percentage}%)`))
      console.log('- Tool Usage:', dashboardData.user_behavior.tool_usage.map(t => `${t.tool_id}: ${t.usage_count} uses`))
      console.log('- Insights:', dashboardData.insights.map(i => `${i.type}: ${i.title}`))
    }, 1000)
    
  } catch (error) {
    console.error('❌ Error sending events:', error)
  }
}

sendEvents()