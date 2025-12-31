// Setup KPIs API - Professional Trading System
// Best practice: comprehensive metrics, regime breakdown, actionable insights

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';
import { setupLogger } from '@/lib/setup/logger';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get('days') || '7'), 1), 90);
    const setupType = searchParams.get('setupType'); // Optional filter
    
    const toTimestamp = Date.now();
    const fromTimestamp = toTimestamp - (days * 24 * 60 * 60 * 1000);

    // Extract KPIs using the logger
    const kpis = await setupLogger.extractKPIs(fromTimestamp, toTimestamp);
    
    // Get additional database-level KPIs
    const sb = supabaseAdmin();
    
    const [dbKpisResult, performanceByTypeResult] = await Promise.all([
      sb.rpc('calculate_setup_kpis', {
        start_time: new Date(fromTimestamp).toISOString(),
        end_time: new Date(toTimestamp).toISOString()
      }),
      sb.rpc('get_setup_performance_by_type', {
        start_time: new Date(fromTimestamp).toISOString(),
        end_time: new Date(toTimestamp).toISOString()
      })
    ]);

    if (dbKpisResult.error) {
      console.error('Failed to get setup KPIs from DB:', dbKpisResult.error);
      return NextResponse.json(
        { ok: false, error: 'Failed to get setup KPIs' },
        { status: 500 }
      );
    }

    if (performanceByTypeResult.error) {
      console.error('Failed to get performance by type:', performanceByTypeResult.error);
      return NextResponse.json(
        { ok: false, error: 'Failed to get performance breakdown' },
        { status: 500 }
      );
    }

    const dbKpis = dbKpisResult.data;
    const performanceByType = performanceByTypeResult.data || [];

    // Assess setup system health
    const assessment = assessSetupSystemHealth(kpis, performanceByType);

    const response = {
      ok: true,
      data: {
        period: kpis.period,
        
        // Volume metrics
        volume: {
          totalSetups: kpis.totalSetups,
          setupsByType: kpis.setupsByType,
          setupsBySymbol: kpis.setupsBySymbol,
          triggered: kpis.triggered,
          triggerRate: kpis.triggerRate,
        },
        
        // Quality metrics
        quality: {
          avgConfidenceScore: kpis.avgConfidenceScore,
          avgRiskReward: kpis.avgRiskReward,
          avgSlippage: kpis.avgSlippage,
        },
        
        // Performance metrics
        performance: {
          winners: kpis.winners,
          losers: kpis.losers,
          winRate: kpis.winRate,
          avgWin: kpis.avgWin,
          avgLoss: kpis.avgLoss,
          expectancy: kpis.expectancy,
          maxDrawdown: kpis.maxDrawdown,
          avgHoldTime: kpis.avgHoldTime,
          largestLoss: kpis.largestLoss,
        },
        
        // Breakdown by setup type
        performanceByType: performanceByType.map((p: any) => ({
          setupType: p.setup_type,
          totalSetups: parseInt(p.total_setups),
          triggered: parseInt(p.triggered),
          completed: parseInt(p.completed),
          winners: parseInt(p.winners),
          totalPnl: parseFloat(p.total_pnl),
          winRate: parseFloat(p.win_rate),
          expectancy: parseFloat(p.expectancy),
        })),
        
        // Regime breakdown
        performanceByRegime: kpis.performanceByRegime,
        
        // System health assessment
        assessment,
        
        // Database-level KPIs for validation
        dbValidation: dbKpis,
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Setup KPIs API error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Assess setup system health against professional standards
function assessSetupSystemHealth(kpis: any, performanceByType: any[]): {
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'no_data';
  issues: string[];
  recommendations: string[];
  readyForDerivatives: boolean;
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (kpis.totalSetups === 0) {
    return {
      overall: 'no_data',
      issues: ['No setup data available'],
      recommendations: ['Run setup engine to generate data'],
      readyForDerivatives: false,
    };
  }

  // Check minimum sample size for validation
  if (kpis.totalSetups < 100) {
    issues.push(`Insufficient sample size: ${kpis.totalSetups} setups (need ≥100)`);
    recommendations.push('Continue collecting setup data before validation');
  }

  // Check expectancy (must be positive)
  if (kpis.expectancy <= 0) {
    issues.push(`Negative expectancy: ${(kpis.expectancy * 100).toFixed(2)}%`);
    recommendations.push('Review setup criteria and market conditions');
  }

  // Check risk-reward ratio (should be ≥1.2)
  if (kpis.avgRiskReward < 1.2) {
    issues.push(`Low risk-reward ratio: ${kpis.avgRiskReward.toFixed(2)} (need ≥1.2)`);
    recommendations.push('Improve target selection or tighten stops');
  }

  // Check drawdown control (should be <10%)
  if (Math.abs(kpis.maxDrawdown) > 0.1) {
    issues.push(`High max drawdown: ${(Math.abs(kpis.maxDrawdown) * 100).toFixed(1)}%`);
    recommendations.push('Implement stricter risk management');
  }

  // Check trigger rate (should be reasonable, not too high or low)
  if (kpis.triggerRate < 0.3) {
    issues.push(`Low trigger rate: ${(kpis.triggerRate * 100).toFixed(1)}%`);
    recommendations.push('Review entry criteria - may be too restrictive');
  } else if (kpis.triggerRate > 0.8) {
    issues.push(`High trigger rate: ${(kpis.triggerRate * 100).toFixed(1)}%`);
    recommendations.push('Review entry criteria - may be too loose');
  }

  // Check slippage (should be minimal)
  if (kpis.avgSlippage > 0.001) { // 0.1%
    issues.push(`High average slippage: ${(kpis.avgSlippage * 100).toFixed(3)}%`);
    recommendations.push('Improve execution or review market conditions');
  }

  // Check confidence score quality
  if (kpis.avgConfidenceScore < 0.7) {
    issues.push(`Low average confidence: ${(kpis.avgConfidenceScore * 100).toFixed(1)}%`);
    recommendations.push('Review setup detection criteria');
  }

  // Check setup type diversification
  const activeSetupTypes = Object.values(kpis.setupsByType).filter((count: any) => count > 0).length;
  if (activeSetupTypes < 2) {
    issues.push('Limited setup type diversification');
    recommendations.push('Develop and validate additional setup types');
  }

  // Overall assessment
  let overall: 'excellent' | 'good' | 'fair' | 'poor' | 'no_data' = 'excellent';
  
  if (issues.length === 0 && kpis.totalSetups >= 100) {
    overall = 'excellent';
  } else if (issues.length <= 2 && kpis.expectancy > 0) {
    overall = 'good';
  } else if (issues.length <= 4) {
    overall = 'fair';
  } else {
    overall = 'poor';
  }

  // Derivatives readiness check (strict criteria)
  const readyForDerivatives = 
    kpis.totalSetups >= 100 &&
    kpis.expectancy > 0 &&
    kpis.avgRiskReward >= 1.2 &&
    Math.abs(kpis.maxDrawdown) < 0.1 &&
    kpis.avgSlippage < 0.001 &&
    issues.length <= 1;

  if (!readyForDerivatives && kpis.totalSetups >= 100) {
    recommendations.push('🚫 NOT READY for derivatives - address issues above first');
  } else if (readyForDerivatives) {
    recommendations.push('✅ READY for derivatives promotion (Phase 2)');
  }

  return {
    overall,
    issues,
    recommendations,
    readyForDerivatives,
  };
}