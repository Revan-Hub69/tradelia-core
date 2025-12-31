// Market Data Repository
// Handles database operations for market_data table

import { supabaseAdmin } from "./supabase";
import { type KlineType, type MarketDataRowType } from "../schemas";
import { MarketDataRowSchema } from "../schemas";
import { MCEError, DataQualityError } from "../types";

export interface MarketDataQuery {
  symbol?: string;
  tf?: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

export interface UpsertResult {
  inserted: number;
  updated: number;
  errors: number;
  duplicates: number;
}

// Convert Kline to database row format
function klineToRow(kline: KlineType): Omit<MarketDataRowType, 'id' | 'inserted_at'> {
  return {
    symbol: kline.symbol,
    tf: kline.tf,
    open_time: kline.openTime,
    close_time: kline.closeTime,
    open: kline.open,
    high: kline.high,
    low: kline.low,
    close: kline.close,
    volume: kline.volume,
    trades: kline.trades || null,
    source: 'binance',
  };
}

// Convert database row to Kline format
function rowToKline(row: MarketDataRowType): KlineType {
  return {
    symbol: row.symbol as any, // Type assertion needed due to DB string vs enum
    tf: row.tf as any,
    openTime: row.open_time,
    closeTime: row.close_time,
    open: Number(row.open),
    high: Number(row.high),
    low: Number(row.low),
    close: Number(row.close),
    volume: Number(row.volume),
    trades: row.trades || undefined,
  };
}

// Upsert klines (insert or update on conflict)
export async function upsertKlines(klines: KlineType[]): Promise<UpsertResult> {
  if (klines.length === 0) {
    return { inserted: 0, updated: 0, errors: 0, duplicates: 0 };
  }

  const sb = supabaseAdmin();
  
  try {
    // Convert klines to database format
    const rows = klines.map(klineToRow);
    
    // Use upsert with ON CONFLICT handling
    const { data, error, count } = await sb
      .from('market_data')
      .upsert(rows, {
        onConflict: 'symbol,tf,open_time',
        ignoreDuplicates: false, // Update existing records
      })
      .select('id');

    if (error) {
      throw new MCEError(
        `Failed to upsert market data: ${error.message}`,
        "DATABASE_ERROR",
        { error, rowCount: rows.length }
      );
    }

    // For upsert, we can't easily distinguish between inserts and updates
    // So we return the total count as "inserted" for simplicity
    const processedCount = count || data?.length || 0;
    
    return {
      inserted: processedCount,
      updated: 0, // Would need separate query to determine this
      errors: Math.max(0, klines.length - processedCount),
      duplicates: 0,
    };

  } catch (error) {
    if (error instanceof MCEError) {
      throw error;
    }
    
    throw new MCEError(
      `Market data upsert failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "DATABASE_ERROR",
      { originalError: error, klinesCount: klines.length }
    );
  }
}

// Get klines by query parameters
export async function getKlines(query: MarketDataQuery = {}): Promise<KlineType[]> {
  const sb = supabaseAdmin();
  
  try {
    let dbQuery = sb
      .from('market_data')
      .select('*')
      .order('open_time', { ascending: true });

    // Apply filters
    if (query.symbol) {
      dbQuery = dbQuery.eq('symbol', query.symbol);
    }
    
    if (query.tf) {
      dbQuery = dbQuery.eq('tf', query.tf);
    }
    
    if (query.startTime) {
      dbQuery = dbQuery.gte('open_time', query.startTime);
    }
    
    if (query.endTime) {
      dbQuery = dbQuery.lt('open_time', query.endTime);
    }
    
    if (query.limit) {
      dbQuery = dbQuery.limit(query.limit);
    }

    const { data, error } = await dbQuery;

    if (error) {
      throw new MCEError(
        `Failed to fetch market data: ${error.message}`,
        "DATABASE_ERROR",
        { error, query }
      );
    }

    if (!data) {
      return [];
    }

    // Validate and convert rows to klines
    const klines: KlineType[] = [];
    const errors: any[] = [];

    for (const row of data) {
      try {
        // Validate row structure
        const validatedRow = MarketDataRowSchema.parse(row);
        const kline = rowToKline(validatedRow);
        klines.push(kline);
      } catch (validationError) {
        errors.push({ row, error: validationError });
      }
    }

    // Log validation errors but don't fail the entire query
    if (errors.length > 0) {
      console.warn(`MCE: ${errors.length} invalid rows in market_data query`, { query, errors: errors.slice(0, 5) });
    }

    return klines;

  } catch (error) {
    if (error instanceof MCEError) {
      throw error;
    }
    
    throw new MCEError(
      `Market data query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "DATABASE_ERROR",
      { originalError: error, query }
    );
  }
}

// Get latest klines for a symbol/timeframe
export async function getLatestKlines(
  symbol: string,
  tf: string,
  limit: number = 500
): Promise<KlineType[]> {
  return getKlines({
    symbol,
    tf,
    limit,
  });
}

// Get klines in a time range
export async function getKlinesRange(
  symbol: string,
  tf: string,
  startTime: number,
  endTime: number
): Promise<KlineType[]> {
  return getKlines({
    symbol,
    tf,
    startTime,
    endTime,
  });
}

// Check for data gaps in a time range
export async function checkDataGaps(
  symbol: string,
  tf: string,
  hours: number = 24
): Promise<Array<{ expected_time: number; gap_minutes: number }>> {
  const sb = supabaseAdmin();
  
  try {
    const { data, error } = await sb.rpc('get_data_gaps', {
      p_symbol: symbol,
      p_tf: tf,
      p_hours: hours,
    });

    if (error) {
      throw new MCEError(
        `Failed to check data gaps: ${error.message}`,
        "DATABASE_ERROR",
        { error, symbol, tf, hours }
      );
    }

    return data || [];

  } catch (error) {
    if (error instanceof MCEError) {
      throw error;
    }
    
    throw new MCEError(
      `Data gap check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "DATABASE_ERROR",
      { originalError: error, symbol, tf, hours }
    );
  }
}

// Get data statistics
export async function getDataStats(
  symbol?: string,
  tf?: string
): Promise<{
  totalRows: number;
  dateRange: { earliest: number | null; latest: number | null };
  symbols: string[];
  timeframes: string[];
}> {
  const sb = supabaseAdmin();
  
  try {
    // Build base query
    let query = sb.from('market_data').select('*', { count: 'exact', head: true });
    
    if (symbol) {
      query = query.eq('symbol', symbol);
    }
    
    if (tf) {
      query = query.eq('tf', tf);
    }

    const { count, error: countError } = await query;

    if (countError) {
      throw new MCEError(
        `Failed to get data count: ${countError.message}`,
        "DATABASE_ERROR",
        { error: countError }
      );
    }

    // Get date range
    let rangeQuery = sb
      .from('market_data')
      .select('open_time')
      .order('open_time', { ascending: true })
      .limit(1);
    
    if (symbol) rangeQuery = rangeQuery.eq('symbol', symbol);
    if (tf) rangeQuery = rangeQuery.eq('tf', tf);

    const { data: earliestData, error: earliestError } = await rangeQuery;

    let latestQuery = sb
      .from('market_data')
      .select('open_time')
      .order('open_time', { ascending: false })
      .limit(1);
    
    if (symbol) latestQuery = latestQuery.eq('symbol', symbol);
    if (tf) latestQuery = latestQuery.eq('tf', tf);

    const { data: latestData, error: latestError } = await latestQuery;

    if (earliestError || latestError) {
      throw new MCEError(
        `Failed to get date range: ${earliestError?.message || latestError?.message}`,
        "DATABASE_ERROR",
        { earliestError, latestError }
      );
    }

    // Get unique symbols and timeframes
    const { data: symbolsData, error: symbolsError } = await sb
      .from('market_data')
      .select('symbol')
      .order('symbol');

    const { data: timeframesData, error: timeframesError } = await sb
      .from('market_data')
      .select('tf')
      .order('tf');

    if (symbolsError || timeframesError) {
      throw new MCEError(
        `Failed to get symbols/timeframes: ${symbolsError?.message || timeframesError?.message}`,
        "DATABASE_ERROR",
        { symbolsError, timeframesError }
      );
    }

    // Extract unique values
    const symbols = [...new Set((symbolsData || []).map(row => row.symbol))];
    const timeframes = [...new Set((timeframesData || []).map(row => row.tf))];

    return {
      totalRows: count || 0,
      dateRange: {
        earliest: earliestData?.[0]?.open_time || null,
        latest: latestData?.[0]?.open_time || null,
      },
      symbols,
      timeframes,
    };

  } catch (error) {
    if (error instanceof MCEError) {
      throw error;
    }
    
    throw new MCEError(
      `Data stats query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "DATABASE_ERROR",
      { originalError: error, symbol, tf }
    );
  }
}

// Delete old data (for free tier space management)
export async function cleanupOldData(days: number = 90): Promise<number> {
  const sb = supabaseAdmin();
  
  try {
    const { data, error } = await sb.rpc('cleanup_old_data', {
      p_days: days,
    });

    if (error) {
      throw new MCEError(
        `Failed to cleanup old data: ${error.message}`,
        "DATABASE_ERROR",
        { error, days }
      );
    }

    return data || 0;

  } catch (error) {
    if (error instanceof MCEError) {
      throw error;
    }
    
    throw new MCEError(
      `Data cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "DATABASE_ERROR",
      { originalError: error, days }
    );
  }
}

// Health check for market data
export async function healthCheck(): Promise<{
  connected: boolean;
  latencyMs: number;
  recentDataCount: number;
  error?: string;
}> {
  const start = Date.now();
  
  try {
    const sb = supabaseAdmin();
    
    // Simple query to test connection and get recent data count
    const { count, error } = await sb
      .from('market_data')
      .select('*', { count: 'exact', head: true })
      .gte('inserted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

    const latencyMs = Date.now() - start;

    if (error) {
      return {
        connected: false,
        latencyMs,
        recentDataCount: 0,
        error: error.message,
      };
    }

    return {
      connected: true,
      latencyMs,
      recentDataCount: count || 0,
    };

  } catch (error) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      recentDataCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}