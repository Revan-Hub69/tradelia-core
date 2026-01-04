"use client";

import { useState } from "react";
import React from "react";
import { Card } from "./card";

// Types
type TableViewMode = 'compact' | 'comfortable' | 'detailed';

interface UniverseCandidate {
  symbol: string;
  side: "LONG" | "SHORT";
  scores: {
    total: number;
    tradeability: number;
    regimeMatch: number;
  };
  htf: {
    price: number;
    regime: "TREND" | "RANGE" | "TRANSITION";
    stress: boolean;
  };
  ws: {
    spreadBpsNow: number;
    lastUpdateAgeSec: number;
  };
  reasons: {
    blocks: string[];
    warnings: string[];
    info: string[];
  };
}

interface TableConfig {
  mode: TableViewMode;
  columns: string[];
  rowHeight: string;
  maxVisibleRows: number;
}

// View mode configurations
const viewModes: Record<TableViewMode, TableConfig> = {
  compact: {
    mode: 'compact',
    columns: ['symbol', 'price', 'score', 'status'],
    rowHeight: 'h-10',
    maxVisibleRows: 5
  },
  comfortable: {
    mode: 'comfortable',
    columns: ['symbol', 'price', 'regime', 'score', 'spread', 'status'],
    rowHeight: 'h-12',
    maxVisibleRows: 8
  },
  detailed: {
    mode: 'detailed',
    columns: ['symbol', 'price', 'change', 'regime', 'stress', 'score', 'tradeability', 'spread', 'timestamp', 'reasons', 'actions'],
    rowHeight: 'h-14',
    maxVisibleRows: 10
  }
};

// Utility functions
function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function formatBps(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}bps`;
}

function getRegimeBadge(regime: "TREND" | "RANGE" | "TRANSITION") {
  const styles = {
    TREND: "bg-status-ok/20 text-status-ok border-status-ok/30",
    RANGE: "bg-status-attention/20 text-status-attention border-status-attention/30", 
    TRANSITION: "bg-muted/30 text-muted-foreground border-border/50"
  };
  
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${styles[regime]}`}>
      {regime}
    </span>
  );
}

