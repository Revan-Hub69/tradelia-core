import { type NextRequest, NextResponse } from 'next/server'

// Ultra-Chicche 2026: Feature Flags API
// Gestione centralizzata delle feature flags per controllo UX granulare

interface FeatureFlag {
  id: string
  enabled: boolean
  rolloutPercentage?: number
  conditions?: {
    userAgent?: string[]
    locale?: string[]
    environment?: string[]
  }
  metadata?: {
    description: string
    owner: string
    createdAt: string
    lastModified: string
  }
}

// Feature flags di default per Ultra-Chicche Tier 1
const DEFAULT_FLAGS: Record<string, FeatureFlag> = {
  // UX Enhancement Flags
  animations: {
    id: 'animations',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable smooth animations and transitions',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  complexAnimations: {
    id: 'complexAnimations',
    enabled: true,
    rolloutPercentage: 80,
    conditions: {
      userAgent: ['desktop']
    },
    metadata: {
      description: 'Enable complex animations for desktop users',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  autoplay: {
    id: 'autoplay',
    enabled: false,
    rolloutPercentage: 0,
    metadata: {
      description: 'Enable autoplay for media content',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },

  // Tool Availability Flags
  riskCalculator: {
    id: 'riskCalculator',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable risk calculation tools',
      owner: 'product-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  portfolioAnalyzer: {
    id: 'portfolioAnalyzer',
    enabled: true,
    rolloutPercentage: 90,
    metadata: {
      description: 'Enable portfolio analysis features',
      owner: 'product-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  advancedCharts: {
    id: 'advancedCharts',
    enabled: true,
    rolloutPercentage: 75,
    conditions: {
      userAgent: ['desktop']
    },
    metadata: {
      description: 'Enable advanced charting capabilities',
      owner: 'product-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },

  // AI and Smart Features
  aiFeatures: {
    id: 'aiFeatures',
    enabled: false,
    rolloutPercentage: 10,
    conditions: {
      environment: ['development', 'staging']
    },
    metadata: {
      description: 'Enable AI-powered features (beta)',
      owner: 'ai-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },

  // UX Enhancement Flags
  tooltips: {
    id: 'tooltips',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable contextual tooltips',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  notifications: {
    id: 'notifications',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable push notifications',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  soundEffects: {
    id: 'soundEffects',
    enabled: false,
    rolloutPercentage: 0,
    metadata: {
      description: 'Enable sound effects for interactions',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  hapticFeedback: {
    id: 'hapticFeedback',
    enabled: true,
    rolloutPercentage: 100,
    conditions: {
      userAgent: ['mobile']
    },
    metadata: {
      description: 'Enable haptic feedback on mobile devices',
      owner: 'ux-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },

  // Performance Flags
  lazyLoading: {
    id: 'lazyLoading',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable lazy loading for images and components',
      owner: 'performance-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  imageOptimization: {
    id: 'imageOptimization',
    enabled: true,
    rolloutPercentage: 100,
    metadata: {
      description: 'Enable advanced image optimization',
      owner: 'performance-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  prefetching: {
    id: 'prefetching',
    enabled: true,
    rolloutPercentage: 80,
    metadata: {
      description: 'Enable resource prefetching',
      owner: 'performance-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },

  // Development Flags
  betaFeatures: {
    id: 'betaFeatures',
    enabled: false,
    rolloutPercentage: 5,
    conditions: {
      environment: ['development', 'staging']
    },
    metadata: {
      description: 'Enable beta features for testing',
      owner: 'dev-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  },
  debugMode: {
    id: 'debugMode',
    enabled: false,
    rolloutPercentage: 0,
    conditions: {
      environment: ['development']
    },
    metadata: {
      description: 'Enable debug mode and logging',
      owner: 'dev-team',
      createdAt: '2026-01-10',
      lastModified: '2026-01-10'
    }
  }
}

function shouldEnableFlag(flag: FeatureFlag, request: NextRequest): boolean {
  // Check rollout percentage
  const rolloutPercentage = flag.rolloutPercentage ?? 0
  if (rolloutPercentage === 0) return false
  if (rolloutPercentage === 100) return flag.enabled

  // Simple hash-based rollout (in production, use more sophisticated logic)
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
  const userHash = Math.abs(hashCode(clientIP)) % 100
  if (userHash >= rolloutPercentage) return false

  // Check conditions
  if (flag.conditions) {
    const userAgent = request.headers.get('user-agent') || ''
    const locale = request.headers.get('accept-language') || ''
    const environment = process.env.NODE_ENV || 'development'

    if (flag.conditions.userAgent) {
      const matchesUserAgent = flag.conditions.userAgent.some(ua => 
        userAgent.toLowerCase().includes(ua.toLowerCase())
      )
      if (!matchesUserAgent) return false
    }

    if (flag.conditions.locale) {
      const matchesLocale = flag.conditions.locale.some(loc => 
        locale.toLowerCase().includes(loc.toLowerCase())
      )
      if (!matchesLocale) return false
    }

    if (flag.conditions.environment) {
      if (!flag.conditions.environment.includes(environment)) return false
    }
  }

  return flag.enabled
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const flagId = searchParams.get('flag')

    // Return specific flag
    if (flagId) {
      const flag = DEFAULT_FLAGS[flagId]
      if (!flag) {
        return NextResponse.json(
          { error: 'Flag not found', flagId },
          { status: 404 }
        )
      }

      const enabled = shouldEnableFlag(flag, request)
      return NextResponse.json({
        id: flag.id,
        enabled,
        metadata: flag.metadata
      })
    }

    // Return all flags with their current state
    const enabledFlags: Record<string, boolean> = {}
    const flagsMetadata: Record<string, FeatureFlag['metadata']> = {}

    for (const [id, flag] of Object.entries(DEFAULT_FLAGS)) {
      enabledFlags[id] = shouldEnableFlag(flag, request)
      flagsMetadata[id] = flag.metadata
    }

    return NextResponse.json({
      flags: enabledFlags,
      metadata: flagsMetadata,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Feature flags API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for updating flags (admin only - in production add auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flagId, enabled, rolloutPercentage } = body

    if (!flagId || !DEFAULT_FLAGS[flagId]) {
      return NextResponse.json(
        { error: 'Invalid flag ID' },
        { status: 400 }
      )
    }

    // In production, this would update a database
    // For now, we just return the updated state
    const updatedFlag = {
      ...DEFAULT_FLAGS[flagId],
      enabled: enabled ?? DEFAULT_FLAGS[flagId].enabled,
      rolloutPercentage: rolloutPercentage ?? DEFAULT_FLAGS[flagId].rolloutPercentage,
      metadata: {
        ...DEFAULT_FLAGS[flagId].metadata,
        lastModified: new Date().toISOString()
      }
    }

    return NextResponse.json({
      success: true,
      flag: updatedFlag
    })

  } catch (error) {
    console.error('Feature flags update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}