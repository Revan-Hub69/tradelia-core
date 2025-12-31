// MSF KPIs API - Performance metrics and analysis
// Best practice: operational KPIs, trend analysis

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (general tier - 60 req/min)
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const sb = supabaseAdmin();
    
    // Get days parameter (default 7)
    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get('days') || '7'), 1), 30);
    
    // Get MSF KPIs
    const { data: kpis, error } = await sb.rpc('analyze_msf_kpis', { days_back: days });
    
    if (error) {
      console.error('Failed to get MSF KPIs:', error);
      return NextResponse.json(
        { ok: false, error: 'Failed to get MSF KPIs' },
        { status: 500 }
      );
    }

    const kpiData = kpis?.[0];
    
    if (!kpiData) {
      return NextResponse.json({
        ok: true,
        data: {
          period: { days, from: Date.now() - (days * 24 * 60 * 60 * 1000), to: Date.now() },
          kpis: {
            totalDecisions: 0,
            tradableDays: 0,
            noTradeDays: 0,
            tradableDaysPct: 0,
            avgASymbols: 0,
            avgBSymbols: 0,
            aSymbolsPct: 0,
            flipRate: 0,
            avgFriction: 0,
            dataQuality: 0,
          },
          assessment: {
            overall: 'no_data',
            issues: ['No MSF data available'],
            recommendations: ['Run MSF pipeline to generate data'],
          }
        }
      });
    }

    // Assess KPI health
    const assessment = assessKPIHealth(kpiData);
    
    const response = {
      ok: true,
      data: {
        period: { 
          days, 
          from: Date.now() - (days * 24 * 60 * 60 * 1000), 
          to: Date.now() 
        },
        kpis: {
          totalDecisions: parseInt(kpiData.total_decisions),
          tradableDays: parseInt(kpiData.tradable_days),
          noTradeDays: parseInt(kpiData.no_trade_days),
          tradableDaysPct: parseFloat(kpiData.tradable_days_pct),
          avgASymbols: parseFloat(kpiData.avg_a_symbols),
          avgBSymbols: parseFloat(kpiData.avg_b_symbols),
          aSymbolsPct: parseFloat(kpiData.a_symbols_pct),
          flipRate: parseFloat(kpiData.flip_rate),
          avgFriction: parseFloat(kpiData.avg_friction),
          dataQuality: parseFloat(kpiData.data_quality),
        },
        assessment,
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('MSF KPIs API error:', error);
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

// Assess KPI health against best practices
function assessKPIHealth(kpis: any): {
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'no_data';
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  const tradableDaysPct = parseFloat(kpis.tradable_days_pct);
  const aSymbolsPct = parseFloat(kpis.a_symbols_pct);
  const flipRate = parseFloat(kpis.flip_rate);
  const avgFriction = parseFloat(kpis.avg_friction);
  const dataQuality = parseFloat(kpis.data_quality);
  
  // NO_TRADE days should be 20-40% (discipline)
  const noTradeDaysPct = 100 - tradableDaysPct;
  if (noTradeDaysPct < 20) {
    issues.push(`Too few NO_TRADE days: ${noTradeDaysPct.toFixed(1)}%`);
    recommendations.push('Be more selective, increase NO_TRADE rate');
  } else if (noTradeDaysPct > 60) {
    issues.push(`Too many NO_TRADE days: ${noTradeDaysPct.toFixed(1)}%`);
    recommendations.push('Review criteria, may be too restrictive');
  }
  
  // A symbols should be rare (<15%)
  if (aSymbolsPct > 15) {
    issues.push(`Too many A symbols: ${aSymbolsPct.toFixed(1)}%`);
    recommendations.push('Tighten A class criteria');
  }
  
  // Flip rate should be low (stability)
  if (flipRate > 0.3) {
    issues.push(`High flip rate: ${(flipRate * 100).toFixed(1)}%`);
    recommendations.push('Review hysteresis parameters');
  }
  
  // Friction should be reasonable
  if (avgFriction > 0.6) {
    issues.push(`High average friction: ${(avgFriction * 100).toFixed(1)}%`);
    recommendations.push('Review market conditions or criteria');
  }
  
  // Data quality should be high
  if (dataQuality < 0.95) {
    issues.push(`Low data quality: ${(dataQuality * 100).toFixed(1)}%`);
    recommendations.push('Improve data collection');
  }
  
  // Overall assessment
  let overall: 'excellent' | 'good' | 'fair' | 'poor' | 'no_data' = 'excellent';
  
  if (issues.length === 0) {
    overall = 'excellent';
  } else if (issues.length <= 2) {
    overall = 'good';
  } else if (issues.length <= 4) {
    overall = 'fair';
  } else {
    overall = 'poor';
  }
  
  // Add positive feedback for good performance
  if (issues.length === 0) {
    recommendations.push('MSF performing within best practice parameters');
  }
  
  return {
    overall,
    issues,
    recommendations,
  };
}