// View Mode Toggle Component
function ViewModeToggle({ 
  mode, 
  onChange 
}: { 
  mode: TableViewMode; 
  onChange: (mode: TableViewMode) => void; 
}) {
  const modes: { key: TableViewMode; label: string; icon: string }[] = [
    { key: 'compact', label: 'Compact', icon: '▦' },
    { key: 'comfortable', label: 'Comfortable', icon: '▤' },
    { key: 'detailed', label: 'Detailed', icon: '▥' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-muted/30 rounded p-1">
      {modes.map((modeOption) => (
        <button
          key={modeOption.key}
          onClick={() => onChange(modeOption.key)}
          className={`px-2 py-1 text-xs font-medium rounded transition-subtle ${
            mode === modeOption.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
          title={`Switch to ${modeOption.label} view`}
        >
          <span className="mr-1">{modeOption.icon}</span>
          <span className="hidden sm:inline">{modeOption.label}</span>
        </button>
      ))}
    </div>
  );
}

// Enhanced Table Component
interface EnhancedTableProps {
  candidates: UniverseCandidate[];
  title: string;
  defaultMode?: TableViewMode;
}

export function EnhancedTable({ 
  candidates, 
  title, 
  defaultMode = 'comfortable' 
}: EnhancedTableProps) {
  const [viewMode, setViewMode] = useState<TableViewMode>(defaultMode);
  const [showAll, setShowAll] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const config = viewModes[viewMode];
  const displayedCandidates = showAll ? candidates : candidates.slice(0, config.maxVisibleRows);
  
  const toggleRowExpansion = (symbol: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol);
    } else {
      newExpanded.add(symbol);
    }
    setExpandedRows(newExpanded);
  };

  // Column rendering functions
  const renderCell = (candidate: UniverseCandidate, column: string) => {
    switch (column) {
      case 'symbol':
        return (
          <div>
            <div className="text-sm font-medium text-foreground">{candidate.symbol}</div>
            <div className="text-xs text-muted-foreground">{candidate.side}</div>
          </div>
        );
      
      case 'price':
        return (
          <div className="text-sm font-medium text-foreground">
            ${formatNumber(candidate.htf.price)}
          </div>
        );
      
      case 'change':
        // Placeholder for price change - would need historical data
        return (
          <div className="text-sm text-muted-foreground">
            --
          </div>
        );
      
      case 'regime':
        return (
          <div>
            {getRegimeBadge(candidate.htf.regime)}
          </div>
        );
      
      case 'stress':
        return candidate.htf.stress ? (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-status-risk/20 text-status-risk border border-status-risk/30">
            STRESS
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Normal</span>
        );
      
      case 'score':
        return (
          <div>
            <div className="text-sm font-medium text-foreground">{candidate.scores.total}</div>
            {viewMode === 'detailed' && (
              <div className="text-xs text-muted-foreground">
                T:{candidate.scores.tradeability} R:{candidate.scores.regimeMatch}
              </div>
            )}
          </div>
        );
      
      case 'tradeability':
        return (
          <div className="text-sm text-foreground">{candidate.scores.tradeability}</div>
        );
      
      case 'spread':
        return (
          <div>
            <div className="text-sm text-foreground">{formatBps(candidate.ws.spreadBpsNow)}</div>
            {viewMode === 'detailed' && (
              <div className="text-xs text-muted-foreground">
                {candidate.ws.lastUpdateAgeSec}s ago
              </div>
            )}
          </div>
        );
      
      case 'timestamp':
        return (
          <div className="text-xs text-muted-foreground">
            {candidate.ws.lastUpdateAgeSec}s ago
          </div>
        );
      
      case 'status':
        return (
          <div className="flex flex-wrap gap-1 max-w-24">
            {candidate.reasons.blocks.slice(0, 1).map((reason, i) => (
              <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-status-risk/20 text-status-risk border border-status-risk/30 truncate" title={reason}>
                {reason.length > 6 ? reason.substring(0, 6) + '...' : reason}
              </span>
            ))}
            {candidate.reasons.warnings.slice(0, 1).map((reason, i) => (
              <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-status-attention/20 text-status-attention border border-status-attention/30 truncate" title={reason}>
                {reason.length > 6 ? reason.substring(0, 6) + '...' : reason}
              </span>
            ))}
          </div>
        );
      
      case 'reasons':
        return (
          <div className="max-w-32">
            <div className="text-xs text-muted-foreground">
              {candidate.reasons.blocks.length > 0 && `${candidate.reasons.blocks.length} blocks`}
              {candidate.reasons.warnings.length > 0 && `, ${candidate.reasons.warnings.length} warnings`}
            </div>
          </div>
        );
      
      case 'actions':
        return (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleRowExpansion(candidate.symbol)}
              className="text-primary hover:text-primary/80 transition-subtle text-sm"
              title="Toggle details"
            >
              {expandedRows.has(candidate.symbol) ? '−' : '+'}
            </button>
          </div>
        );
      
      default:
        return <div className="text-xs text-muted-foreground">--</div>;
    }
  };

  // Column headers
  const getColumnHeader = (column: string) => {
    const headers: Record<string, string> = {
      symbol: 'Symbol',
      price: 'Price',
      change: 'Change',
      regime: 'Regime',
      stress: 'Stress',
      score: 'Score',
      tradeability: 'Trade',
      spread: 'Spread',
      timestamp: 'Updated',
      status: 'Status',
      reasons: 'Reasons',
      actions: 'Details'
    };
    return headers[column] || column;
  };

  return (
    <Card 
      title={title} 
      subtitle={`${candidates.length} candidates`}
      actions={
        <div className="flex items-center space-x-3">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          {candidates.length > config.maxVisibleRows && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-primary hover:text-primary/80 transition-subtle"
            >
              {showAll ? 'Show Less' : `Show All (${candidates.length})`}
            </button>
          )}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border/30" style={{ minWidth: '700px' }}>
          <thead className="bg-muted/30">
            <tr>
              {config.columns.map((column) => (
                <th 
                  key={column}
                  className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                >
                  {getColumnHeader(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border/30">
            {displayedCandidates.map((candidate) => {
              const isRowExpanded = expandedRows.has(candidate.symbol);
              return (
                <React.Fragment key={candidate.symbol}>
                  <tr className={`hover:bg-muted/20 transition-subtle ${config.rowHeight}`}>
                    {config.columns.map((column) => (
                      <td key={column} className="px-3 py-2 whitespace-nowrap">
                        {renderCell(candidate, column)}
                      </td>
                    ))}
                  </tr>
                  {isRowExpanded && (
                    <tr>
                      <td colSpan={config.columns.length} className="px-3 py-3 bg-muted/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Reasons</h4>
                            <div className="space-y-1">
                              {candidate.reasons.blocks.length > 0 && (
                                <div>
                                  <span className="text-xs text-status-risk font-medium">Blocks:</span>
                                  <ul className="text-xs text-muted-foreground ml-2">
                                    {candidate.reasons.blocks.map((reason, i) => (
                                      <li key={i}>• {reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {candidate.reasons.warnings.length > 0 && (
                                <div>
                                  <span className="text-xs text-status-attention font-medium">Warnings:</span>
                                  <ul className="text-xs text-muted-foreground ml-2">
                                    {candidate.reasons.warnings.map((reason, i) => (
                                      <li key={i}>• {reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {candidate.reasons.info.length > 0 && (
                                <div>
                                  <span className="text-xs text-foreground font-medium">Info:</span>
                                  <ul className="text-xs text-muted-foreground ml-2">
                                    {candidate.reasons.info.map((reason, i) => (
                                      <li key={i}>• {reason}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Technical Details</h4>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div>Side: <span className="text-foreground">{candidate.side}</span></div>
                              <div>HTF Regime: <span className="text-foreground">{candidate.htf.regime}</span></div>
                              <div>HTF Stress: <span className="text-foreground">{candidate.htf.stress ? 'Yes' : 'No'}</span></div>
                              <div>WS Update: <span className="text-foreground">{candidate.ws.lastUpdateAgeSec}s ago</span></div>
                              <div>Total Score: <span className="text-foreground">{candidate.scores.total}</span></div>
                              <div>Tradeability: <span className="text-foreground">{candidate.scores.tradeability}</span></div>
                              <div>Regime Match: <span className="text-foreground">{candidate.scores.regimeMatch}</span></div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}