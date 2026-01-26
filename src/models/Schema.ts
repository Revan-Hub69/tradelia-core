import {
  bigint,
  boolean,
  date,
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

// User Progress - tracks XP, level, streaks
export const userProgressSchema = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  totalXP: integer('total_xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActivityDate: date('last_activity_date'),
  totalStudyTime: integer('total_study_time').default(0), // seconds
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Lesson Completion - tracks which lessons user completed
export const lessonCompletionSchema = pgTable('lesson_completion', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  pathId: text('path_id').notNull(),
  xpEarned: integer('xp_earned').notNull(),
  approachesUsed: text('approaches_used'), // JSON array of approaches
  quizScore: integer('quiz_score'), // percentage 0-100
  timeSpent: integer('time_spent'), // seconds
  completedAt: timestamp('completed_at', { mode: 'date' }).defaultNow().notNull(),
});

// User Badges - tracks unlocked badges
export const userBadgesSchema = pgTable('user_badges', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  badgeId: text('badge_id').notNull(),
  badgeName: text('badge_name').notNull(),
  badgeDescription: text('badge_description'),
  badgeIcon: text('badge_icon'),
  rarity: text('rarity').notNull(), // common|rare|epic|legendary
  unlockedAt: timestamp('unlocked_at', { mode: 'date' }).defaultNow().notNull(),
});

// Learning Paths - defines available learning paths
export const learningPathSchema = pgTable('learning_path', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty').notNull(), // beginner|intermediate|advanced
  isPremium: boolean('is_premium').default(false).notNull(),
  estimatedDuration: integer('estimated_duration'), // minutes
  lessonOrder: text('lesson_order'), // JSON array of lesson IDs
  prerequisites: text('prerequisites'), // JSON array of required lesson/path IDs
  isActive: boolean('is_active').default(true).notNull(),
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
