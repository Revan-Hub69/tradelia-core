import {
  bigint,
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// User Profile - stores basic user data and preferences
export const userProfileSchema = pgTable('user_profile', {
  id: text('id').primaryKey(), // Supabase auth.users.id
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Support Tickets - tracks contact form submissions with follow-up automation
export const supportTicketsSchema = pgTable('support_tickets', {
  id: text('id').primaryKey(), // Format: TKT-2026-123456
  status: text('status').notNull().default('open'), // open|pending|resolved|closed
  priority: text('priority').notNull().default('medium'), // low|medium|high|urgent

  // User information
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  userPhone: text('user_phone'),
  userLocale: text('user_locale').notNull(), // it|en

  // Ticket information
  inquiryType: text('inquiry_type').notNull(), // general|technical|account|billing|feedback|other
  subject: text('subject').notNull(),
  message: text('message').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  resolvedAt: timestamp('resolved_at', { mode: 'date' }),
  closedAt: timestamp('closed_at', { mode: 'date' }),

  // Assignment (for future use)
  assignedTo: text('assigned_to'),

  // Tracking metadata
  source: text('source').notNull().default('contact_form'), // contact_form|email|chat
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),

  // Follow-up automation
  followUpSentAt: timestamp('follow_up_sent_at', { mode: 'date' }),
  followUpCount: integer('follow_up_count').default(0).notNull(),

  // Feedback (for future use)
  feedbackRating: integer('feedback_rating'), // 1-5
  feedbackComment: text('feedback_comment'),
});

// ============================================================================
// TRADING CHALLENGES DASHBOARD SCHEMA
// ============================================================================

// Prop Firms - trading companies offering challenges
export const propFirmsSchema = pgTable('prop_firms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  founded: integer('founded'),
  totalPaid: bigint('total_paid', { mode: 'number' }),
  reputation: integer('reputation'), // 0-100
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Challenges - available trading challenges (free competitions + paid prop firm evaluations)
export const challengesSchema = pgTable('challenges', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  propFirmId: text('prop_firm_id').references(() => propFirmsSchema.id),

  // Type
  type: text('type').notNull(), // free_competition|paid_evaluation|instant_funding
  challengeType: text('challenge_type').notNull(), // 1-step|2-step|competition|instant

  // Pricing
  isFree: boolean('is_free').notNull().default(false),
  entryFee: integer('entry_fee'),
  currency: text('currency').default('USD'),
  refundable: boolean('refundable').default(false),
  refundConditions: text('refund_conditions'),

  // Account
  accountSize: integer('account_size').notNull(),
  scalingPotential: integer('scaling_potential'),

  // Profit split (stored as JSON)
  profitSplit: text('profit_split').notNull(), // JSON: {initial: 80, scaled: 90, maximum: 95}

  // Rules (stored as JSON)
  rules: text('rules').notNull(), // JSON: {profitTarget: 10, maxDailyLoss: 5, maxDrawdown: 10, ...}

  // Payout
  payoutSpeed: text('payout_speed').notNull(), // instant|same_day|24_hours|weekly|bi_weekly
  firstPayoutDelay: integer('first_payout_delay'), // days

  // Markets & Platforms
  markets: text('markets').notNull(), // JSON array: ["forex", "futures", "crypto"]
  platforms: text('platforms'), // JSON array: ["MT4", "MT5", "cTrader"]

  // Status
  status: text('status').notNull().default('active'), // active|upcoming|ended
  startDate: timestamp('start_date', { mode: 'date' }),
  endDate: timestamp('end_date', { mode: 'date' }),
  recurring: boolean('recurring').default(false),
  frequency: text('frequency'), // monthly|quarterly|annual

  // Metadata
  description: text('description'),
  pros: text('pros'), // JSON array
  cons: text('cons'), // JSON array
  bestFor: text('best_for'),
  officialUrl: text('official_url'),
  logoUrl: text('logo_url'),

  // Analytics
  popularity: integer('popularity').default(0), // 0-100
  successRate: integer('success_rate'), // percentage
  averagePassTime: integer('average_pass_time'), // days

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Tracked Challenges - user's enrolled challenges
export const trackedChallengesSchema = pgTable('tracked_challenges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: text('challenge_id').references(() => challengesSchema.id),
  name: text('name').notNull(),
  accountSize: integer('account_size').notNull(),
  phase: text('phase').notNull(), // challenge|verification|funded

  // Timing
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }),
  daysRemaining: integer('days_remaining'),

  // Balance & P&L
  startingBalance: integer('starting_balance').notNull(),
  currentBalance: integer('current_balance').notNull(),
  highWaterMark: integer('high_water_mark').notNull(),
  totalPnL: integer('total_pnl').default(0).notNull(),
  todayPnL: integer('today_pnl').default(0).notNull(),

  // Rules (stored as JSON)
  rules: text('rules').notNull(), // JSON with profit target, daily loss, max drawdown, etc.

  // Status
  status: text('status').notNull().default('active'), // active|passed|failed|pending_verification
  violations: text('violations').default('[]'), // JSON array

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Trades - logged trades for challenges
export const tradesSchema = pgTable('trades', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: text('challenge_id').references(() => trackedChallengesSchema.id),
  signalId: text('signal_id'), // references trading_signals.id

  // Asset
  symbol: text('symbol').notNull(),
  direction: text('direction').notNull(), // long|short

  // Levels
  entryPrice: integer('entry_price').notNull(), // stored as cents/pips
  exitPrice: integer('exit_price'),
  stopLoss: integer('stop_loss').notNull(),
  takeProfit: integer('take_profit').notNull(),

  // Position
  positionSize: integer('position_size').notNull(), // lots * 1000
  riskAmount: integer('risk_amount').notNull(), // cents

  // Timing
  entryTime: timestamp('entry_time', { mode: 'date' }).notNull(),
  exitTime: timestamp('exit_time', { mode: 'date' }),

  // P&L
  pnl: integer('pnl'), // cents
  pnlPercentage: integer('pnl_percentage'), // basis points (10000 = 100%)
  rMultiple: integer('r_multiple'), // stored as 1000x (1500 = 1.5R)

  // Status
  status: text('status').notNull().default('open'), // open|closed_win|closed_loss|closed_breakeven

  // Metadata
  notes: text('notes'),
  tags: text('tags'), // JSON array

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Trading Signals - AI-generated trade signals
export const tradingSignalsSchema = pgTable('trading_signals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  symbol: text('symbol').notNull(),
  direction: text('direction').notNull(), // long|short

  // Timing
  generatedAt: timestamp('generated_at', { mode: 'date' }).notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),

  // Levels
  entry: integer('entry').notNull(), // stored as cents/pips
  stopLoss: integer('stop_loss').notNull(),
  takeProfit: integer('take_profit').notNull(),
  riskReward: integer('risk_reward').notNull(), // stored as 100x (250 = 2.5)

  // Confidence & Reasoning
  confidence: integer('confidence').notNull(), // 0-100
  indicators: text('indicators').notNull(), // JSON array
  reasoning: text('reasoning').notNull(),

  // Market Context
  marketCondition: text('market_condition').notNull(), // trending|ranging|volatile
  timeframe: text('timeframe').notNull(), // H1|H4|D1

  // Status
  status: text('status').notNull().default('active'), // active|executed|expired|dismissed
  executedTradeId: text('executed_trade_id'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Signal Settings - user preferences for signal generation
export const signalSettingsSchema = pgTable('signal_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),

  watchlist: text('watchlist').notNull().default('[]'), // JSON array of symbols
  minConfidence: integer('min_confidence').notNull().default(70),
  maxRiskPerTrade: integer('max_risk_per_trade').notNull().default(100), // stored as 100x (100 = 1%)
  minRiskReward: integer('min_risk_reward').notNull().default(150), // stored as 100x (150 = 1.5)
  timeframes: text('timeframes').notNull().default('["H1","H4"]'), // JSON array

  // Indicators config (stored as JSON)
  indicators: text('indicators').notNull(), // JSON with enabled flags and parameters

  // Notifications (stored as JSON)
  notifications: text('notifications').notNull(), // JSON with notification preferences

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Alerts - rule violation and notification alerts
export const alertsSchema = pgTable('alerts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: text('challenge_id').references(() => trackedChallengesSchema.id),

  type: text('type').notNull(), // daily_loss|max_drawdown|profit_target|deadline|consistency
  severity: text('severity').notNull(), // info|warning|critical
  message: text('message').notNull(),
  dismissed: boolean('dismissed').notNull().default(false),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
