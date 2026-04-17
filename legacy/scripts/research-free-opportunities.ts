#!/usr/bin/env node
/**
 * FREE OPPORTUNITIES RESEARCH SCRIPT
 * Uses Playwright to verify 0€ trading contests and competitions
 *
 * Usage: npx tsx scripts/research-free-opportunities.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { Browser } from 'playwright';
import { chromium } from 'playwright';

// Types for opportunity data
type Opportunity = {
  id: string;
  name: string;
  organizer: string;
  url: string;
  type: 'demo_contest' | 'paper_trading' | 'testnet' | 'free_trial';
  tier: 1 | 2 | 3 | 4;
  expectedPrize: string;
  expectedEntryFee: number;
  notes: string;
};

type ResearchResult = {
  status: 'active' | 'ended' | 'not_found' | 'error';
  actualPrize?: string;
  actualEntryFee?: string;
  details?: string;
  error?: string;
  verifiedAt: string;
} & Opportunity;

// List of opportunities to verify (from FREE_OPPORTUNITIES_CORRECTED_2026.md)
const OPPORTUNITIES: Opportunity[] = [
  // TIER 1 - Best opportunities
  {
    id: 'ninjatrader-arena',
    name: 'NinjaTrader Arena',
    organizer: 'NinjaTrader',
    url: 'https://ninjatrader.com/arena',
    type: 'demo_contest',
    tier: 1,
    expectedPrize: 'Cash / credits / evaluation',
    expectedEntryFee: 0,
    notes: 'Sim futures trading, monthly',
  },
  {
    id: 'primexbt-demo',
    name: 'PrimeXBT Demo Contests',
    organizer: 'PrimeXBT',
    url: 'https://primexbt.com/contests',
    type: 'demo_contest',
    tier: 1,
    expectedPrize: 'Bonus up to $10K',
    expectedEntryFee: 0,
    notes: 'Weekly, bonus with volume requirement',
  },
  {
    id: 'the5ers-competition',
    name: 'The5ers Trading Competition',
    organizer: 'The5ers',
    url: 'https://the5ers.com/competition',
    type: 'demo_contest',
    tier: 1,
    expectedPrize: 'Account funded (top 3-5)',
    expectedEntryFee: 0,
    notes: 'Extreme competition, very hard to win',
  },
  {
    id: 'bybit-demo-arena',
    name: 'Bybit Demo Trading Arena',
    organizer: 'Bybit',
    url: 'https://www.bybit.com/en-US/trading-arena',
    type: 'demo_contest',
    tier: 1,
    expectedPrize: 'USDT reali',
    expectedEntryFee: 0,
    notes: 'Weekly, prizes for top performers',
  },
  // TIER 2 - Good opportunities
  {
    id: 'bitget-demo',
    name: 'Bitget Demo Competitions',
    organizer: 'Bitget',
    url: 'https://www.bitget.com/competition',
    type: 'demo_contest',
    tier: 2,
    expectedPrize: 'Bonus USDT',
    expectedEntryFee: 0,
    notes: 'Regular competitions',
  },
  {
    id: 'tradingview-leap',
    name: 'TradingView The Leap',
    organizer: 'TradingView',
    url: 'https://www.tradingview.com/leap',
    type: 'paper_trading',
    tier: 2,
    expectedPrize: 'Subscriptions / cash',
    expectedEntryFee: 0,
    notes: 'Periodic, paper trading competition',
  },
  {
    id: 'xm-demo',
    name: 'XM Trading Competitions',
    organizer: 'XM',
    url: 'https://www.xm.com/competitions',
    type: 'demo_contest',
    tier: 2,
    expectedPrize: 'Cash prizes',
    expectedEntryFee: 0,
    notes: 'Demo contests',
  },
  {
    id: 'fbs-demo',
    name: 'FBS Demo Contests',
    organizer: 'FBS',
    url: 'https://fbs.com/contests',
    type: 'demo_contest',
    tier: 2,
    expectedPrize: 'Bonus / cash',
    expectedEntryFee: 0,
    notes: 'Various competitions',
  },
  // TIER 3 - Onchain/Testnet
  {
    id: 'berachain-testnet',
    name: 'Berachain Testnet',
    organizer: 'Berachain',
    url: 'https://www.berachain.com',
    type: 'testnet',
    tier: 3,
    expectedPrize: 'BERA tokens (est $2K-10K)',
    expectedEntryFee: 0,
    notes: 'bArtio testnet, potential airdrop',
  },
  {
    id: 'linea-voyage',
    name: 'Linea Voyage',
    organizer: 'Consensys/Linea',
    url: 'https://linea.build/voyage',
    type: 'testnet',
    tier: 3,
    expectedPrize: 'LXP points → token',
    expectedEntryFee: 0,
    notes: 'Testnet tasks, bridge, swap',
  },
  {
    id: 'scroll-testnet',
    name: 'Scroll Testnet',
    organizer: 'Scroll',
    url: 'https://scroll.io',
    type: 'testnet',
    tier: 3,
    expectedPrize: 'SCR tokens',
    expectedEntryFee: 0,
    notes: 'zkEVM testnet, already did first airdrop',
  },
  // TIER 4 - Others
  {
    id: 'kucoin-demo',
    name: 'KuCoin Demo Competitions',
    organizer: 'KuCoin',
    url: 'https://www.kucoin.com/competition',
    type: 'demo_contest',
    tier: 4,
    expectedPrize: 'USDT / bonus',
    expectedEntryFee: 0,
    notes: 'Demo trading battles',
  },
  {
    id: 'mexc-demo',
    name: 'MEXC Demo Contests',
    organizer: 'MEXC',
    url: 'https://www.mexc.com/competition',
    type: 'demo_contest',
    tier: 4,
    expectedPrize: 'USDT',
    expectedEntryFee: 0,
    notes: 'Demo trading',
  },
  {
    id: 'instaforex-contest',
    name: 'InstaForex Contests',
    organizer: 'InstaForex',
    url: 'https://www.instaforex.com/contests',
    type: 'demo_contest',
    tier: 4,
    expectedPrize: 'Cash pool $10K+',
    expectedEntryFee: 0,
    notes: 'Demo and real contests',
  },
];

class OpportunityResearcher {
  private browser: Browser | null = null;
  private results: ResearchResult[] = [];
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'docs', 'research', 'verification-results');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async init(): Promise<void> {
    console.log('🚀 Launching browser...');
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async researchOpportunity(opp: Opportunity): Promise<ResearchResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    console.log(`\n🔍 Researching: ${opp.name}`);
    console.log(`   URL: ${opp.url}`);

    const page = await this.browser.newPage();
    const result: ResearchResult = {
      ...opp,
      status: 'error',
      verifiedAt: new Date().toISOString(),
    };

    try {
      // Navigate to URL with timeout
      const response = await page.goto(opp.url, {
        timeout: 30000,
        waitUntil: 'networkidle',
      });

      // Check HTTP status
      if (!response) {
        result.status = 'error';
        result.error = 'No response from server';
        return result;
      }

      if (response.status() === 404) {
        result.status = 'not_found';
        result.error = 'Page not found (404)';
        return result;
      }

      if (response.status() >= 500) {
        result.status = 'error';
        result.error = `Server error (${response.status()})`;
        return result;
      }

      // Get page content
      const content = await page.content();
      const text = await page.evaluate(() => document.body.textContent ?? '');

      // Check for common "ended" or "not available" indicators
      const endedIndicators = [
        'ended', 'concluded', 'finished', 'closed', 'expired',
        'not available', 'coming soon', 'stay tuned',
        'registration closed', 'contest over', 'has ended',
      ];

      const isEnded = endedIndicators.some(indicator =>
        text.toLowerCase().includes(indicator),
      );

      if (isEnded) {
        result.status = 'ended';
        result.details = 'Page indicates contest/competition has ended';
      } else {
        result.status = 'active';
      }

      // Extract prize information if available
      result.actualPrize = this.extractPrizeInfo(text, content);

      // Extract entry fee information
      result.actualEntryFee = this.extractEntryFee(text, content);

      // Get page title
      const title = await page.title();
      result.details = `Page title: ${title}`;

      console.log(`   Status: ${result.status}`);
      console.log(`   Prize: ${result.actualPrize || 'Not found'}`);
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : String(error);
      console.log(`   Error: ${result.error}`);
    } finally {
      await page.close();
    }

    return result;
  }

  private extractPrizeInfo(text: string, _html: string): string | undefined {
    // Look for common prize patterns
    const prizePatterns = [
      /prize\s*pool[\s:]*\$?([\d,]+)/i,
      /win\s*\$?([\d,]+)/i,
      /reward[\s:]*\$?([\d,]+)/i,
      /bonus[\s:]*\$?([\d,]+)/i,
      /\$([\d,]+)\s*(USDT|USD|prize)/i,
      /([\d,]+)\s*(USDT|USD)\s*(prize|reward|bonus)/i,
    ];

    for (const pattern of prizePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  private extractEntryFee(text: string, _html: string): string | undefined {
    // Look for entry fee indicators
    if (text.toLowerCase().includes('free entry') ||
      text.toLowerCase().includes('no entry fee') ||
      text.toLowerCase().includes('0 usdt') ||
      text.toLowerCase().includes('0$') ||
      text.toLowerCase().includes('0 €')) {
      return 'Free';
    }

    const feePatterns = [
      /entry\s*fee[\s:]*\$?([\d.]+)/i,
      /registration\s*fee[\s:]*\$?([\d.]+)/i,
      /cost[\s:]*\$?([\d.]+)/i,
    ];

    for (const pattern of feePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  async runResearch(): Promise<void> {
    console.log('='.repeat(60));
    console.log('FREE TRADING OPPORTUNITIES RESEARCH');
    console.log('='.repeat(60));
    console.log(`Total opportunities to verify: ${OPPORTUNITIES.length}`);

    for (const opp of OPPORTUNITIES) {
      const result = await this.researchOpportunity(opp);
      this.results.push(result);

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await this.saveResults();
  }

  private async saveResults(): Promise<void> {
    // Save JSON results
    const jsonPath = path.join(this.outputDir, 'research-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to: ${jsonPath}`);

    // Generate markdown report
    const reportPath = path.join(this.outputDir, 'research-report.md');
    const report = this.generateMarkdownReport();
    fs.writeFileSync(reportPath, report);
    console.log(`📝 Report saved to: ${reportPath}`);

    // Generate SQL insert statements
    const sqlPath = path.join(this.outputDir, 'verified-opportunities.sql');
    const sql = this.generateSQLInserts();
    fs.writeFileSync(sqlPath, sql);
    console.log(`🗄️  SQL saved to: ${sqlPath}`);

    // Print summary
    this.printSummary();
  }

  private generateMarkdownReport(): string {
    const timestamp = new Date().toISOString();
    let report = `# Free Trading Opportunities - Verification Report\n\n`;
    report += `**Generated:** ${timestamp}\n\n`;
    report += `## Summary\n\n`;

    const active = this.results.filter(r => r.status === 'active').length;
    const ended = this.results.filter(r => r.status === 'ended').length;
    const notFound = this.results.filter(r => r.status === 'not_found').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    report += `- ✅ Active: ${active}\n`;
    report += `- ❌ Ended: ${ended}\n`;
    report += `- 🔍 Not Found: ${notFound}\n`;
    report += `- ⚠️ Errors: ${errors}\n\n`;

    // Group by tier
    report += `## Results by Tier\n\n`;

    for (let tier = 1; tier <= 4; tier++) {
      const tierResults = this.results.filter(r => r.tier === tier);
      if (tierResults.length > 0) {
        report += `### Tier ${tier}\n\n`;
        for (const r of tierResults) {
          const statusEmoji = r.status === 'active' ? '✅' :
                            r.status === 'ended' ? '❌' :
                            r.status === 'not_found' ? '🔍' : '⚠️';
          report += `#### ${statusEmoji} ${r.name}\n\n`;
          report += `- **Status:** ${r.status}\n`;
          report += `- **Organizer:** ${r.organizer}\n`;
          report += `- **URL:** ${r.url}\n`;
          report += `- **Expected Prize:** ${r.expectedPrize}\n`;
          if (r.actualPrize) {
            report += `- **Actual Prize:** ${r.actualPrize}\n`;
          }
          if (r.error) {
            report += `- **Error:** ${r.error}\n`;
          }
          if (r.details) {
            report += `- **Details:** ${r.details}\n`;
          }
          report += `\n`;
        }
      }
    }

    return report;
  }

  private generateSQLInserts(): string {
    const timestamp = new Date().toISOString();
    let sql = `-- Free Opportunities - Verified Data\n`;
    sql += `-- Generated: ${timestamp}\n\n`;

    const activeResults = this.results.filter(r => r.status === 'active');

    if (activeResults.length === 0) {
      sql += `-- No active opportunities found during verification\n`;
      return sql;
    }

    // Generate INSERT statements for organizers
    sql += `-- Insert verified organizers\n`;
    const organizers = [...new Set(activeResults.map(r => r.organizer))];

    for (const org of organizers) {
      const id = org.toLowerCase().replace(/\s+/g, '-');
      sql += `INSERT INTO organizers (id, name, organizer_type, website_url, legal_status)\n`;
      sql += `VALUES ('${id}', '${org}', 'platform', 'https://${id}.com', 'active')\n`;
      sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    // Generate INSERT statements for programs/offers
    sql += `-- Insert verified free opportunities\n`;
    for (const r of activeResults) {
      const orgId = r.organizer.toLowerCase().replace(/\s+/g, '-');
      sql += `INSERT INTO programs (id, organizer_id, name, category, type, status, official_url)\n`;
      sql += `VALUES ('${r.id}', '${orgId}', '${r.name}', 'free_competition', '${r.type}', 'active', '${r.url}')\n`;
      sql += `ON CONFLICT (id) DO NOTHING;\n`;

      sql += `INSERT INTO offers (id, program_id, offer_name, entry_fee, prize_pool, status)\n`;
      sql += `VALUES ('${r.id}-offer', '${r.id}', '${r.name}', 0, NULL, 'active')\n`;
      sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
    }

    return sql;
  }

  private printSummary(): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log('RESEARCH SUMMARY');
    console.log('='.repeat(60));

    const active = this.results.filter(r => r.status === 'active').length;
    const ended = this.results.filter(r => r.status === 'ended').length;
    const notFound = this.results.filter(r => r.status === 'not_found').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    console.log(`✅ Active:        ${active}`);
    console.log(`❌ Ended:         ${ended}`);
    console.log(`🔍 Not Found:     ${notFound}`);
    console.log(`⚠️  Errors:        ${errors}`);
    console.log(`─────────────────────────────`);
    console.log(`Total:           ${this.results.length}`);

    console.log('\n📋 Active Opportunities:');
    this.results
      .filter(r => r.status === 'active')
      .forEach(r => console.log(`   ✅ ${r.name}`));

    console.log('\n❌ Ended/Not Found:');
    this.results
      .filter(r => r.status === 'ended' || r.status === 'not_found')
      .forEach(r => console.log(`   ❌ ${r.name} (${r.status})`));
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('\n👋 Browser closed');
    }
  }
}

// Main execution
async function main() {
  const researcher = new OpportunityResearcher();

  try {
    await researcher.init();
    await researcher.runResearch();
  } catch (error) {
    console.error('❌ Research failed:', error);
    process.exit(1);
  } finally {
    await researcher.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { OPPORTUNITIES, OpportunityResearcher };
