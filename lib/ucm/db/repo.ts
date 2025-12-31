// UCM Database Repository - Data access layer for Universe Control Module
// Handles all database operations for UCM with proper error handling and type safety

import { supabaseAdmin } from "../../mce/db/supabase";
import { 
  UniversePoolType, 
  UniverseStateType, 
  UniverseActiveType, 
  EligibilitySnapshotType,
  UniversePoolRowType,
  UniverseStateRowType,
  UniverseActiveRowType,
  EligibilitySnapshotRowType,
  UniverseDiffType,
  UCMError
} from "../schemas";

export class UCMRepository {
  // Get admin client
  private getClient() {
    return supabaseAdmin();
  }

  // Universe Pool operations
  async getUniversePool(): Promise<UniversePoolType | null> {
    try {
      const { data, error } = await this.getClient()
        .from('universe_pool')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw new UCMError(`Failed to get universe pool: ${error.message}`, 'DB_ERROR');
      }
      
      if (!data) return null;
      
      return {
        v: "ucm.pool.v1",
        asOf: data.as_of,
        symbols: data.symbols,
        coreSymbols: data.core_symbols,
        hash: data.hash,
      };
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in getUniversePool: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  async updateUniversePool(pool: UniversePoolType): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from('universe_pool')
        .insert({
          version: pool.v,
          as_of: pool.asOf,
          symbols: pool.symbols,
          core_symbols: pool.coreSymbols,
          hash: pool.hash,
        });
      
      if (error) {
        throw new UCMError(`Failed to update universe pool: ${error.message}`, 'DB_ERROR');
      }
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in updateUniversePool: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  // Universe State operations
  async getUniverseStates(): Promise<UniverseStateType[]> {
    try {
      const { data, error } = await this.getClient()
        .from('universe_state')
        .select('*')
        .order('symbol');
      
      if (error) {
        throw new UCMError(`Failed to get universe states: ${error.message}`, 'DB_ERROR');
      }
      
      return (data || []).map(row => ({
        symbol: row.symbol,
        status: row.status as "ACTIVE" | "INACTIVE" | "BLACKLISTED",
        enteredAt: row.entered_at || undefined,
        exitedAt: row.exited_at || undefined,
        cooldownUntil: row.cooldown_until || undefined,
        blacklistUntil: row.blacklist_until || undefined,
      }));
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in getUniverseStates: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  async updateUniverseStates(states: UniverseStateType[]): Promise<void> {
    try {
      const rows = states.map(state => ({
        symbol: state.symbol,
        status: state.status,
        entered_at: state.enteredAt || null,
        exited_at: state.exitedAt || null,
        cooldown_until: state.cooldownUntil || null,
        blacklist_until: state.blacklistUntil || null,
      }));
      
      const { error } = await this.getClient()
        .from('universe_state')
        .upsert(rows);
      
      if (error) {
        throw new UCMError(`Failed to update universe states: ${error.message}`, 'DB_ERROR');
      }
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in updateUniverseStates: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  // Universe Active operations
  async getLatestUniverseActive(): Promise<UniverseActiveType | null> {
    try {
      const { data, error } = await this.getClient()
        .from('universe_active')
        .select('*')
        .order('as_of', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw new UCMError(`Failed to get latest universe active: ${error.message}`, 'DB_ERROR');
      }
      
      if (!data) return null;
      
      return {
        v: "ucm.active.v1",
        asOf: data.as_of,
        target: data.target_count,
        min: data.min_count,
        max: data.max_count,
        symbols: data.symbols,
        coreIncluded: data.core_included,
        meta: data.meta,
        basedOn: data.based_on,
        hash: data.hash,
      };
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in getLatestUniverseActive: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  async saveUniverseActive(active: UniverseActiveType): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from('universe_active')
        .insert({
          as_of: active.asOf,
          version: active.v,
          target_count: active.target,
          min_count: active.min,
          max_count: active.max,
          symbols: active.symbols,
          core_included: active.coreIncluded,
          meta: active.meta,
          based_on: active.basedOn,
          hash: active.hash,
        });
      
      if (error) {
        throw new UCMError(`Failed to save universe active: ${error.message}`, 'DB_ERROR');
      }
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in saveUniverseActive: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  // Eligibility Snapshots operations
  async saveEligibilitySnapshots(snapshots: EligibilitySnapshotType[]): Promise<void> {
    try {
      const rows = snapshots.map(snapshot => ({
        symbol: snapshot.symbol,
        as_of: snapshot.asOf,
        vol_quote_24h: snapshot.volQuote_24h,
        spread_bps: snapshot.spreadBps,
        completeness_60m: snapshot.completeness_60m,
        gaps_60m: snapshot.gaps_60m,
        atr14_1m: snapshot.atr14_1m,
        atr_percentile_1m: snapshot.atrPercentile_1m,
      }));
      
      const { error } = await this.getClient()
        .from('eligibility_snapshots')
        .upsert(rows, { onConflict: 'symbol,as_of' });
      
      if (error) {
        throw new UCMError(`Failed to save eligibility snapshots: ${error.message}`, 'DB_ERROR');
      }
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in saveEligibilitySnapshots: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  async getEligibilityHistory(symbol: string, minutes: number): Promise<EligibilitySnapshotType[]> {
    try {
      const cutoff = Date.now() - (minutes * 60 * 1000);
      
      const { data, error } = await this.getClient()
        .from('eligibility_snapshots')
        .select('*')
        .eq('symbol', symbol)
        .gte('as_of', cutoff)
        .order('as_of', { ascending: true });
      
      if (error) {
        throw new UCMError(`Failed to get eligibility history for ${symbol}: ${error.message}`, 'DB_ERROR');
      }
      
      return (data || []).map(row => ({
        symbol: row.symbol,
        asOf: row.as_of,
        volQuote_24h: row.vol_quote_24h,
        spreadBps: row.spread_bps,
        completeness_60m: row.completeness_60m,
        gaps_60m: row.gaps_60m,
        atr14_1m: row.atr14_1m,
        atrPercentile_1m: row.atr_percentile_1m,
      }));
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in getEligibilityHistory: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  // Universe diff operations
  async getUniverseDiff(fromTimestamp?: number, toTimestamp?: number, limit: number = 50): Promise<UniverseDiffType> {
    try {
      const from = fromTimestamp || (Date.now() - 24 * 60 * 60 * 1000); // Default: last 24 hours
      const to = toTimestamp || Date.now();
      
      const { data, error } = await this.getClient()
        .from('universe_active')
        .select('*')
        .gte('as_of', from)
        .lte('as_of', to)
        .order('as_of', { ascending: true })
        .limit(limit);
      
      if (error) {
        throw new UCMError(`Failed to get universe diff: ${error.message}`, 'DB_ERROR');
      }
      
      const changes = (data || []).map(row => ({
        asOf: row.as_of,
        added: row.meta?.added || [],
        removed: row.meta?.removed || [],
        blacklisted: row.meta?.blacklisted || [],
        activeCount: (row.symbols || []).length,
      }));
      
      return {
        from,
        to,
        changes,
      };
    } catch (error) {
      if (error instanceof UCMError) throw error;
      throw new UCMError(`Database error in getUniverseDiff: ${error instanceof Error ? error.message : 'Unknown error'}`, 'DB_ERROR');
    }
  }
  
  // Health check
  async healthCheck(): Promise<{ healthy: boolean; message: string; latency: number }> {
    const startTime = Date.now();
    
    try {
      const { error } = await this.getClient()
        .from('universe_pool')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        return {
          healthy: false,
          message: `Database connection failed: ${error.message}`,
          latency,
        };
      }
      
      return {
        healthy: true,
        message: 'Database connection healthy',
        latency,
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        latency: Date.now() - startTime,
      };
    }
  }
}