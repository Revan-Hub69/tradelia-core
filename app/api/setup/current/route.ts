// Setup Engine Current State API - Professional Trading System
// Best practice: real-time setup monitoring, active setup management

import { NextRequest, NextResponse } from 'next/server';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';
import { setupEngine } from '@/lib/setup/engine';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Get current engine state
    const activeSetups = await setupEngine.getActiveSetups();
    const engineStats = await setupEngine.getEngineStats();

    // Format active setups for API response
    const formattedSetups = activeSetups.map(setup => ({
      setupId: setup.setupId,
      symbol: setup.symbol,
      setupType: setup.setupType,
      direction: setup.direction,
      
      entry: {
        type: setup.entryModel.type,
        price: setup.entryModel.price,
        ttlSec: setup.entryModel.ttlSec,
        expiresAt: setup.expiresAt,
        timeRemaining: Math.max(0, setup.expiresAt - Date.now()),
      },
      
      risk: {
        stopLevel: setup.stopModel.level,
        primaryTarget: setup.targets.primary,
        secondaryTarget: setup.targets.secondary,
        riskReward: setup.riskReward,
        maxRisk: setup.maxRisk,
      },
      
      quality: {
        confidenceScore: setup.confidenceScore,
        evidenceCount: setup.evidence.length,
        evidenceTypes: setup.evidence.map(e => e.type),
      },
      
      status: {
        active: setup.expiresAt > Date.now(),
        expired: setup.expiresAt <= Date.now(),
        timeToExpiry: setup.expiresAt - Date.now(),
      },
    }));

    // Calculate additional metrics
    const now = Date.now();
    const expiringSetups = activeSetups.filter(s => s.expiresAt - now < 5 * 60 * 1000); // Expiring in 5 minutes
    const highConfidenceSetups = activeSetups.filter(s => s.confidenceScore >= 0.8);
    
    const totalRisk = activeSetups.reduce((sum, s) => sum + s.maxRisk, 0);
    const avgTimeToExpiry = activeSetups.length > 0 
      ? activeSetups.reduce((sum, s) => sum + Math.max(0, s.expiresAt - now), 0) / activeSetups.length
      : 0;

    const response = {
      ok: true,
      data: {
        timestamp: now,
        timestampISO: new Date(now).toISOString(),
        
        // Active setups
        activeSetups: formattedSetups,
        
        // Engine statistics
        stats: {
          ...engineStats,
          totalRisk,
          avgTimeToExpiry: Math.round(avgTimeToExpiry / 1000), // seconds
          expiringSetups: expiringSetups.length,
          highConfidenceSetups: highConfidenceSetups.length,
        },
        
        // Risk summary
        riskSummary: {
          totalExposure: totalRisk,
          maxAllowedExposure: engineStats.maxConcurrentSetups * 100, // Assuming $100 per setup
          utilizationPct: totalRisk / (engineStats.maxConcurrentSetups * 100) * 100,
          riskBySymbol: calculateRiskBySymbol(activeSetups),
          riskByType: calculateRiskByType(activeSetups),
        },
        
        // Alerts and warnings
        alerts: generateAlerts(activeSetups, engineStats),
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache', // Real-time data, no caching
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Setup current API error:', error);
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

// Helper function to calculate risk by symbol
function calculateRiskBySymbol(setups: any[]): Record<string, number> {
  const riskBySymbol: Record<string, number> = {};
  
  for (const setup of setups) {
    riskBySymbol[setup.symbol] = (riskBySymbol[setup.symbol] || 0) + setup.maxRisk;
  }
  
  return riskBySymbol;
}

// Helper function to calculate risk by setup type
function calculateRiskByType(setups: any[]): Record<string, number> {
  const riskByType: Record<string, number> = {};
  
  for (const setup of setups) {
    riskByType[setup.setupType] = (riskByType[setup.setupType] || 0) + setup.maxRisk;
  }
  
  return riskByType;
}

// Helper function to generate alerts and warnings
function generateAlerts(setups: any[], stats: any): Array<{
  type: 'warning' | 'error' | 'info';
  message: string;
  setupId?: string;
}> {
  const alerts: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    setupId?: string;
  }> = [];
  
  const now = Date.now();
  
  // Check for expiring setups
  const expiringSetups = setups.filter(s => s.expiresAt - now < 5 * 60 * 1000 && s.expiresAt > now);
  for (const setup of expiringSetups) {
    const minutesLeft = Math.round((setup.expiresAt - now) / (60 * 1000));
    alerts.push({
      type: 'warning',
      message: `Setup expires in ${minutesLeft} minute(s)`,
      setupId: setup.setupId,
    });
  }
  
  // Check for expired setups
  const expiredSetups = setups.filter(s => s.expiresAt <= now);
  for (const setup of expiredSetups) {
    alerts.push({
      type: 'error',
      message: 'Setup has expired and should be cleaned up',
      setupId: setup.setupId,
    });
  }
  
  // Check capacity utilization
  const utilizationPct = (stats.activeSetups / stats.maxConcurrentSetups) * 100;
  if (utilizationPct >= 90) {
    alerts.push({
      type: 'warning',
      message: `High capacity utilization: ${utilizationPct.toFixed(1)}%`,
    });
  } else if (utilizationPct >= 100) {
    alerts.push({
      type: 'error',
      message: 'Maximum setup capacity reached',
    });
  }
  
  // Check for low confidence setups
  const lowConfidenceSetups = setups.filter(s => s.confidenceScore < 0.7);
  if (lowConfidenceSetups.length > 0) {
    alerts.push({
      type: 'info',
      message: `${lowConfidenceSetups.length} setup(s) with confidence < 70%`,
    });
  }
  
  // Check for high risk concentration
  const riskBySymbol = calculateRiskBySymbol(setups);
  const maxSymbolRisk = Math.max(...Object.values(riskBySymbol));
  const totalRisk = Object.values(riskBySymbol).reduce((sum, risk) => sum + risk, 0);
  
  if (totalRisk > 0 && maxSymbolRisk / totalRisk > 0.5) {
    const concentratedSymbol = Object.keys(riskBySymbol).find(
      symbol => riskBySymbol[symbol] === maxSymbolRisk
    );
    alerts.push({
      type: 'warning',
      message: `High risk concentration in ${concentratedSymbol}: ${((maxSymbolRisk / totalRisk) * 100).toFixed(1)}%`,
    });
  }
  
  return alerts;
}