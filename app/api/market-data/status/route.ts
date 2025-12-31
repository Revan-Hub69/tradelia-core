// Market Data Status API - Phase 1 Integration
// Professional monitoring and KPI endpoint

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/middleware/api-auth';
import { supabaseAdmin } from '@/lib/mce/db/supabase';

export async function GET(request: NextRequest) {
  try {
    // Require authentication and read permission
    const authResult = await requirePermission(request, 'read:market-data');
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error response
    }
    
    const authContext = authResult;

    const supabase = supabaseAdmin();
    
    // Get current run statistics
    const { data: runs, error: runsError } = await supabase
      .from('market_data_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (runsError) {
      throw new Error(`Failed to fetch runs: ${runsError.message}`);
    }

    // Get overall statistics
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_market_data_stats');

    if (statsError) {
      throw new Error(`Failed to fetch stats: ${statsError.message}`);
    }

    const stats = statsData?.[0] || {
      total_events: 0,
      total_candles: 0,
      total_trades: 0,
      symbols_count: 0,
      latest_event: null,
      run_duration: null,
    };

    // Get recent paper trades for KPI calculation
    const { data: recentTrades, error: tradesError } = await supabase
      .from('paper_trades')
      .select('*')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(100);

    if (tradesError) {
      throw new Error(`Failed to fetch trades: ${tradesError.message}`);
    }

    // Calculate KPIs
    const kpis = calculateKPIs(recentTrades || []);
    
    // Assess Phase 1 readiness
    const readiness = assessPhase1Readiness(stats, kpis, runs || []);

    const response = {
      ok: true,
      data: {
        currentRuns: runs?.filter(r => r.status === 'RUNNING') || [],
        recentRuns: runs || [],
        statistics: {
          totalEvents: parseInt(stats.total_events) || 0,
          totalCandles: parseInt(stats.total_candles) || 0,
          totalTrades: parseInt(stats.total_trades) || 0,
          symbolsCount: parseInt(stats.symbols_count) || 0,
          latestEvent: stats.latest_event,
          totalRunDuration: stats.run_duration,
        },
        kpis,
        readiness,
        timestamp: new Date().toISOString(),
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Market data status API error:', error);
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

function calculateKPIs(trades: any[]): {
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  expectancy: number;
  maxDrawdown: number;
  sharpeRatio: number;
  rDistribution: { min: number; max: number; avg: number; std: number };
  avgSlippage: number;
  avgHoldTime: number;
  profitFactor: number;
} {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      avgReturn: 0,
      expectancy: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      rDistribution: { min: 0, max: 0, avg: 0, std: 0 },
      avgSlippage: 0,
      avgHoldTime: 0,
      profitFactor: 0,
    };
  }

  const returns = trades.map(t => parseFloat(t.pnl_pct) || 0);
  const rMultiples = trades.map(t => parseFloat(t.r_multiple) || 0);
  const slippages = trades.map(t => parseFloat(t.slippage) || 0);
  const holdTimes = trades.map(t => parseInt(t.hold_time) || 0);

  // Basic statistics
  const totalTrades = trades.length;
  const winningTrades = returns.filter(r => r > 0);
  const losingTrades = returns.filter(r => r < 0);
  const winRate = winningTrades.length / totalTrades;

  // Return statistics
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / totalTrades;
  const returnStd = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / totalTrades
  );

  // Expectancy
  const avgWin = winningTrades.length > 0 ? 
    winningTrades.reduce((sum, r) => sum + r, 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? 
    Math.abs(losingTrades.reduce((sum, r) => sum + r, 0) / losingTrades.length) : 0;
  const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);

  // Drawdown calculation
  let peak = 0;
  let maxDrawdown = 0;
  let cumulative = 0;
  
  for (const ret of returns) {
    cumulative += ret;
    if (cumulative > peak) {
      peak = cumulative;
    }
    const drawdown = peak - cumulative;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Sharpe ratio (assuming risk-free rate of 0)
  const sharpeRatio = returnStd > 0 ? avgReturn / returnStd : 0;

  // R-multiple distribution
  const rMin = Math.min(...rMultiples);
  const rMax = Math.max(...rMultiples);
  const rAvg = rMultiples.reduce((sum, r) => sum + r, 0) / rMultiples.length;
  const rStd = Math.sqrt(
    rMultiples.reduce((sum, r) => sum + Math.pow(r - rAvg, 2), 0) / rMultiples.length
  );

  // Other metrics
  const avgSlippage = slippages.reduce((sum, s) => sum + s, 0) / slippages.length;
  const avgHoldTime = holdTimes.reduce((sum, h) => sum + h, 0) / holdTimes.length;

  // Profit factor
  const grossProfit = winningTrades.reduce((sum, r) => sum + r, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, r) => sum + r, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  return {
    totalTrades,
    winRate: winRate * 100,
    avgReturn: avgReturn * 100,
    expectancy: expectancy * 100,
    maxDrawdown: maxDrawdown * 100,
    sharpeRatio,
    rDistribution: { min: rMin, max: rMax, avg: rAvg, std: rStd },
    avgSlippage: avgSlippage * 100,
    avgHoldTime: avgHoldTime / 1000, // Convert to seconds
    profitFactor,
  };
}

function assessPhase1Readiness(
  stats: any, 
  kpis: any, 
  runs: any[]
): {
  status: 'GREEN' | 'YELLOW' | 'RED';
  score: number;
  criteria: Array<{ name: string; status: 'PASS' | 'WARN' | 'FAIL'; value: any; threshold: any }>;
  recommendation: string;
} {
  const criteria = [
    {
      name: 'Minimum Trades',
      status: kpis.totalTrades >= 100 ? 'PASS' : kpis.totalTrades >= 50 ? 'WARN' : 'FAIL',
      value: kpis.totalTrades,
      threshold: 100,
    },
    {
      name: 'Data Quality',
      status: stats.totalEvents >= 1000 ? 'PASS' : stats.totalEvents >= 500 ? 'WARN' : 'FAIL',
      value: stats.totalEvents,
      threshold: 1000,
    },
    {
      name: 'Win Rate',
      status: kpis.winRate >= 40 ? 'PASS' : kpis.winRate >= 30 ? 'WARN' : 'FAIL',
      value: `${kpis.winRate.toFixed(1)}%`,
      threshold: '40%',
    },
    {
      name: 'Expectancy',
      status: kpis.expectancy > 0 ? 'PASS' : kpis.expectancy > -0.5 ? 'WARN' : 'FAIL',
      value: `${kpis.expectancy.toFixed(2)}%`,
      threshold: '>0%',
    },
    {
      name: 'Max Drawdown',
      status: kpis.maxDrawdown <= 10 ? 'PASS' : kpis.maxDrawdown <= 20 ? 'WARN' : 'FAIL',
      value: `${kpis.maxDrawdown.toFixed(1)}%`,
      threshold: '≤10%',
    },
    {
      name: 'Slippage Control',
      status: kpis.avgSlippage <= 0.1 ? 'PASS' : kpis.avgSlippage <= 0.2 ? 'WARN' : 'FAIL',
      value: `${kpis.avgSlippage.toFixed(3)}%`,
      threshold: '≤0.1%',
    },
    {
      name: 'System Stability',
      status: runs.filter(r => r.status === 'FAILED').length === 0 ? 'PASS' : 
             runs.filter(r => r.status === 'FAILED').length <= 1 ? 'WARN' : 'FAIL',
      value: runs.filter(r => r.status === 'FAILED').length,
      threshold: 0,
    },
  ];

  // Calculate score
  const passCount = criteria.filter(c => c.status === 'PASS').length;
  const warnCount = criteria.filter(c => c.status === 'WARN').length;
  const score = (passCount * 100 + warnCount * 50) / criteria.length;

  // Determine overall status
  let status: 'GREEN' | 'YELLOW' | 'RED';
  let recommendation: string;

  if (score >= 80 && criteria.every(c => c.status !== 'FAIL')) {
    status = 'GREEN';
    recommendation = 'System ready for derivatives promotion. All criteria met.';
  } else if (score >= 60) {
    status = 'YELLOW';
    recommendation = 'System approaching readiness. Address failing criteria before promotion.';
  } else {
    status = 'RED';
    recommendation = 'System not ready. Significant improvements needed before derivatives promotion.';
  }

  return {
    status,
    score,
    criteria,
    recommendation,
  };
}